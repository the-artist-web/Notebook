"use client";

/**
 * Node modules
 */
import { Suspense } from "react";

/**
 * Hooks
 */
import { UserProvider } from "@/hooks/useUser";

/**
 * Components
 */
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserProvider>
            <SidebarProvider>
                <Suspense>
                    <AppSidebar />
                </Suspense>
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </UserProvider>
    )
}

export default layout