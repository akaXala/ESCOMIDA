"use client";

import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Importa los iconos necesarios
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Para actividad reciente
import ListAltIcon from '@mui/icons-material/ListAlt'; // Para órdenes
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Para ingredientes populares
import NotificationsIcon from '@mui/icons-material/Notifications';

// Sesiones Clerk
import { useAuth } from "@clerk/nextjs";
// Navegación Next.js
import { useRouter } from "next/navigation";
// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

import FixedNavBarKitchen from '@/components/FixedNavBarKitchen'
import OrderManagementTables from '@/components/OrderManagementTables'

export default function Home() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

    const { isSignedIn, signOut } = useAuth();
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
    const dummyPendingOrders = [
        {
            id: 'ORD001',
            customerName: 'Juan Pérez',
            items: [{ name: 'Pizza Pepperoni', quantity: 1 }, { name: 'Refresco Cola', quantity: 2 }],
            notes: 'Sin cebolla, extra queso',
            orderTime: '18:00',
            status: 'Pendiente'
        },
        {
            id: 'ORD002',
            customerName: 'Ana García',
            items: [{ name: 'Ensalada César', quantity: 1 }],
            notes: '',
            orderTime: '18:15',
            status: 'Pendiente'
        },
    ];

    const dummyAcceptedOrders = [
        {
            id: 'ORD003',
            customerName: 'Carlos López',
            items: [{ name: 'Hamburguesa Doble', quantity: 1 }, { name: 'Papas Fritas', quantity: 1 }],
            notes: 'Bien cocida la carne',
            orderTime: '17:30',
            status: 'En Proceso',
            estimatedCompletion: '2025-06-16 19:00'
        },
    ];


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
                    onMostPoular={handlePopularIngredients}
                    currentTab="kitchen"
                />
                <OrderManagementTables 
                    initialPendingOrders = {dummyPendingOrders}
                    initialAcceptedOrders = {dummyAcceptedOrders}
                />
            </Box>
        </ThemeProvider>
    );
}