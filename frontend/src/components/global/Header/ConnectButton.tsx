import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { abbrAddress } from '@utils/string';
import { useViteWallet } from '@react-vite';

const ConnectButton: FC = () => {
  const { walletAddress, connect } = useViteWallet();
  const navigate = useNavigate();

  return (
    <>
      <Box ml={2}>
        <Button
          variant='outlined'
          color='inherit'
          onClick={() =>
            walletAddress ? navigate(`/profile/${walletAddress}`) : connect()
          }
        >
          {walletAddress ? abbrAddress(walletAddress, 5 + 5, 5) : 'Connect'}
        </Button>
      </Box>
    </>
  );
};
export default ConnectButton;
