"use client";

/**
 * Node modules
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { useMediaQuery } from "@custom-react-hooks/all";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Actions
 */
import { settingsAction } from "@/actions/users/settings";

/**
 * Hooks
 */
import { useUser } from "@/hooks/useUser";

/**
 * Components
 */
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Field,
    FieldError,
    FieldLabel,
    FieldGroup,
    FieldSeparator,
} from "@/components/ui/field";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { InputPassword } from "@/components/InputPassword";
import { ToggleTheme } from "@/components/ToggleTheme";

/**
 * Assets
 */
import { AtSignIcon } from "lucide-react";

/**
 * Settings form schema
 */
const avatarUrlSchema = z.instanceof(File, {
        message: "Avatar is required."
    }).refine(file => file.size <= 5 * 1024 * 1024, {
        message: "The maximum avatar size is 5 MB."
    });

const settingsSchema = z.object({
    avatar_url: avatarUrlSchema.optional(),

    full_name: z
        .string()
        .refine(v => v === "" || v.length <= 50, {
            message: "Full name must not exceed 50 characters."
        }),

    username: z
        .string()
        .nonempty("Username is required.")
        .max(50, "Username must not exceed 50 characters.")
        .regex(
            /^[a-z][a-z0-9_-]*$/,
            "Username must start with a lowercase letter and contain only lowercase letters, numbers, underscores, or hyphens."
        ),

    email: z
        .string()
        .nonempty("Email is required")
        .email("Please enter a valid email address")
        .max(50, "Email must not exceed 50 characters"),

    password: z
        .string()
        .refine(v => v === "" || v.length >= 8, {
            message: "Password must be at least 8 characters"
        }),

    password_confirmation: z
        .string()
        .refine(v => v === "" || v.length >= 8, {
            message: "Password must be at least 8 characters"
        }),
}).refine(data => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match"
});

export type SettingsType = z.infer<typeof settingsSchema>;

const SettingsForm = ({
    form
}: {
    form: UseFormReturn<z.infer<typeof settingsSchema>>
}) => {
    const { user } = useUser();
    const [avatarUrl, setAvatarUrl] = useState<File | null>(null);

    return (
        <FieldGroup>
            <Controller
                control={form.control}
                name="avatar_url"
                render={({ field: { value, onChange, ...field }, fieldState }) => (
                    <Field className="!grid items-start md:grid-cols-[1fr_2fr] gap-4">
                        <p className="text-sm font-medium">Profile Picture</p>

                        <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor="avatar_url">
                                <Avatar
                                    className="relative cursor-pointer"
                                    size="xxl"
                                >
                                    <AvatarFallback>{(user?.full_name || user?.username)?.[0]}</AvatarFallback>

                                    <AvatarImage
                                        src={avatarUrl ? URL.createObjectURL(avatarUrl) : user?.avatar_url}
                                        alt={user?.full_name || user?.username}
                                    />
                                </Avatar>

                                <Input
                                    {...field}
                                    type="file"
                                    id="avatar_url"
                                    hidden
                                    onChange={e => {
                                        const selectedFile = e.target.files?.[0] ?? null;
        
                                        onChange(selectedFile);
                                        setAvatarUrl(selectedFile);
                                    }}
                                />
                            </FieldLabel>

                            {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                        </div>
                    </Field>
                )}
            />

            <FieldSeparator />

            <Field className="!grid items-start md:grid-cols-[1fr_2fr] gap-y-2 gap-x-4">
                <FieldLabel htmlFor="name">Name</FieldLabel>

                <div className="grid items-start md:grid-cols-2 gap-4">
                    <Controller
                        control={form.control}
                        name="full_name"
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                                <Input
                                    {...field}
                                    placeholder="Enter your full name"
                                    aria-invalid={fieldState.invalid}
                                    id="name"
                                />

                                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                            </div>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="username"
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2 relative">
                                <span className="w-10 h-10 absolute top-0 left-0 grid place-items-center text-muted-foreground">
                                    <AtSignIcon size="20" />
                                </span>

                                <Input
                                    {...field}
                                    placeholder="Enter your username"
                                    className="ps-10"
                                    aria-invalid={fieldState.invalid}
                                />

                                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                            </div>
                        )}
                    />
                </div>
            </Field>

            <FieldSeparator />

            <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                    <Field className="!grid items-start md:grid-cols-[1fr_2fr] gap-y-2 gap-x-4">
                        <FieldLabel htmlFor="email">Email address</FieldLabel>

                        <div className="flex flex-col gap-2">
                            <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email"
                                aria-invalid={fieldState.invalid}
                                id="email"
                            />

                            {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                        </div>
                    </Field>
                )}
            />

            <FieldSeparator />

            <Field className="!grid items-start md:grid-cols-[1fr_2fr] gap-y-2 gap-x-4">
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <div className="grid items-start md:grid-cols-2 gap-4">
                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                                <InputPassword
                                    {...field}
                                    placeholder="Enter your password"
                                    aria-invalid={fieldState.invalid}
                                    id="password"
                                />

                                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                            </div>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="password_confirmation"
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-2">
                                <InputPassword
                                    {...field}
                                    placeholder="Enter your confirm password"
                                    aria-invalid={fieldState.invalid}
                                />

                                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                            </div>
                        )}
                    />
                </div>
            </Field>

            <FieldSeparator />

            <Field className="!grid items-start md:grid-cols-[1fr_2fr] gap-y-2 gap-x-4">
                <FieldLabel htmlFor="theme">Theme</FieldLabel>

                <ToggleTheme />
            </Field>

            <FieldSeparator />
        </FieldGroup>
    );
};

const SettingsDialog = ({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) => {
    const isWide = useMediaQuery("(min-width: 768px)");
    const { user } = useUser();

    const defaultValues = {
        avatar_url: undefined,
        full_name: user?.full_name,
        username: user?.username,
        email: user?.email,
        password: "",
        password_confirmation: "",
    };

    const form = useForm<z.infer<typeof settingsSchema>>({
        resolver: zodResolver(settingsSchema),
        defaultValues
    });

    const onSubmit = async () => {
        const result = await settingsAction(form.getValues());

        if (!result.ok) {
            toast.error(result.err);
            return;
        }

        toast.success("Your account has been updated successfully.");
        onOpenChange(false);
    };

    if (isWide)
        return (
            <Dialog 
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogContent 
                    className="!min-w-[768px]"
                    showCloseButton={false}
                    onInteractOutside={e => e.preventDefault()}
                >
                    <form 
                        className="grid gap-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <DialogHeader>
                            <DialogTitle>Settings</DialogTitle>
                            
                            <DialogDescription>Manage your account settings and preferences.</DialogDescription>
                        </DialogHeader>

                        <SettingsForm form={form} />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && <Spinner />}

                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
        >
            <DrawerContent>
                <form 
                    className="grid gap-5 no-scrollbar max-h-[90vh] overflow-y-auto"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <DrawerHeader>
                        <DrawerTitle>Settings</DrawerTitle>

                        <DrawerDescription>Manage your account settings and preferences.</DrawerDescription>
                    </DrawerHeader>

                    <div className="pt-4 px-4">
                        <SettingsForm form={form} />
                    </div>

                    <DrawerFooter>
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                                {form.formState.isSubmitting && <Spinner />}

                                Save
                        </Button>

                        <DrawerClose>
                            <Button 
                                variant="ghost"
                                className="w-full"
                            >Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}

export default SettingsDialog