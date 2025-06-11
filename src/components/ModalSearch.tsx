"use client";

import * as React from 'react';

// Motion
import { motion, AnimatePresence } from 'motion/react';

// Componentes MUI
import {
    ThemeProvider,
    CssBaseline,
    useMediaQuery,
    Modal,
    Box,
    TextField,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    InputAdornment,
    ListItemButton
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';

// Tema personalizado
import { getCustomTheme } from '@/components/MUI/CustomTheme';

interface ModalSearchProps {
    open: boolean;
    onClose: () => void;
}

// Mock data
const searchResultsData = [
    { id: 1, name: 'Prueba1', category: 'Breakfast', avatarText: 'P1' },
    { id: 2, name: 'Prueba2', category: 'Fast Food', avatarText: 'P2' },
    { id: 3, name: 'Prueba3', category: 'Fast Food', avatarText: 'P3' },
    { id: 4, name: 'Prueba4', category: 'Breakfast', avatarText: 'P4' },
    { id: 5, name: 'Prueba5', category: 'Chicken', avatarText: 'P5' },
];

const modalContentStyle = (theme: any) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    bgcolor: theme.palette.background.paper,
    borderRadius: 0,
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    p: 0,
    overflow: 'hidden',
});

const MotionBox = motion.create(Box);

export default function ModalSearch({ open, onClose }: ModalSearchProps) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);
    const themeMode = prefersDarkMode ? 'dark' : 'light';

    const borderColor = (themeMode === 'light') ? '#0044ff' : '#91a8fd';
    const borderHoverColor = (themeMode === 'light') ? '#0334BA' : '#6C84DB';
    const borderFocusedColor = (themeMode === 'light') ? '#0334BA' : '#6C84DB';

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AnimatePresence>
                {open && (
                    <Modal
                        keepMounted
                        open={open}
                        onClose={onClose}
                        aria-labelledby="search-modal-title"
                        // Evita la animación de fondo por defecto del Modal para no entrar en conflicto
                        slotProps={{ backdrop: { style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } } }}
                    >
                        <MotionBox
                            sx={modalContentStyle}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ ease: "easeInOut", duration: 0.3 }}
                        >
                            {/* Header: Title and Close Button */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: '12px 16px',
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    flexShrink: 0,
                                }}
                            >
                                <Typography id="search-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'medium' }}>
                                    Buscar
                                </Typography>
                                <IconButton onClick={onClose} aria-label="close search modal">
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            {/* Search Input Field */}
                            <Box sx={{ p: '16px', flexShrink: 0 }}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    placeholder="Buscar en ESCOMIDA..."
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: 'action.active', ml: 0.5 }} />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: '8px',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor, borderWidth: '1.5px' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: borderHoverColor },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: borderFocusedColor },
                                        }
                                    }}
                                />
                            </Box>

                            {/* Results List */}
                            <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                                <List sx={{ py: 0 }}>
                                    {searchResultsData.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <ListItemButton sx={{ px: '16px', py: '10px' }}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt={item.name}
                                                        src={`/images/avatar_placeholder_${item.id}.png`}
                                                        sx={{
                                                            bgcolor: theme.palette.primary.main,
                                                            color: theme.palette.getContrastText(theme.palette.primary.main)
                                                        }}
                                                    >
                                                        {item.avatarText}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={<Typography variant="body1">{item.name}</Typography>}
                                                    secondary={<Typography variant="body2" color="text.secondary">{item.category}</Typography>}
                                                />
                                            </ListItemButton>
                                            {index < searchResultsData.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Box>
                        </MotionBox>
                    </Modal>
                )}
            </AnimatePresence>
        </ThemeProvider>
    );
}