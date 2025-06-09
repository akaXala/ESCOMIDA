import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

// Componentes MUI
import { ThemeProvider, CssBaseline, useMediaQuery, Box, Button } from '@mui/material'

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

interface SearchButtonProps {
  onClick?: () => void;
}

function SearchButton({ onClick }: SearchButtonProps): React.ReactElement {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
        const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);
    
        // Guarda el modo actual
        const themeMode = prefersDarkMode ? 'dark' : 'light';

        // Colores dependiendo del tema
        const borderColor = (themeMode === 'light') ? '#0044ff' : '#91a8fd';
        const color = (themeMode === 'light') ? '#000000' : '#ffffff';
        const borderHoverColor = (themeMode === 'light') ? '#0334BA' : '#6C84DB';
        const backgroundColor = (themeMode === 'light') ? 'rgba(0, 0, 0, 0.04)' : 'rgba(16, 20, 28, 0.1)';

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 4, // Añade algo de espacio alrededor
                width: '100%'
            }}>
                <Button
                    variant="outlined"
                    startIcon={<SearchIcon />}
                    sx={{
                    width: '99%',
                    borderRadius: '50px',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    borderColor: borderColor,
                    color: color,
                    padding: '8px 16px',
                    '&:hover': {
                        borderColor: borderHoverColor,
                        backgroundColor: backgroundColor,
                    },
                    }}
                    onClick={onClick}
                >
                    Buscar en ESCOMIDA...
                </Button>
            </Box>
        </ThemeProvider>
        
    );
};

export default SearchButton;