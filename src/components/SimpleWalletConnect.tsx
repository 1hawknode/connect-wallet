"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect } from "react";
import Image from "next/image";

function truncateAddress(address: string, start = 6, end = 4) {
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
}

export function SimpleWalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { context } = useMiniKit();

  // Auto-connect if there's a connector available
  useEffect(() => {
    if (connectors[0] && !isConnected) {
      connect({ connector: connectors[0] });
    }
  }, [connectors, isConnected, connect]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="w-full max-w-md rounded-xl p-8 space-y-6">
        {/* Profile Picture */}
        {context?.user?.pfpUrl && (
          <div className="flex justify-center mb-6">
            <Image
              src={context.user.pfpUrl}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full border-4 border-gray-200"
              priority
            />
          </div>
        )}

        {/* Wallet Connection Status */}
        <div className="text-center space-y-4">
          {isConnected && address ? (
            <div className="space-y-4">
              <div 
                className="text-lg font-medium text-white px-4 py-3 rounded-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                {truncateAddress(address)}
              </div>
              <button
                onClick={() => disconnect()}
                className="w-full px-4 py-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: '#000080',
                  color: '#FFFFFF'
                }}
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <button
              onClick={() => connectors[0] && connect({ connector: connectors[0] })}
              disabled={!connectors[0]}
              className="w-full px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: '#000080',
                color: '#FFFFFF'
              }}
            >
              {connectors[0] ? 'Connect Wallet' : 'No Wallet Found'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}