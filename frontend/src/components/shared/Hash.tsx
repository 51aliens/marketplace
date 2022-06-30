import React, { FC, useMemo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { useViteProvider } from '@react-vite';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#BD92F4 !important',
  },
}));

const Hash: FC<{ hash: string }> = ({ hash }) => {
  const { baseBlockexplorerUrl } = useViteProvider();
  const classes = useStyles();

  const blockExplorerLink = useMemo(
    () => `${baseBlockexplorerUrl}/tx/${hash}`,
    [hash, baseBlockexplorerUrl]
  );

  return (
    <a
      href={blockExplorerLink}
      className={clsx('flex items-center', classes.container)}
      target='_blank'
      rel='noreferrer'
    >
      <Box mr={2}>{hash}</Box>
    </a>
  );
};

export default Hash;
