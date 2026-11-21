"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

/**
 * Actions
 */
import { getUser } from "@/actions/users/getUser";

/**
 * Types
 */
import { SettingsType } from "@/components/SettingsDialog";

export const settingsAction = async (value: SettingsType) => {
    const supabase = await createClient();
    const result = await getUser();
    
    if (!result.ok || !result.data)
        return {
            ok: false as const,
            err: "Unauthorized"
        };

    const file = value.avatar_url;
    const user = result.data;
    let avatar_url: string | undefined;

    if (file) {
        const { data: uploadAvatarUrl, error: uploadAvatarError } = await supabase.storage
            .from("avatars")
            .upload(`${user?.id}/${Date.now()}-${file?.name}`, file);
    
        if (uploadAvatarError)
            return {
                ok: false as const,
                err: uploadAvatarError.message
            };
    
        const { data: getAvatarUrl } = supabase.storage
            .from("avatars")
            .getPublicUrl(uploadAvatarUrl.path);

        avatar_url = getAvatarUrl.publicUrl;
    }

    const { data: updateProfileData, error: updateProfileError } = await supabase
        .from("profile")
        .update({ username: value.username })
        .eq("id", user?.id)
        .select("username")
        .maybeSingle();

    if (updateProfileError)
        return { 
            ok: false as const, 
            err: updateProfileError.message
        };

    const { data: updateUserData, error: updateUserError } = await supabase.auth.updateUser({
        ...(value.email !== user.email && { email: value.email }),
        ...(value.password && { password: value.password }),
        data: {
            full_name: value.full_name,
            ...(avatar_url && { avatar_url })
        }
    }, {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/auth/callback`
    });

    if (updateUserError)
        return {
            ok: false as const,
            err: updateUserError.message
        };

    return {
        ok: true as const,
        data: {
            ...updateUserData,
            ...updateProfileData
        }
    }
};