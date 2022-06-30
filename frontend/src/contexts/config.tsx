import React, {
  FC,
  useContext,
  createContext,
  ReactNode,
  useMemo,
} from 'react';
import { Network, useViteProvider } from '@react-vite';

const BAYC_CONTRACT_ADDRESSES: Record<Network, string> = {
  //mainnet: 'vite_8fad5a10ff04c23e07aa738a8c48e382c8c51eeed8a28c082c',
  testnet: 'vite_79fafa1d344b2a77fec46a536e73b73c9102f0436bd9caf2a3',
  thomiznet: 'vite_64f217293161513bec4c9df04cf25e0305ac46aebebfee6524',
  local: 'vite_8fad5a10ff04c23e07aa738a8c48e382c8c51eeed8a28c082c',
};

const MARKETPLACE_CONTRACT_ADDRESSES: Record<
  Network,
  string
> = BAYC_CONTRACT_ADDRESSES;

// const MARKETPLACE_CONTRACT_ADDRESSES: Record<Network, string> = {
//   mainnet: '',
//   testnet: '',
//   local: 'vite_129c940d475daf59569437bffb701e1b078daad68d78e58489',
// };

const ConfigContext = createContext<{
  baycContractAddress: string;
  marketplaceContractAddress: string;
} | null>(null);

export const ConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { network } = useViteProvider();
  const baycContractAddress = useMemo(() => BAYC_CONTRACT_ADDRESSES[network], [
    network,
  ]);
  const marketplaceContractAddress = useMemo(
    () => MARKETPLACE_CONTRACT_ADDRESSES[network],
    [network]
  );

  return (
    <ConfigContext.Provider
      value={{
        baycContractAddress,
        marketplaceContractAddress,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('Missing Config context');
  }
  return context;
}
