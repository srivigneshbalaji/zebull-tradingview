/* eslint-disable no-extra-boolean-cast */
import Vue from "vue";
import Cryptojs from "crypto-js";
Vue.use(Cryptojs);
import sha256 from "crypto-js/sha256";
// import { parseFullSymbol } from './apiConnectionPool.js';
import { logMessage } from '../utils/helpers.js'
const moment = require('moment');

// var chartFeed = '';
// var currentChartData =  new Map();

const url = "wss://ws.zebull.in/NorenWS/"
var connectionStatus = false
const socket = new WebSocket(url);

const channelToSubscription = new Map();
const singleQuoteMap = new Map();
const guidToSubscription = new Map();



const prelog = []

const tokenid = "VIJAY22_WEB"
const userId = "VIJAY22"


socket.onopen = function () {
    connectionRequest(tokenid, userId)
    prelog.forEach((message) => {
        send(message)
    });
}
socket.onmessage = function (msg) {
    logMessage(`=====> [socket] onmessage  :: ${msg}`);
    var responseFeed = JSON.parse(msg.data);

    if (!!responseFeed.t && responseFeed.t == 'ck' && responseFeed.s == 'OK') {
        connectionStatus = true
        logMessage("<==========[Socket Connection Success]============>")

    } else if (!!responseFeed.t && responseFeed.t == 'ck' && responseFeed.s == 'NOT_OK') {

        logMessage("!==========[Socket Session Invalid]============!")
    }
    if (responseFeed.tk) {

        logMessage(`[socket.onmessage] responseFeed ${responseFeed}`)
        ProcessPacketString(responseFeed)


        // if (localStorage.getItem("loadChart") == "true" && chartFeed.resolution == localResolution) {

        // } // checking chartload conditon

    }

}
socket.onclose = function (event) {
    socket.close()
    logMessage(`[socket] onclose:: ${event}`, 1);
};
socket.onerror = function (event) {
    logMessage(`[socket] Error: ${event} type ${event.type}`, 2);
    socket.onclose()
};

async function connectionRequest(tokenid, userId) {
    var encrcptToken = await sha256(sha256(tokenid).toString()).toString();
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
        logMessage("[socket send] socket connection is undefined", 2)
        //console.log("[socket send] socket connection is undefined", socket.readyState, socket.readyState)
    }
}

async function establishConnection(payload) {
    if (connectionStatus == false) {
        await connectionRequest(tokenid, userId);
    }
    //console.log("[establishConnection] : ", Date.now(), payload)
    await send(JSON.stringify(payload));
}


export function closeConnection() {
    logMessage(`Streaming Provider: Close connection called`)
    socket.close()
    channelToSubscription.clear();
    singleQuoteMap.clear();
    guidToSubscription.clear();
    // baOldData = null;
}


export async function websocketSubscription(payload) {
    if (connectionStatus) {
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
                t: 'd'
            };
            await establishConnection(json);
            //console.log("[establishConnection] : json   :", Date.now(), payload)
        }
    }
}


export function subscribeOnStream(
    symbols,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
    lastDailyBar,
    type) {


    // if (type == 'depth') {
    //     _subscribeDepth(symbols[0], onRealtimeCallback, subscribeUID)
    //     request = _getSubscribeDepthRequest(symbols[0])
    // } 
    if (type == 'quotes') {
        _subscribeQuotes(symbols, onRealtimeCallback, subscribeUID, type)

    } else if (type == 'bar') {
        _subscribeBars(symbols, onRealtimeCallback, subscribeUID, lastDailyBar, resolution)
    } else if (type == 'single-quotes') {
        _subscribeSingleQuotes(symbols, onRealtimeCallback, subscribeUID)
    }
}

// export function subscribeOnStream(
//     symbolInfo,
//     resolution,
//     onRealtimeCallback,
//     subscriberUID,
//     onResetCacheNeededCallback,
//     lastDailyBar) {

//     // const parsedSymbol = {exchange:symbolInfo.exchange};
//     const channelString = symbolInfo.description;
//     const handler = {
//         id: subscriberUID,
//         callback: onRealtimeCallback,
//     };
//     let subscriptionItem = channelToSubscription.get(channelString);
//     if (subscriptionItem) {
//         // already subscribed to the channel, use the existing subscription
//         subscriptionItem.handlers.push(handler);
//         return;
//     }
//     subscriptionItem = {
//         subscriberUID,
//         resolution,
//         lastDailyBar,
//         onResetCacheNeededCallback,
//         handlers: [handler],
//     };
//     channelToSubscription.set(channelString, subscriptionItem);
//     logMessage('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
//     // socket.send(channelString);
// }

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
                logMessage('[unsubscribeBars]: Unsubscribe from streaming. Channel:', channelString);
                socket.send(channelString);
                channelToSubscription.delete(channelString);
                break;
            }
        }
    }

}


function _subscribeQuotes(symbols, onRealtimeCallback, subscribeUID, type) {
    symbols.forEach(function set(symbol) {
        let channelString = `${symbol.exchange}|${symbol.token}#`
        _setChannelMap(symbol, channelString, onRealtimeCallback, subscribeUID, type)
        websocketSubscription(channelString)
    })
}

function _subscribeBars(symbols, onRealtimeCallback, subscribeUID, lastDailyBar, resolution) {
    //console.log("[_subscribeBars] symbols ",symbols)
    symbols.forEach(function set(symbol) {
        //console.log("[_subscribeBars] symbol ",symbol)
        let channelString = `${symbol.exchange}|${symbol.token}#`

        _setChannelMap(symbol, channelString, onRealtimeCallback, subscribeUID, 'bar', resolution, lastDailyBar)
        websocketSubscription(channelString)



    })
}

function _subscribeSingleQuotes(symbols, onRealtimeCallback, subscribeUID) {
    //console.log("[_subscribeSingleQuotes] symbols == ", symbols, subscribeUID)
    symbols.forEach(function set(symbol) {
        let channelString = `${symbol.exchange}|${symbol.token}#`
        let existing = singleQuoteMap.get(subscribeUID)
        //console.log("[_subscribeSingleQuotes] existing == ", existing)
        if (existing) {
            existing[`${symbol.exchange}|${symbol.token}#`] = {
                quote: {}
            }
        } else {
            singleQuoteMap.set(subscribeUID, new Object())
            singleQuoteMap.get(subscribeUID)[`${symbol.exchange}|${symbol.token}#`] = {
                quote: {},
                symbol: symbol.name
            }
        }
        //console.log("[_subscribeSingleQuotes] singleQuoteMap : ", singleQuoteMap)
        _setChannelMap(symbol, channelString, onRealtimeCallback, subscribeUID, 'single-quotes')
        websocketSubscription(channelString)
    })

}

function _setChannelMap(symbol, channelString, onRealtimeCallback, subscribeUID, type, resolution, lastDailyBar) {
    let subscriptionItem = channelToSubscription.get(channelString);
    let handler = {
        id: subscribeUID,
        callback: onRealtimeCallback,
    };
    // //console.log("[_setChannelMap] handler : ","symbol : ",symbol," channelString : ",channelString," handler : ",handler," subscribeUID : ",subscribeUID,
    // "resolution : ",resolution,"lastDailyBar : ",lastDailyBar)
    if (subscriptionItem) {
        var index = subscriptionItem.handlers.findIndex(ob => {
            //console.log("[_setChannelMap] ob  subscribeUID : ", ob.id == subscribeUID, ob, subscribeUID)
            return ob.id == subscribeUID
        })
        if (index == -1) {
            subscriptionItem.handlers.push({
                handler: handler,
                type: type,
                resolution: resolution,
                lastDailyBar: lastDailyBar,
                symbol: symbol.name,
                id: subscribeUID
            });
        } else {
            subscriptionItem.handlers[index] = {
                handler: handler,
                type: type,
                resolution: resolution,
                lastDailyBar: lastDailyBar,
                symbol: symbol.name,
                id: subscribeUID
            }
        }
    } else {
        subscriptionItem = {
            handlers: [{
                handler: handler,
                type: type,
                resolution: resolution,
                lastDailyBar: lastDailyBar,
                symbol: symbol.name,
                id: subscribeUID
            }],
        };
        channelToSubscription.set(channelString, subscriptionItem);
        //console.log("[_setChannelMap] channelToSubscription  : ", channelToSubscription)
    }
    guidToSubscription.set(subscribeUID, channelString)
    //console.log("[_setChannelMap] guidToSubscription  : ", guidToSubscription)
    if (!guidToSubscription.has(subscribeUID)) {
        console.error("guid fail")
    }
}



function ProcessPacketString(responseFeed) {
    //console.log("[ProcessPacketString] .......::", responseFeed, responseFeed.t === "dk", responseFeed.t === "df")
    // let data_map = new Map()
    // let pipe_broken = responseFeed.split('|');
    // pipe_broken.forEach(function parse(item){
    //     let split_array = item.split('=')
    //     data_map.set(split_array[0],split_array[1])
    // })
    // let data_map = marketDepthProcessMessage(responseFeed);
    // let message_code = parseInt(data_map.get('64'));
    // if (message_code == 102 || message_code == 155) {
    //     return
    // }
    // var preVolume = null;
    // var curVolume;
    // // tradingViewchart.methods.webSocketData(responseFeed) 
    // var localResolution = localStorage.getItem(
    //     "tradingview.chart.lastUsedTimeBasedResolution"
    // );
    // var currentGraph = []
    // // var currBarVol;
    // var lotSize;
    // var open;
    // var high;
    // var low;
    // var close;
    // var volume;
    // var date;
    // let time;
    // var tempRes;
    // var tickerLtp;

    // if (currentChartData.chart == '::index') {
    //     tickerLtp = currentChartData['value']
    // }
    // if (currentChartData['token'] == responseFeed['tk']) {
    //     currentChartData["volume"] = !!responseFeed["v"] ? responseFeed["v"] : currentChartData["volume"]
    //     tickerLtp = !!responseFeed["lp"] ? responseFeed["lp"] : !!currentChartData['ltp'] ? currentChartData['ltp'] : tickerLtp

    //     var prevBar = JSON.parse(localStorage.getItem("_lastBar"));
    //     preVolume = currentGraph["TradeVolume"];


    //     curVolume =
    //         Number(preVolume) > Number(curVolume) ? preVolume : curVolume;

    //     curVolume = !!responseFeed["v"] ? responseFeed["v"] : currentChartData["volume"]
    //     lotSize = '' //!!orderWindow.chartScripData["BodLotQty"] ? orderWindow.chartScripData["BodLotQty"] : orderWindow.chartScripData["bodlot"]
    //     volume = currentGraph["TradeVolume"];


    //     open = tickerLtp
    //     high = tickerLtp
    //     low = tickerLtp
    //     close = tickerLtp

    //     if (prevBar == undefined || prevBar == null) {
    //         prevBar = {
    //             time: new Date().getTime(),
    //             close: close,
    //             open: open,
    //             high: high,
    //             low: low,
    //             volume: 0,
    //         };
    //     }
    //     if (!!responseFeed["ltt"]) {
    //         const changedDate = responseFeed["ltt"].replace(
    //             /(..)\/(..)\/(....) (..):(..):(..)/,
    //             "$3-$2-$1 $4:$5:$6"
    //         );
    //         date = new Date(changedDate);
    //     }
    //     time =
    //         !!date && date !== "NA" && !isNaN(date)
    //             ? date.getTime()
    //             : new Date().getTime();

    //     let bar = null;
    //     if (localResolution === "D" || localResolution === "1D") {
    //         time = new Date().getTime() + 330 * 60 * 1000;
    //         volume = Number(curVolume);
    //         if (Number(responseFeed["lp"]) > prevBar["high"]) {
    //             prevBar["high"] = Number(responseFeed["lp"]);
    //             high = Number(responseFeed["lp"]);
    //         } else {
    //             high = prevBar["high"];
    //         }
    //         if (Number(responseFeed["lp"]) < prevBar["low"]) {
    //             prevBar["low"] = Number(responseFeed["lp"]);
    //             low = Number(responseFeed["lp"]);
    //         } else {
    //             low = prevBar["low"];
    //         }
    //         prevBar["close"] = Number(responseFeed["lp"]);
    //         open = prevBar["open"];
    //         bar = {
    //             time: Number(time),
    //             close: Number(close),
    //             open: Number(open),
    //             high: Number(high),
    //             low: Number(low),
    //             volume: Number(volume),
    //         };
    //     } else {
    //         if (localResolution == "1" || localResolution == "1M") {
    //             tempRes = 1;
    //         } else if (localResolution == "5") {
    //             tempRes = 5;
    //         } else if (localResolution == "15") {
    //             tempRes = 15;
    //         } else if (localResolution == "30") {
    //             tempRes = 30;
    //         } else if (localResolution == "60") {
    //             tempRes = 60;
    //         }
    //         volume =
    //             (Number(curVolume) - Number(preVolume)) * Number(lotSize);
    //         var coeff;
    //         if (
    //             (localResolution == "30" || localResolution == "60") &&
    //             this.exchange != "MCX"
    //         ) {
    //             coeff = 1000 * 60 * tempRes;
    //             time = Math.floor(time / coeff) * coeff;
    //             if (localResolution == "30") {
    //                 var roundOffedDateTime = new Date(time).toLocaleString(
    //                     "en-US",
    //                     {
    //                         timeZone: "IST",
    //                     }
    //                 );
    //                 var roundOffedTime = roundOffedDateTime.split(" ")[1];
    //                 var timeDiff = roundOffedTime.split(":")[1];
    //                 if (timeDiff == "00") {
    //                     time = time + 900000;
    //                 } else if (timeDiff == "30") {
    //                     time = time - 900000;
    //                 }
    //             } else if (localResolution == "60") {
    //                 var currentTime = new Date().getTime();
    //                 var roundOffedDateTime60 = new Date(
    //                     currentTime
    //                 ).toLocaleString("en-US", {
    //                     timeZone: "IST",
    //                 });
    //                 var roundOffedTime60 = roundOffedDateTime60.split(" ")[1];
    //                 var timeDiff60 = roundOffedTime60.split(":")[1];
    //                 if (
    //                     parseInt(timeDiff60) >= 0 &&
    //                     parseInt(timeDiff60) <= 14
    //                 ) {
    //                     time = time - 900000;
    //                 } else if (
    //                     parseInt(timeDiff60) >= 15 &&
    //                     parseInt(timeDiff60) <= 59
    //                 ) {
    //                     time = time + 900000;
    //                 }
    //             }
    //         } else {
    //             coeff = 1000 * 60 * tempRes;
    //             time = Math.floor(time / coeff) * coeff;
    //         }

    //         /** New bar to be created. Save current bar data in Previous Bar */
    //         if (
    //             !!prevBar &&
    //             !!prevBar["time"] &&
    //             time > prevBar["time"]
    //         ) {
    //             prevBar["open"] = tickerLtp;
    //             prevBar["high"] = tickerLtp;
    //             prevBar["low"] = tickerLtp;
    //             preVolume = curVolume;
    //             prevBar["volume"] = preVolume;
    //         }
    //         if (Number(tickerLtp) > prevBar["high"]) {
    //             prevBar["high"] = Number(tickerLtp);
    //             high = Number(tickerLtp);
    //         } else {
    //             high = prevBar["high"];
    //         }
    //         if (Number(tickerLtp) < prevBar["low"]) {
    //             prevBar["low"] = Number(tickerLtp);
    //             low = Number(tickerLtp);
    //         } else {
    //             low = prevBar["low"];
    //         }
    //         prevBar["close"] = Number(tickerLtp);
    //         open = prevBar["open"];
    //         bar = {
    //             time: Number(time),
    //             close: Number(close),
    //             open: Number(open),
    //             high: Number(high),
    //             low: Number(low),
    //             volume: Number(volume),
    //         };
    //     }

    //     let barValue = {
    //         time: Number(time),
    //         close: Number(close),
    //         open: Number(open),
    //         high: Number(high),
    //         low: Number(low),
    //         volume: Number(preVolume),
    //     };
    //     localStorage.setItem("_lastBar", JSON.stringify(barValue));
    //     localStorage.setItem(
    //         "previousBarTime",
    //         JSON.stringify(responseFeed["ltt"])
    //     );
    //     chartFeed.onRealtimeCallback(bar);

    // }
    try {
        var tradePrice
        var openPrice
        var highPrice
        var lowPrice
        var closePrice
        var volume
        var token
        var market_segment
        var tradeTime
        var changeper

        if (responseFeed.t === "dk") {
            tradePrice = responseFeed["lp"]
            openPrice = responseFeed["o"];
            highPrice = responseFeed["h"];
            lowPrice = responseFeed["l"];
            closePrice = responseFeed["c"];
            volume = responseFeed["v"];
            token = responseFeed["tk"]
            market_segment = responseFeed["e"]
            tradeTime = responseFeed["ft"]
            changeper = responseFeed["cp"]
        }

       

        if ("lp" in responseFeed) tradePrice = responseFeed["lp"];
        if ("o" in responseFeed) openPrice = responseFeed["o"];
        if ("h" in responseFeed) highPrice = responseFeed["h"];
        if ("l" in responseFeed) lowPrice = responseFeed["l"];
        if ("c" in responseFeed) closePrice = responseFeed["c"];
        if ("v" in responseFeed) volume = responseFeed["v"];
        if ("tk" in responseFeed) token = responseFeed["tk"]
        if ("e" in responseFeed) market_segment = responseFeed["e"]
        if ("ft" in responseFeed) tradeTime = responseFeed["ft"]
        if ("cp" in responseFeed) changeper = responseFeed["cp"]

        let channelString = `${market_segment}|${token}#`
        let subscriptionItem = channelToSubscription.get(channelString);

        if (subscriptionItem === undefined) {
            return;
        }
        if (subscriptionItem.handlers === undefined) {
            return;
        }
        subscriptionItem.handlers.forEach(function callHandler(handler) {
            //console.log("[subscriptionItem] handler.type ", handler)
            if (handler.type == 'quotes') {
                let quote = {
                    s: 'ok',
                    n: handler.symbol,
                    v: {
                        ch: (tradePrice - closePrice),
                        chp: changeper,
                        short_name: market_segment,
                        exchange: market_segment,
                        description: handler.symbol,
                        lp: tradePrice,
                        open_price: openPrice,
                        high_price: highPrice,
                        low_price: lowPrice,
                        prev_close_price: closePrice,
                        volume: volume,
                        token: token,
                        market_segment_id: market_segment,
                    }

                }
                //console.log("[quotes] handler.type : ", quote)
                try {
                    handler.handler.callback([quote])
                } catch (err) {
                    console.info(err)
                }

            } else if (handler.type == 'tt-quotes') {
                let quote = {
                    s: 'success',
                    n: handler.symbol,
                    v: {
                        ch: (tradePrice - closePrice),
                        chp: changeper,
                        short_name: market_segment,
                        exchange: market_segment,
                        description: handler.symbol,
                        lp: tradePrice,
                        open_price: openPrice,
                        high_price: highPrice,
                        low_price: lowPrice,
                        prev_close_price: closePrice,
                        volume: volume
                    }

                }
                try {

                    handler.handler.callback(quote)
                } catch (err) {
                    console.info(err)
                }
            } else if (handler.type == 'bar') {

                const lastDailyBar = handler.lastDailyBar;
                const resolution = handler.resolution;
                var nextDailyBarTime
                if (resolution == '1' || resolution == 1) {
                    nextDailyBarTime = getNextMinBarTime(lastDailyBar != null ? lastDailyBar.time : null);
                } else if (resolution == '1D') {
                    tradeTime = moment(tradeTime).startOf('day').toDate().getTime() + 19800000
                    nextDailyBarTime = getNextDailyBarTime(lastDailyBar != null ? lastDailyBar.time : null);
                } else if (resolution == '1M') {
                    tradeTime = moment(tradeTime).startOf('month').toDate().getTime() + 19800000
                    nextDailyBarTime = getNextMonthBarTime(lastDailyBar != null ? lastDailyBar.time : null);
                } else if (resolution == '1Y') {
                    tradeTime = moment(tradeTime).startOf('year').toDate().getTime() + 19800000
                    nextDailyBarTime = getNextyearBarTime(lastDailyBar != null ? lastDailyBar.time : null);
                }
                let bar;
                if (tradeTime >= nextDailyBarTime) {
                    if (resolution == '1D') {
                        bar = {
                            time: nextDailyBarTime,
                            open: openPrice,
                            high: highPrice,
                            low: lowPrice,
                            close: tradePrice,
                            volume: volume
                        };
                    } else {
                        bar = {
                            time: nextDailyBarTime,
                            open: tradePrice,
                            high: tradePrice,
                            low: tradePrice,
                            close: tradePrice,
                        };
                    }
                } else {
                    if (resolution == '1D') {
                        bar = {
                            ...lastDailyBar,
                            high: highPrice,
                            low: lowPrice,
                            close: tradePrice,
                            volume: volume
                        };
                    } else {
                        bar = {
                            ...lastDailyBar,
                            high: Math.max((lastDailyBar != null ? lastDailyBar.high : 0), tradePrice),
                            low: Math.min(lastDailyBar != null ? lastDailyBar.low : 0, tradePrice),
                            close: tradePrice,
                        };
                    }
                }
                //console.log("[bar] handler.type : ", bar)
                handler.handler.callback(bar)

                handler.lastDailyBar = bar;
            } else if (handler.type == 'single-quotes') {
                let quote = {
                    s: 'success',
                    n: handler.symbol,
                    v: {
                        ch: (tradePrice - closePrice),
                        chp: changeper,
                        lp: tradePrice,
                        open_price: openPrice,
                        high_price: highPrice,
                        low_price: lowPrice,
                        prev_close_price: closePrice,
                        volume: volume,
                    }

                }
                //console.log("[single-quotes] else if handler.type : ", quote, singleQuoteMap)
                let mapper = singleQuoteMap.get(handler.id)

                if (mapper) {
                    //console.log("[single-quotes] mapper : ", mapper)
                    let all = true
                    let callbackResp = []
                    mapper[`${market_segment}|${token}#`].quote = quote
                    for (const [, value] of Object.entries(mapper)) {
                        //console.log("key : ", key, " value : ", value)
                        //console.log("Object.keys(value.quote).length === 0 : ", Object.keys(value.quote).length === 0)
                        if (Object.keys(value.quote).length === 0) {
                            all = false
                        } else {
                            callbackResp.push({
                                "s": "ok",
                                "n": value.quote.n,
                                "v": {
                                    "ch": value.quote.v.ch,
                                    "chp": value.quote.v.chp,
                                    "short_name": value.quote.n.split("::")[0],
                                    "exchange": value.quote.n.split("::")[1],
                                    "description": value.quote.n,
                                    "lp": value.quote.v.lp,
                                    "ask": value.quote.v.ask || 0,
                                    "bid": value.quote.v.bid || 0,
                                    "open_price": value.quote.v.open_price,
                                    "high_price": value.quote.v.high_price,
                                    "low_price": value.quote.v.low_price,
                                    "prev_close_price": value.quote.v.prev_close_price,
                                    "volume": value.quote.v.volume,

                                }
                            })
                        }
                    }
                    // //console.log("[single-quotes] mapper : ", all, callbackResp)
                    //console.log("[single-quotes] handler : ",all,callbackResp,handler)
                    if (all) {
                        handler.handler.callback(callbackResp)
                        singleQuoteMap.delete(handler.handler.id)
                        unsubscribeFromStream(handler.handler.id)
                    }
                }
            }
            //  else if (handler.type == 'depth') {
            //     handler.handler.callback(depth)
            // }

        });

    } catch (e) {
        //console.log("ERROR : ", e)
    }

}

// function odinDateParse(rand) {
// let [dateStr, timeStr] = rand.split(" ")
// let final_time = "T" + timeStr[0] + timeStr[1] + ":" + timeStr[2] + timeStr[3] + ":" + timeStr[4] + timeStr[5] + "+05:30"
// return Date.parse(dateStr + final_time)

// var d = new Date(0); 
//     //console.log("[odinDateParse] : " ,new Date(rand?rand/1000:rand))
//     return new Date(rand);
// }

function getNextDailyBarTime(barTime) {
    const date = new Date(barTime);
    var new_date = moment(date).add('1', 'd').startOf('day').toDate()
    return new_date.getTime() + 19800000;
}

function getNextMonthBarTime(barTime) {
    const date = new Date(barTime);
    var new_date = moment(date).add('1', 'M').startOf('month').toDate()
    return new_date.getTime();
}

function getNextyearBarTime(barTime) {
    const date = new Date(barTime);
    var new_date = moment(date).add('1', 'Y').startOf('year').toDate()
    return new_date.getTime();
}

function getNextMinBarTime(barTime) {
    const date = new Date(barTime);
    const curTime = moment();
    var duration = moment.duration(curTime.diff(date)).asMinutes();
    if (duration > 1) {
        return curTime.startOf('minute').toDate()
    } else {
        var new_date = moment(date).add('1', 'm').startOf('minute').toDate()
        return new_date.getTime();
    }
}


// export function unsubscribe(listenerGuid) {
//     logMessage(`[unsubscribe] ==  ${listenerGuid}`)
//     let channelString = guidToSubscription.get(listenerGuid);
//     let subscriptionItem = channelToSubscription.get(channelString)
//     if (subscriptionItem) {
//         subscriptionItem.handlers = subscriptionItem.handlers.filter(function(handler) {
//             return handler.id != listenerGuid;
//         })
//         if (typeof subscriptionItem.handlers !== 'undefined' && subscriptionItem.handlers.length == 0) {
//             var request = "63=FT3.0|64=206|65=80|"
//             const [market_segment_id, token] = channelString.split("-")
//             request = request + "1=" + market_segment_id + "$7=" + token + "|4=1000|230=2"
//             send(request)
//             channelToSubscription.delete(channelString)
//         }
//     }
// }

// function marketDepthProcessMessage(message) {
//     //console.log("onResponse = $message ",message);
//     var scrip = message//.split("|");
//     //print(scrip);
//     let depth = {
//         snapshot: true,
//         asks: [],
//         bids: []
//     }
//     let data_map = new Map()

//     for (var i = 0, len = scrip.length; i < len; i++) {
//         var data = scrip[i];
//         // if (data != null && data.isNotEmpty) {
//         var pos = data.indexOf('=');
//         if (pos >= 0) {
//             var key = data.substring(0, pos);
//             var value = data.substring(pos + 1, scrip[i].length);
//             if (key == '11') {
//                 var buySell = data.substring(pos + 1, scrip[i].length);

//                 if (buySell == '1') {
//                     for (var j = 0, len1 = 5; j < len1; j++) {
//                         let aa = scrip[i + j + 1].split("$")
//                         let quantity_a = aa[0].split("=")
//                         let price_a = aa[1].split("=")
//                         depth.bids.push({
//                             price: (data_map.get('1') == '13' ? parseFloat(price_a[1]) / 10000000 : parseFloat(price_a[1]) / 100),
//                             volume: parseInt(quantity_a[1])
//                         })
//                     }
//                 } else {
//                     for (var k = 0, len2 = 5; k < len2; k++) {
//                         let aa = scrip[i + k + 1].split("$")
//                         let quantity_a = aa[0].split("=")
//                         let price_a = aa[1].split("=")
//                         depth.asks.push({
//                             price: (data_map.get('1') == '13' ? parseFloat(price_a[1]) / 10000000 : parseFloat(price_a[1]) / 100),
//                             volume: parseInt(quantity_a[1])
//                         })
//                     }

//                 }

//             } else {
//                 data_map.set(key, value)
//             }
//             // processMarketDepthKeyValuePair(scripDetailModel, key, value);
//         }
//     }
//     depth.asks.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0))
//     depth.bids.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0))
//     data_map.set("depth", depth)
//     return data_map
// }