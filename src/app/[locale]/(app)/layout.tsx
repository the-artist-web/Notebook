"use client";

/**
 * Node modules
 */
import { Suspense, useEffect } from "react";

/**
 * Custom modules
 */
import { usePathname } from "@/i18n/navigation";

/**
 * Hooks
 */
import { UserProvider } from "@/hooks/useUser";

/**
 * Components
 */
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import Loading from "@/components/Loading";

export function SidebarCloseOnNavigate() {
    const pathname = usePathname();

    const { isMobile, setOpenMobile } = useSidebar();

    useEffect(() => {
        if (isMobile) setOpenMobile(false);
    }, [pathname, isMobile, setOpenMobile]);

    return null;
}

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserProvider>
            <SidebarProvider>
                <Suspense fallback={<Loading />}>
                    <SidebarCloseOnNavigate />
                    <AppSidebar />
                </Suspense>
                <SidebarInset>
                    <Header />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </UserProvider>
    )
}

export default layout