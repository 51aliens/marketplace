import { createTheme, Theme } from '@mui/material/styles';
import { BORDER_RADIUS } from '../config';

declare module '@mui/styles' {
  interface DefaultTheme extends Theme {}
}

export default createTheme({
  typography: {
    fontFamily: ['Metropolis', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#000',
    },
    primary: {
      main: '#BD92F4',
    },
    secondary: {
      main: 'rgba(255, 255, 255, 0.5)', // rgb(9, 9, 47)
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: BORDER_RADIUS,
        },
        root: {
          backgroundImage: 'unset',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: BORDER_RADIUS,
        },
      },
    },
  },
});
