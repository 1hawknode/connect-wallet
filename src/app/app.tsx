"use client";

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';
import { SimpleWalletConnect } from '~/components/SimpleWalletConnect';

export default function App() {
  const { isFrameReady, setFrameReady } = useMiniKit();

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return <SimpleWalletConnect />;
}