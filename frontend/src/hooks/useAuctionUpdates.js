import { useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';

const useAuctionUpdates = (auctionId, onBidUpdate, onStatusUpdate) => {
    const handleConnect = useCallback(() => {
        if (auctionId && onBidUpdate) {
            websocketService.subscribe(`/topic/auction/${auctionId}`, onBidUpdate);
        }
        
        if (auctionId && onStatusUpdate) {
            websocketService.subscribe(`/topic/auction/${auctionId}/status`, onStatusUpdate);
        }
    }, [auctionId, onBidUpdate, onStatusUpdate]);

    useEffect(() => {
        websocketService.connect(handleConnect, (error) => {
            console.error('WebSocket connection error:', error);
        });

        return () => {
            if (auctionId) {
                websocketService.unsubscribe(`/topic/auction/${auctionId}`);
                websocketService.unsubscribe(`/topic/auction/${auctionId}/status`);
            }
        };
    }, [auctionId, handleConnect]);

    return websocketService.isConnected();
};

export default useAuctionUpdates;
