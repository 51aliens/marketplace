import React, { useMemo, useState } from 'react';
import toast, { LoaderIcon } from 'react-hot-toast';

import { TxStatus } from '../types';
import { sleep } from '../utils';

export type CreateAccountBlockFn = (typ: string, params: any) => Promise<void>;

export function useCreateAccountBlock(
  typ: string,
  params: any,
  createAccountBlock: CreateAccountBlockFn
) {
  const [status, setStatus] = useState<TxStatus>('pending');
  const [block, setBlock] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const working = useMemo(() => status === 'sending', [status]);

  const send = async () => {
    try {
      setStatus('sending');
      const block = await createAccountBlock(typ, params);
      setBlock(block);
      await sleep(2000);
      setStatus('sent');
      await sleep(1);
    } catch (e) {
      const errMsg = (e as Error).message;
      toast.error(errMsg);
      setError(errMsg);
    } finally {
      setStatus('pending');
      setBlock(null);
    }
  };

  const workingLoader = useMemo(
    () =>
      !working ? null : (
        <div className='flex items-center'>
          <span className='mr-1'>Please wait ...</span>
          <LoaderIcon />
        </div>
      ),
    [working]
  );

  return {
    working: workingLoader,
    status,
    send,
    error,
    block,
  };
}
