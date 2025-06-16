"use client";

import * as React from 'react';

// Componentes MUI
import { Button, ThemeProvider, CssBaseline, useMediaQuery, Typography, Box,Grid,Paper
 } from "@mui/material";
// Sesiones Clerk
import { useAuth } from "@clerk/nextjs";
// Navegación Next.js
import { useRouter } from "next/navigation";
// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';
  
import FixedNavBarKitchen from '@/components/FixedNavBarKitchen'

export default function Home(){
    // Detecta si el sistema está en dark mode
        const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
        const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);
    
        // Sesiones Clerk
        const { isSignedIn, signOut } = useAuth();
        // Navegación Next.js
        const router = useRouter();
    
        const handleSignOut = async () => {
            await signOut();
            router.push("/");
        };
    
        const handleListOrders = () => {
            console.log("Navegar a la lista de órdenes");
            router.push("/cocina/pedidos"); // Ejemplo de navegación real
        };
    
        const handlePopularIngredients = () => {
            console.log("Navegar a la sección de ingredientes más populares");
            router.push("/cocina/ingredientes"); // Ejemplo de navegación real
        };
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 12, // Espacio para la barra de navegación fija
                        padding: { xs: 2, sm: 3, md: 4 }, // Padding responsivo
                        minHeight: '100vh',
                        backgroundColor: theme.palette.background.default,
                    }}
                >
                    {/* Asumo que FixedNavBarKitchen ya está manejando su propio estilo y posicionamiento */}
                    <FixedNavBarKitchen
                        onListOrdersListClick={handleListOrders}
                        onLogutClick={handleSignOut}
                        onMostPoularClick={handlePopularIngredients}
                        currentTab="kitchen"
                    />
                </Box>
            </ThemeProvider>
        );
}