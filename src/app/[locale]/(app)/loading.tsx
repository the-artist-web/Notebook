/**
 * Components
 */
import { Spinner } from "@/components/ui/spinner";

const Loading = () =>
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-full shadow-lg p-2">
        <Spinner className="!size-7" />
    </div>

export default Loading;