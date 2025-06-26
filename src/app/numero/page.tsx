"use client";

import * as React from 'react';

import { ThemeProvider, CssBaseline, useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

import PhoneNumberForm from "@/components/Form/PhoneNumberForm";

export default function Home() {
    // Estado para saber si estamos en el cliente
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);

    // Detecta si el sistema está en dark mode
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => getCustomTheme(mounted && prefersDarkMode ? 'dark' : 'light'), [mounted, prefersDarkMode]);

    if (!mounted) return null;

    return(
        <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
              >
                <PhoneNumberForm />
              </Box>
        </ThemeProvider >
    )
}