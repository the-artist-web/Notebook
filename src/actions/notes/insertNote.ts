"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

/**
 * Actions
 */
import { getUser } from "@/actions/auth/getUser";

/**
 * Types
 */
type NoteValues = {
    photo_url: File;
    title: string;
    description: string;
};

export const insertNoteAction = async (notebookId: number, value: NoteValues) => {
    const supabase = await createClient();
    const result = await getUser();

    if (!result.ok || !result.data) 
        return {
            ok: false as const,
            err: "Unauthorized"
        };

    const { data: notePhoto, error: notePhotoError } = await supabase.storage
        .from("notes")
        .upload(`${result.data.id}/${crypto.randomUUID()}-${value.photo_url.name}`, value.photo_url);

    if (notePhotoError)
        return {
            ok: false,
            err: notePhotoError.message
        };

    const { data: note, error } = await supabase
        .from("notes")
        .insert({ 
            photo_url: notePhoto.path,
            title: value.title,
            description: value.description,
            notebook_id: notebookId
        })
        .select()
        .single();

    if (error)
        return {
            ok: false,
            err: error.message
        };

    return {
        ok: true,
        data: note
    }
};