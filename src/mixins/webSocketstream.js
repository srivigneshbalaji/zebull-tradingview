// import { parseFullSymbol } from './apiConnectionPool.js';
const socket =new WebSocket('wss://ws.zebull.in/NorenWS/');
const channelToSubscription = new Map();
var subscribedata = ['{"t": "c", "uid": "VIJAY22", "actid": "VIJAY22","source": "MOB","susertoken": "305218d75387791e96aee97b9ba62bf3d2834836417f5cdee1b64b485673bad6"}', `{"t": "d", "k": "NSE|2885"}`]
socket.onopen = function(event) {
    console.log("=========== [socket] onopen ",event)
    socket.send(subscribedata[0])
    setTimeout(() => {
        socket.send(subscribedata[1])
    }, 1000);
    
    console.log("Successfully connected to the echo websocket server...")
  }


  socket.onmessage = function(event) {
    console.log("=====> [socket] onmessage  :: ",event);
  }


socket.onclose=function(event){
    console.log('[socket] onclose:', event);
};

socket.onerror=function(event) {
    console.log('[socket] Error:', event);
};

export function subscribeOnStream(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback,
    lastDailyBar) {
        
        // const parsedSymbol = {exchange:symbolInfo.exchange};
        const channelString = symbolInfo.description;
        const handler = {
            id: subscriberUID,
            callback: onRealtimeCallback,
        };
        let subscriptionItem = channelToSubscription.get(channelString);
        if (subscriptionItem) {
            // already subscribed to the channel, use the existing subscription
            subscriptionItem.handlers.push(handler);
            return;
        }
        subscriptionItem = {
            subscriberUID,
            resolution,
            lastDailyBar,
            onResetCacheNeededCallback,
            handlers: [handler],
        };
        channelToSubscription.set(channelString, subscriptionItem);
        console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
        // socket.send(channelString);
}

export function unsubscribeFromStream(subscriberUID) {
    for (const channelString of channelToSubscription.keys()) {
        const subscriptionItem = channelToSubscription.get(channelString);
        const handlerIndex = subscriptionItem.handlers
            .findIndex(handler => handler.id === subscriberUID);

        if (handlerIndex !== -1) {
            // remove from handlers
            subscriptionItem.handlers.splice(handlerIndex, 1);

            if (subscriptionItem.handlers.length === 0) {
                // unsubscribe from the channel, if it was the last handler
                console.log('[unsubscribeBars]: Unsubscribe from streaming. Channel:', channelString);
                socket.send(channelString);
                channelToSubscription.delete(channelString);
                break;
            }
        }
    }
    
}