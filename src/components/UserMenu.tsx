"use client";

/**
 * Node modules
 */
import { useState } from "react";

/**
 * Hooks
 */
import { useUser } from "@/hooks/useUser";

/**
 * Components
 */
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import SettingsDialog from "@/components/SettingsDialog";

/**
 * Assets
 */
import { SettingsIcon, LogOutIcon } from "lucide-react";

const UserMenu = () => {
    const { user, logout } = useUser();
    const [settingsOpen, setSettingOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger
                            className="cursor-pointer"
                            asChild
                        >
                            <Avatar size="sm">
                                <AvatarFallback>{(user?.full_name || user?.username || "?")?.[0]}</AvatarFallback>

                                <AvatarImage
                                    src={user?.avatar_url}
                                    alt={user?.full_name || user?.username || "?"}
                                />
                            </Avatar>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>

                    <TooltipContent
                        side="bottom"
                        align="center"
                    >Account</TooltipContent>
                </Tooltip>

                <DropdownMenuContent
                    side="bottom"
                    align="end"
                >
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Avatar size="xs">
                                <AvatarFallback>{(user?.full_name || user?.username || "?")?.[0]}</AvatarFallback>

                                <AvatarImage
                                    src={user?.avatar_url}
                                    alt={user?.full_name || user?.username || "?"}
                                />
                            </Avatar>

                            <div>
                                <div className="flex-1 text-sm font-normal line-clamp-1">{user?.full_name || user?.username}</div>
                                <div className="flex-1 text-xs line-clamp-1">@{user?.username}</div>
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onSelect={() => setSettingOpen(true)}>
                            <SettingsIcon />

                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => logout()}
                        >
                            <LogOutIcon />

                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <SettingsDialog
                open={settingsOpen}
                onOpenChange={setSettingOpen}
            />
        </>
    )
}

export default UserMenu