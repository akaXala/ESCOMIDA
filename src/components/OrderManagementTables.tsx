"use client";

import React, { useState, useMemo } from 'react';
import {
    Box, Typography, Button, Paper, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, TextField
} from '@mui/material';
import { useTheme} from '@mui/material/styles'; // Importa createTheme también
import {
    CheckCircleOutline as AcceptIcon,
    CancelOutlined as RejectIcon,
    Visibility as ViewIcon,
    LocalDining as PreparedIcon // Un nuevo icono para "listo"
} from '@mui/icons-material';

// Para el DatePicker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';// Cambiado a DateTimePicker para incluir la hora
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const OrderManagementTables = ({ initialPendingOrders = [], initialAcceptedOrders = [] }) => {
    // Estado para los pedidos pendientes de acción
    const [pendingOrders, setPendingOrders] = useState(initialPendingOrders);
    // Estado para los pedidos aceptados
    const [acceptedOrders, setAcceptedOrders] = useState(initialAcceptedOrders);
    // Estado para la fecha estimada de finalización para cada pedido pendiente
    const [estimatedDates, setEstimatedDates] = useState({});

    const theme = useTheme(); // Use useTheme to access the theme properties

    // Manejar el cambio de fecha para un pedido específico
    const handleDateChange = (orderId, date) => {
        setEstimatedDates(prevDates => ({
            ...prevDates,
            [orderId]: date
        }));
    };

    // Función para aceptar un pedido
    const handleAcceptOrder = (orderId) => {
        const orderToAccept = pendingOrders.find(order => order.id === orderId);
        const estimatedDate = estimatedDates[orderId];

        if (orderToAccept && estimatedDate) {
            // Eliminar de pedidos pendientes
            setPendingOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

            // Añadir a pedidos aceptados con la fecha estimada
            setAcceptedOrders(prevAccepted => [
                ...prevAccepted,
                { ...orderToAccept, status: 'Aceptado', estimatedCompletion: estimatedDate.format('YYYY-MM-DD HH:mm') }
            ]);

            // Limpiar la fecha estimada para ese pedido
            setEstimatedDates(prevDates => {
                const newDates = { ...prevDates };
                delete newDates[orderId];
                return newDates;
            });

            console.log(`Pedido ${orderId} aceptado para ser completado el ${estimatedDate.format('YYYY-MM-DD HH:mm')}`);
            // Aquí iría tu lógica para enviar esto al backend
        } else if (!estimatedDate) {
            alert('Por favor, selecciona una fecha estimada para completar el pedido.');
        }
    };

    // Función para rechazar un pedido
    const handleRejectOrder = (orderId) => {
        setPendingOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        setEstimatedDates(prevDates => { // También limpiar la fecha si se rechaza
            const newDates = { ...prevDates };
            delete newDates[orderId];
            return newDates;
        });
        console.log(`Pedido ${orderId} rechazado.`);
        // Aquí iría tu lógica para enviar esto al backend
    };

    // Función para ver detalles del pedido (simulado)
    const handleViewDetails = (order) => {
        alert(`Detalles del Pedido #${order.id}:\nCliente: ${order.customerName}\nPlatillos: ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}\nNotas: ${order.notes || 'Ninguna'}`);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                marginTop: 4,
                padding: { xs: 2, sm: 3, md: 4 },
                minHeight: '80vh',
                backgroundColor: theme.palette.background.default,
            }}>
                {/* Sección de Nuevos Pedidos (Pendientes de Aprobación) */}
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.primary, mb: 3 }}>
                    Nuevos Pedidos Pendientes
                </Typography>
                <Paper elevation={4} sx={{ mb: 6 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID Pedido</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Platillos</TableCell>
                                    <TableCell>Notas</TableCell>
                                    <TableCell>Hora Pedido</TableCell>
                                    <TableCell>Fecha Estimada</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingOrders.length > 0 ? (
                                    pendingOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{order.customerName}</TableCell>
                                            <TableCell>
                                                {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                                            </TableCell>
                                            <TableCell>{order.notes || '-'}</TableCell>
                                            <TableCell>{order.orderTime}</TableCell>
                                            <TableCell>
                                                <DatePicker
                                                    label="Elegir Fecha y Hora"
                                                    value={estimatedDates[order.id] || null}
                                                    onChange={(newValue) => handleDateChange(order.id, newValue)}
                                                    slotProps={{ textField: { variant: 'outlined', size: 'small' } }}
                                                    ampm={false} // 24-hour format
                                                    format="YYYY-MM-DD HH:mm"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="success"
                                                    onClick={() => handleAcceptOrder(order.id)}
                                                    disabled={!estimatedDates[order.id]} // Deshabilitar si no hay fecha
                                                    title="Aceptar Pedido"
                                                >
                                                    <AcceptIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRejectOrder(order.id)}
                                                    title="Rechazar Pedido"
                                                >
                                                    <RejectIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="info"
                                                    onClick={() => handleViewDetails(order)}
                                                    title="Ver Detalles"
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No hay nuevos pedidos pendientes.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Sección de Pedidos Aceptados */}
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.primary, mb: 3 }}>
                    Pedidos Aceptados y en Proceso
                </Typography>
                <Paper elevation={4}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID Pedido</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Platillos</TableCell>
                                    <TableCell>Notas</TableCell>
                                    <TableCell>Hora Pedido</TableCell>
                                    <TableCell>Finalización Estimada</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {acceptedOrders.length > 0 ? (
                                    acceptedOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{order.customerName}</TableCell>
                                            <TableCell>
                                                {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                                            </TableCell>
                                            <TableCell>{order.notes || '-'}</TableCell>
                                            <TableCell>{order.orderTime}</TableCell>
                                            <TableCell>{order.estimatedCompletion}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: order.status === 'Listo' ? theme.palette.success.main : theme.palette.warning.main,
                                                        color: theme.palette.text.primary,
                                                        '&:hover': {
                                                            backgroundColor: order.status === 'Listo' ? theme.palette.success.dark : theme.palette.warning.dark,
                                                        },
                                                    }}
                                                >
                                                    {order.status}
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="info"
                                                    onClick={() => handleViewDetails(order)}
                                                    title="Ver Detalles"
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                                {/* Aquí podrías añadir un botón para "Marcar como listo" */}
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="success"
                                                    sx={{ ml: 1 }}
                                                    onClick={() => console.log(`Marcar pedido ${order.id} como listo`)}
                                                >
                                                    Listo
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No hay pedidos aceptados actualmente.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </LocalizationProvider>
    );
};
export default OrderManagementTables;
