"use client";

/**
 * Node modules
 */
import { useEffect, useState } from "react";

/**
 * Custom modules
 */
import { Link } from "@/i18n/navigation";

/**
 * Hooks
 */
import { useUser } from "@/hooks/useUser";

/**
 * Components
 */
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserMenu from "@/components/UserMenu";

const Header = () => {
    const { isAuth, isLoading: isLoadingUser } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [greeting, setGreeting] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState<string | null>(null);

    useEffect(() => {
        const currentHour = new Date().getHours();
        const currentDate = new Date().toDateString().replace(", ", ", ");

        const greeting = 
            currentHour < 5 ? "Night" : 
                currentHour < 12 ? "Morning" :
                    currentHour < 15 ? "Noon" : 
                        currentHour < 17 ? "Afternoon" : 
                            currentHour < 20 ? "Evening" : 
                                "Night";

        setIsLoading(false);
        setGreeting(greeting);
        setCurrentDate(currentDate);
    }, []);

    return (
        <header className="flex items-start justify-between gap-2 py-4 px-4 md:px-6">
            <div>
                {isLoading ? <Skeleton className="w-[150px] h-[31px] rounded-full mb-2 bg-accent" /> : <div className="text-2xl font-medium mb-1">Good {greeting}</div>}

                {isLoading ? <Skeleton className="w-1/2 h-4 rounded-full bg-accent/80" /> : <p className="text-sm font-normal text-muted-foreground">{currentDate}</p>}
            </div>

            <div className="flex items-center gap-2">
                {isLoadingUser ? <Skeleton className="bg-accent h-10 w-10 rounded-full" /> : (
                    isAuth ? <UserMenu /> : (
                        <>
                            <Button
                                variant="ghost"
                                asChild
                            >
                                <Link href="/login">Login</Link>
                            </Button>

                            <Button
                                className="hidden md:flex"
                                asChild
                            >
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </>
                    )
                )}
                
                <Tooltip>
                    <TooltipTrigger
                        className="md:hidden"
                        asChild
                    >
                        <SidebarTrigger />
                    </TooltipTrigger>

                    <TooltipContent
                        side="bottom"
                        align="center"
                    >Toggle Sidebar</TooltipContent>
                </Tooltip>
            </div>
        </header>
    )
}

export default Header