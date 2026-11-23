"use client";

/**
 * Node modules
 */
import { useTheme } from "next-themes";

/**
 * Custom modules
 */
import { cn } from "cn";

/**
 * Components
 */
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/**
 * Assets
 */
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";

export function ToggleTheme() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {theme === "system" && <SunMoonIcon size="20" />}

                    {theme === "light" && <SunIcon size="20" />}

                    {theme === "dark" && <MoonIcon size="20" />}
                    
                    <span>Theme {theme === "system" ? "System" : theme === "light" ? "Light" : theme === "dark" && "Dark"}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem 
                        className={cn(theme === "system" && "!bg-primary/10 !text-primary")}
                        onClick={() => setTheme("system")}
                    >
                        <SunMoonIcon />

                        System
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        className={cn(theme === "light" && "!bg-primary/10 !text-primary")}
                        onClick={() => setTheme("light")}
                    >
                        <SunIcon />

                        Light
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        className={cn(theme === "dark" && "!bg-primary/10 !text-primary")}
                        onClick={() => setTheme("dark")}
                    >
                        <MoonIcon />

                        Dark
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
