// components/kitchen/NewOrdersSection.jsx
"use client";

import * as React from 'react';
import {
    Box, Typography, Grid, Card, CardContent, CardActions, Button, useTheme,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField // Import Dialog components and TextField
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function NewOrdersSection({ newOrders, onAcceptOrder, onRejectOrder }) {
    const theme = useTheme();

    // State for the accept order dialog
    const [openAcceptDialog, setOpenAcceptDialog] = React.useState(false);
    const [selectedOrderId, setSelectedOrderId] = React.useState(null);
    const [estimatedTimeInput, setEstimatedTimeInput] = React.useState('');

    // Handle opening the dialog
    const handleOpenAcceptDialog = (orderId) => {
        setSelectedOrderId(orderId);
        setEstimatedTimeInput(''); // Reset input when opening
        setOpenAcceptDialog(true);
    };

    // Handle closing the dialog
    const handleCloseAcceptDialog = () => {
        setOpenAcceptDialog(false);
        setSelectedOrderId(null);
        setEstimatedTimeInput('');
    };

    // Handle confirming the acceptance with the time
    const handleConfirmAccept = () => {
        if (selectedOrderId && estimatedTimeInput.trim() !== '') {
            onAcceptOrder(selectedOrderId, estimatedTimeInput.trim());
            handleCloseAcceptDialog();
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
                                        {/* Original estimated time from the order, if available, or just a placeholder */}
                                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} /> Solicitado para: **{order.requestedTime || 'Pronto'}**
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleOutlineIcon />}
                                        // Change: Open dialog instead of directly accepting
                                        onClick={() => handleOpenAcceptDialog(order.id)}
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

            {/* Accept Order Dialog */}
            <Dialog open={openAcceptDialog} onClose={handleCloseAcceptDialog} fullWidth maxWidth="xs">
                <DialogTitle>Especificar Tiempo de Entrega</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Ingresa el tiempo estimado para el pedido **#{selectedOrderId}**:
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="estimated-time"
                        label="Tiempo (ej. 20 min, 1 hora)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={estimatedTimeInput}
                        onChange={(e) => setEstimatedTimeInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAcceptDialog} color="error">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmAccept} color="success" disabled={!estimatedTimeInput.trim()}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}