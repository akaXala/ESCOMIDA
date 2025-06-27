"use client";

import * as React from 'react';

// Componentes MUI
import { Button, ThemeProvider, CssBaseline, useMediaQuery, Typography, Box } from "@mui/material";
// Sesiones Clerk
import { useAuth } from "@clerk/nextjs";
// Navegación Next.js
import { useRouter } from "next/navigation";
// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// Iconos MUI
import PeopleIcon from '@mui/icons-material/People'; // Para "Gestionar usuarios"
import LogoutIcon from '@mui/icons-material/Logout'; // Para "Cerrar Sesión"

export default function Home() {
    // Estado para saber si estamos en el cliente
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);

    // Detecta si el sistema está en dark mode
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => getCustomTheme(mounted && prefersDarkMode ? 'dark' : 'light'), [mounted, prefersDarkMode]);

    // Sesiones Clerk
    const { isSignedIn, signOut } = useAuth();
    // Navegación Next.js
    const router = useRouter();

    // Cerrar sesión
    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    // Estilos comunes para los botones
    const buttonStyle = {
        margin: '10px', // Espaciado entre botones
        padding: '12px 24px', // Botones más grandes
        borderRadius: '20px', // Bordes redondeados
        minWidth: '250px', // Ancho mínimo para consistencia
    };

    if (!mounted) return null;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {/* Contenedor principal para centrar todo */}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh" // Ocupa toda la altura de la pantalla
                textAlign="center"
            >
                <Typography variant="h4" gutterBottom>
                    Administrador
                </Typography>

                {/* Contenedor para los botones */}
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Button
                        variant="contained" 
                        color="primary" 
                        startIcon={<PeopleIcon />}
                        sx={buttonStyle}
                    >
                        Gestionar usuarios
                    </Button>
                    {isSignedIn && (
                        <Button 
                            variant="contained" 
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={handleSignOut} 
                            sx={buttonStyle}
                        >
                            Cerrar Sesión
                        </Button>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}