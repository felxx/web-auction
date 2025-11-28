import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.connected = false;
        this.subscriptions = new Map();
        this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    }

    connect(onConnected, onError) {
        if (this.connected) {
            if (onConnected) onConnected();
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS(`${this.baseUrl}/ws`),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                this.connected = true;
                console.log('WebSocket connected');
                if (onConnected) onConnected();
            },
            onStompError: (frame) => {
                console.error('WebSocket error:', frame);
                this.connected = false;
                if (onError) onError(frame);
            },
            onWebSocketClose: () => {
                this.connected = false;
                console.log('WebSocket disconnected');
            }
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
            this.subscriptions.clear();
            this.client.deactivate();
            this.connected = false;
        }
    }

    subscribe(destination, callback) {
        if (!this.client || !this.connected) {
            console.warn('WebSocket not connected. Cannot subscribe to:', destination);
            return null;
        }

        const subscription = this.client.subscribe(destination, (message) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        this.subscriptions.set(destination, subscription);
        return subscription;
    }

    unsubscribe(destination) {
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(destination);
        }
    }

    isConnected() {
        return this.connected;
    }
}

const websocketService = new WebSocketService();
export default websocketService;
