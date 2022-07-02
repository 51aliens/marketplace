import React, { FC, useMemo } from 'react';
//import { useViteProvider } from '@react-vite';

import { abbrAddress } from '@utils/string';
import CopyToClipboard from '@components/shared/CopyToClipboard';
import { useNavigate } from 'react-router';

const N = 5;

const Address: FC<{ address: string; copy?: boolean }> = ({
  address,
  copy = true,
}) => {
  //const { baseBlockexplorerUrl } = useViteProvider();
  const formatedAddress = useMemo(() => {
    return abbrAddress(address, N + 5, N);
  }, [address]);

  const blockExplorerLink = `/#/profile/${address}`; /*useMemo(
    () => `${baseBlockexplorerUrl}/address/${address}`,
    [address, baseBlockexplorerUrl]
  );*/
  const navigate = useNavigate();

  return (
    <CopyToClipboard {...(copy ? { text: address } : null)}>
      <a
        href={blockExplorerLink}
        className={'flex items-center text-primary font-bold'}
        target='_blank'
        rel='noreferrer'
        onClick={(e) => {
          e.preventDefault();
          navigate(blockExplorerLink.slice(2));
        }}
      >
        {formatedAddress}
      </a>
    </CopyToClipboard>
  );
};

export default Address;
