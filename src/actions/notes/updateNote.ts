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
type NoteValues = {
    photo_url?: File;
    title: string;
    description: string;
};

export const updateNoteAction = async (noteId: number, notebookId: number | undefined, value: NoteValues) => {
    if (!notebookId) 
        return {
            ok: false as const,
            err: "Please open a notebook first."
        };

    const supabase = await createClient();
    const result = await getUser();

    if (!result.ok || !result.data) 
        return {
            ok: false as const,
            err: "Unauthorized"
        };

    let notePhotoPath;
    if (value.photo_url) {
        const { data: notePhoto, error: notePhotoError } = await supabase.storage
            .from("notes")
            .upload(`${result.data.id}/${crypto.randomUUID()}-${value.photo_url.name}`, value.photo_url);
    
        if (notePhotoError)
            return {
                ok: false,
                err: notePhotoError.message
            };
    
        const { data: getNotePhoto } = await supabase.storage
            .from("notes")
            .getPublicUrl(notePhoto.path);

        notePhotoPath = getNotePhoto.publicUrl;
    }

    const { data: note, error } = await supabase
        .from("notes")
        .update({ 
            photo_url: notePhotoPath,
            title: value.title,
            description: value.description,
            notebook_id: notebookId,
            user_id: result.data.id
        })
        .eq("id", noteId)
        .eq("notebook_id", notebookId)
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