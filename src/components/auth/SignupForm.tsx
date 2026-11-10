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
import { loginGoogle, loginGithub } from "@/actions/auth/loginWithGoogleAndGithubAction";
import { signupAction } from "@/actions/auth/signup";

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
  FieldSeparator
} from "@/components/ui/field";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/InputPassword";
import { Spinner } from "@/components/ui/spinner";

/**
 * Assets
 */
import { IconBrandGoogleFilled, IconBrandGithub } from "@tabler/icons-react";

/**
 * Constants
 */
const SIGNUP_FORM = {
    title: "Create your account",
    description: "Enter your email below to create your account",
    textCenterSeparator: "Or continue with",
    footerText: "Already have an account?",
    agreeText: "By clicking continue, you agree to our"
}

/**
 * Sign up form schema
 */
const signupSchema = z.object({
    username: z
        .string()
        .nonempty("Username is required")
        .max(50, "Username must not exceed 50 characters")
        .toLowerCase()
        .trim()
        .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),

    email: z
        .string()
        .nonempty("Email is required")
        .email("Please enter a valid email address")
        .max(50, "Email must not exceed 50 characters"),

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

const SignupForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            password_confirmation: ""
        }
    });

    const onSubmit = async () => {
        const result = await signupAction(form.getValues());

        if (!result.ok) {
            toast.error(result.err);
            return;
        }

        router.replace(`/email-verify?email=${result.data?.user?.email}`);
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-[384px]">
            <Logo />

            <Card>
                <CardContent>
                    <CardHeader className="text-center px-0 mb-6 gap-1">
                        <h1 className="text-xl font-bold">{SIGNUP_FORM.title}</h1>

                        <p className="text-muted-foreground text-sm font-normal">{SIGNUP_FORM.description}</p>
                    </CardHeader>

                    <div className="flex flex-col gap-3 w-full">
                        <Button 
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => loginGoogle()}
                        >
                            <IconBrandGoogleFilled />

                            Continue with Google
                        </Button>

                        <Button 
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => loginGithub()}
                        >
                            <IconBrandGithub />

                            Continue with Github
                        </Button>
                    </div>

                    <div className="grid grid-cols-[1fr_max-content_1fr] items-center gap-3 my-5">
                        <FieldSeparator />

                        <p className="text-muted-foreground text-sm font-normal text-nowrap">{SIGNUP_FORM.textCenterSeparator}</p>

                        <FieldSeparator />
                    </div>

                    <form
                        className="flex flex-col gap-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <Controller
                            control={form.control}
                            name="username"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="username">Username</FieldLabel>

                                    <Input
                                        type="text"
                                        placeholder="e.g. johndeo"
                                        id="username"
                                        autoFocus
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />

                                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                                </Field>
                            )}
                        />

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
                            {form.formState.isSubmitting ? <Spinner /> : "Create Account"}
                        </Button>
                    </form>

                    <CardFooter className="justify-center mt-3">
                        <p className="text-muted-foreground text-sm text-normal">
                            {SIGNUP_FORM.footerText}{" "}

                            <Link
                                href="/login"
                                className="underline underline-offset-4 hover:text-primary"
                            >Login</Link>
                        </p>
                    </CardFooter>
                </CardContent>
            </Card>

            <p className="text-muted-foreground text-sm font-normal text-center px-4 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">{SIGNUP_FORM.agreeText}{" "} <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>.</p>
        </div>
    );
};

export default SignupForm