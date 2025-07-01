import * as React from 'react';
import Image from 'next/image';
import { Box, Typography, CircularProgress, useMediaQuery } from '@mui/material';

export default function Loading() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const bgGradient = prefersDarkMode
        ? '#10141C'
        : '#ffffff';
    const shadow = prefersDarkMode
        ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        : '0 8px 32px 0 rgba(100, 150, 255, 0.15)';
    const spinnerColor = prefersDarkMode ? '#6C84DB' : '#0334BA';
    const textColor = prefersDarkMode ? '#e0e0e0' : 'text.secondary';

    return(
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                width: '100vw',
                background: bgGradient,
                boxShadow: shadow,
                transition: 'background 0.3s',
            }}
        >
            <Box sx={{
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: prefersDarkMode
                    ? '0 4px 24px 0 rgba(0,0,0,0.5)'
                    : '0 4px 24px 0 rgba(0,0,0,0.12)',
                mb: 2
            }}>
                <Image
                    src='/favicon.webp'
                    alt='Logo ESCOMIDA'
                    width={120}
                    height={120}
                    priority
                    style={{ background: prefersDarkMode ? '#232526' : '#fff' }}
                />
            </Box>
            <CircularProgress
                sx={{ my: 2, color: spinnerColor }}
                color="inherit"
                thickness={5}
                size={48}
            />
            <Typography 
                variant='h5'
                sx={{ color: textColor, fontWeight: 600, letterSpacing: 1 }}
            >
                Cargando...
            </Typography>
        </Box>
    )
}