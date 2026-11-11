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
import { Link } from "@/i18n/navigation";

/**
 * Actions
 */
import { forgotPasswordAction } from "@/actions/auth/forgotPassword";

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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

/**
 * Constants
 */
const FORGOT_PASSWORD = {
    title: "Forgot password?",
    description: "No worries, we'll send you reset instructions.",
    footerText: "Back to Login",
}

/**
 * Sign up form schema
 */
const forgotPasswordSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .email("Please enter a valid email address")
        .max(50, "Email must not exceed 50 characters")
});

const ForgotPasswordForm = () => {
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = async () => {
        const result = await forgotPasswordAction(form.getValues());

        if (!result.ok) {
            toast.error(result.err);
            return;
        }
        
        toast.success("Password reset email sent successfully. Please check your inbox.");
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-[384px]">
            <Logo />

            <Card>
                <CardContent>
                    <CardHeader className="text-center px-0 mb-6 gap-1">
                        <h1 className="text-xl font-bold">{FORGOT_PASSWORD.title}</h1>

                        <p className="text-muted-foreground text-sm font-normal">{FORGOT_PASSWORD.description}</p>
                    </CardHeader>

                    <form
                        className="flex flex-col gap-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <Controller
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="email">Email address</FieldLabel>

                                    <Input
                                        type="email"
                                        placeholder="e.g. johndeo@example.com"
                                        id="email"
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
                            <Link href="/login">{FORGOT_PASSWORD.footerText}</Link>
                        </Button>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPasswordForm