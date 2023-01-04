// import {
//     BrokerApiInstance
// } from '../chart-brokerapi/broker'
// import {
//     DataFeedInstance
// } from '../chart-datafeed/udf-compatible-datafeed'
export class ChartWatchlists {
    constructor(watchlistObj) {
        this._watchlists = {}
        this._watchlistObj = watchlistObj
        // this._broker = "BrokerApiInstance"
        // this._feed = "DataFeedInstance"
    }

    updateWatchlist(listId) {
        if (this._watchlists[listId].readonly) {
            window.alert("Changes made to default watchlist will not be stored to server")
            return
        }
        console.error(listId)
        var list = this._watchlistObj.getAllLists()[listId]
        console.error(list)
        console.log("UPDATE --------- :; ",list)
        this._watchlists[listId].symbols = list
        // this._feed.getTokensFromSymbol(list.symbols).then((result) => {
        //     return result.map((symbol) => {
        //         return {
        //             scripToken: parseInt(symbol.token),
        //             marketSegmentId: parseInt(symbol.market_segment_id),
        //         }
        //     })

        // }).then((payload_symbols) => {
            // if (this._watchlists[listId].id == undefined) {
            //     this._broker.createWatchlist({
            //         watchlistName: list.title,
            //         stocksOrder: payload_symbols
            //     })
            // } else {
            //     this._broker.updateWatchlist(this._watchlists[listId].id, {
            //         watchlistName: list.title,
            //         stocksOrder: payload_symbols
            //     })
            // }
            // console.log("(payload_symbols", payload_symbols)
        // })

    }
    addWatchlist(watchlist) {
        // for (let i in watchlist){ 
        console.log("@@@ [watchlist] @@@@  ", this._watchlistObj) //,watchlist[0]
        // }
        watchlist.forEach(element => {
            var list = this._watchlistObj.createList(element.n)
            console.log("LIST ;;;;;;;;;",list)
            this._watchlists[list.id] = element
            if (element.wlPosition == 0) {
                this._watchlistObj.setActiveList(list.id)
            }
        });

       
    }

    // renameWatchlist(listId, oldName, newName) {
    //     var list = this._watchlistObj.getList(listId)
    //     this._watchlists[listId].symbols = list
    //     if (this._watchlists[listId].readonly) {
    //         window.alert("Changes made to default watchlist will not be stored to server")
    //         return
    //     }
    //     var payload_symbols = list.map((symbol) => {
    //         var aa = this._feed._symbolToTokenMap[symbol]
    //         return {
    //             scripToken: parseInt(aa[1]),
    //             marketSegmentId: parseInt(aa[0]),
    //         }
    //     })
    //     this._watchlists[listId].name = newName
    //     this._broker.updateWatchlist(this._watchlists[listId].id, {
    //         watchlistName: newName,
    //         stocksOrder: payload_symbols
    //     })
    // }

    // deleteWatchlist(listId) {
    //     if (this._watchlists[listId].readonly) {
    //         window.alert("Changes made to default watchlist will not be stored to server")
    //         return
    //     }
    //     this._broker.deleteWatchlist(this._watchlists[listId].id)
    //     delete this._watchlists[listId]
    // }

    // createWatchlist(listId, symbols, name) {
    //     console.log("[createWatchlist] symbols name :: ",symbols,name)
    //     var list = this._watchlistObj.getAllLists()[listId]
    //     this._watchlists[listId] = {}
    //     var watchlistObj = this._watchlistObj
    //     var watchlists = this._watchlists
    //     var feed = this._feed
    //     var broker = this._broker
    //     var interval = setInterval(function() {
    //         if (watchlistObj.getAllLists()[listId] != undefined) {
    //             if (watchlists[listId] == undefined || Object.keys(watchlists[listId]).length == 0) {
    //                 var list = watchlistObj.getAllLists()[listId]
    //                 watchlists[listId] = {
    //                     symbols: []
    //                 }
    //                 var payload_symbols = list.symbols.map((symbol) => {
    //                     var aa = feed._symbolToTokenMap[symbol]
    //                     return {
    //                         scripToken: parseInt(aa[1]),
    //                         marketSegmentId: parseInt(aa[0]),
    //                     }
    //                 })
    //                 broker.createWatchlist({
    //                     watchlistName: list.title,
    //                     stocksOrder: payload_symbols
    //                 }).then((response) => {
    //                     watchlists[listId].id = response.response.ID
    //                 })

    //             }
    //             clearInterval(interval)
    //         }
    //     }, 200)
    // }

}