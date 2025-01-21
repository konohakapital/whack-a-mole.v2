import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount } from 'wagmi';
import { config } from './config';
import { Account } from './components/Account.tsx';
import { WalletOptions } from './components/WalletOptions'


const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet /> 
        <App />
      </QueryClientProvider> 
    </WagmiProvider>
  </StrictMode>
);