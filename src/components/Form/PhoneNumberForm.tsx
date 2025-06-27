'use client'; // Necesario para componentes que usan hooks de estado o eventos

import React, { useState } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Stack 
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/navigation';

const PhoneNumberForm = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleContinue = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!phoneNumber.trim() || !/^\d{10}$/.test(phoneNumber)) {
            setError('Por favor, introduce un número de teléfono válido de 10 dígitos.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/numero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero: phoneNumber })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                // Redirige a la página principal
                router.push('/');
            } else {
                setError(data.error || 'Error al registrar el número.');
            }
        } catch (e) {
            setError('Error de red. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                }}
            >
                <Typography 
                    component="h1" 
                    variant="h6" 
                    sx={{ 
                        textAlign: 'center', 
                        fontWeight: '600',
                        marginBottom: 3,
                    }}
                    color='black'
                >
                    Registra tu número de teléfono para continuar
                </Typography>
                
                <Box 
                    component="form" 
                    onSubmit={handleContinue} 
                    noValidate 
                    sx={{ width: '100%' }}
                >
                    <Stack spacing={2}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            label="Número de teléfono"
                            name="phone"
                            autoComplete="tel"
                            autoFocus
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            error={!!error}
                            helperText={error}
                            placeholder="Introduce tu teléfono"
                            variant="outlined"
                            sx={{
                                borderRadius: '8px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#e0e0e0', // borde gris claro
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#bdbdbd', // borde más oscuro al pasar el mouse
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#bdbdbd', // borde igual al enfocar
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#374151', // texto gris oscuro
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#374151', // label gris oscuro
                                },
                            }}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="small"
                            endIcon={<ArrowForwardIosIcon sx={{ fontSize: '16px' }} />}
                            sx={{
                                mt: 2,
                                mb: 2,
                                backgroundColor: '#2d3748', // Color oscuro como en la imagen
                                color: '#ffffff',
                                textTransform: 'none', // Evita que el texto se ponga en mayúsculas
                                fontWeight: 'bold',
                                padding: '8px 0',
                                '&:hover': {
                                    backgroundColor: '#1a202c',
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Continuar'}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
};

export default PhoneNumberForm;