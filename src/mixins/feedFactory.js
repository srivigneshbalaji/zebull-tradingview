/* eslint-disable */
import { makeApiRequest, getWatchlistdata } from './apiConnectionPool.js';
import { subscribeOnStream, unsubscribeFromStream,connectionRequest } from './webSocketstream.js';
import {getMWValues} from './marketWatchList.js';
import {logMessage} from '../utils/helpers.js'

const lastBarsCache = new Map();
var _symbolInfoMap={}
const configurationData = {
    supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
    exchanges: [
        { name: "All Exchanges", value: "", desc: "" },
        { name: "NSE", value: "NSE", desc: "NSE" },
        { name: "NFO", value: "NFO", desc: "NFO" },
        { name: "CDS", value: "CDS", desc: "CDS" },
        { name: "MCX", value: "MCX", desc: "MCX" },
    ],
    symbols_types: [
        { name: "All types", value: "" },
        { name: "Stock", value: "stock" },
        { name: "Index", value: "index" },
    ],
    "supports_search": true,
    "supports_group_request": false,
    "supports_marks": false,
    "supports_timescale_marks": true,
    "supports_time": true
};

export default {
    onReady: (callback) => {
        logMessage("[onReady] Initiated------------------------------------ ")
        // logMessage('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    },
    searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
        logMessage('[searchSymbols]: Method call');
        const symbols = await getAllSymbols(userInput);
        // const newSymbols = symbols.filter(symbol => {
        //     const isExchangeValid = exchange === '' || symbol.exchange === exchange;
        //     const isFullSymbolContainsInput = symbol.full_name
        //         .toLowerCase()
        //         .indexOf(userInput.toLowerCase()) !== -1;
        //     return isExchangeValid && isFullSymbolContainsInput;
        // });
        logMessage(`"[search symbols] :: ",${symbols}`)
        onResultReadyCallback(symbols);
    },

    async getQuotes(symbols, onDataCallback, onErrorCallback) {
        logMessage(`"[getQuotes symbols] :: ",${symbols}`)
        var symbolInfos = {}
        symbols.forEach(symbol => {
            console.log("[getQuotes symbols] symbol :: ",symbol)
            this.resolveSymbol(symbol, (symbolInfo) => {
                symbolInfos[symbol] = symbolInfo
                if (Object.keys(symbolInfos).length == symbols.length) {
                    subscribeOnStream(Object.values(symbolInfos),
                        undefined,
                        onDataCallback,
                        Date.now().toString(),
                        undefined,
                        undefined, 'single-quotes')
                }
            })
        });
    },

    subscribeQuotes: async(symbols, fastSymbols, onRealtimeCallback, listenerGuid) => {
        if (fastSymbols == null) {
            fastSymbols = symbols
        }
        logMessage(`"[subscribeQuotes symbols] :: ",${symbols}`)
        // let allSym = [...new Set(fastSymbols.concat(symbols))]
        var symbolInfos = {}
        symbols.forEach(symbol => {
            console.log("[symbol] HAI : ",symbol)
            this.resolveSymbol(symbol, (symbolInfo) => {
                symbolInfos[symbol] = symbolInfo
                if (Object.keys(symbolInfos).length == symbols.length) {
                    subscribeOnStream(Object.values(symbolInfos),
                        undefined,
                        onRealtimeCallback,
                        listenerGuid,
                        undefined,
                        undefined, 'quotes')
                }
            })
        });
	},
    unsubscribeQuotes: async(listenerGUID) => {
        unsubscribeFromStream(listenerGUID)
	},

    resolveSymbol: async (symbolName, onSymbolResolvedCallback, ErrorCallback, extension) => {
        console.log("[resolveSymbol] symbolName :: ",symbolName,extension,ErrorCallback)
        const currencyCode = extension && extension.currencyCode;
        const unitId = extension && extension.unitId;
        const resolveRequestStartTime = Date.now();

        function onResultReady(symbolInfo) {
            logMessage(`UdfCompatibleDatafeed: Symbol resolved: ${Date.now() - resolveRequestStartTime}ms`);
            onSymbolResolvedCallback(symbolInfo);
        }

        
        let requestOptions = {method: 'GET',redirect: 'follow'};
        if(symbolName.includes("NSE:")){
            const myArray = symbolName.split("NSE:");
            symbolName = myArray[1];
        }else if(symbolName.includes("MCX:")){
            const myArray = symbolName.split("MCX:");
            symbolName = myArray[1];
        }
        else{
            symbolName=symbolName;
            // logMessage(`"SYMBOL NAME:::::", ${symbolName}`)
        }
        if(symbolName=="CRUDEOIL_MCX"){
            symbolName="CRUDEOIL23FEBFUT::MCX"
        }
        if(symbolName.includes("_")){
            symbolName=symbolName.replace("_","::")
        }

        if (_symbolInfoMap[symbolName] != undefined) {
            setTimeout(() => onResultReady(_symbolInfoMap[symbolName]));
            console.log("_symbolInfoMap[symbolName] 1: ",_symbolInfoMap," \nsymbolName : ",symbolName,_symbolInfoMap[symbolName])
            return Promise.resolve(_symbolInfoMap[symbolName])
        }
        var symbolItem;

        let symbols =await makeApiRequest(`https://api.zebull.in/rest/V2MobullService/chart/symbols?symbol=${symbolName}`, requestOptions);
        // logMessage(`"[resolveSymbol] symbols ===> ", ${symbolName}, ${symbols}, ${typeof symbols}`)
        console.log("[resolveSymbol] symbols  : ",symbols)
        symbolItem=symbols
        console.log("[symbolItem] : ",symbolItem ,typeof symbolItem,Object.keys(symbolItem).length === 0)
        if (Object.keys(symbolItem).length === 0) {
            logMessage(`'[resolveSymbol]: Cannot resolve symbol', ${symbolName}`);
            ErrorCallback('cannot resolve symbol');
            // return // Promise.reject('cannot resolve symbol');
        }
        var ticker;
       
        if(symbolItem['exchange-listed']=="NFO"){
            ticker=symbolItem.description+"::"+symbolItem['exchange-listed'];
        }
        else{
            ticker = symbolItem.name
            if(ticker.includes("::")){
                ticker = symbolItem.name.replace("::","_")
            }
            
        }
        const symbolInfo = {
            token:symbolItem.ticker,
            ticker: ticker,
            name: ticker,
            description: symbolItem.description,
            type: symbolItem.type,
            session: symbolItem.session,
            timezone: symbolItem.timezone,
            exchange: symbolItem["exchange-listed"],
            minmov: symbolItem.minmov,
            pricescale: symbolItem.pricescale,
            has_intraday: symbolItem.has_intraday,
            has_no_volume: symbolItem.has_no_volume,
            has_weekly_and_monthly: false,
            supported_resolutions: symbolItem.supported_resolutions,
            volume_precision: 1,
            data_status: 'streaming',
        };

        console.log('[resolveSymbol]: Symbol resolved',symbolInfo);
        _symbolInfoMap[symbolName]=symbolInfo
        console.log("_symbolInfoMap[symbolName] 2: ",_symbolInfoMap,_symbolInfoMap[symbolName])
        onSymbolResolvedCallback(symbolInfo);

    },
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        // periodParams.firstDataRequest = true;
        // const firstDataRequest = periodParams;
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        console.log('[getBars]: Method call ',symbolInfo);
        // const { from, to, firstDataRequest } = periodParams;
        // logMessage('[getBars]: Method call', symbolInfo, resolution, from, to);
        let data11 = await makeApiRequest(`https://besim.zebull.in/getAdvancedData?exchange=${symbolInfo['exchange']}&tokenID=${symbolInfo.token}&from=${periodParams.from - 31556926}&to=${periodParams.to + 86400}&res=${resolution}`, requestOptions);
        // let parsedData=JSON.parse(data11)
        console.log("[data11] : ",data11)
        let data = data11["response"].map(d => {
            return { time: parseFloat(d.dateandtime), open: d.open, high: d.high, low: d.low, close: d.close, volume: Number(d.volume.toFixed(2)) }
        });
        console.log("Data : ",data)
        try {
            if (data.Response && data.Response === 'Error' || data.length === 0) {
                // "noData" should be set if there is no data in the requested period.
                onHistoryCallback([], { noData: true });
                return;
            }
            let bars = [];
            data.forEach(bar => {
                // if (bar.time >= from && bar.time < to) {
                bars = [...bars, {
                    time: bar.time * 1000,
                    low: bar.low,
                    high: bar.high,
                    open: bar.open,
                    volume: bar.volume,
                    close: bar.close,
                }];
                // }
            });
            console.log(`[getBars]: returned bar(s)`,bars,bars.length);
            if (periodParams.firstDataRequest) {
                lastBarsCache.set(symbolInfo.name, {
                    ...bars[bars.length - 1],
                });
            }
            onHistoryCallback(bars, { noData: false });
        } catch (error) {
            logMessage(`'[getBars]: Get error', ${error}`);
            onErrorCallback(error);
        }
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        logMessage(`'[subscribeBars]: Method call with subscriberUID:', ${subscriberUID}`);
        subscribeOnStream(
            symbolInfo,
            resolution,
            onRealtimeCallback,
            subscriberUID,
            onResetCacheNeededCallback,
            lastBarsCache.get(symbolInfo.name),'bar'
        );
    },
    unsubscribeBars: (subscriberUID) => {
        logMessage(`'[unsubscribeBars]: Method call with subscriberUID:', ${subscriberUID}`);
        unsubscribeFromStream(subscriberUID);
    },
}


async function getAllSymbols(searchInput) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let searchString = JSON.stringify({
        "symbol": `${searchInput}`,
        "exchange": ["All", "NSE", "BSE", "CDS", "MCX", "NFO"]
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: searchString,
        redirect: 'follow'
    };
    const allSymbols = await makeApiRequest("https://zebull.in/rest/MobullService/exchange/getScripForSearch", requestOptions);
		
		let searchSymbols = allSymbols.filter(symbol => symbol)
			.map(value => {
				console.log(`[getAllSymbols] :: ${value.exchange_segment}`,value);
				if(value.exchange_segment == "bse_cm" || value.exchange_segment == "nse_cm"){
					var group = "stock";
					var stock = value.symbol.slice(0, -3) //+ "::" + value.exch;
				}
				else{
					var group = "index";
					var stock = value.instrument_name + "::" + value.exch
				}
				return {
					exchanges: [{ name:"All Exchanges",value: ""},{name:value.exch,value:value.exch}],
					symbols_types: [{ name:"All Types",value: ""},{name:"stock", value:"stock"},{name:"index",value:"index"}],
					symbol: value.symbol,
					// symbolType: group,
					full_name:value.symbol,
					description: value.instrument_name,
					exchange: value.exch,
					ticker: stock,
					type: group,
				};
});
return searchSymbols

}
