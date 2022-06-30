import { Dialog, Typography } from '@mui/material';
import React, { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const Warning: FC = () => {
  const [shown, setShown] = React.useState(false);
  return (
    <>
      <Dialog open={!shown} onClose={() => setShown(true)}>
        <div className={'p-4'}>
          <div className='flex flex-grow justify-space items-center my-2'>
            <div className='flex text-xl mr-1'>Disclaimer</div>
            <CloseIcon
              className='cursor-pointer'
              onClick={() => setShown(true)}
            />
          </div>

          <div className='mt-4'>
            <Typography>
              51 Aliens is an open source decentralized product operating on the
              Vite blockchain.
              <br />
              <br />
              As with all financial products there are risks associated with
              using the protocol and users assume the full responsibility for
              these risks. You should not spend, deposit or send any money you
              are not comfortable losing.
              <br />
              <br />
              <strong>DO NOT</strong> buy any NFTs with the expectation of
              profits. 51 Aliens was, and will be built with social utility in
              mind—not financial utility.
              <br />
              <br />
              <strong>
                0036 Labs does not take any responsibility for financial losses
                associated with this project.
              </strong>
            </Typography>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Warning;
