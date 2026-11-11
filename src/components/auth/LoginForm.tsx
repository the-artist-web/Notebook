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
import { loginAction } from "@/actions/auth/login";

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
const LOGIN_FORM = {
    title: "Welcome back",
    description: "Login with your Google or Github account",
    textCenterSeparator: "Or continue with",
    footerText: "Don't have an account?",
    agreeText: "By clicking continue, you agree to our"
}

/**
 * Sign up form schema
 */
const loginSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .email("Please enter a valid email address")
        .max(50, "Email must not exceed 50 characters"),

    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters")
});

const LoginForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async () => {
        const result = await loginAction(form.getValues());

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
                        <h1 className="text-xl font-bold">{LOGIN_FORM.title}</h1>

                        <p className="text-muted-foreground text-sm font-normal">{LOGIN_FORM.description}</p>
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

                        <p className="text-muted-foreground text-sm font-normal text-nowrap">{LOGIN_FORM.textCenterSeparator}</p>

                        <FieldSeparator />
                    </div>

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

                        <Controller
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="password">
                                        Password

                                        <Link
                                            href="/forgot-password"
                                            className="text-muted-foreground ms-auto hover:text-primary"
                                        >Forgot your password?</Link>
                                    </FieldLabel>

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

                        <Button 
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? <Spinner /> : "Login"}
                        </Button>
                    </form>

                    <CardFooter className="justify-center mt-3">
                        <p className="text-muted-foreground text-sm text-normal">
                            {LOGIN_FORM.footerText}{" "}

                            <Link
                                href="/signup"
                                className="underline underline-offset-4 hover:text-primary"
                            >Sign up</Link>
                        </p>
                    </CardFooter>
                </CardContent>
            </Card>

            <p className="text-muted-foreground text-sm font-normal text-center px-4 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">{LOGIN_FORM.agreeText}{" "} <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>.</p>
        </div>
    );
};

export default LoginForm