export type UserType = {
    id: string;
    display_name?: string;
    email?: string;
    username?: string;
    created_at: string;
}

export type NoteType = {
    id: number;
    photo_url: string;
    title: string;
    description: string;
    notebook_id: number;
    created_at: string;
}

export type NotebookType = {
    id: number;
    title: string;
    user_id?: string;
    created_at: string;
}