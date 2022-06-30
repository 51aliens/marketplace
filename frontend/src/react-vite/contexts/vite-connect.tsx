import React, { FC, ReactNode, useState, useMemo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import QRCode from 'qrcode.react';
// @ts-ignore
import Connector from '@vite/connector';

import { useViteProvider, ViteWalletContext } from './vite';
import * as utils from '../utils';

const useStyles = makeStyles((theme) => ({
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
}));

type ConnectResponsePayload = {
  params: {
    version: number; // vc protocol version, 2 at present
    peerId: string; // can be ignored
    peerMeta: {
      // Vite App meta info
      bridgeVersion: number;
      description: string;
      url: string;
      icons: string[];
      name: string;
    };
    chainId: number; // can be ignored
    accounts: string[]; // the address returned from Vite wallet.
  }[];
};

export const ViteConnectProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { provider } = useViteProvider();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connectionUri, setConnectionUri] = useState<string | null>(null);
  const classes = useStyles();
  const vbInstance = useMemo(
    () => new Connector({ bridge: 'wss://viteconnect.thomiz.dev' }),
    []
  );

  const connect = async () => {
    vbInstance.createSession().then(() => {
      setConnectionUri(vbInstance.uri);
    });

    vbInstance.on('connect', (err: Error, payload: ConnectResponsePayload) => {
      if (err) throw err;
      const { accounts } = payload.params[0];
      if (!accounts || !accounts[0]) throw new Error('address is null');
      const walletAddress = accounts[0];
      setWalletAddress(walletAddress);
      setConnectionUri(null);
    });
  };

  const createAccountBlock = async (typ: string, params: any) => {
    const block = await utils.createAccountBlock(provider, typ, params);

    return await new Promise((resolve, reject) => {
      vbInstance.on('disconnect', () => {
        reject({ code: 11020, message: 'broken link' });
      });

      vbInstance
        .sendCustomRequest({
          method: 'vite_signAndSendTx',
          params: [
            {
              block: block.accountBlock,
            },
          ],
        })
        .then((r: any) => {
          resolve(r);
        })
        .catch((e: any) => {
          console.error(e);
          reject(e);
        });
    });
  };

  const clearConnectionUri = () => {
    setConnectionUri(null);
  };

  return (
    <ViteWalletContext.Provider
      value={{
        walletAddress,
        connect,
        createAccountBlock,
      }}
    >
      {children}

      {!connectionUri ? null : (
        <Dialog open={true} onClose={() => {}}>
          <Box
            className='flex flex-col text-center raltive'
            px={4}
            pt={2}
            pb={4}
          >
            <CloseIcon
              className={clsx(classes.closeBtn, 'cursor-pointer')}
              onClick={clearConnectionUri}
            />

            <Box pb={2}>Connect on app</Box>
            <Box
              sx={{
                padding: 2,
                backgroundColor: '#fff',
              }}
            >
              <QRCode value={connectionUri} size={128 * 2} />
            </Box>
          </Box>
        </Dialog>
      )}
    </ViteWalletContext.Provider>
  );
};
