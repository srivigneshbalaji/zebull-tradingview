// Make requests to CryptoCompare API
var watchlistapi = "https://api.zebull.in/rest/V2MobullService/marketWatch/fetchMWScrips"
export async function makeApiRequest(path, requestOptions) {
    try {
        const response = await fetch(path, requestOptions);
        return response.json();
    } catch (error) {
        throw new Error(`zebull symbols request error: ${error.status}`);
    }
}

export async function fetchfromZebullAPI(path, requestOptions) {

    try {
        const response = await fetch(path, requestOptions);
        return response.json();
    } catch (error) {
        throw new Error(`zebull fetch request error: ${error.status}`);
    }
}

export async function getWatchlist(watchlistID) {
    let dataArr = []
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer ZP00231 ImSHVX5p34O308oscki7F7chJhWN7LZnAKKqrySWWjhAfDMdAs9tEF9VLmWu0qeW8WyryT3L0NBBQgMJ0S5pSm7zcPROb8UyMGf5f4Rbfa12XcuCHUKWdFtAc8M2IXLc1IMolFBGJLtyf28qo9UDSE9FRiqcXg2jnxighvnBeHzNpYvQaKxBKJWnGA88VGBoBmPVcW5im6YmcfNZ61Rlkh6LcmDTU5c68nWAo9ByPH5IAXC8snQhEIcmUoomcVmx")
    let watchlistName = JSON.stringify({
        "mwName": watchlistID,
        "userId": "ZP00231"
    });
    var requestOptions = {
        method: 'POST',
        redirect: 'follow',
        headers: myHeaders,
        body: watchlistName
    };

    fetchfromZebullAPI(watchlistapi, requestOptions).then(function (response) {
        if (response.stat == "Ok" && response.values[0] !== "No Market Watch") {
            // console.log("[MarketWatch] getQuotes response :: ", response.values)
            for (let scripts in response.values) {
                // console.log("DATA of Watchlist !!!!!!!!!!!!!!",parseFloat(response.values[scripts].ltp),typeof(parseFloat(response.values[scripts].ltp)))
                let script = response.values[scripts]
                // subsymbols.push(result[i]['n'])
                let quote = {
                    s: 'ok',
                    n: script.symbolname,
                    v: {
                        ch: script.open,
                        chp: script.Change,
                        short_name: script.symbolname,
                        exchange: script.Exchange,
                        description: script.companyname,
                        lp: parseFloat(script.ltp),
                        ask: script.BestBuyPrice,
                        ask_qty: script.BestBuySize,
                        bid: script.BestSellPrice,
                        bid_qty: script.BestSellSize,
                        open_price: script.open,
                        high_price: script.high,
                        low_price: script.low,
                        prev_close_price: script.close,
                        volume: parseInt(script.TradeVolume)
                    }
                }
                dataArr.push(quote)
                // data += response[i]['v']['exchange'] + '|' + response[i]['token'] + '#'
            }
        }
    })

    return dataArr

}