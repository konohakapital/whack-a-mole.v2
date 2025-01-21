import { http, createConfig } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

const projectId = import.meta.env.VITE_WAGMI_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing VITE_WAGMI_PROJECT_ID environment variable');
}

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});