import React, { FC, ReactNode, useMemo, useState } from 'react';

import { vite, WS_RPC } from '../vite';
import { Network } from '../types';
import { ViteProviderContext } from './vite';

const VITE_BLOCK_EXPLORERS: Record<Network, string> = {
  mainnet: 'https://vitcscan.com',
  // testnet: 'https://testnet.vitcscan.com',
  // thomiznet: 'https://thomiznet.vitcscan.com',
  // local: 'https://debug.vitcscan.com',
};

const VITE_PROVIDER_URLS: Record<Network, string> = {
  mainnet: 'wss://node-vite.thomiz.dev/ws',
  // testnet: 'wss://buidl.vite.net/gvite/ws',
  // thomiznet: 'wss://node-vite-testnet.thomiz.dev/ws',
  // local: 'ws://127.0.0.1:23457',
};

export const ViteProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<Network>('mainnet');

  const baseBlockexplorerUrl = useMemo(() => VITE_BLOCK_EXPLORERS[network], [
    network,
  ]);

  const provider = useMemo(
    () =>
      new vite.ViteAPI(
        new WS_RPC(VITE_PROVIDER_URLS[network], 6e4, {
          protocol: '',
          headers: '',
          clientConfig: '',
          retryTimes: Infinity,
          retryInterval: 10000,
        }),
        () => {}
      ),
    [network]
  );

  return (
    <ViteProviderContext.Provider
      value={{
        network,
        setNetwork,
        baseBlockexplorerUrl,
        provider,
      }}
    >
      {children}
    </ViteProviderContext.Provider>
  );
};
