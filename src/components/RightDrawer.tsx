"ise client";

import * as React from 'react';

// Componentes MUI
import { Box, Drawer, Button, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
// Iconos MUI
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';

// Define de que lado va a estar el drawer
type Anchor = 'right';

export default function RightDrawer(){
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () = {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {['Cuenta, Mis pedidos, Soporte'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <AccessibleForwardIcon />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return(
        <div>
            <Button onClick={toggleDrawer(true)}>OpenDrawer</Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    )
}