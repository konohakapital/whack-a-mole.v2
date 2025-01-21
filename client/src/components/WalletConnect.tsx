import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { Button } from './ui/button';

const WalletConnect = () => {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <div className="flex justify-end mb-4 space-x-2">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={!connector.ready}
            className="px-6 py-2 text-white bg-blue-600 border border-transparent rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Connect {connector.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-4 items-center space-x-2">
      <span className="text-sm text-gray-600">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <Button
        onClick={() => disconnect()}
        className="px-6 py-2 text-white bg-red-600 border border-transparent rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out"
      >
        Disconnect
      </Button>
    </div>
  );
};

export default WalletConnect;
