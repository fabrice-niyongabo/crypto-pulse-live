/**
 * WebSocket connection status indicator
 * Shows real-time connection state with visual feedback
 */

import { useCryptoStore } from '@/store/useCryptoStore';
import { Wifi, WifiOff } from 'lucide-react';

export function ConnectionStatus() {
  const { isConnected } = useCryptoStore();

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
        transition-colors duration-300
        ${
          isConnected
            ? 'bg-gain/20 text-gain'
            : 'bg-loss/20 text-loss'
        }
      `}
    >
      {isConnected ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>Live</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gain opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gain" />
          </span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
}
