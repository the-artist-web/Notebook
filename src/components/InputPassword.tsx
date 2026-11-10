"use client";

/**
 * Node modules
 */
import { useState } from "react";

/**
 * Components
 */
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from "@/components/ui/tooltip";
import {
  InputGroup,
  InputGroupInput
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

/**
 * Assets
 */
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const InputPassword = ({
    ...props
}: React.ComponentProps<typeof InputGroupInput>) => {
    const [toggleShow, setToggleShow] = useState(false);

    return (
        <InputGroup>
            <InputGroupInput
                type={toggleShow ? "text" : "password"}
                {...props}
            />

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setToggleShow(toggleShow ? false : true)}
                    >
                        {toggleShow ? <EyeOffIcon /> : <EyeIcon />}
                    </Button>
                </TooltipTrigger>

                <TooltipContent
                    side="bottom"
                    align="center"
                >{toggleShow ? "Hide password" : "Show Password"}</TooltipContent>
            </Tooltip>
        </InputGroup>
    )
}