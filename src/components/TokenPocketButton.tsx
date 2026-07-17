import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';

export const TokenPocketButton: React.FC = () => {
  const { open } = useWeb3Modal(); // Ini adalah cara pemicu modal Web3Modal
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    // Membuka modal yang otomatis mendeteksi TokenPocket/MetaMask/WalletConnect
    open();
  };

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="neu-btn flex h-9 items-center justify-center px-3 text-xs font-bold text-cyan-400 border border-cyan-900/50"
      >
        {address?.slice(0, 6)}…{address?.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="neu-btn flex h-9 items-center justify-center px-3 text-xs font-bold text-cyan-400 border border-cyan-900/50"
      title="Connect Wallet"
    >
      <span className="font-mono">TP Wallet</span>
    </button>
  );
};
