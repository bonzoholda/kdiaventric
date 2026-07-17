import React from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Fix for fetch property on window
if (typeof window !== 'undefined' && !window.fetch) {
  // Try to use a safe way to ensure fetch is available if needed
  // In many modern browsers this is built-in.
}

// Gunakan ProjectID yang sama yang terbukti berhasil
const projectId = '0e067b77e88bde54e08e5d0a94da2cc6';

const getAppOrigin = () => {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return 'https://ais-dev-ez5khyrvcvnoo656rzehzg-112283305797.asia-southeast1.run.app';
};

const metadata = {
  name: 'KDIA Ventric Referral & Monoline Matrix Portal',
  description: 'KDIA Ventric Portal for referral system, vesting, and monoline matrix queues.',
  url: getAppOrigin(),
  icons: [getAppOrigin() + '/kdiaventric_logo.png']
};

const chains = [bscTestnet] as const;
export const config = defaultWagmiConfig({ chains, projectId, metadata });

// Inisialisasi Modal
createWeb3Modal({ wagmiConfig: config, projectId });

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
