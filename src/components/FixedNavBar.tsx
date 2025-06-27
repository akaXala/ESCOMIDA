"use client";

import React, { useState, useMemo, useEffect } from 'react';

// Componentes MUI
import { 
    Typography, 
    AppBar, 
    Toolbar, 
    Button, 
    Box, 
    Badge, 
    CssBaseline, 
    ThemeProvider, 
    useMediaQuery,
    BottomNavigation,
    BottomNavigationAction
} from '@mui/material';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// Navegación Next.js
import { useRouter } from 'next/navigation';

// Iconos MUI
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type NavItem = 'home' | 'search' | 'orders' | 'account';

interface FixedNavBarProps {
  onAccountClick: () => void;
  onSearchClick: () => void;
  currentTab?: NavItem;
}

const FixedNavBar: React.FC<FixedNavBarProps> = ({ onAccountClick, onSearchClick, currentTab }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);
    const themeMode = prefersDarkMode ? 'dark' : 'light';
    
    // Usamos el breakpoint 'sm' del tema para detectar si es una vista móvil
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const logoImageUrl = "/favicon.webp";
    const router = useRouter();

    const [selectedTab, setSelectedTab] = useState<NavItem>(currentTab ?? 'home');
    useEffect(() => {
      if (currentTab) setSelectedTab(currentTab);
    }, [currentTab]);

    const [cartItemCount, setCartItemCount] = useState<number>(0);

    useEffect(() => {
      const fetchCartCount = async () => {
        try {
          const res = await fetch('/api/carrito/count');
          const data = await res.json();
          setCartItemCount(data.success ? data.count : 0);
        } catch (err) {
          setCartItemCount(0);
        }
      };
      fetchCartCount();
    }, []);

    const handleLogoClick = () => router.push("/");
    const handleCartClick = () => router.push("/carrito");

    // Manejador centralizado para la navegación
    const handleNavChange = (newValue: NavItem) => {
        switch (newValue) {
            case 'home':
                setSelectedTab('home');
                router.push("/");
                break;
            case 'orders':
                setSelectedTab('orders');
                router.push("/ordenes");
                break;
            case 'search':
                onSearchClick();
                break;
            case 'account':
                onAccountClick();
                break;
        }
    };

    // Manejador movil
    const handleMobileNavChange = (event: React.SyntheticEvent, newValue: NavItem) => {
        // Solo se actualiza el estado para 'home' y 'orders'
        switch (newValue) {
            case 'home':
                router.push("/");
                break;
            case 'orders':
                router.push("/ordenes");
                break;
            case 'search':
                onSearchClick();
                break;
            case 'account':
                onAccountClick();
                break;
        }
    };
    
    // --- Estilos ---
    const buttonHoverStyle = { '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } };
    const selectedIndicatorColor = (themeMode == 'light') ? '#0334BA' : '#6C84DB'; 

    const getNavButtonStyle = (tabName: NavItem) => ({
      ...buttonHoverStyle,
      flexGrow: 1, 
      minWidth: 0, 
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

    const bottomNavSelectedStyle = {
        '&.Mui-selected': {
            color: selectedIndicatorColor,
        },
    };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* AppBar solo contiene la fila superior */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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

        {/* --- RENDERIZADO CONDICIONAL DE LA NAVEGACIÓN --- */}
        {!isMobile && (
             <Toolbar
               variant="dense" 
               sx={{
                 padding: 0, // Crucial para que los botones ocupen todo el espacio
                 display: 'flex',
                 borderTop: (theme) => `1px solid ${theme.palette.divider}`, 
                 backgroundColor: (theme) => theme.palette.primary.main, 
                 minHeight: '40px', 
               }}
             >
                <Button onClick={() => handleNavChange('home')} sx={getNavButtonStyle('home')} startIcon={<HomeIcon />}>Inicio</Button>
                <Button onClick={() => handleNavChange('search')} sx={getNavButtonStyle('search')} startIcon={<SearchIcon />}>Buscar</Button>
                <Button onClick={() => handleNavChange('orders')} sx={getNavButtonStyle('orders')} startIcon={<ListAltIcon />}>Ordenes</Button>
                <Button onClick={() => handleNavChange('account')} sx={getNavButtonStyle('account')} startIcon={<AccountCircleIcon />}>Cuenta</Button>
             </Toolbar>
        )}
      </AppBar>

      {isMobile && (
          <BottomNavigation
            component="nav"
            sx={{ 
                width: '100%', 
                position: 'fixed', 
                bottom: 0, 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
            value={selectedTab}
            onChange={handleMobileNavChange}
          >
            <BottomNavigationAction label="Inicio" value="home" icon={<HomeIcon />} sx={bottomNavSelectedStyle} />
            <BottomNavigationAction label="Buscar" value="search" icon={<SearchIcon />} />
            <BottomNavigationAction label="Ordenes" value="orders" icon={<ListAltIcon />} sx={bottomNavSelectedStyle} />
            <BottomNavigationAction label="Cuenta" value="account" icon={<AccountCircleIcon />} />
          </BottomNavigation>
      )}
    </ThemeProvider>     
  );
};

export default FixedNavBar;