
var userid = localStorage.getItem('userid');
var usession = localStorage.getItem('usession');

var watchlistapi = "https://api.zebull.in/rest/V2MobullService/api/marketWatch/fetchMWScrips"

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
        let resp=response.json();
        return resp
    } catch (error) {
        throw new Error(`zebull fetch request error: ${error.status}`);
    }
}

export async function getWatchlistdata(watchlistID) {
    var dataArr = []
   
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userid} ${usession}`)
    let watchlistName = JSON.stringify({
        "mwName": watchlistID
    });
    var requestOptions = {
        method: 'POST',
        redirect: 'follow',
        headers: myHeaders,
        body: watchlistName
    };

    var response=await fetchfromZebullAPI(watchlistapi, requestOptions)
    // .then((response)=> {
        if (response.stat == "Ok" && response.values[0] !== "No Market Watch") {
            
            for (let scripts in response.values) {
                let script = response.values[scripts]
                if(script.TradSym.includes("-EQ")){
                    script.TradSym = script.TradSym.replace("-EQ","")
                }
               
                var quote = {
                    s: 'ok',
                    n: `${script.TradSym}_${script.Exchange}`,
                    v: {
                        ch: script.open,
                        chp: script.Change,
                        short_name: script.TradSym,
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
            }
        }
    // })
            console.log("[watchlist] dataArr :: ",dataArr)
    return dataArr

}



export async function getScripQuoteDetails(){
    // let url="https://api.zebull.in/rest/V2MobullService/ScripDetails/getScripQuoteDetails"


}

