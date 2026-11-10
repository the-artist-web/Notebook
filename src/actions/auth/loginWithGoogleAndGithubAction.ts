"use server";

/**
 * Node modules
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

/**
 * Types
 */
import type { Provider } from "@supabase/supabase-js";

const signInWithOAuth = async (provider: Provider) => {
    const supabase = await createClient();
    const header = await headers();
    const origin = header.get("origin");

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/auth/callback`
        } 
    });

    if (error) {
        console.error(error.message);
        return;
    }

    redirect(data.url);
}

export const loginGoogle = async () => await signInWithOAuth("google");

export const loginGithub = async () => await signInWithOAuth("github");