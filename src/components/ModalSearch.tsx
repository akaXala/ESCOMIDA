"use client";

import * as React from 'react';

// Componentes MUI
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

export default function ModalSearch() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Detecta si el sistema está en dark mode
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    
    // Crea el tema automáticamente según preferencia
    const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

    return (
        <ThemeProvider theme={theme}>

        </ThemeProvider>
    );
}