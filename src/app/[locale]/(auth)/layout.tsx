"use client";

const AuthLayout = ({
    children
}: {
    children: React.ReactNode;
}) => 
    <div
        className="grid place-items-center w-full min-h-dvh py-10 px-4"
    >{children}</div>;

export default AuthLayout