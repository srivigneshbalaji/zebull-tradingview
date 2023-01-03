import Vue from "vue";
import Cryptojs from "crypto-js";
Vue.use(Cryptojs);
import sha256 from "crypto-js/sha256";
// import { parseFullSymbol } from './apiConnectionPool.js';


const url =   "wss://ws.zebull.in/NorenWS/"

const socket =new WebSocket(url);
const channelToSubscription = new Map();
var connectionStatus=false


// var subscribedata = ['{"t": "c", "uid": "VIJAY22", "actid": "VIJAY22","source": "MOB","susertoken": "305218d75387791e96aee97b9ba62bf3d2834836417f5cdee1b64b485673bad6"}', `{"t": "d", "k": "NSE|2885"}`]

socket.onopen = function() {
    connectionRequest()
  }

  socket.onmessage = function(msg) {
    console.log("=====> [socket] onmessage  :: ",msg);
    var responseFeed = JSON.parse(msg.data);

    if (!!responseFeed.t && responseFeed.t == 'ck' && responseFeed.s == 'OK') {
        console.log("<==========[Socket Connection Success]============>")
       
    } else if (!!responseFeed.t && responseFeed.t == 'ck' && responseFeed.s == 'NOT_OK') {
        
        console.log("!==========[Socket Session Invalid]============!")
    }
    if (responseFeed.tk) {
        // tradingViewchart.methods.webSocketData(responseFeed) 

       console.log("responseFeed")

        // rootGetters['marketWatch/getMwList'].forEach(element => {
        //     if (element.token == responseFeed.tk) {
        //         element.ltp = !!responseFeed.lp ? responseFeed.lp : element.ltp;
        //         element.volume = !!responseFeed.v ? responseFeed.v : element.volume;
        //         element.PerChange = !!responseFeed.pc ? responseFeed.pc : element.PerChange;
        //         element.preClose = !!responseFeed.c ? responseFeed.c : element.preClose
        //         element.Change = !!responseFeed.lp ? responseFeed.lp - element.preClose : element.Change

              
        //     }
        // })

  
    }
  }


socket.onclose=function(event){
    socket.close()
    console.log('[socket] onclose:', event);
};

socket.onerror=function(event) {
    console.log('[socket] Error:', event);
    socket.onclose()
};

async function connectionRequest() {
    var token = "VIJAY22_WEB"
    var userId = "VIJAY22"
    var encrcptToken = await sha256(sha256(token).toString()).toString();
    var initCon = {
        susertoken: encrcptToken,
        t: "c",
        actid: userId + "_WEB",
        uid: userId + "_WEB",
        source: "WEB"
    }
    send(JSON.stringify(initCon));
}

async function send(msg) {
    if (!!socket.readyState && socket.readyState == 1) {
        try {
            socket.send(msg);
        } catch (err) {
            console.error(err);
        }
    } else if (!!socket.readyState && socket.readyState == 0) {
        setTimeout(() => { socket.send(msg); }, 900);

    } else {
        console.error("socket connection is undefined")
    }
}

async function establishConnection(payload) {
    if (connectionStatus == false) {
        await connectionRequest();
    }
    await send(JSON.stringify(payload));
}

export async function websocketSubscription(payload) {
    if(connectionStatus){
    var channel = ''; //BSE|1#NSE|26017#NSE|26040#NSE|26009#NSE|26000#
       
    channel += `${payload}` 

    if (channel != '' && !!channel) {
        var tempChannel = channel.substring(0, channel.length - 1)
        var tempUniqueArray = tempChannel.split('#')
        var uniqueChannel = ''
        const uniqueArray = new Set(tempUniqueArray);
        uniqueArray.forEach(element => {
            uniqueChannel += element + '#'
        })
        let json = {
            k: uniqueChannel.substring(0, uniqueChannel.length - 1),
            t: 't'
        };
        await establishConnection(json);
    }
}
}





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