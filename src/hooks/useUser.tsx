"use client";

/**
 * Node modules
 */
import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "sonner";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/client";

/**
 * Actions
 */
import { logoutAction } from "@/actions/auth/logout";

/**
 * Types
 */
import { UserType } from "@/types";

type UserContextType = {
    user: UserType | null;
    isAuth: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        (async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error || !user) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from("profile")
                .select("username")
                .eq("id", user.id)
                .single();
                
            setUser({...user, ...profile});
            setIsLoading(false);
        })();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        const result = await logoutAction();

        if (!result.ok) {
            toast.error(result.err);
            return;
        }

        setUser(null);
        setIsLoading(false);
    }

    return (
        <UserContext 
            value={{
                user,
                isAuth: !!user,
                isLoading,
                logout
            }}
        >{children}</UserContext>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context)
        throw new Error("useUser must be used within UserProvider");

    return context;
}