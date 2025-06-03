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
    Divider // Importado para usar explícitamente si es necesario
} from '@mui/material';

// Iconos MUI
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person'; // Para Avatar de usuario logueado
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Para Avatar de invitado
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'; // Para "Cuenta" (logueado)
import LoginIcon from '@mui/icons-material/Login'; // Para "Cuenta" (deslogueado, lleva a login)
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'; // Para "Mis pedidos"
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // Para "Soporte"
import LogoutIcon from '@mui/icons-material/Logout'; // Para "Cerrar Sesión"
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Para "Registrarse"

interface RightDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Simulación de datos de usuario
interface UserData {
    name: string;
    email: string;
    avatarLetter?: string; // Para el fallback del Avatar
}

export default function RightDrawer({ open, setOpen }: RightDrawerProps) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Estado de sesión
    const [currentUser, setCurrentUser] = React.useState<UserData | null>(null);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    // Simulación de inicio/cierre de sesión
    const handleToggleLoginState = () => {
        if (isLoggedIn) {
            setIsLoggedIn(false);
            setCurrentUser(null);
        } else {
            setIsLoggedIn(true);
            setCurrentUser({
                name: "Arath Jimenez Xala", // Nombre más natural
                email: "jimenez.xala.arath@gmail.com", // Email principal
                avatarLetter: "A"
            });
        }
        setOpen(false); // Cerrar drawer después de cambiar estado de sesión
    };

    const handleMenuItemClick = (actionKey: string) => {
        console.log(`Action: ${actionKey}`);
        // Aquí iría la lógica de navegación o acción específica
        // Por ejemplo, si es 'myOrders' y no está logueado, redirigir a login
        if (actionKey === 'myOrders' && !isLoggedIn) {
            alert("Por favor, inicia sesión para ver tus pedidos.");
            // Lógica para redirigir a login
            setOpen(false);
            return;
        }
        if (actionKey === 'loginPrompt') {
            // Lógica para mostrar modal de login o redirigir
            alert("Redirigiendo a inicio de sesión...");
            // Para demostración, simulamos un login:
            // handleToggleLoginState(); // No llamar aquí directamente si cierra el drawer
            setOpen(false);
            return;
        }
         if (actionKey === 'signUp') {
            alert("Redirigiendo a la página de registro...");
        }

        setOpen(false); // Cerrar el drawer para otras acciones
    };


    const menuOptions = [
        {
            text: 'Cuenta',
            icon: isLoggedIn ? <ManageAccountsIcon /> : <LoginIcon />,
            actionKey: isLoggedIn ? 'userAccount' : 'loginPrompt',
            requiresLogin: false, // La opción es visible, la acción cambia
        },
        {
            text: 'Mis pedidos',
            icon: <ShoppingBagIcon />,
            actionKey: 'myOrders',
            requiresLogin: true, // La acción requerirá login si no está autenticado
        },
        {
            text: 'Soporte',
            icon: <SupportAgentIcon />,
            actionKey: 'support',
            requiresLogin: false,
        },
    ];

    const DrawerList = (
        <Box
            sx={{
                width: { xs: '85vw', sm: 300, md: 320 }, // Ancho responsivo
                height: '100%', // Ocupa toda la altura del Drawer
                display: 'flex',
                flexDirection: 'column', // Organiza contenido verticalmente
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
                    flexShrink: 0, // Evita que se encoja
                }}
            >
                <Typography variant="h6" component="div">
                    {isLoggedIn && currentUser ? "Tu Cuenta" : "Menú"}
                </Typography>
                <IconButton onClick={toggleDrawer(false)} aria-label="Cerrar menú">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />

            {/* 2. Sección de Perfil (Condicional) */}
            <Box sx={{ textAlign: 'center', p: { xs: 2, sm: 3 }, flexShrink: 0 }}>
                {isLoggedIn && currentUser ? (
                    <>
                        <Avatar sx={{ width: 56, height: 56, mb: 1.5, mx: 'auto', bgcolor: 'primary.main' }}>
                            {currentUser.avatarLetter || <PersonIcon />}
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                            {currentUser.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                            {currentUser.email}
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

            {/* 3. Lista de Opciones (Cuerpo principal que puede hacer scroll) */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List sx={{ px: 1, pt: 1 }}>
                    {menuOptions.map((item) => (
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
                {isLoggedIn ? (
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<LogoutIcon />}
                        onClick={handleToggleLoginState} // Cierra sesión
                    >
                        Cerrar Sesión
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant="contained" // Botón principal para registrarse
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleMenuItemClick('signUp')} // Acción para registrarse
                    >
                        Registrarse
                    </Button>
                )}
            </Box>
        </Box>
    );

    return (
        <div>
            {/* Botón de prueba para simular login/logout */}
            <Button onClick={handleToggleLoginState} sx={{ ml: 2 }}>
                {isLoggedIn ? "Simular Logout" : "Simular Login"}
            </Button>

            <Drawer
                anchor="right" // Puedes cambiarlo a "right"
                open={open}
                onClose={toggleDrawer(false)}
                sx={{ zIndex: 1400 }}
            >
                {DrawerList}
            </Drawer>
        </div>
    );
}