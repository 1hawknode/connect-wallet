"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect, useState } from "react";
import Image from "next/image";

function truncateAddress(address: string, start = 6, end = 4) {
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
}

export function SimpleWalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { context } = useMiniKit();
  const [imageError, setImageError] = useState(false);

  // Debug: Log user context
  useEffect(() => {
    console.log('User context:', {
      user: context?.user,
      pfpUrl: context?.user?.pfpUrl,
      isConnected
    });
  }, [context, isConnected]);

  // Fallback to default avatar if there's an error or no pfpUrl
  const profilePicture = !imageError && context?.user?.pfpUrl 
    ? context.user.pfpUrl 
    : '/default-avatar.png';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md rounded-2xl p-6">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20 rounded-full border-2 border-gray-300 overflow-hidden">
            <Image
              src={profilePicture}
              alt="Profile"
              fill
              className="object-cover"
              onError={() => {
                console.error('Failed to load profile image');
                setImageError(true);
              }}
              priority
            />
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
              onClick={() => window.location.reload()}
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