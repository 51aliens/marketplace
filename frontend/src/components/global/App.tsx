import React, { FC } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import Layout from '@components/global/Layout';
import theme from '@utils/theme';
import { ConfigProvider } from '@contexts/config';
import { ViteProvider, ViteConnectProvider } from '@react-vite';

const ViteWalletProvider = ViteConnectProvider;

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <ViteProvider>
        <ViteWalletProvider>
          <ConfigProvider>
            <Layout />
          </ConfigProvider>
        </ViteWalletProvider>
      </ViteProvider>
    </ThemeProvider>
  );
};

export default App;
