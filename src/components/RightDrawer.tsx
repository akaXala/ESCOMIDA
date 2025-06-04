"use client";

import * as React from 'react';

// Componentes MUI
import {
    Box,
    Drawer,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    Avatar,
    Divider
} from '@mui/material';

// Iconos MUI
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person'; // Fallback para Avatar
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Para Avatar de invitado
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'; // Para "Cuenta" (logueado)
import LoginIcon from '@mui/icons-material/Login'; // Para "Iniciar Sesión"
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'; // Para "Mis pedidos"
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // Para "Soporte"
import LogoutIcon from '@mui/icons-material/Logout'; // Para "Cerrar Sesión"
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Para "Registrarse"

// Navegación Next.js
import { useRouter } from 'next/navigation';

// Clerk
import { useUser, useAuth } from '@clerk/nextjs';

interface RightDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function RightDrawer({ open, setOpen }: RightDrawerProps) {
    const router = useRouter();
    const { isSignedIn, signOut } = useAuth();
    const { user, isLoaded } = useUser();

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/'); // Redirect to homepage after sign out
        setOpen(false);
    };

    const handleMenuItemClick = (actionKey: string) => {
        setOpen(false); // Close drawer on any item click

        switch (actionKey) {
            case 'userAccount':
                router.push('/user-profile'); // Clerk's default user profile page
                break;
            case 'signIn':
                router.push('/sign-in');
                break;
            case 'signUp':
                router.push('/sign-up');
                break;
            case 'myOrders':
                if (!isSignedIn) {
                    // Optionally, pass a redirect URL to Clerk's sign-in page
                    router.push('/sign-in?redirect_url=/my-orders');
                } else {
                    router.push('/my-orders'); // Placeholder for actual orders page
                }
                break;
            case 'support':
                router.push('/support'); // Placeholder for actual support page
                break;
            default:
                console.log(`Action: ${actionKey}`);
        }
    };

    // Wait for Clerk to load before rendering anything
    if (!isLoaded) {
        return null; // Or a loading spinner
    }

    const menuOptions = [
        {
            text: isSignedIn ? 'Cuenta' : 'Iniciar Sesión',
            icon: isSignedIn ? <ManageAccountsIcon /> : <LoginIcon />,
            actionKey: isSignedIn ? 'userAccount' : 'signIn',
            show: true, // Always show this option
        },
        // Add "Registrarse" option only if not signed in
        ...(!isSignedIn ? [{
            text: 'Registrarse',
            icon: <PersonAddIcon />,
            actionKey: 'signUp',
            show: true,
        }] : []),
        {
            text: 'Mis pedidos',
            icon: <ShoppingBagIcon />,
            actionKey: 'myOrders',
            show: true, // Show always, behavior changes based on login state
        },
        {
            text: 'Soporte',
            icon: <SupportAgentIcon />,
            actionKey: 'support',
            show: true, // Always show this option
        },
    ];

    const DrawerList = (
        <Box
            sx={{
                width: { xs: '85vw', sm: 300, md: 320 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
            role="presentation"
        >
            {/* 1. Cabecera */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    flexShrink: 0,
                }}
            >
                <Typography variant="h6" component="div">
                    {isSignedIn && user ? "Tu Cuenta" : "Menú"}
                </Typography>
                <IconButton onClick={toggleDrawer(false)} aria-label="Cerrar menú">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />

            {/* 2. Sección de Perfil (Condicional) */}
            <Box sx={{ textAlign: 'center', p: { xs: 2, sm: 3 }, flexShrink: 0 }}>
                {isSignedIn && user ? (
                    <>
                        <Avatar
                            src={user.imageUrl || undefined}
                            sx={{ width: 56, height: 56, mb: 1.5, mx: 'auto', bgcolor: 'primary.main' }}
                        >
                            {!user.imageUrl && (user.firstName?.charAt(0) || <PersonIcon />)}
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                            {user.fullName || user.firstName || "Usuario"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                            {user.primaryEmailAddress?.emailAddress || "No email"}
                        </Typography>
                    </>
                ) : (
                    <>
                        <Avatar sx={{ width: 56, height: 56, mb: 1.5, mx: 'auto' }}>
                            <AccountCircleIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Invitado/a
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Únete o inicia sesión.
                        </Typography>
                    </>
                )}
            </Box>
            <Divider />

            {/* 3. Lista de Opciones */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List sx={{ px: 1, pt: 1 }}>
                    {menuOptions.filter(item => item.show).map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton onClick={() => handleMenuItemClick(item.actionKey)}>
                                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* 4. Pie de Drawer (Botón condicional) */}
            <Box sx={{ p: 2, mt: 'auto', flexShrink: 0, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                {isSignedIn ? (
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<LogoutIcon />}
                        onClick={handleSignOut}
                    >
                        Cerrar Sesión
                    </Button>
                ) : (
                    <Button // When not logged in, this button takes to Sign In
                        fullWidth
                        variant="contained"
                        startIcon={<LoginIcon />}
                        onClick={() => handleMenuItemClick('signIn')}
                    >
                        Iniciar Sesión Rápido
                    </Button>
                )}
            </Box>
        </Box>
    );

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }} // Ensure drawer is above other Clerk modals if any
        >
            {DrawerList}
        </Drawer>
    );
}