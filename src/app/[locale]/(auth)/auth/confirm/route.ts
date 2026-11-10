"use server";

/**
 * Node modules
 */
import { type NextRequest, NextResponse } from "next/server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const redirectTo = request.nextUrl.clone();
    const next = "/";

    redirectTo.pathname = next;
    redirectTo.searchParams.delete("code");

    if (code) {
        const supabase = await createClient();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            redirectTo.searchParams.delete("next");
            return NextResponse.redirect(redirectTo);
        }
    }

    redirectTo.pathname = "/error";

    return NextResponse.redirect(redirectTo);
}