/* eslint-disable */
import { makeApiRequest, generateSymbol,parseFullSymbol } from './apiConnectionPool.js';
import { subscribeOnStream, unsubscribeFromStream } from './webSocketstream.js';

const lastBarsCache = new Map();


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

export default{
    onReady: (callback) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    },
    searchSymbols: async(userInput, exchange, symbolType, onResultReadyCallback) => {
        console.log('[searchSymbols]: Method call');
        const symbols = await getAllSymbols();
        const newSymbols = symbols.filter(symbol => {
        const isExchangeValid = exchange === '' || symbol.exchange === exchange;
        const isFullSymbolContainsInput = symbol.full_name
            .toLowerCase()
            .indexOf(userInput.toLowerCase()) !== -1;
        return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(newSymbols);
    },

    getQuotes(symbolName, onDataCallback, onErrorCallback) {
        var symbolInfos = {}
        symbolName.forEach(symbol => {
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


    resolveSymbol: async(symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
        console.log('[resolveSymbol]: Method call', symbolName);
         
        let symbols =[await makeApiRequest(`https://api.zebull.in/rest/V2MobullService/chart/symbols?symbol=${symbolName}`)];
        // const symbols = await getAllSymbols();
        console.log("symbols =======",symbols,typeof(symbols))
        const symbolItem = symbols.find(({ name }) => {
            console.log("name======== ",name,symbolName,name === symbolName)
            return name === symbolName
        
        });
        if (!symbolItem) {
            console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
            onResolveErrorCallback('cannot resolve symbol');
            return;
        }
        const symbolInfo = {
            ticker: symbolItem.name,
            name: symbolItem.name,
            description:symbolItem.description,
            type:symbolItem.type,
            session:symbolItem.session,
            timezone:symbolItem.timezone,
            exchange: symbolItem["exchange-listed"],
            minmov:symbolItem.minmov,
            pricescale:symbolItem.pricescale,
            has_intraday:symbolItem.has_intraday,
            has_no_volume:symbolItem.has_no_volume,
            has_weekly_and_monthly: false,
            supported_resolutions: symbolItem.supported_resolutions,
            volume_precision: 1,
            data_status: 'streaming',
        };

        console.log('[resolveSymbol]: Symbol resolved', symbolName);
        onSymbolResolvedCallback(symbolInfo);
   
    },
    getBars: async(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        periodParams.firstDataRequest = true;
		const firstDataRequest = periodParams;

        console.log('[getBars]: Method call', symbolInfo);
        // const { from, to, firstDataRequest } = periodParams;
        // console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
        let data11 = await makeApiRequest(`https://besim.zebull.in/getAdvancedData?exchange=${symbolInfo['exchange']}&tokenID=2885&from=${periodParams.from - 31556926}&to=${periodParams.to + 86400}&res=${resolution}`);
        // let parsedData=JSON.parse(data11)
        let data = data11["response"].map(d => {
            return { time: parseFloat(d.dateandtime), open: d.open, high: d.high, low: d.low, close: d.close, volume: Number(d.volume.toFixed(2)) }
            });
        try {
            // const data = await makeApiRequest(`data/histoday?${query}`);
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
                        volume:bar.volume,
                        close: bar.close,
                    }];
                // }
            });
            console.log(`[getBars]: returned ${bars.length} bar(s)`);
            if (firstDataRequest) {
				lastBarsCache.set(symbolInfo.name, {
					...bars[bars.length - 1],
				});
			}
            onHistoryCallback(bars, { noData: false });
        } catch (error) {
            console.log('[getBars]: Get error', error);
            onErrorCallback(error);
        }



    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
        subscribeOnStream(
            symbolInfo,
            resolution,
            onRealtimeCallback,
            subscriberUID,
            onResetCacheNeededCallback,
            lastBarsCache.get(symbolInfo.name)
        );
    },
    unsubscribeBars: (subscriberUID) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        unsubscribeFromStream(subscriberUID);
    },
}


async function getAllSymbols() {
    const data = await makeApiRequest('data/v3/all/exchanges');
    let allSymbols = [];
    
    for (const exchange of configurationData.exchanges) {
        const pairs = data.Data[exchange.value].pairs;
        
        for (const leftPairPart of Object.keys(pairs)) {
                // console.log("leftPairPart ",leftPairPart)
            const symbols = pairs[leftPairPart].map(rightPairPart => {
                const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
                return {
                    symbol: symbol.short,
                    full_name: symbol.full,
                    description: symbol.short,
                    exchange: exchange.value,
                    type: 'crypto',
                };
            });
            // console.log("before allSymbols ========== ",allSymbols)
            allSymbols = [...allSymbols, ...symbols];
            // console.log("after allSymbols ========== ",allSymbols)
        }
    }
    return allSymbols;
}


