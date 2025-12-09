"use client";

// External dependencies
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount, useConnect, useDisconnect } from "wagmi";

// Built-in modules
import { useEffect, useState } from "react";
import Image from "next/image";

// Types
interface FarcasterUser {
  pfpUrl?: string;
  username?: string;
  displayName?: string;
  fid: number;
  bio?: string;
}

function truncateAddress(address: string, start = 6, end = 4) {
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
}

export function SimpleWalletConnect() {
  // State
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [pfpError, setPfpError] = useState(false);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Initialize Farcaster SDK and load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const miniAppStatus = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppStatus);

        if (miniAppStatus) {
          const context = await sdk.context;
          console.log('Farcaster context:', context);
          if (context?.user) {
            setUser({
              pfpUrl: context.user.pfpUrl,
              username: context.user.username,
              displayName: context.user.displayName,
              fid: context.user.fid
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  // Handle wallet connection
  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md rounded-2xl p-6">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20 rounded-full border-2 border-gray-300 overflow-hidden">
            {user?.pfpUrl && !pfpError ? (
              <img
                src={user.pfpUrl}
                alt="Profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                onError={() => {
                  console.error('Failed to load profile image');
                  setPfpError(true);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-300 text-xs">
                  {isInMiniApp ? 'No Profile' : 'Not in Mini App'}
                </span>
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
                onClick={() => disconnect()}
                className="w-full px-4 py-2 rounded-lg text-white font-medium"
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
              className="w-full px-4 py-2 rounded-lg text-white font-medium"
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