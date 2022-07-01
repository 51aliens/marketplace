import React, {
  FC,
  useCallback,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import {
  DataLog,
  useViteProvider,
  useVmLogs,
  useQueryContractState,
} from '@react-vite';
import uniq from 'lodash/uniq';

import { useConfig } from '@contexts/config';
//import useIPFS, { getIPFSKeyUrl } from '@hooks/useIPFS';
import BAYC_ABI from '@data/bayc-abi.json';
import MARKETPLACE_ABI from '@data/marketplace-abi.json';
import { ZERO_ADDRESS } from '../config';
import { formatUnits, toBigNumber } from '@utils/big-number';
import Address from '@components/shared/Address';
import {
  OfferUpdatedEvent,
  BidUpdatedEvent,
  TradedEvent,
  TransferEvent,
} from '../types';
import { Tab, Tabs } from '@mui/material';
//import useGetRequest from '@hooks/useGetRequest';

const useStyles = makeStyles((theme) => {
  return {
    container: {},
    tabs: {
      display: 'flex',
      '& > div': {
        padding: '0.5rem 1rem',
        borderBottom: '2px solid transparent',
        cursor: 'pointer',
        marginBottom: '-0.125rem',
      },
    },
    activeTab: {
      borderBottomColor: 'black !important',
    },
  };
});

const TABS = ['Items', 'Activity'];

type Log = { id: string; height: string; description: ReactNode };

const Page = () => {
  const params = useParams<{
    walletAddress: string;
  }>();
  const walletAddress = params.walletAddress as string;
  const classes = useStyles();
  const { baycContractAddress, marketplaceContractAddress } = useConfig();
  const { provider } = useViteProvider();

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [logs, setLogs] = useState<Log[]>([]);

  const offerUpdatedEventsFilter = useCallback(
    (log: DataLog<OfferUpdatedEvent>) => log.data.offeror === walletAddress,
    [walletAddress]
  );

  const bidUpdatedEventsFilter = useCallback(
    (log: DataLog<BidUpdatedEvent>) => log.data.bidder === walletAddress,
    [walletAddress]
  );

  const tradedEventsFilter = useCallback(
    (log: DataLog<TradedEvent>) =>
      log.data.offeror === walletAddress || log.data.bidder === walletAddress,
    [walletAddress]
  );

  const offerUpdatedEvents: DataLog<OfferUpdatedEvent>[] = useVmLogs<OfferUpdatedEvent>(
    provider,
    marketplaceContractAddress,
    MARKETPLACE_ABI as any,
    'OfferUpdated',
    offerUpdatedEventsFilter
  );

  const bidUpdatedEvents: DataLog<BidUpdatedEvent>[] = useVmLogs<BidUpdatedEvent>(
    provider,
    marketplaceContractAddress,
    MARKETPLACE_ABI as any,
    'BidUpdated',
    bidUpdatedEventsFilter
  );

  const tradedEvents: DataLog<TradedEvent>[] = useVmLogs<TradedEvent>(
    provider,
    marketplaceContractAddress,
    MARKETPLACE_ABI as any,
    'Traded',
    tradedEventsFilter
  );

  useEffect(() => {
    const load = async () => {
      const ret: Log[] = [];
      for (const log of offerUpdatedEvents) {
        ret.push({
          id: `offer-${log.log.accountBlockHash}`,
          height: log.log.accountBlockHeight,
          description: (
            <div className='flex items-center'>
              Offer{' '}
              <div className={'mx-1 font-bold'}>
                {formatUnits(log.data.minimumOffer, 18, 2)} VITE
              </div>{' '}
              from{' '}
              <div className='flex items-center ml-1'>
                <Address address={log.data.offeror} />
              </div>
            </div>
          ),
        });
      }
      for (const log of bidUpdatedEvents) {
        ret.push({
          id: `bid-${log.log.accountBlockHash}`,
          height: log.log.accountBlockHeight,
          description: (
            <div className='flex items-center'>
              Bid{' '}
              <div className={'mx-1 font-bold'}>
                {formatUnits(log.data.lockedBid, 18, 2)} VITE
              </div>{' '}
              by{' '}
              <div className='flex items-center ml-1'>
                <Address address={log.data.bidder} />
              </div>
            </div>
          ),
        });
      }
      for (const log of tradedEvents) {
        ret.push({
          id: `trade-${log.log.accountBlockHash}`,
          height: log.log.accountBlockHeight,
          description: (
            <div className='flex items-center'>
              Traded{' '}
              <div className='flex items-center ml-1'>
                <Address address={log.data.offeror} copy={false} />
              </div>{' '}
              {'→'}{' '}
              <div className='flex items-center ml-1'>
                <Address address={log.data.bidder} copy={false} />
              </div>
            </div>
          ),
        });
      }
      ret.sort((a, b) => {
        const aa = toBigNumber(a.height);
        const bb = toBigNumber(b.height);
        if (aa.gt(bb)) return -1;
        if (bb.gt(aa)) return 1;
        return 0;
      });
      setLogs(ret);
    };

    load();
  }, [offerUpdatedEvents, bidUpdatedEvents, tradedEvents]);

  const transferEventsFilter = useCallback(
    (log: DataLog<TransferEvent>) =>
      log.data.from === walletAddress || log.data.to === walletAddress,
    [walletAddress]
  );
  const transferEvents: DataLog<TransferEvent>[] = useVmLogs<TransferEvent>(
    provider,
    baycContractAddress,
    BAYC_ABI as any,
    'Transfer',
    transferEventsFilter
  );
  const mints: string[] = useMemo(
    () => uniq(transferEvents.map((e) => e.data.tokenId)),
    [transferEvents]
  );

  return (
    <div className={classes.container}>
      <div className='flex flex-col items-center'>
        <div className='text-3xl font-bold mb-3'>
          <Address address={walletAddress} />
        </div>
      </div>

      <div className='flex flex-col mt-2'>
        <div className={clsx('mt-4 justify-center', classes.tabs)}>
          <Tabs
            onChange={(e, val) => {
              setActiveTab(TABS[val]);
            }}
            value={TABS.indexOf(activeTab)}
            indicatorColor='primary'
          >
            {TABS.map((e) => {
              return <Tab key={e} label={e} />;
            })}
          </Tabs>
        </div>

        <div className={'mt-4'}>
          {TABS[0] !== activeTab ? null : (
            <div className={'grid grid-cols-6 gap-6'}>
              {mints.map((tokenId) => (
                <Mint key={tokenId} {...{ tokenId }} />
              ))}
            </div>
          )}

          {TABS[1] !== activeTab ? null : (
            <div className='leading-8 ml-96'>
              {logs.map((log) => (
                <div key={log.id}>{log.description}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

//type GetNftMetadata = { trait_type: string; value: string }[];

const Mint: FC<{ tokenId: string }> = ({ tokenId }) => {
  const { /*baycContractAddress,*/ marketplaceContractAddress } = useConfig();
  const { provider } = useViteProvider();

  // const callOffChainMethodParams = useMemo(() => [Number(tokenId)], [tokenId]);
  // const tokenUriParams = useQueryContractState<string[]>(
  //   provider,
  //   baycContractAddress,
  //   BAYC_ABI as any,
  //   'tokenURI',
  //   callOffChainMethodParams
  // );

  /*const callOffChainMethodParams = useMemo(() => [], []);
  const baseUrlParams = useQueryContractState<string[]>(
    provider,
    baycContractAddress,
    BAYC_ABI as any,
    'BASE_URL',
    callOffChainMethodParams
  );

  const getNftMetadata = useMemo(
    () => (!baseUrlParams ? null : `${baseUrlParams[0]}${tokenId}`),
    [baseUrlParams, tokenId]
  );
  const nftMetadata = useIPFS<GetNftMetadata>(getNftMetadata);*/
  const imgUrl = `https://cdn.51aliens.net/${tokenId}.png`;
  /*useMemo(() => getIPFSKeyUrl(nftMetadata?.image ?? null), [
    nftMetadata,
  ]);*/

  const tokenMarketsQueryParams = useMemo(() => [tokenId], [tokenId]);
  const tokenMarketsQueryEvents = useMemo(
    () => ['OfferUpdatedEvent', 'BidUpdatedEvent', 'TradedEvent'],
    []
  );
  const tokenMarketsQueryResult = useQueryContractState<string[]>(
    provider,
    marketplaceContractAddress,
    MARKETPLACE_ABI as any,
    'tokenMarkets',
    tokenMarketsQueryParams,
    tokenMarketsQueryEvents
  );
  const tokenMarkets = useMemo(
    () =>
      !tokenMarketsQueryResult
        ? null
        : {
            offeror: tokenMarketsQueryResult[0],
            minimumOffer: tokenMarketsQueryResult[1],
            bidder: tokenMarketsQueryResult[2],
            lockedBid: tokenMarketsQueryResult[3],
          },
    [tokenMarketsQueryResult]
  );

  const hasOffer = useMemo(() => tokenMarkets?.offeror !== ZERO_ADDRESS, [
    tokenMarkets,
  ]);
  /*
  const hasBid = useMemo(() => tokenMarkets?.bidder !== ZERO_ADDRESS, [
    tokenMarkets,
  ]);
  */

  return !imgUrl ? null : (
    <Link to={`/mint/${tokenId}`} className='flex flex-col'>
      <div>
        <img src={imgUrl} height={100} alt={`${tokenId} nft`} />
      </div>
      <div className='mt-1 flex justify-between'>
        <div className='font-bold'>#{tokenId}</div>
        {!(hasOffer && tokenMarkets) ? (
          <>UNLISTED</>
        ) : (
          <>{formatUnits(tokenMarkets.minimumOffer, 18, 2)} VITE</>
        )}
      </div>
    </Link>
  );
};

export default Page;
