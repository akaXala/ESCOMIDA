'use client';

import * as React from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Box, Tab, Tabs, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, CssBaseline } from '@mui/material';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';

// Importa los componentes custom
import FixedNavBar from '@/components/FixedNavBar';
import RightDrawer from '@/components/RightDrawer';
import Loading from '@/components/Loading';

// Importa el tema custom
import { getCustomTheme } from '@/components/MUI/CustomTheme';
import { useSearch } from '@/context/SearchContext';
import { useOrderDetails } from '@/context/OrderDetailsContext';

// 1. Definición del tipo de dato para una Orden
interface Order {
  id_pedido: number;
  estatus: string;
  fecha: string;
  precio_total: number;
}

// --- Componentes Auxiliares ---
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
// --- Fin de Componentes Auxiliares ---

// Icono según estatus
function getStatusIcon(estatus: string, color: string) {
  switch (estatus) {
    case 'En espera':
      return <AccessTimeIcon />;
    case 'Preparando':
      return <LocalDiningIcon />;
    case 'Listo para recoger':
      return <CheckCircleIcon />;
    case 'Entregado':
      return <DoneAllIcon />;
    default:
      return <AccessTimeIcon />;
  }
}

// Texto amigable para mostrar
function getStatusText(estatus: string) {
  switch (estatus) {
    case 'En espera':
      return 'En espera';
    case 'Preparando':
      return 'Preparando';
    case 'Listo para recoger':
      return 'Listo para recoger';
    case 'Entregado':
      return 'Entregado';
    default:
      return estatus;
  }
}

export default function Home() {
    // Estado para saber si estamos en el cliente
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);

    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace(`/sign-in?redirect_url=/ordenes`);
        }
    }, [isLoaded, isSignedIn, router]);

    const [value, setValue] = React.useState(0);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Usa el contexto global para abrir el modal y manejo de datos
    const { openSearch } = useSearch();
    const { setOrderDetails } = useOrderDetails();

    // Detecta si el sistema está en dark mode
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(() => getCustomTheme(mounted && prefersDarkMode ? 'dark' : 'light'), [mounted, prefersDarkMode]);
    const themeMode = mounted && prefersDarkMode ? 'dark' : 'light';

    const backgroundColor = (themeMode === 'light') ? '#0334BA' : '#6C84DB';
    
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    // Estado para las órdenes
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/ordenes/mostrar-todos');
          const data = await res.json();
          if (data.success) {
            setOrders(data.data);
          }
        } catch (error) {
          // Manejo de error opcional
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }, []);

    // Filtrado por estatus
    const inProgressStatuses = ['En espera', 'Preparando', 'Listo para recoger'];
    const inProgressOrders = orders.filter(order => inProgressStatuses.includes(order.estatus));
    const pastOrders = orders.filter(order => order.estatus === 'Entregado');

    if (!mounted) return null;
    if (loading) return <Loading />;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box marginTop={{xs: 7, sm: 12}} sx={{ marginX: { xs: 1, sm: 5 } }}>
          <FixedNavBar
            onAccountClick={() => setDrawerOpen(true)}
            onSearchClick={openSearch}
            currentTab="orders"
          />
          <RightDrawer open={drawerOpen} setOpen={setDrawerOpen} />

          <Typography variant="h4" component="h1" sx={{ py: { xs: 2, sm: 3 } }}>
            Ordenes
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="orders tabs"
              sx={{
                // Cambia el color del indicador
                '& .MuiTabs-indicator': {
                  backgroundColor: prefersDarkMode ? '#fff' : '#000',
                },
              }}
            >
              <Tab
                label="En progreso"
                {...a11yProps(0)}
                sx={{
                  color: prefersDarkMode ? '#fff' : '#000',
                  '&.Mui-selected': {
                    color: prefersDarkMode ? '#fff' : '#000',
                  },
                }}
              />
              <Tab
                label="Ordenes pasadas"
                {...a11yProps(1)}
                sx={{
                  color: prefersDarkMode ? '#fff' : '#000',
                  '&.Mui-selected': {
                    color: prefersDarkMode ? '#fff' : '#000',
                  },
                }}
              />
            </Tabs>
          </Box>

          {/* Panel de Órdenes "En progreso" */}
          <CustomTabPanel value={value} index={0}>
            {inProgressOrders.length === 0 ? (
              <Typography>No hay órdenes en progreso.</Typography>
            ) : (
              <List
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  marginLeft: 0,
                  paddingLeft: 0,
                  '& .MuiListItem-root': {
                    paddingLeft: 0,
                  },
                }}
              >
                {inProgressOrders.map((order, index) => (
                  <React.Fragment key={order.id_pedido}>
                    <ListItem
                      // Quita la prop 'button', usa 'component="button"' para MUI v5+
                      component="button"
                      onClick={() => {
                        setOrderDetails(order);
                        router.push('/ordenes/detalles');
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: backgroundColor }}>
                          {getStatusIcon(order.estatus, backgroundColor)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography fontWeight="bold">{`Orden #${order.id_pedido}`}</Typography>} 
                        secondary={`${getStatusText(order.estatus)} • ${new Date(order.fecha).toLocaleDateString()}`}
                      />
                    </ListItem>
                    {index < inProgressOrders.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CustomTabPanel>
          
          {/* Panel de Órdenes "Pasadas" */}
          <CustomTabPanel value={value} index={1}>
            {pastOrders.length === 0 ? (
              <Typography>No hay órdenes pasadas.</Typography>
            ) : (
              <List
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  marginLeft: 0,
                  paddingLeft: 0,
                  '& .MuiListItem-root': {
                    paddingLeft: 0,
                  },
                }}
              >
                {pastOrders.map((order, index) => (
                  <React.Fragment key={order.id_pedido}>
                    <ListItem
                      component="button"
                      onClick={() => {
                        setOrderDetails(order);
                        router.push('/ordenes/detalles');
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: backgroundColor }}>
                          {getStatusIcon(order.estatus, backgroundColor)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography fontWeight="bold">{`Orden #${order.id_pedido}`}</Typography>} 
                        secondary={`${getStatusText(order.estatus)} • ${new Date(order.fecha).toLocaleDateString()}`}
                      />
                    </ListItem>
                    {index < pastOrders.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CustomTabPanel>
        </Box>
      </ThemeProvider>
    );
}