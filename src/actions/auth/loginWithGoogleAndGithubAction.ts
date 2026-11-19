"use server";

/**
 * Node modules
 */
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

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/auth/callback`
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