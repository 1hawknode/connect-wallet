"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect, useState } from "react";
import Image from "next/image";

function truncateAddress(address: string, start = 6, end = 4) {
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
}

export function SimpleWalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { context } = useMiniKit();
  const [imageError, setImageError] = useState(false);

  // Handle wallet connection
  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    } else {
      console.warn('No wallet connector available');
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('=== DEBUG ===');
    console.log('User object:', context?.user);
    console.log('PFP URL:', context?.user?.pfpUrl);
    console.log('Is connected:', isConnected);
    console.log('Address:', address);
  }, [context, isConnected, address]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md rounded-2xl p-6">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20 rounded-full border-2 border-gray-300 overflow-hidden">
            {context?.user?.pfpUrl ? (
              <Image
                src={context.user.pfpUrl}
                alt="Profile"
                fill
                className="object-cover"
                onError={() => {
                  console.error('Failed to load profile image');
                  setImageError(true);
                }}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-300 text-xs">No Image</span>
              </div>
            )}
          </div>
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
                onClick={() => {
                  console.log('Disconnecting wallet...');
                  disconnect();
                }}
                className="w-full px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ 
                  backgroundColor: '#1E40AF',
                }}
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="w-full px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ 
                backgroundColor: '#1E40AF',
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}