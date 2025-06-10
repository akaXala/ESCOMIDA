'use client';

import * as React from 'react';
import { Box, Tab, Tabs, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, CssBaseline } from '@mui/material';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import { AccessTime, Check } from '@mui/icons-material';

// Importa los componentes custom
import FixedNavBar from '@/components/FixedNavBar';
import RightDrawer from '@/components/RightDrawer';
import ModalSearch from '@/components/ModalSearch';

// Importa el tema custom
import { getCustomTheme } from '@/components/MUI/CustomTheme';

// 1. Definición del tipo de dato para una Orden
interface Order {
  id: number;
  orderNumber: number;
  status: 'In Progress' | 'Past Orders';
  date: string;
}

// 2. Colección de datos (aquí puedes obtenerla de una API en el futuro)
const ordenes: Order[] = [
  { id: 77, orderNumber: 77, status: 'In Progress', date: 'May 21, 2025' },
  { id: 12, orderNumber: 12, status: 'Past Orders', date: 'May 9, 2025' },
  { id: 48, orderNumber: 48, status: 'Past Orders', date: 'April 18, 2025' },
  { id: 24, orderNumber: 24, status: 'Past Orders', date: 'March 26, 2025' },
  { id: 36, orderNumber: 36, status: 'Past Orders', date: 'March 25, 2025' },
  { id: 92, orderNumber: 92, status: 'In Progress', date: 'June 5, 2025' },
];

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

export default function Home() {
  const [value, setValue] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Detecta si el sistema está en dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(() => getCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Filtramos las órdenes según su estado
  const inProgressOrders = ordenes.filter(order => order.status === 'In Progress');
  const pastOrders = ordenes.filter(order => order.status === 'Past Orders');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box marginTop={12}>
        <FixedNavBar
          onAccountClick={() => setDrawerOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          currentTab="orders"
        />
        <RightDrawer open={drawerOpen} setOpen={setDrawerOpen} />
        <ModalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

        <Typography variant="h4" component="h1" sx={{ p: { xs: 2, sm: 3 } }}>
          Ordenes
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="orders tabs">
            <Tab label="En progreso" {...a11yProps(0)} />
            <Tab label="Ordenes pasadas" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Panel de Órdenes "In Progress" */}
        <CustomTabPanel value={value} index={0}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {inProgressOrders.map((order, index) => (
              <React.Fragment key={order.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={<Typography fontWeight="bold">{`Order #${order.orderNumber}`}</Typography>} 
                    secondary={`${order.status} • ${order.date}`}
                  />
                </ListItem>
                {index < inProgressOrders.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </CustomTabPanel>
        
        {/* Panel de Órdenes "Past Orders" */}
        <CustomTabPanel value={value} index={1}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {pastOrders.map((order, index) => (
              <React.Fragment key={order.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <Check />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={<Typography fontWeight="bold">{`Order #${order.orderNumber}`}</Typography>} 
                    secondary={`${order.status} • ${order.date}`}
                  />
                </ListItem>
                {index < pastOrders.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </CustomTabPanel>
      </Box>
    </ThemeProvider>
  );
}