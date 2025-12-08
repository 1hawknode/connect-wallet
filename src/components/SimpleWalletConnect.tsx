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

  // Get profile picture with fallback
  const profilePicture = context?.user?.pfpUrl || "/default-avatar.png";

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="w-full max-w-md rounded-2xl p-6">
        {/* Profile Picture - Always visible */}
        <div className="flex justify-center mb-4">
          <Image
            src={profilePicture}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full border-2 border-gray-300"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/default-avatar.png";
            }}
          />
        </div>

        {/* Wallet Connection Status */}
        <div className="text-center">
          {isConnected && address ? (
            <div className="space-y-3">
              <div 
                className="text-sm font-medium text-white px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                {truncateAddress(address)}
              </div>
              <button
                onClick={() => disconnect()}
                className="w-full px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ 
                  backgroundColor: '#1E40AF',
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
              className="w-full px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: '#1E40AF',
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