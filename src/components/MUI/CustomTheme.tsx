import { createTheme, ThemeOptions } from '@mui/material/styles';
import '@fontsource/quicksand'; // Importar la fuente Quicksand

export const getCustomTheme = (mode: 'light' | 'dark') => {
    const themeOptions : ThemeOptions = {
        typography: {
            fontFamily: "'Quicksand', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        },
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    primary: {
                        main: '#ffffff',
                    },
                    background: {
                        default: '#FDFDFD',
                        paper: '#ffffff',
                    },
                }
            : {
                primary: {
                    main: '#10141C',
                },
                background: {
                    default: '#10141C',
                    paper: '#1e1e1e',
                },
            }),
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                root: {
                    ...(mode === 'light'
                    ? {
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        }
                    : {
                        backgroundColor: '#10141C',
                        color: '#ffffff',
                        }),
                },
                },
            },
            MuiToolbar: {
                styleOverrides: {
                root: {
                    minHeight: 64,
                    ...(mode === 'light'
                    ? {
                        backgroundColor: '#ffffff',
                        }
                    : {
                        backgroundColor: '#10141C',
                        }),
                },
                },
            },
        },
    };

    return createTheme(themeOptions);
};