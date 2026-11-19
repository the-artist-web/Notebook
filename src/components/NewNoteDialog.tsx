"use client";

/**
 * Node modules
 */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@custom-react-hooks/all";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";

/**
 * Custom modules
 */
import { cn } from "@/lib/utils";

/**
 * Actions
 */
import { insertNoteAction } from "@/actions/notes/insertNote";

/**
 * Components
 */
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/**
 * Assets
 */
import { CloudUploadIcon } from "lucide-react";

/**
 * Types
 */
import type { DialogProps } from "@radix-ui/react-dialog";
import type { UseFormReturn } from "react-hook-form";

type NewNoteFormValues = {
    photo_url: File;
    title: string;
    description: string;
};

/**
 * Motions
 */
const MotionImage = motion.create(Image);

/**
 * New note form schema
 */
const photoSchema = z
    .instanceof(File, {
        message: "Image is required."
    })
    .refine(file => file.size <= 5 * 1024 * 1024, {
        message: "The maximum image size is 5 MB."
    });

const newNoteSchema = z.object({
    photo_url: photoSchema,

    title: z
        .string()
        .nonempty("Title is required."),

    description: z
        .string()
        .nonempty("Description is required.")
});

const NewNoteForm = ({
    form
}: {
    form: UseFormReturn<NewNoteFormValues>
}) => {
    const [file, setFile] = useState<File | null>(null);

    return (
        <FieldGroup className="gap-3">
            <Controller
                control={form.control}
                name="photo_url"
                render={({ field: { value, onChange, ...field }, fieldState }) => (
                    <Field>
                        <FieldLabel
                            htmlFor="photo_url"
                            className={cn("bg-card flex flex-col items-center gap-1 overflow-hidden border-2 border-dashed border-border rounded-4xl cursor-pointer hover:border-primary transition-all duration-150", fieldState.invalid && "!border-destructive", !file && "p-10")}
                        >
                            {!file && (
                                <>
                                    <CloudUploadIcon 
                                        size="30"
                                        className="mb-3"
                                    />
            
                                    <div className="text-sm font-medium">Click To Upload</div>
            
                                    <div className="text-xs font-normal text-muted-foreground">Choose a file</div>
                                </>
                            )}

                            {file && (
                                <AspectRatio ratio={16 / 9}>
                                    <MotionImage
                                        src={file ? URL.createObjectURL(file) : ""}
                                        alt={file?.name}
                                        fill
                                        className="w-full h-full object-cover"
                                        initial={{
                                            opacity: 0,
                                            scale: 0.9,
                                            transition: {
                                                duration: 0.3
                                            }
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        viewport={{ once: true }}
                                    />
                                </AspectRatio>
                            )}
    
                            <input
                                {...field}
                                type="file"
                                accept="image/*"
                                id="photo_url"
                                hidden
                                onChange={e => {
                                    const selectedFile = e.target.files?.[0] ?? null;
    
                                    onChange(selectedFile);
                                    setFile(selectedFile);
                                }}
                            />
                        </FieldLabel>
    
                        {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                    </Field>
                )}
            />

            <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                    <Field className="mt-1">
                        <Input
                            {...field}
                            placeholder="Untitled"
                            className=" bg-transparent !ring-0 focus-visible:!ring-transparent !border-transparent p-0 rounded-none"
                            autoFocus
                        />
    
                        {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                    </Field>
                )}
            />

            <div className="-mx-4 no-scrollbar max-h-[40vh] overflow-y-auto px-4">
                <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                        <Field>
                            <Textarea
                                {...field}
                                placeholder="Take a note..."
                                className="min-h-[240px] !text-base bg-transparent !ring-0 focus-visible:!ring-transparent !border-transparent p-0 rounded-none"
                            />
        
                            {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                        </Field>
                    )}
                />
            </div>
        </FieldGroup>
    )
}

const NewNoteDialog = ({
    children,
    ...props
}: React.PropsWithChildren<DialogProps>) => {
    const { id } = useParams<{ id: string | undefined; }>();
    const [isOpen, setIsOpen] = useState(false);
    const isWide = useMediaQuery("(min-width: 768px)");
    const form = useForm<z.infer<typeof newNoteSchema>>({
        resolver: zodResolver(newNoteSchema),
        defaultValues: {
            photo_url: undefined,
            title: "",
            description: ""
        }
    });

    const onSubmit = async () => {
        const result = await insertNoteAction(Number(id), form.getValues());

        if (!result.ok) {
            toast.error(result.err);
            return;
        }

        toast.success("Note added successfully.");

        setIsOpen(false);
        form.reset();
    };

    if (isWide)
        return (
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
                {...props}
            >
                <DialogTrigger asChild>{children}</DialogTrigger>
                
                <DialogContent
                    className="!max-w-[550px]"
                    showCloseButton={false}
                    onInteractOutside={e => e.preventDefault()}
                >
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <NewNoteForm form={form} />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => form.reset()}
                                >Close</Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >{form.formState.isSubmitting && <Spinner />} Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );

    return (
        <Drawer
            open={isOpen}
            onOpenChange={setIsOpen}
            direction="bottom"
        >
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent>
                <form
                    className="no-scrollbar max-h-[90vh] overflow-y-auto"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <DrawerHeader>
                        <NewNoteForm form={form} />
                    </DrawerHeader>

                    <DrawerFooter>
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >{form.formState.isSubmitting && <Spinner />} Save</Button>

                        <DrawerClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => form.reset()}
                            >Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}

export default NewNoteDialog