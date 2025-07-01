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

// Iconos MUI
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Para actividad reciente
import ListAltIcon from '@mui/icons-material/ListAlt'; // Para órdenes
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Para ingredientes populares
import NotificationsIcon from '@mui/icons-material/Notifications';


import FixedNavBarKitchen from '@/components/FixedNavBarKitchen'

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

    const handlePrepareDishes = () => {
        console.log("Navegar a la sección de preparación de platillos");
        // router.push("/cocina/preparar");
    };

    const handleModifyDailyMenu = () => {
        console.log("Navegar a la sección de modificar menú del día");
        // router.push("/cocina/menu-del-dia");
    };

    const handleModifyFullMenu = () => {
        console.log("Navegar a la sección de modificar menú completo");
        // router.push("/cocina/menu-completo");
    };
    
    // Estilos comunes para los botones
    const buttonStyle = {
        margin: '10px', // Espaciado entre botones
        padding: '12px 24px', // Botones más grandes
        borderRadius: '20px', // Bordes redondeados
        minWidth: '250px', // Ancho mínimo para consistencia
    };
    const dashboardStats = {
        pendingOrdersCount: 5,
        newNotifications: 2,
        todayPrepared: 15,
        recentActivity: [
            { id: 1, text: 'Orden #1234 completada', time: 'Hace 5 minutos' },
            { id: 2, text: 'Nuevo pedido: Pizza Pepperoni', time: 'Hace 15 minutos' },
            { id: 3, text: 'Inventario de tomate bajo', time: 'Hace 30 minutos' },
        ],
    };

    if (!mounted) return null;

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

                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: theme.palette.text.primary, mb: 4 }}>
                    Bienvenido, Chef!
                </Typography>

                {/* Sección de Métricas Rápidas */}
                <Grid container spacing={3} justifyContent="center" mb={6}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={4} sx={{
                            p: 3, textAlign: 'center', backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText,
                            transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'translateY(-5px)' }
                        }}>
                            <ListAltIcon sx={{ fontSize: 50, mb: 1 }} />
                            <Typography variant="h5">Órdenes Pendientes</Typography>
                            <Typography variant="h3">{dashboardStats.pendingOrdersCount}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={4} sx={{
                            p: 3, textAlign: 'center', backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText,
                            transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'translateY(-5px)' }
                        }}>
                            <NotificationsIcon sx={{ fontSize: 50, mb: 1 }} />
                            <Typography variant="h5">Nuevas Notificaciones</Typography>
                            <Typography variant="h3">{dashboardStats.newNotifications}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={4} sx={{
                            p: 3, textAlign: 'center', backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText,
                            transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'translateY(-5px)' }
                        }}>
                            <RestaurantMenuIcon sx={{ fontSize: 50, mb: 1 }} />
                            <Typography variant="h5">Platillos Preparados Hoy</Typography>
                            <Typography variant="h3">{dashboardStats.todayPrepared}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Sección de Actividad Reciente */}
                {dashboardStats.recentActivity.length > 0 && (
                    <Box display="flex" justifyContent="center" mb={4}>
                        <Paper elevation={3} sx={{
                            p: 3, width: '100%', maxWidth: 800, backgroundColor: theme.palette.background.paper
                        }}>
                            <Box display="flex" alignItems="center" mb={2} sx={{ color: theme.palette.text.primary }}>
                                <AccessTimeIcon sx={{ mr: 1 }} />
                                <Typography variant="h6" component="h3">
                                    Actividad Reciente en Cocina
                                </Typography>
                            </Box>
                            {dashboardStats.recentActivity.map((activity) => (
                                <Box key={activity.id} display="flex" justifyContent="space-between" alignItems="center" py={1} borderBottom={1} borderColor="divider">
                                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>{activity.text}</Typography>
                                    <Typography variant="body2" color="text.secondary">{activity.time}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    </Box>
                )}

                {/* Botón de Cerrar Sesión (al final) */}
                {isSignedIn && (
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="outlined" // Cambiado a outlined para diferenciarlo de los principales
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={handleSignOut}
                            sx={{
                                ...buttonStyle, // Mantiene el mismo estilo base
                                borderColor: theme.palette.error.main,
                                color: theme.palette.error.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.error.light,
                                    color: theme.palette.error.contrastText,
                                    borderColor: theme.palette.error.light,
                                },
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    );
}