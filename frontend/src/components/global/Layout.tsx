import React, { FC } from 'react';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './Header';
import Landing from '@pages/Landing';
import Profile from '@pages/Profile';
import Mint from '@pages/Mint';
import { Toaster } from 'react-hot-toast';
import Warning from './Warning';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '1200px',
    margin: '0 auto',
    padding: '80px 0 30px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '70px 0 10px',
      width: 'auto',
    },
    '& a': {
      textDecoration: 'none',
    },
    '& .MuiInputLabel-shrink': {
      right: 0,
      transform: 'translate(0, 1.5px) scale(1)',
      transformOrigin: 'top left',
      fontSize: 12,
    },
    '& td, th': {
      borderColor: 'transparent',
    },
  },
}));

const Layout: FC = () => {
  const classes = useStyles();

  return (
    <Router>
      <Box className={classes.container}>
        <Header />
        <Toaster position='bottom-center' />

        <Routes>
          <Route path={'/'} element={<Landing />} />
          <Route path={'/profile/:walletAddress'} element={<Profile />} />
          <Route path={'/mint/:tokenId'} element={<Mint />} />
        </Routes>
        <Warning />
      </Box>
    </Router>
  );
};

export default Layout;
