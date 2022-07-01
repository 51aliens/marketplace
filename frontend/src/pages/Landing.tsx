import React, {
  FC,
  useCallback,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import {
  Button,
  Dialog,
  Tabs,
  Tab,
  Typography,
  Paper,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import {
  DataLog,
  useViteProvider,
  useViteWallet,
  useCreateAccountBlock,
  useVmLogs,
  useQueryContractState,
} from '@react-vite';
import uniq from 'lodash/uniq';

import { useConfig } from '@contexts/config';
//import useIPFS, { getIPFSKeyUrl } from '@hooks/useIPFS';
import BAYC_ABI from '@data/bayc-abi.json';
import MARKETPLACE_ABI from '@data/marketplace-abi.json';
import { VITE_TOKEN_ID, ZERO_ADDRESS } from '../config';
import { formatUnits, toBigNumber } from '@utils/big-number';
import Address from '@components/shared/Address';
import {
  OfferUpdatedEvent,
  BidUpdatedEvent,
  TradedEvent,
  TransferEvent,
} from '../types';
import { setShouldConfetti } from './Mint';
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

const Page: FC<{}> = () => {
  const { baycContractAddress, marketplaceContractAddress } = useConfig();
  const { provider } = useViteProvider();
  const { walletAddress, connect, createAccountBlock } = useViteWallet();

  const classes = useStyles();
  const [showMintModal, setShowMintModal] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [logs, setLogs] = useState<Log[]>([]);
  const navigate = useNavigate();

  const offerUpdatedEventsFilter = useCallback(
    (log: DataLog<OfferUpdatedEvent>) => log.data.offeror !== ZERO_ADDRESS,
    []
  );

  const bidUpdatedEventsFilter = useCallback(
    (log: DataLog<BidUpdatedEvent>) => log.data.bidder !== ZERO_ADDRESS,
    []
  );

  const tradedEventsFilter = useCallback(
    (log: DataLog<TradedEvent>) => true,
    []
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
              </div>
              for{' '}
              <span className='flex items-center ml-1'>
                <Typography
                  color='primary'
                  style={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate('/mint/' + log.data.tokenId);
                  }}
                >
                  #{log.data.tokenId}
                </Typography>
              </span>
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
              Traded
              <span className='flex items-center ml-1'>
                <Typography
                  color='primary'
                  style={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate('/mint/' + log.data.tokenId);
                  }}
                >
                  #{log.data.tokenId}
                </Typography>
              </span>
              <span className='flex items-center ml-1'>
                <Address address={log.data.offeror} copy={false} />
              </span>{' '}
              {'→'}{' '}
              <span className='flex items-center ml-1'>
                <Address address={log.data.bidder} copy={false} />
              </span>
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
  }, [offerUpdatedEvents, bidUpdatedEvents, tradedEvents, navigate]);

  const mintTxParams = useMemo(
    () =>
      !walletAddress
        ? null
        : {
            address: walletAddress,
            abi: BAYC_ABI as any,
            toAddress: baycContractAddress,
            params: [],
            methodName: 'safeMint',
            tokenId: VITE_TOKEN_ID,
            amount: (BigInt(500) * BigInt(10) ** BigInt(18)).toString(), // 10 vite
          },
    [baycContractAddress, walletAddress]
  );
  const mintTx = useCreateAccountBlock(
    'callContract',
    mintTxParams,
    createAccountBlock
  );

  const onMint = () => {
    if (!walletAddress) return connect();
    mintTx.send();
  };

  useEffect(() => {
    if (mintTx.status === 'sent') {
      toast.success(`Mint request sent!`);
      let start = Date.now();
      (async () => {
        while (true) {
          // timeout after 150 seconds
          if (start + 150 * 1000 < Date.now()) {
            toast.error(`Mint request timeout`);
            setShowMintModal(false);
            break;
          }
          const hash = mintTx.block.hash;
          const block = await provider.request(
            'ledger_getAccountBlockByHash',
            hash
          );
          if (!block.receiveBlockHash) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
          }

          const receiveBlock = await provider.request(
            'ledger_getAccountBlockByHash',
            block.receiveBlockHash
          );
          const data = Buffer.from(receiveBlock.data, 'base64');

          if (data[32] !== 0) {
            // error
            setShowMintModal(false);
            toast.error('The contract reverted the Mint request.');
            break;
          }

          // the request is good
          const vmlog = await provider.request(
            'ledger_getVmLogs',
            receiveBlock.hash
          );

          const log = vmlog?.[0];
          if (
            !log ||
            log.topics[0] !==
              'e9a7da5bfc2bcbf4266adfba50ac5d6fa9ba4d52df50d9359a3974c36c131ce1'
          ) {
            setShowMintModal(false);
            toast.error("Couldn't find the correct log.");
            break;
          }

          const id = BigInt(`0x${log.topics[3]}`);
          toast.success(`Successfully minted Alien #${id}`);
          setShowMintModal(false);

          setShouldConfetti(true);
          navigate('/mint/' + id);

          break;
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, mintTx.status, provider]);

  const transferEventsFilter = useCallback(
    (log: DataLog<TransferEvent>) => true,
    []
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
  const availableMints = useMemo(() => 510 - mints.length, [mints]);

  useEffect(() => {
    if (showMintModal && walletAddress) {
      onMint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMintModal, walletAddress]);

  return (
    <>
      <div className={classes.container}>
        <div className='flex flex-col items-center'>
          <Typography
            variant='h4'
            style={{
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            51 Aliens
          </Typography>
          <Button
            variant='contained'
            color='primary'
            size='small'
            disableElevation
            onClick={() => setShowMintModal(true)}
          >
            Mint
          </Button>
          <Typography
            variant='subtitle2'
            style={{
              marginTop: 10,
            }}
          >
            <Paper>
              <div
                style={{
                  padding: '10px',
                }}
              >
                {availableMints}/510 remaining
              </div>
              <LinearProgress
                variant='determinate'
                value={(availableMints / 510) * 100}
                color={
                  availableMints > 100
                    ? 'primary'
                    : availableMints > 50
                    ? 'warning'
                    : 'error'
                }
              />
            </Paper>
          </Typography>
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

      {/* <Dialog open={!!showMintModal} onClose={() => setShowMintModal(false)}>
        <div className={'w-96 p-4'}>
          <div className='flex flex-grow justify-space items-center my-2'>
            <div className='flex text-xl mr-1'>Mint</div>
            <CloseIcon
              className='cursor-pointer'
              onClick={() => setShowMintModal(false)}
            />
          </div>

          <div>

      <div className='flex flex-col' mr={4}>
            <div>
              {BAYC_TRAITS.map((trait) => (
                <div key={trait.traitType} className='mb-2'>
                  <div>{trait.traitType}</div>
                  <Select
                    isMulti
                    theme={SELECT_THEME}
                    options={trait.values.map((value) => ({
                      label: value,
                      value,
                    }))}
                    onChange={(traits) => {
                      toggleTraits(
                        trait.traitType,
                        traits.map((t) => t.value)
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          </div>
      </Dialog> */}

      <Dialog open={!!showMintModal} onClose={() => setShowMintModal(false)}>
        <div className={'w-96 p-4'}>
          <div className='flex flex-grow justify-space items-center my-2'>
            <div className='flex text-xl mr-1'>Mint</div>
            <CloseIcon
              className='cursor-pointer'
              onClick={() => setShowMintModal(false)}
            />
          </div>

          <div className='mt-4'>
            {!walletAddress ? (
              <Button variant='outlined' onClick={connect}>
                Connect
              </Button>
            ) : (
              <>
                <Button
                  variant='outlined'
                  disabled={!!mintTx.working}
                  onClick={onMint}
                >
                  {mintTx.working || 'Mint'}
                </Button>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </>
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
  );*/

  //const getNftMetadata = `https://cdn.51aliens.net/${tokenId}.json`;
  /*useMemo(
    () => (!baseUrlParams ? null : `${baseUrlParams[0]}${tokenId}`),
    [baseUrlParams, tokenId]
  );*/
  //const nftMetadata = useGetRequest<GetNftMetadata>(getNftMetadata)//useIPFS<GetNftMetadata>(getNftMetadata);
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
  ]);*/

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
          <>{formatUnits(tokenMarkets?.minimumOffer, 18, 2)} VITE</>
        )}
      </div>
    </Link>
  );
};

export default Page;
