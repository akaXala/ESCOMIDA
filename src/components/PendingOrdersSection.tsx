// components/kitchen/PendingOrdersSection.jsx
"use client";

import * as React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function PendingOrdersSection({ pendingOrders, onCompleteOrder }) {
    const theme = useTheme();

    return (
        <Box mb={6}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.primary, borderBottom: `2px solid ${theme.palette.secondary.main}`, pb: 1, mb: 3 }}>
                <AccessTimeIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Pedidos Pendientes
            </Typography>
            <Grid container spacing={3}>
                {pendingOrders.length > 0 ? (
                    pendingOrders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order.id}>
                            <Card sx={{
                                display: 'flex', flexDirection: 'column', height: '100%',
                                backgroundColor: theme.palette.background.paper, boxShadow: 3,
                                borderLeft: `5px solid ${theme.palette.secondary.main}`,
                                transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'translateY(-3px)' }
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" sx={{ color: theme.palette.secondary.main, mb: 1 }}>
                                        Pedido #{order.id}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                                        **Platillo:** {order.food}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} /> Tiempo de preparación restante: **{order.estimatedTime}**
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                    <Button
                                        variant="contained"
                                        color="info"
                                        onClick={() => onCompleteOrder(order.id)}
                                    >
                                        Marcar como completado
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center" color="text.secondary">
                            No hay pedidos pendientes en este momento. ¡Buen trabajo!
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}