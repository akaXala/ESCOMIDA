"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';

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

interface Alimento {
    id_alimento: number;
    nombre: string;
    precio: number;
    calorias: number;
    imagen?: string; // Asegúrate de que tu API regrese la ruta de la imagen
}

interface ModalSearchProps {
    open: boolean;
    onClose: () => void;
    alimentos: Alimento[];
}

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

export default function ModalSearch({ open, onClose, alimentos }: ModalSearchProps) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);
    const themeMode = prefersDarkMode ? 'dark' : 'light';
    const [search, setSearch] = React.useState('');
    const router = useRouter();

    const borderColor = (themeMode === 'light') ? '#0044ff' : '#91a8fd';
    const borderHoverColor = (themeMode === 'light') ? '#0334BA' : '#6C84DB';
    const borderFocusedColor = (themeMode === 'light') ? '#0334BA' : '#6C84DB';

    // Filtrado en tiempo real
    const filteredResults = React.useMemo(() => {
        if (!search) return alimentos;
        return alimentos.filter(a =>
            a.nombre.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, alimentos]);

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
                        slotProps={{ backdrop: { style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } } }}
                    >
                        <MotionBox
                            sx={modalContentStyle}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ ease: "easeInOut", duration: 0.3 }}
                        >
                            {/* Header */}
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
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
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
                                    {filteredResults.length === 0 ? (
                                        <Typography sx={{ px: 3, py: 2 }} color="text.secondary">
                                            No se encontraron resultados.
                                        </Typography>
                                    ) : (
                                        filteredResults.map((item, index) => (
                                            <React.Fragment key={item.id_alimento}>
                                                <ListItemButton
                                                    sx={{ px: '16px', py: '10px' }}
                                                    onClick={() => {
                                                        onClose();
                                                        router.push(`/producto?id=${item.id_alimento}`);
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            alt={item.nombre}
                                                            src={item.imagen || `/images/avatar_placeholder_${item.id_alimento}.png`}
                                                            sx={{
                                                                bgcolor: theme.palette.primary.main,
                                                                color: theme.palette.getContrastText(theme.palette.primary.main)
                                                            }}
                                                        >
                                                            {item.nombre[0]}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={<Typography variant="body1">{item.nombre}</Typography>}
                                                        secondary={
                                                            <Typography variant="body2" color="text.secondary">
                                                                {item.calorias} kcal · ${item.precio}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                                {index < filteredResults.length - 1 && <Divider variant="inset" component="li" />}
                                            </React.Fragment>
                                        ))
                                    )}
                                </List>
                            </Box>
                        </MotionBox>
                    </Modal>
                )}
            </AnimatePresence>
        </ThemeProvider>
    );
}