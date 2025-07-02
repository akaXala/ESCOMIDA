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
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'; // Para "Preparar"
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd'; // Para "Modificar menú del día"
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Para "Modificar menú"
import LogoutIcon from '@mui/icons-material/Logout'; // Para "Cerrar Sesión"

type NavItem = 'preparar' | 'menu-del-dia' | 'modificar-menu';

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

    // Navegación botones
    const handleNavChange = (newValue: NavItem) => {
        switch (newValue) {
            case 'preparar':
                router.push("/cocina/preparar");
                break;
            case 'menu-del-dia':
                router.push("/cocina/menu-del-dia");
                break;
            case 'modificar-menu':
                router.push("/cocina/modificar-menu");
                break;                
        }
    }

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
                    Cocinero
                </Typography>

                {/* Contenedor para los botones */}
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Button
                        variant="contained" 
                        color="primary" 
                        startIcon={<RestaurantMenuIcon />}
                        sx={buttonStyle}
                        onClick={() => handleNavChange('preparar')}
                    >
                        Preparar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FormatListBulletedAddIcon />}
                        sx={buttonStyle}
                        onClick={() => handleNavChange('menu-del-dia')}
                    >
                        Modificar menú del día
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<MenuBookIcon />}
                        sx={buttonStyle}
                        onClick={() => handleNavChange('modificar-menu')}
                    >
                        Modificar menú
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