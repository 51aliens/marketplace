import { useMemo } from 'react';
import useGetRequest from './useGetRequest';

function useIPFS<T>(key: string | null) {
  const url = useMemo(() => (!key ? null : getIPFSKeyUrl(key)), [key]);
  const json = useGetRequest(url) as T | null;
  return json;
}

export default useIPFS;

export function getIPFSKeyUrl(key: string | null) {
  if (!key) return null;

  return `https://node-ipfs.thomiz.dev/ipfs/${key.slice('ipfs://'.length)}`;
}
