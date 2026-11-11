"use client";

/**
 * Node modules
 */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

/**
 * Custom modules
 */
import { Link, useRouter } from "@/i18n/navigation";

/**
 * Actions
 */
import { resetPasswordAction } from "@/actions/auth/resetPassword";

/**
 * Components
 */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { InputPassword } from "@/components/InputPassword";
import { Spinner } from "@/components/ui/spinner";

/**
 * Constants
 */
const RESET_PASSWORD = {
    title: "Set new password",
    description: "Your new password must be different to previously used passwords.",
    footerText: "Back to Login",
}

/**
 * Sign up form schema
 */
const resetPasswordSchema = z.object({
    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters"),

    password_confirmation: z
        .string()
        .nonempty("Password confirmation is required")
        .min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"]
});

const ResetPasswordForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            password_confirmation: ""
        }
    });

    const onSubmit = async () => {
        const result = await resetPasswordAction(form.getValues());

        if (!result.ok) {
            toast.error(result.err);
            return;
        }
        
        router.replace("/");
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-[384px]">
            <Logo />

            <Card>
                <CardContent>
                    <CardHeader className="text-center px-0 mb-6 gap-1">
                        <h1 className="text-xl font-bold">{RESET_PASSWORD.title}</h1>

                        <p className="text-muted-foreground text-sm font-normal">{RESET_PASSWORD.description}</p>
                    </CardHeader>

                    <form
                        className="flex flex-col gap-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <Controller
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>

                                    <InputPassword
                                        placeholder="Enter your password"
                                        id="password"
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />

                                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="password_confirmation"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>

                                    <InputPassword
                                        placeholder="Enter your confirm password"
                                        id="password_confirmation"
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />

                                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                                </Field>
                            )}
                        />

                        <Button 
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? <Spinner /> : "Reset password"}
                        </Button>
                    </form>

                    <CardFooter className="justify-center mt-2 p-0">
                        <Button 
                            variant="ghost"
                            className="w-full"
                            asChild
                        >
                            <Link href="/login">{RESET_PASSWORD.footerText}</Link>
                        </Button>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPasswordForm