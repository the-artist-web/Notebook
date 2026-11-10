"use client";

const layout = ({
    children
}: React.PropsWithChildren<"div">) => 
    <div
        className="grid place-items-center w-full min-h-dvh py-10 px-4"
    >{children}</div>;

export default layout