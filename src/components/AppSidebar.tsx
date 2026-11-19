"use client";

/**
 * Node modules
 */
import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/client";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Actions
 */
import { getNotebooksAction } from "@/actions/notebooks/getNotebooks";
import { postNotebookAction } from "@/actions/notebooks/postNotebook";
import { putNotebookAction } from "@/actions/notebooks/putNotebook";
import { deleteNotebookAction } from "@/actions/notebooks/deleteNotebook";

/**
 * Hooks
 */
import { useUser } from "@/hooks/useUser";

/**
 * Components
 */
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarGroupLabel
} from "@/components/ui/sidebar";
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
    TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Field,
    FieldError
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import NewNoteDialog from "@/components/NewNoteDialog";
import Logo from "@/components/Logo";

const NewNoteButton = ({
    ...props
}: React.ComponentProps<typeof MotionButton>) => {
    return (
        <MotionButton
            type="button"
            size="lg"
            className="max-w-max !ps-0 gap-0"
            initial={{
                opacity: 0,
                scale: 0.9
            }}
            animate={{
                opacity: 1,
                scale: 1
            }}
            {...props}
        >
            <span className="w-[56px] h-[56px] grid place-items-center">
                <PlusIcon />
            </span>

            New note
        </MotionButton>
    )
}

/**
 * Assets
 */
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react";

/**
 * Types
 */
import type { NotebookType } from "@/types";

/**
 * Motions
 */
const MotionButton = motion.create(Button);
const MotionSidebarMenuItem = motion.create(SidebarMenuItem);
const MotionSidebarMenu = motion.create(SidebarMenu);

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 5,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
};

/**
 * Notebook form Schema
 */
const notebookSchema = z.object({
    title: z
        .string()
        .nonempty("Title is required.")
});

const NavLink = ({
    notebook,
}: {
    notebook: NotebookType;
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isEdit, setIsEdit] = useState(false);
    const form = useForm<z.infer<typeof notebookSchema>>({
        resolver: zodResolver(notebookSchema),
        defaultValues: {
            title: notebook.title
        }
    });

    const onSubmit = async () => {
        const result = await putNotebookAction(form.getValues(), notebook.id);

        if (!result.ok) {
            toast.error(result.err);
            return;
        }

        toast.success("Notebook updated successfully.");
    };

    const onDelete = async () => {
        const result = await deleteNotebookAction(notebook.id);

        if (!result.ok) {
            toast.error(result.err);
            return;
        }

        toast.success("Notebook deleted successfully.", {
            duration: 1500
        });

        setTimeout(() => router.replace("/"), 1500);
    };

    return (
        <MotionSidebarMenuItem
            variants={itemVariants}
            className="group/action relative"
        >
            {!isEdit ? (
                <>
                    <SidebarMenuButton
                        className="min-h-[56px] px-4 group-hover/action:!pe-[80px] group-hover/action:bg-sidebar-accent transition-all duration-150"
                        isActive={pathname === `/notebook/${notebook.id}`}
                        asChild
                    >
                        <Link href={`/notebook/${notebook.id}`}>
                            <p className="line-clamp-1">{notebook.title}</p>
                        </Link>
                    </SidebarMenuButton>

                    <div className="absolute top-1/2 right-3 rlt:right-auto rtl:left-3 -translate-y-1/2 flex items-center ms-auto opacity-0 group-hover/action:opacity-100 transition-opacity duration-150">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon-xs"
                                    variant="ghost"
                                    onClick={() => setIsEdit(true)}
                                >
                                    <PencilIcon />
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="bottom"
                                align="center"
                            >Edit notebook</TooltipContent>
                        </Tooltip>

                        <AlertDialog>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="icon-xs"
                                            variant="ghost"
                                        >
                                            <TrashIcon />
                                        </Button>
                                    </AlertDialogTrigger>
                                </TooltipTrigger>

                                <TooltipContent
                                    side="bottom"
                                    align="center"
                                >Delete notebook</TooltipContent>
                            </Tooltip>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete {`"${notebook.title}"`}?</AlertDialogTitle>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>

                                    <AlertDialogAction 
                                        variant="destructive"
                                        onClick={() => {
                                            onDelete();
                                        }}
                                    >
                                        Delete

                                        <div className="state-layer" />
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </>
            ) : (
                <Controller
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                        <Field className="gap-0.5">
                            <InputGroup className={cn("bg-sidebar-accent h-[56px] py-2 text-sm font-normal rounded-full !ring-0 focus-visible:!ring-transparent !border-transparent", form.formState.isSubmitting ? "ps-4" : "px-4")}>
                                <InputGroupInput
                                    {...field}
                                    placeholder="e.g. Project ideas"
                                    className="p-0"
                                    aria-invalid={fieldState.invalid}
                                    autoFocus
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            form.handleSubmit(async () => {
                                                await onSubmit();
                                                setIsEdit(false);
                                            })();
                                        }
                                    }}
                                />

                                {form.formState.isSubmitting && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="pointer-events-none !size-[56px]"
                                    >
                                        <Spinner />
                                    </Button>
                                )}
                            </InputGroup>

                            {fieldState.invalid && <FieldError className="text-xs">{fieldState.error?.message}</FieldError>}
                        </Field>
                    )}
                />
            )}
        </MotionSidebarMenuItem>
    );
}

export function AppSidebar() {
    const pathname = usePathname();
    const { isAuth, isLoading } = useUser();
    const [notebooks, setNotebooks] = useState<NotebookType[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [year, setYear] = useState<number | null>(null);
    const form = useForm<z.infer<typeof notebookSchema>>({
        resolver: zodResolver(notebookSchema),
        defaultValues: {
            title: ""
        }
    });

    useEffect(() => setYear(new Date().getFullYear()), []);

    const onSubmit = async () => {
        const result = await postNotebookAction(form.getValues());

        if (!result.ok) {
            toast.error(result.err);
            return;
        }

        toast.success("Notebook added successfully.");
    };

    useEffect(() => {
        (async () => {
            const result = await getNotebooksAction();

            if (!result.ok) return;

            setNotebooks(result.data);
        })();
    }, []);

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase.channel("notebooks-channel");

        channel.on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "notebooks",
        }, (payload) => {
            const newNoteButtonbook = payload.new as NotebookType;

            setNotebooks(prev => [...prev, newNoteButtonbook]);
        }).on("postgres_changes", {
            event: "UPDATE",
            schema: "public",
            table: "notebooks",
        }, (payload) => {
            const updateNoteButtonbook = payload.new as NotebookType;

            setNotebooks(prev => prev.map(notebook => notebook.id === updateNoteButtonbook.id ? updateNoteButtonbook : notebook));
        }).on("postgres_changes", {
            event: "DELETE",
            schema: "public",
            table: "notebooks",
        }, (payload) => {
            const deletedNotebook = payload.old as Pick<NotebookType, "id">;

            setNotebooks(prev =>
                prev.filter(notebook => notebook.id !== deletedNotebook.id)
            );
        }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    useEffect(() => {
        setIsOpen(false);
        form.resetField("title");
    }, [pathname, form]);

    return (
        <Sidebar variant="inset">
            {isLoading ? (
                <>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="!bg-transparent mb-2">
                                    <Logo className="max-w-max" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>

                        <span className="bg-primary rounded-full w-[149px] h-[56px] animate-pulse" />
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <div className="flex items-center justify-between mb-1">
                                <SidebarGroupLabel className="p-0">NOTEBOOKS</SidebarGroupLabel>

                                <span className="bg-muted rounded-full size-[32px] animate-pulse" />
                            </div>

                            <SidebarMenu>
                                {Array.from({ length: 16 }).map((_, index) => (
                                    <SidebarMenuItem key={`skeleton-${index}`}>
                                        <Skeleton className="w-full h-[56px] rounded-full" />
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                </>
            ) : (
                <>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="!bg-transparent mb-2">
                                    <Logo className="max-w-max" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        
                        {isAuth && (
                            notebooks.length === 0 ? <NewNoteButton disabled /> : (
                                <NewNoteDialog>
                                    <NewNoteButton />
                                </NewNoteDialog>
                            )
                        )}
                    </SidebarHeader>

                    <SidebarContent>
                        <Collapsible
                            open={isOpen}
                            onOpenChange={setIsOpen}
                        >
                            <SidebarGroup>
                                <div className="flex items-center justify-between mb-1">
                                    <SidebarGroupLabel className="p-0">NOTEBOOKS</SidebarGroupLabel>

                                    {isAuth && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CollapsibleTrigger asChild>
                                                    <MotionButton
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon-xs"
                                                        initial={{
                                                            opacity: 0,
                                                            scale: 0.9
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            scale: 1
                                                        }}
                                                    >
                                                        {!isOpen ? <PlusIcon /> : <XIcon />}
                                                    </MotionButton>
                                                </CollapsibleTrigger>
                                            </TooltipTrigger>

                                            <TooltipContent
                                                side="bottom"
                                                align="center"
                                            >{isOpen ? "Close" : "Create new notebook"}</TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>

                                <MotionSidebarMenu
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {isAuth && (
                                        <CollapsibleContent>
                                            <SidebarMenuItem>
                                                <Controller
                                                    control={form.control}
                                                    name="title"
                                                    render={({ field, fieldState }) => (
                                                        <Field className="gap-0.5 mb-2">
                                                            <InputGroup className={cn("bg-sidebar-accent h-[56px] py-2 mt-1 text-sm font-normal rounded-full !ring-0 focus-visible:!ring-transparent !border-transparent", form.formState.isSubmitting ? "ps-4" : "px-4")}>
                                                                <InputGroupInput
                                                                    {...field}
                                                                    placeholder="e.g. Project ideas"
                                                                    className="p-0"
                                                                    aria-invalid={fieldState.invalid}
                                                                    autoFocus
                                                                    onKeyDown={e => {
                                                                        if (e.key === "Enter") {
                                                                            e.preventDefault();
                                                                            form.handleSubmit(async () => {
                                                                                await onSubmit();
                                                                                setIsOpen(false);
                                                                                form.resetField("title");
                                                                            })();
                                                                        }
                                                                    }}
                                                                />

                                                                {form.formState.isSubmitting && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="pointer-events-none !size-[56px]"
                                                                    >
                                                                        <Spinner />
                                                                    </Button>
                                                                )}
                                                            </InputGroup>

                                                            {fieldState.invalid && <FieldError className="text-xs">{fieldState.error?.message}</FieldError>}
                                                        </Field>
                                                    )}
                                                />
                                            </SidebarMenuItem>
                                        </CollapsibleContent>
                                    )}

                                    {isAuth && notebooks.map(notebook => 
                                        <NavLink 
                                            key={`notebook-${notebook.id}`}
                                            notebook={notebook}
                                        />
                                    )}
                                </MotionSidebarMenu>
                            </SidebarGroup>
                        </Collapsible>
                    </SidebarContent>
                </>
            )}

            <SidebarFooter>
                <p className="text-sm font-normal text-muted-foreground">Copyright {year ?? "2026"} theartistweb</p>
            </SidebarFooter>
        </Sidebar>
    )
}