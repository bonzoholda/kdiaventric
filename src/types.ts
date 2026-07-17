export type Language = 'id' | 'en';

export interface UserVesting {
  total: number;
  claimed: number;
  lastUpdate: number; // timestamp
  startTime?: number; // block.timestamp (seconds)
  duration?: number; // duration (seconds)
}

export interface QueueUser {
  address: string;
  joinedAt: number; // timestamp
  index: number;
  isDummy?: boolean;
  isProcessed?: boolean;
}

export interface ReferralLevelInfo {
  level: 1 | 2 | 3;
  percentage: number;
  count: number;
  earnings: number;
  members: Array<{
    address: string;
    joinedAt: number;
    amount: number;
    depositVestingBonus: number;
    buyMatrixBonus: number;
    squeezeBonus: number;
  }>;
}

export interface WalletState {
  connected: boolean;
  address: string;
  usdtBalance: number;
  kdiaBalance: number;
  btcbBalance: number;
  bnbBalance: number;
  chainId?: string;
}

export interface TreasuryStats {
  btcbReserve: number;
  kdiaReserve: number; // for vesting
  kdiaCirculating: number;
  floorPrice: number; // BTCB per KDIA
  marketPrice: number; // simulated price of KDIA in USDT
}

export interface AppNotification {
  id: string;
  titleEn: string;
  titleId: string;
  messageEn: string;
  messageId: string;
  type: 'success' | 'info' | 'warning' | 'matrix' | 'referral';
  timestamp: number;
}

export interface TransactionHistory {
  id: string;
  type: 'deposit' | 'claim_ref' | 'claim_matrix' | 'vesting_claim' | 'redeem' | 're_entry' | 'buy_matrix_only' | 'cashback_received' | 'executor_bonus';
  amount: string;
  token: string;
  txHash: string;
  timestamp: number;
  address: string;
}
