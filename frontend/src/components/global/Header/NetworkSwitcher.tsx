import React, { FC, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useViteProvider, Network } from '@react-vite';

const NETWORKS = [
  'mainnet',
  // 'testnet',
  // 'thomiznet',
  // 'local',
];

const NetworkSwitcher: FC = () => {
  const { network, setNetwork } = useViteProvider();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (currentTarget: any) => {
    setAnchorEl(currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectNetwork = (network: Network) => {
    handleCloseMenu();
    setNetwork(network);
  };

  return (
    <Box ml={2}>
      <Button
        variant='outlined'
        color='inherit'
        aria-haspopup='true'
        onClick={(e) => handleOpenMenu(e.currentTarget)}
      >
        {network}
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {NETWORKS.map((net) => (
          <MenuItem
            key={net}
            onClick={() => handleSelectNetwork(net as Network)}
          >
            {net}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default NetworkSwitcher;
