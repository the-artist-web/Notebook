import { cn } from "cn"
import { HugeiconsIcon } from "@hugeicons/react"
import { LoaderCircleIcon } from "@hugeicons/core-free-icons"

type SpinnerProps = Omit<
    React.ComponentProps<typeof HugeiconsIcon>,
    "icon"
>;

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <HugeiconsIcon icon={LoaderCircleIcon} strokeWidth={2} data-slot="spinner" role="status" aria-label="Loading" className={cn("size-5 animate-spin", className)} {...props} />
  )
}

export { Spinner }
