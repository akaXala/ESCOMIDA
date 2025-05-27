"use client";

import React, { useState, useMemo } from 'react';

// Componentes MUI
import { Typography, AppBar, Toolbar, Button, Box, Badge, Divider, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// Iconos MUI
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type NavItem = 'home' | 'search' | 'orders' | 'account';

const FixedNavBar: React.FC = () => {
    // Detecta si el sistema está en dark mode
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Crea el tema automáticamente según preferencia
    const theme = useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

    // Guarda el modo actual
    const themeMode = prefersDarkMode ? 'dark' : 'light';
    
    const logoImageUrl = "/favicon.webp";
    const cartItemCount = 5;

    const [selectedTab, setSelectedTab] = useState<NavItem>('home');

    // Funciones temporales
    const handleLogoClick = () => console.log("Logo clickeado!");
    const handleCartClick = () => console.log("Carrito clickeado!");

    // Funciones para cambio de color de selector
    const handleHomeClick = () => setSelectedTab('home');
    const handleOrdersClick = () => setSelectedTab('orders');

    // Colores de diseño
    const buttonHoverStyle = { '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } };
    const selectedIndicatorColor = (themeMode == 'light') ? '#0334BA' : '#6C84DB'; 

    const getNavButtonStyle = (tabName: NavItem) => ({
      ...buttonHoverStyle,
      flexGrow: 1, 
      minWidth: 0, 
      //padding: '4px 8px', 
      borderBottom: selectedTab === tabName ? `2px solid` : '2px solid transparent', 
      borderColor: selectedTab === tabName ? selectedIndicatorColor : 'transparent',
      backgroundColor: (themeMode === 'light') ? '#ffffff' :'#10141C',
      color: 'inherit', 
      fontWeight: selectedTab === tabName ? 'bold' : 'normal', 
      textTransform: 'none', 
      borderRadius: 0, 
      '& .MuiButton-startIcon .MuiSvgIcon-root': {
          fontSize: '1.1rem', 
          marginRight: '4px', 
      },
      fontSize: '0.75rem', 
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        {/* Primera Fila: Logo, Nombre y Carrito */}
        <Toolbar variant="dense"> 
          <Box
            component="img"
            sx={{ height: { xs: 24, sm: 28 }, cursor: 'pointer', mr: 1 }} 
            alt="Logo"
            src={logoImageUrl}
            onClick={handleLogoClick}
          />
          <Typography 
              variant="body1" 
              component="div" 
              sx={{ color: 'inherit', fontWeight: 'bold' }}
          >
            ESCOM-IDA
          </Typography>
          <Box sx={{ flexGrow: 1 }} /> 
          <Button
            color="inherit"
            onClick={handleCartClick}
            startIcon={
              <Badge badgeContent={cartItemCount > 0 ? cartItemCount : null} color="error">
                <ShoppingCartIcon sx={{ fontSize: '1.2rem' }} /> 
              </Badge>
            }
            sx={{ 
              ...buttonHoverStyle, 
              padding: '4px 8px', 
              textTransform: 'none',
              fontSize: '0.8rem' 
            }}
          >
            Cart
          </Button>
        </Toolbar>

        {/* Segunda Fila: Botones de Navegación */}
        <Toolbar
          variant="dense" 
          sx={{
            paddingLeft: { xs: 1, sm: 0 }, // Quitar padding izquierdo del toolbar en sm y mayor
            paddingRight: { xs: 1, sm: 0 }, // Quitar padding derecho del toolbar en sm y mayor
            display: 'flex', // Aseguramos que el Toolbar sea un contenedor flex
            borderTop: (theme) => `1px solid ${theme.palette.divider}`, 
            backgroundColor: (theme) => theme.palette.primary.main, 
            minHeight: '40px', 
            padding: 0, // Crucial para que los botones puedan ocupar todo el espacio
          }}
        >
          <Button
            onClick={handleHomeClick}
            sx={getNavButtonStyle('home')}
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button
            sx={getNavButtonStyle('search')}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
          <Button
            onClick={handleOrdersClick}
            sx={getNavButtonStyle('orders')}
            startIcon={<ListAltIcon />}
          >
            Orders
          </Button>
          <Button
            sx={getNavButtonStyle('account')}
            startIcon={<AccountCircleIcon />}
          >
            Account
          </Button>
        </Toolbar>
      </AppBar>
    </ThemeProvider>    
  );
};

export default FixedNavBar;
