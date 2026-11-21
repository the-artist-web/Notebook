"use client";

/**
 * Components
 */
import { Spinner } from "@/components/ui/spinner";

const Loading = () =>
    <div className="fixed inset-0 z-50 flex justify-center w-full h-dvh bg-background p-6">
        <div className="bg-card border border-border rounded-full shadow-lg p-2 max-w-max max-h-max">
            <Spinner className="!size-7" />
        </div>
    </div>

export default Loading