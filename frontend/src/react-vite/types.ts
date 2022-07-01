export type TxStatus = 'pending' | 'sending' | 'sent';

// export type Network = 'mainnet' | 'testnet' | 'local';
export type Network = 'mainnet'; //'testnet' | 'thomiznet' | 'local';

export type Fragment = {
  anonymous: boolean;
  inputs: {
    indexed: boolean;
    name: string;
    type: string;
  }[];
  outputs: {
    name: string;
    type: string;
  }[];
  name: string;
  type: string;
};
