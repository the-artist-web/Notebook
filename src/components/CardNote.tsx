"use client";

/**
 * Node modules
 */
import { motion } from "motion/react";
import { useMediaQuery } from "@custom-react-hooks/all";
import { toast } from "sonner";
import Image from "next/image";


/**
 * Custom modules
 */
import { cn } from "@/lib/utils";

/**
 * Actions
 */
import { deleteNoteAction } from "@/actions/notes/deleteNote";

/**
 * Components
 */
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import EditNoteDialog from "@/components/EditNoteDialog";

/**
 * Assets
 */
import { TrashIcon, PencilIcon } from "lucide-react";

/**
 * Types
 */
import { NoteType } from "@/types";

/**
 * Motions
 */
const MotionCard = motion.create(Card);

const DeleteNote = ({
    note
}: {
    note: NoteType;
}) => {
    const isWide = useMediaQuery("(min-width: 768px)");

    const onDelete = async () => {
        const result = await deleteNoteAction(note.id);

        if (!result.ok) {
            toast.error(result.err);
            return;
        }

        toast.success("Note deleted successfully.");
    };

    if (isWide)
        return (
            <AlertDialog>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                            >
                                <TrashIcon />
                            </Button>
                        </AlertDialogTrigger>
                    </TooltipTrigger>

                    <TooltipContent
                        side="bottom"
                        align="center"
                    >Delete note</TooltipContent>
                </Tooltip>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete {`"${note.title}"`}?</AlertDialogTitle>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => onDelete()}
                        >
                            Delete

                            <div className="state-layer" />
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );

    return (
        <Drawer direction="bottom">
            <Tooltip>
                <TooltipTrigger asChild>
                    <DrawerTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                        >
                            <TrashIcon />
                        </Button>
                    </DrawerTrigger>
                </TooltipTrigger>

                <TooltipContent
                    side="bottom"
                    align="center"
                >Delete note</TooltipContent>
            </Tooltip>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you sure you want to delete {`"${note.title}"`}?</DrawerTitle>
                </DrawerHeader>

                <DrawerFooter>
                    <Button
                        variant="destructive"
                        onClick={() => onDelete()}
                    >
                        Delete

                        <div className="state-layer" />
                    </Button>

                    <DrawerClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

const CardNote = ({
    note
}: {
    note: NoteType
}) => {
    return (
        <div className="group relative max-h-max">
            <Drawer>
                <DrawerTrigger asChild>
                    <MotionCard
                        className={cn("cursor-pointer [--state-layer-bg:var(--foreground)]", !note.photo_url ? "py-[var(--card-spacing)]" : "pb-[var(--card-spacing)]")}
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            transition: {
                                duration: 0.3
                            }
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                    >
                        {note.photo_url && (
                            <AspectRatio 
                                className="bg-muted border-b border-border"
                                ratio={16 / 9}
                            >
                                <Image
                                    src={note.photo_url}
                                    alt={note.title}
                                    fill
                                    className="w-full h-full object-cover"
                                />
                            </AspectRatio>
                        )}

                        <CardHeader>
                            <CardTitle className="line-clamp-1">{note.title}</CardTitle>

                            <CardDescription className="line-clamp-2">{note.description}</CardDescription>
                        </CardHeader>

                        <CardFooter>
                            <p className="text-muted-foreground">
                                {new Intl.DateTimeFormat("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                }).format(new Date(note.created_at))}
                            </p>
                        </CardFooter>

                        <div className="state-layer" />
                    </MotionCard>
                </DrawerTrigger>

                <DrawerContent>
                    <div className="no-scrollbar overflow-y-auto mx-auto w-full max-w-3xl">
                        {note.photo_url && (
                            <div className="mt-4 px-4">
                                <AspectRatio ratio={16 / 9}>
                                    <Image
                                        src={note.photo_url}
                                        alt={note.title}
                                        fill
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </AspectRatio>
                            </div>
                        )}

                        <DrawerHeader className="!text-start">
                            <DrawerTitle>{note.title}</DrawerTitle>

                            <DrawerDescription>{note.description}</DrawerDescription>
                        </DrawerHeader>
                    </div>
                </DrawerContent>
            </Drawer>

            <div className="flex items-center gap-1 absolute bottom-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <Tooltip>
                    <EditNoteDialog note={note}>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                            >
                                <PencilIcon />
                            </Button>
                        </TooltipTrigger>
                    </EditNoteDialog>

                    <TooltipContent
                        side="bottom"
                        align="center"
                    >Edit note</TooltipContent>
                </Tooltip>

                <DeleteNote note={note} />
            </div>
        </div>
    )
}

export default CardNote