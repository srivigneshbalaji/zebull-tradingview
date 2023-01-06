/* eslint-disable */
import { makeApiRequest, getWatchlistdata } from './apiConnectionPool.js';
import { subscribeOnStream, unsubscribeFromStream } from './webSocketstream.js';
import {getMWValues} from './marketWatchList.js';

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

export default {
    onReady: (callback) => {
        console.log("START==>>>>>>>> [onReady] @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ")
        // console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    },
    searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
        console.log('[searchSymbols]: Method call');
        const symbols = await getAllSymbols(userInput);
        // const newSymbols = symbols.filter(symbol => {
        //     const isExchangeValid = exchange === '' || symbol.exchange === exchange;
        //     const isFullSymbolContainsInput = symbol.full_name
        //         .toLowerCase()
        //         .indexOf(userInput.toLowerCase()) !== -1;
        //     return isExchangeValid && isFullSymbolContainsInput;
        // });
        console.log("[search symbols] :: ",symbols)
        onResultReadyCallback(symbols);
    },

    async getQuotes(symbols, onDataCallback, onErrorCallback) {

        
        console.log("[getQuotes] symbols ::: ",symbols)
        var a = await getMWValues();
        for(let i in a.values){
        getWatchlistdata(a.values[i]).then(function(dataArr) {
        console.log("[getQuotes] watchlistapi dataArr :: ", dataArr)
        onDataCallback(dataArr)
        onErrorCallback((error) => {console.log("error  ::  ",error)})
        })  
    }
    },

    subscribeQuotes: async(symbols, fastSymbols, onRealtimeCallback, listenerGUID) => {
		// listenerGUID;
		// symbols=subsymbols;
		// fastSymbols=subsymbols;
		// console.log("Output DATA:::::", dataArrOutput,subsymbols);
		// if (dataArrOutput!=undefined){
		// 	onRealtimeCallback(dataArrOutput);
		// }
	},
    unsubscribeQuotes: async(listenerGUID) => {
		// listenerGUID
	},

    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
        console.log('[resolveSymbol]: Method call', symbolName);
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        if(symbolName.includes(":::NFO")){
            const myArray = symbolName.split(":::");
            symbolName = myArray[0];
        }
        else{
            symbolName=symbolName+"::NSE";
            console.log("SYMBOL NAME:::::", symbolName)
        }
        var symbolItem;

        let symbols = [await makeApiRequest(`https://api.zebull.in/rest/V2MobullService/chart/symbols?symbol=${symbolName}`, requestOptions)];
        // const symbols = await getAllSymbols();
        console.log("RESOLVE REQUEST URL::",`https://api.zebull.in/rest/V2MobullService/chart/symbols?symbol=${symbolName}`)
        console.log("[resolveSymbol] symbols ===> ", symbolName, symbols, typeof (symbols),symbols[0]['exchange-listed'])
        if(symbols[0]['exchange-listed']=='NFO'){
            symbolItem = symbols.find(({ description }) => {
                console.log("[resolveSymbol] symbolItem find match name ====> ", description, symbolName.split("::")[0], description === symbolName.split("::")[0])
                return description === symbolName.split("::")[0]
            });
        }
        else{
            symbolItem = symbols.find(({ name }) => {
                console.log("[resolveSymbol] symbolItem find match name ====> ", name.split("::")[0], symbolName.split("::")[0], name.split("::")[0] === symbolName.split("::")[0])
                return name.split("::")[0] === symbolName.split("::")[0]
            });
    }
        if (!symbolItem) {
            console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
            onResolveErrorCallback('cannot resolve symbol');
            return;
        }
        var ticker;
        if(symbolItem['exchange-listed']=="NFO"){
            ticker=symbolItem.description+"::"+symbolItem['exchange-listed'];
        }
        else{
            ticker = symbolItem.name
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

        console.log('[resolveSymbol]: Symbol resolved', symbolInfo);
        onSymbolResolvedCallback(symbolInfo);

    },
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        periodParams.firstDataRequest = true;
        const firstDataRequest = periodParams;
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        console.log('[getBars]: Method call', symbolInfo);
        // const { from, to, firstDataRequest } = periodParams;
        // console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
        let data11 = await makeApiRequest(`https://besim.zebull.in/getAdvancedData?exchange=${symbolInfo['exchange']}&tokenID=${symbolInfo.token}&from=${periodParams.from - 31556926}&to=${periodParams.to + 86400}&res=${resolution}`, requestOptions);
        // let parsedData=JSON.parse(data11)
        let data = data11["response"].map(d => {
            return { time: parseFloat(d.dateandtime), open: d.open, high: d.high, low: d.low, close: d.close, volume: Number(d.volume.toFixed(2)) }
        });
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
    // console.log("[getAllSymbols] fetch data response :: ",allSymbols)
    // return allSymbols;

  
		// console.log('[searchSymbols]: Method call');
		
		let searchSymbols = allSymbols.filter(symbol => symbol)
			.map(value => {
				console.log(value.exchange_segment);
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
					full_name: value.instrument_name,
					description: value.instrument_name,
					exchange: value.exch,
					ticker: stock,
					type: group,
				};
});
return searchSymbols

}
