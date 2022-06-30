import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import NetworkSwitcher from './NetworkSwitcher';
import ConnectButton from './ConnectButton';

const useStyles = makeStyles(() => ({
  container: {
    boxShadow: 'none',
    background: '#000',
  },
  logo: {
    height: 30,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
  },
}));

const Header: FC = () => {
  const classes = useStyles();

  return (
    <AppBar position='fixed' color='secondary' className={classes.container}>
      <Toolbar color='secondary'>
        <Link to='/' className='flex flex-grow'>
          <img
            src='/favicon.png'
            alt='logo'
            height={30}
            width={30}
            className={classes.logo}
          />
          <Typography variant='h6' className={classes.title}>
            51 Aliens
          </Typography>
        </Link>
        <ConnectButton />
        <NetworkSwitcher />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
