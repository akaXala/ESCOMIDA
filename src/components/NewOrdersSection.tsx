// components/kitchen/NewOrdersSection.jsx
"use client";

import * as React from 'react';
import {
    Box, Typography, Grid, Card, CardContent, CardActions, Button, useTheme,
    Dialog, DialogTitle, DialogContent, DialogActions // Import Dialog components
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function NewOrdersSection({ newOrders, onAcceptOrder, onRejectOrder }) {
    const theme = useTheme();

    // State for the confirmation dialog
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [selectedOrderId, setSelectedOrderId] = React.useState(null);

    // Handle opening the confirmation dialog
    const handleOpenConfirmDialog = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenConfirmDialog(true);
    };

    // Handle closing the confirmation dialog
    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setSelectedOrderId(null);
    };

    // Handle confirming the acceptance
    const handleConfirmAccept = () => {
        if (selectedOrderId) {
            // Call the onAcceptOrder function passed from the parent
            onAcceptOrder(selectedOrderId);
            handleCloseConfirmDialog(); // Close dialog after action
        }
    };

    return (
        <Box mb={6}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.primary, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 1, mb: 3 }}>
                <RestaurantMenuIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Nuevos Pedidos del Día
            </Typography>
            <Grid container spacing={3}>
                {newOrders.length > 0 ? (
                    newOrders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order.id}>
                            <Card sx={{
                                display: 'flex', flexDirection: 'column', height: '100%',
                                backgroundColor: theme.palette.background.paper, boxShadow: 3,
                                transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'translateY(-3px)' }
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" sx={{ color: theme.palette.primary.main, mb: 1 }}>
                                        Pedido #{order.id}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                                        **Platillo:** {order.food}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} /> Solicitado para: **{order.requestedTime || 'Pronto'}**
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Teléfono: {order.telefono || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total: ${order.precioTotal ? order.precioTotal.toFixed(2) : '0.00'}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleOutlineIcon />}
                                        // Changed: Open confirmation dialog instead of directly accepting
                                        onClick={() => handleOpenConfirmDialog(order.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        Aceptar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelOutlinedIcon />}
                                        onClick={() => onRejectOrder(order.id)}
                                    >
                                        Rechazar
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center" color="text.secondary">
                            No hay nuevos pedidos en este momento.
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="confirm-accept-dialog-title"
                aria-describedby="confirm-accept-dialog-description"
            >
                <DialogTitle id="confirm-accept-dialog-title">{"Confirmar Aceptación de Pedido"}</DialogTitle>
                <DialogContent>
                    <Typography id="confirm-accept-dialog-description">
                        ¿Estás seguro de que quieres aceptar el **Pedido #{selectedOrderId}** y marcarlo como "Cocinando"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="error">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmAccept} color="success" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}