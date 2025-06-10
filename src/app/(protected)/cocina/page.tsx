"use client";

import { Button } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
    const { isSignedIn, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <>
            <p>pepe</p>
            {isSignedIn && (
                <Button variant="contained" color="error" onClick={handleSignOut}>
                    Cerrar Sesión
                </Button>
            )}
        </>
    );
}