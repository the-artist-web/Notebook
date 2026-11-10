"use client";

/**
 * Node modules
 */
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

/**
 * Custom modules
 */
import { Link } from "@/i18n/navigation";

/**
 * Actions
 */
import { emailVerify } from "@/actions/auth/emailVerify";

/**
 * Components
 */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

/**
 * Assets
 */
import { MailIcon } from "lucide-react";

/**
 * Constants
 */
const EMAIL_VERIFY = {
    title: "Check your email",
    footerText: "Wrong email address?",
}

const EmailVerify = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const onClick = async () => {
        const result = await emailVerify(email as string);

        if (!result.ok) {
            toast.error(result.err);
            return;
        }
        
        toast.success("Verification email resent successfully.");
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-[384px]">
            <Logo />

            <Card>
                <CardContent>
                    <CardHeader className="text-center px-0 mb-5">
                        <Button
                            size="icon-lg"
                            variant="secondary"
                            className="pointer-events-none mx-auto mb-2"
                        >
                            <MailIcon />
                        </Button>

                        <h1 className="text-xl font-bold">{EMAIL_VERIFY.title}</h1>

                        <p className="text-muted-foreground text-sm font-normal">We've sent a verification link to your email address <strong>{(email || "__").slice(0, 2)}•••••@gmail.com</strong> Open your inbox and click the link to verify your account.</p>
                    </CardHeader>
                    
                    <Button
                        type="button"
                        className="w-full"
                        onClick={() => onClick()}
                    >Resend verification email</Button>
                    
                    <CardFooter className="justify-center mt-3">
                        <p className="text-muted-foreground text-sm text-normal">
                            {EMAIL_VERIFY.footerText}{" "}

                            <Link
                                href="/signup"
                                className="underline underline-offset-4 hover:text-primary"
                            >Change email</Link>
                        </p>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailVerify