/**
 * Node modules
 */
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

/**
 * Custom modules
 */
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Constants
 */
const AUTH_ROUTES = [
    "/signup",
    "/email-verify",
    "/login",
    "/forgot-password"
];

const PROTECTED_ROUTES = [
    "/reset-password",
    "/notebook",
];

const matches = (path: string, routes: string[]) => routes.some((r) => path === r || path.startsWith(`${r}/`));

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet, headers) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })

                    cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))

                    Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value))
                },
            },
        }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: If you remove getClaims() and you use server-side rendering
    // with the Supabase client, your users may be randomly logged out.
    const { data } = await supabase.auth.getClaims();

    const isAuth = !!data?.claims;
    
    const { pathname } = request.nextUrl;
    const locale = routing.locales.find((l) => pathname === `${l}` || pathname.startsWith(`/${l}`)) ?? routing.defaultLocale;

    const path = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

    const redirectTo = (target: string) => {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}${target}`;
        const response = NextResponse.redirect(url);
        supabaseResponse.cookies.getAll().forEach((c) => response.cookies.set(c));
        return response;
    }

    if (isAuth && matches(path, AUTH_ROUTES)) return redirectTo("/");
    if (!isAuth && matches(path, PROTECTED_ROUTES)) return redirectTo("/login");

    const intlResponse = intlMiddleware(request);
    supabaseResponse.cookies.getAll().forEach((c) => intlResponse.cookies.set(c));

    return intlResponse;

    return supabaseResponse;
}