"use client";

/**
 * Node modules
 */
import { useEffect, useState } from "react";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/client";

/**
 * Components
 */
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import CardNote from "@/components/CardNote";

/**
 * Assets
 */
import { StickyNotesIcon } from "lucide-react";

/**
 * Types
 */
import { NoteType } from "@/types";

const NotesList = ({
    notes
}: {
    notes: NoteType[];
}) => {
    const [notesData, setNotesData] = useState<NoteType[]>(notes);

    useEffect(() => {
        const supabase = createClient();
        
        const channel = supabase.channel("notes-channel");

        channel.on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "notes"
        }, (payload) => {
            const newNote = payload.new as NoteType;

            setNotesData(prev => [newNote, ...prev]);
        }).on("postgres_changes", {
            event: "UPDATE",
            schema: "public",
            table: "notes"
        }, (payload) => {
            const updateNote = payload.new as NoteType;

            setNotesData(prev => prev.map(note => note.id === updateNote.id ? updateNote : note));
        }).on("postgres_changes", {
            event: "DELETE",
            schema: "public",
            table: "notes"
        }, (payload) => {
            const deleteNote = payload.old as Pick<NoteType, "id">;

            setNotesData(prev => prev.filter(note => note.id !== deleteNote.id));
        })
        .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    return (
        notesData.length === 0 ? (
            <Empty>
                <EmptyHeader>
                    <StickyNotesIcon size={68} className="opacity-25" />

                    <EmptyTitle className="text-2xl font-normal">No Notes</EmptyTitle>
                </EmptyHeader>
            </Empty>
        ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(332px,1fr))] gap-4 pb-6">
                {notesData.map(note => 
                    <CardNote 
                        key={`note-${note.id}`}
                        note={note}
                    />
                )}
            </div>
        )
    );
}

export default NotesList