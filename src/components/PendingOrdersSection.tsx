import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';

// Este componente recibe 'pendingOrders' y 'onCompleteOrder'
export default function PendingOrdersSection({ pendingOrders, onCompleteOrder }) {
    return (
        <Box sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center">
                Pedidos en Preparación y Listos para Entregar
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {pendingOrders.length === 0 ? (
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 3 }}>
                        No hay pedidos en preparación o listos para entregar en este momento.
                    </Typography>
                ) : (
                    pendingOrders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        Pedido #{order.id}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Estado: **{order.status}**
                                    </Typography>
                                    <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                                        Pedido: {order.food}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Teléfono: {order.telefono || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total: ${order.precioTotal ? order.precioTotal.toFixed(2) : '0.00'}
                                    </Typography>
                                    {/*
                                    // ELIMINADO: No se muestra la hora estimada
                                    <Typography variant="body2" color="text.secondary">
                                        Tiempo Estimado: {order.estimatedTime}
                                    </Typography>
                                    */}
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    {order.status === 'Cocinando' && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={() => onCompleteOrder(order.id)}
                                        >
                                            Marcar como Listo
                                        </Button>
                                    )}
                                    {order.status === 'Listo para entregar' && (
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            fullWidth
                                            disabled // Deshabilitar si ya está listo, se asume que otra parte lo "entrega"
                                        >
                                            Listo para Entregar
                                        </Button>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
}