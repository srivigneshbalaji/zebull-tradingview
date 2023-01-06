(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
    factory(global.Brokers = {}));
}(this, (function(exports) {
    'use strict';
    var userid = localStorage.getItem('userid');
    var usession = localStorage.getItem('usession');
    const holdingsPageColumns = [{
        label: 'Symbol',
        formatter: 'symbol',
        property: 'symbol'
    },
    {
        label: 'Exc',
        property: 'exc'
    },
    {
        label: 'Qty',
        property: 'qty'
    },
    {
        label: 'Buy Avg',
        property: 'price'
    },
    {
        label: 'LTP',
        property: 'cprice'
    },
    {
        label:'Profit',
        property:'profit'
    }
];
    const fundsPageColumns = [
        {
            label: 'Details',
            property: 'details'
        },
        {
            label: 'All',
            property: 'all'
    }];
    const ordersPageColumns = [{
        label: 'Symbol',
        formatter: 'symbol',
        property: 'symdata',
    }, {
        label: 'EXC',
        property: 'exc',
    }, {
        label: 'Time',
        property: 'updateTime',
    }, {
        label: 'Type',
        property: 'transType',
    }, {
        label: 'Product',
        property: 'product',
    }, {
        label: 'Qty',
        property: 'quantity',
    }, {
        label: 'LTP',
        alignment: 'right',
        property: 'last',
        formatter: 'formatPriceForexSup',
        highlightDiff: true,
    }, {
        label: 'Price',
        property: 'limitPrice',
        alignment: 'right',
    }, {
        label: 'Status',
        property: 'status',
        formatter: 'status',
        supportedStatusFilters: [0],
        alignment: 'right',
    }, {
        label: "ORDER ID",
        property: "id"
    }];
    const positionsPageColumns = [{
        label: 'Symbol',
        formatter: 'symbol',
        property: 'dispSym',
    }, {
        label: 'EXC',
        property: 'exc',
    }, {
        label: 'Type',
        property: 'pType',
    }, {
        label: 'Qty',
        property: 'pQty',
    }, {
        label: 'Buy Avg',
        property: 'bAvg',
        formatter: 'formatPrice',
    }, {
        label: 'Sell Avg',
        property: 'sAvg',
        formatter: 'formatPrice',
    }, {
        label: 'LTP',
        alignment: 'right',
        property: 'last',
        formatter: 'formatPriceForexSup',
        highlightDiff: true,
    }, {
        label: 'P/L',
        alignment: 'right',
        property: 'profit',
        formatter: 'profit',
    }, ];
    const liveBaseURL = "https://api.zebull.in/rest/V2MobullService/api";
    // const uatBaseURL = "https://ant-uat.aliceblueonline.com/rest/AliceBlueUATAPIService";
    function callApi(url, request) {
        let data = '';
        data = JSON.stringify(request.data);
        let requestMethod = "POST";
        if (request.method)
            requestMethod = request.method;
        const queryParams = window.queryParams;
        let session = usession;
        // queryParams.userId="ZVK0106";
        // queryParams.session="T1RIB25UabTq25FdExo2c5fiYSm6sLFe30GS47YyRMVCe73gNhZE2xj1lVmrxofyvGcoqjzoggk4VcGOfZa8sHZ250VgY49pjSoDslmnOjSZY7eHWDe8I1PY73CBlb7bminCbRxzZMMJq1JfGk3RSZzGqGyiSV5lbrea2ZIu1Zznpu5Vu3IUUou3f7C7cOsO2Ucsri2MNmTtxG4crkdkCSclDm55fqBngH5uuUxUX6UWnHlJyoCT4yvzaDy6tEAC";
        if (!session)
            session = localStorage.getItem("userSession");
        const param = {
            method: requestMethod,
            credentials: 'include',
            headers: {
                "Authorization": `Bearer ${userid} ${usession}`,
                "Content-Type": "application/json"
            }
        };
        if (requestMethod == "POST")
            param.body = data ? data : JSON.stringify({});
        const baseURL = liveBaseURL
        return promiseTimeout(fetch(baseURL + url, param).then(checkStatus).then(getBody).then(parseBody).then(parseJson).catch(function(apiError) {
            if (!apiError.infoID) {
                const error = new Error("");
                throw error;
            }
        }));
    }
    const checkStatus = (response)=>{
        if (response.status == 200) {
            return response;
        } else if (response.status != 200) {
            window.postMessageHandler({
                id: "apiError",
                data: {
                    error: response.status
                }
            });
            throw response;
        } else {
            const error = new Error("");
            throw error;
        }
    }
    ;
    const getBody = (response)=>{
        return response.text();
    }
    ;
    const parseBody = (response)=>{
        return JSON.parse(response);
    }
    ;
    const parseJson = (response)=>{
        return response;
    }
    ;
    const promiseTimeout = (promise)=>new Promise((resolve,reject)=>{
        const timeoutId = setTimeout(()=>{
            reject(new Error("Api Timeout"));
        }
        , (15 * 1000));
        promise.then((res)=>{
            clearTimeout(timeoutId);
            resolve(res);
        }
        , (err)=>{
            clearTimeout(timeoutId);
            reject(err);
        }
        );
    }
    );

    function formSymbolrequestFormat(e) {
        console.log("EEEEEEEEEEEEEEEEEEEE",e);
        const t = e.exchange || e.Exchange || e["exchange-traded"]
          , i = e.symbol || e.name || e.Tsym
          , n = e.token || e.Token || e.ticker || e.Ticker;
          console.log("FORMAT RETURN::",e.isSymbolSearch ? e.symbol : t && t.includes("::index") ? i.includes("::index") ? i : i + "::" + t : i + "::" + t + ":::" + t + ":::" + n)
        return e.isSymbolSearch ? e.symbol : t && t.includes("::index") ? i.includes("::index") ? i : i + "::" + t : i + "::" + t 
        // + ":::" + t + ":::" + n
    }

    function getTransactionType(type) {
        switch (type) {
        case 1:
            return "buy";
        case -1:
            return "sell";
        default:
            return "buy";
        }
    }
    const priceTypes = {
        1: "L",
        2: "MKT",
        3: "SL",
        4: "SL-M",
        "L": 1,
        "MKT": 2,
        "SL": 3,
        "SL-M": 4
    };
    const orderStatus = {
        cancelled: 1,
        complete: 2,
        Inactive: 3,
        Placing: 4,
        rejected: 5,
        open: 6,
        "after market order req received": 6,
        "modify after market order req received": 6,
        "trigger pending": 6,
        "cancelled after market order": 1
    };
    const channelToSubscription = new Map();
    class BrokerSample {
        constructor(host, quotesProvider) {
            this._accountManagerData = {
                title: 'Trading Sample',
                openBalance: 0,
                availMargin: 0,
                pl: 0
            };
            this._positionById = {};
            this._positions = [];
            this._orderById = {};
            this._orders = [];
            this._executions = [];
            this._idsCounter = 1;
            this._host = host;
            this._host.setButtonDropdownActions(this._buttonDropdownItems());
            const sellBuyButtonsVisibility = this._host.sellBuyButtonsVisibility();
            if (sellBuyButtonsVisibility !== null) {
                sellBuyButtonsVisibility.subscribe(()=>{
                    this._host.setButtonDropdownActions(this._buttonDropdownItems());
                }
                );
            }
            const domPanelVisibility = this._host.domPanelVisibility();
            if (domPanelVisibility) {
                domPanelVisibility.subscribe(()=>{
                    this._host.setButtonDropdownActions(this._buttonDropdownItems());
                }
                );
            }
            const orderPanelVisibility = this._host.orderPanelVisibility();
            if (orderPanelVisibility) {
                orderPanelVisibility.subscribe(()=>{
                    this._host.setButtonDropdownActions(this._buttonDropdownItems());
                }
                );
            }
            this._amChangeDelegate = this._host.factory.createDelegate();
            this._changeClosedPositionsDelegate = this._host.factory.createDelegate();
            this._changeHoldingssDelegate = this._host.factory.createDelegate();
            this._changeFundsDelegate = this._host.factory.createDelegate();
            this.ClosedPostionsList = this._host.factory.createWatchedValue([]);
            this._openingBalance = this._host.factory.createWatchedValue(this._accountManagerData.openBalance);
            this._availMargin = this._host.factory.createWatchedValue(this._accountManagerData.availMargin);
            this._amChangeDelegate.subscribe(null, (values)=>{
                this._openingBalance.setValue(values.openBalance);
                this._availMargin.setValue(values.availMargin);
            }
            );
            this._changeClosedPositionsDelegate.subscribe(null, (positionList)=>{
                const updatedClosedPostions = [];
                if (positionList && positionList.length) {
                    positionList.map((item)=>{
                        if (!item.qty)
                            updatedClosedPostions.push(item);
                    }
                    );
                }
                this.ClosedPostionsList.setValue(updatedClosedPostions);
            }
            );
            this.getRMSLimits();
            const regetOrderDetails = (data)=>{
                this.orders(data, true);
                this.positions(data, true);
                this.getRMSLimits();
            }
            ;
            window.regetOrderDetails = regetOrderDetails;
        }
        async getRMSLimits() {
            const getMarginData = ()=>{
                const request = {
                    data: {
                        userId: getUserId()
                    },
                    method:"GET"
                };
                const response = callApi("/limits/getRmsLimits", request);
                return Promise.resolve(response);
            }
            ;
            const marginData = await getMarginData();
            let values = marginData[0];
            if (!values)
                values = {};
            this._openingBalance.setValue(parseFloat(values.cashmarginavailable));
            this._availMargin.setValue(parseFloat(values.net));
            return Promise.resolve([]);
        }
        connectionStatus() {
            return 1;
        }
        chartContextMenuActions(context, options) {
            return this._host.defaultContextMenuActions(context);
        }
        isTradable(symbol) {
            return Promise.resolve(true);
        }
        async placeOrder(preOrder) {
            let currentOrder = null;
            const handler = (params)=>{
                if (preOrder.duration)
                    ;this._host.activateBottomWidget();
                const symbolInfo = {};
                const queryParams = window.queryParams;
                const orderData = {
                    "active_status": null,
                    "complexty": "regular",
                    "created_by": null,
                    "created_on": null,
                    "discqty": 0,
                    "emsg": null,
                    "exch": symbolInfo.exchange,
                    "id": null,
                    "instrument": symbolInfo.name,
                    "link": null,
                    "master_id": 0,
                    "pCode": "mis",
                    "prctyp": priceTypes[params.type || 2],
                    "price": params.limitPrice || params.stopPrice || params.seenPrice,
                    "qty": params.qty,
                    "reponse": null,
                    "ret": "DAY",
                    "salt": null,
                    "stat": null,
                    "stopLoss": 0,
                    "symbol_id": symbolInfo.ticker,
                    "target": 0,
                    "trading_symbol": symbolInfo.name,
                    "trailing_stop_loss": 0,
                    "transtype": getTransactionType(params.side || 1),
                    "trigPrice": 0,
                    "updated_by": null,
                    "updated_on": null,
                    "userId": queryParams.userId
                };
                const orderPrice = params.limitPrice || params.seenPrice;
                const order = {
                    id: `${this._idsCounter++}`,
                    duration: params.duration,
                    limitPrice: orderPrice,
                    profit: 0,
                    qty: params.qty,
                    side: params.side || 1,
                    status: 6,
                    stopPrice: params.stopPrice || 0.00,
                    symbol: params.symbol,
                    type: params.type || 2,
                    execution: params.customFields ? params.customFields['2410'] : '',
                    takeProfit: params.takeProfit,
                    stopLoss: params.stopLoss,
                };
                currentOrder = order;
                const request = {
                    data: [orderData]
                };
                const response = callApi("/placeOrder/executePlaceOrderWeb", request);
                return Promise.resolve(response);
            }
            ;
            const response = await handler(preOrder);
            if (response[0].stat == "Ok") {
                currentOrder.id = response[0].NOrdNo;
                this._updateOrder(currentOrder);
                this.orders();
            }
            return {};
        }
        modifyOrder(order) {
            console.log("MODIFY ORDER::", order, params)
            const handler = (params)=>{
                
                const originalOrder = this._orderById[params.id];
                if (originalOrder) {
                    const modifiedOrder = {
                        ...originalOrder
                    };
                    modifiedOrder.qty = params.qty;
                    modifiedOrder.stopPrice = params.stopPrice;
                    modifiedOrder.limitPrice = params.limitPrice;
                    modifiedOrder.execution = params.customFields ? params.customFields['2410'] : '';
                    this._updateOrder(modifiedOrder);
                }
                return Promise.resolve();
            }
            ;
            return handler(order);
        }
        editPositionBrackets(positionId, positionBrackets) {
            const handler = (id,brackets)=>{
                const position = this._positionById[id];
                if (position) {
                    const modifiedPosition = {
                        ...position
                    };
                    modifiedPosition.takeProfit = brackets.takeProfit || position.takeProfit || null;
                    modifiedPosition.stopLoss = brackets.stopLoss || position.stopLoss || null;
                    this._updatePosition(modifiedPosition);
                }
                return Promise.resolve();
            }
            ;
            return handler(positionId, positionBrackets);
        }
        async closePosition(positionId) {
            const position = this._positionById[positionId];
            const handler = ()=>{
                this.placeOrder({
                    symbol: position.symbol,
                    side: position.side === -1 ? 1 : -1,
                    type: 2,
                    qty: position.qty,
                });
            }
            ;
            await handler();
        }
        async orders(resultData=null, refresh=false) {
            const getOrderbookData = ()=>{
                const request = {
                    data: {
                        userId: getUserId()
                    },
                    method:"GET"
                };
                const response = callApi("/placeOrder/fetchOrderBook", request);
                return Promise.resolve(response);
            }
            ;
            const orderList = await getOrderbookData();
            if (orderList && orderList.length) {
                const chartUnderstoodOrderData = [];
                orderList.map((orderData)=>{
                    const requiredOrder = formatRequiredOrder(orderData);
                    this._subscribeData(orderData, (last)=>{
                        if (requiredOrder.last === last) {
                            return;
                        }
                        requiredOrder.last = last;
                        if (requiredOrder.price == null) {
                            requiredOrder.price = requiredOrder.last;
                        }
                        this._updateOrderLast(requiredOrder);
                    }
                    );
                    const hasOrderAlready = Boolean(this._orderById[requiredOrder.id]);
                    if (!hasOrderAlready) {
                        if (refresh)
                            this._updateOrder(requiredOrder);
                    } else {
                        if (refresh && resultData.non == requiredOrder.id)
                            this._updateOrder(requiredOrder);
                    }
                    this._orderById[requiredOrder.id] = requiredOrder;
                    const existOrderIndex = this._orders.findIndex(item=>item.id == requiredOrder.id);
                    if (existOrderIndex !== -1) {
                        this._orders.splice(existOrderIndex, 1);
                    }
                    this._orders.push(requiredOrder);
                    chartUnderstoodOrderData.push(requiredOrder);
                }
                );
                return Promise.resolve(chartUnderstoodOrderData);
            }
            return Promise.resolve([]);
        } 
        async holdings(){
            const holdingsData = ()=>{
                const request = {
                    data: {
                        clientCode: getUserId()
                    },
                    method:"GET"
                };
                const response = callApi("/positionAndHoldings/holdings",request);
                return Promise.resolve(response);
            }
            ;
            const tradeList1 = await holdingsData();
            const tradeList = tradeList1.HoldingVal;
            console.log("kjjjjjj)))))))))", tradeList)
            if (tradeList && tradeList.length) {
                const chartUnderstoodTradeData = [];
                tradeList.map((TradeData,index)=>{
                    const requiredTrade = formatTrade(TradeData);
                    console.log("kjbc---------",requiredTrade)
                    chartUnderstoodTradeData.push(requiredTrade);
                });
                this._changeHoldingssDelegate.fire(chartUnderstoodTradeData);
                return Promise.resolve(chartUnderstoodTradeData);
            }
            return Promise.resolve([]);
        }
        async funds(){
            const getMarginData = ()=>{
                const request = {
                    data: {
                        userId: getUserId()
                    },
                    method:"GET"
                };
                const response = callApi("/limits/getRmsLimits", request);
                return Promise.resolve(response);
            }
            const marginData = await getMarginData();
            let values = marginData[0];
            console.log("kjjjjjj)))))))))", values)
            const chartUnderstoodFundsData = [];
            if (values) {
                // tradeList.map((TradeData,index)=>{
                //     const requiredTrade = formatTrade(TradeData);
                //     console.log("kjbc---------",requiredTrade)
                //     chartUnderstoodFundsData.push(requiredTrade);
                // });
                var i = 1;
                for (const [key, value] of Object.entries(values)) {
                    // console.log(`${key}: ${value}`);
                    const v={
                        'id':i,
                        'details':key,
                        'all':value
                    }
                    chartUnderstoodFundsData.push(v);
                    i = i+1;
                  }
                this._changeFundsDelegate.fire(chartUnderstoodFundsData);
                return Promise.resolve(chartUnderstoodFundsData);
            }
            return Promise.resolve([]);
        }
        async positions(resultData=null, refresh=false) {
            const getPositionData = ()=>{
                const request = {
                    data: {
                        ret: "NET",
                    }
                };
                const response = callApi("/positionAndHoldings/positionBook", request);
                return Promise.resolve(response);
            }
            ;
            const positionList = await getPositionData();
            if (positionList && positionList.length) {
                const chartUnderstoodPositionData = [];
                positionList.map((positionData,index)=>{
                    positionData.pId = positionData.Token + "_position_" + index;
                    const requiredPosition = formatRequiredPosition(positionData);
                    const hasPositionAlready = Boolean(this._positionById[requiredPosition.id]);
                    if (hasPositionAlready) {
                        this._unsubscribeData(positionData);
                    }
                    if (requiredPosition.qty) {
                        this._subscribeData(positionData, (last)=>{
                            if (requiredPosition.last === last) {
                                return;
                            }
                            requiredPosition.last = last;
                            const qty = positionData.Exchange == 'CDS' ? requiredPosition.qty * 1000 : requiredPosition.qty;
                            requiredPosition.profit = (requiredPosition.last - requiredPosition.price) * qty * (requiredPosition.side === -1 ? -1 : 1);
                            this._host.plUpdate(requiredPosition.symbol, requiredPosition.profit);
                            this._host.positionPartialUpdate(requiredPosition.id, requiredPosition);
                        }
                        );
                    }
                    if (hasPositionAlready) {
                        const exitingPosData = this._positionById[requiredPosition.id];
                        if (exitingPosData.qty != requiredPosition.qty) {
                            this._updatePosition(requiredPosition);
                        }
                    } else {
                        if (refresh) {
                            this._updatePosition(requiredPosition);
                        }
                    }
                    if (!hasPositionAlready) {
                        this._positions.push(requiredPosition);
                        this._positionById[requiredPosition.id] = requiredPosition;
                    }
                    chartUnderstoodPositionData.push(requiredPosition);
                }
                );
                this._changeClosedPositionsDelegate.fire(chartUnderstoodPositionData);
                return Promise.resolve(chartUnderstoodPositionData);
            }
            return Promise.resolve([]);
        }
        executions(symbol) {
            return Promise.resolve(this._executions.filter((data)=>{
                return data.symbol === symbol;
            }
            ));
        }
        async reversePosition(positionId) {
            const position = this._positionById[positionId];
            const handler = ()=>{
                return this.placeOrder({
                    symbol: position.symbol,
                    side: position.side === -1 ? 1 : -1,
                    type: 2,
                    qty: position.qty * 2,
                });
            }
            ;
            await handler();
        }
        cancelOrder(orderId) {
            const order = this._orderById[orderId];
            const handler = ()=>{
                order.status = 1;
                this._updateOrder(order);
                return Promise.resolve();
            }
            ;
            return handler();
        }
        cancelOrders(symbol, side, ordersIds) {
            const closeHandler = ()=>{
                return Promise.all(ordersIds.map((orderId)=>{
                    return this.cancelOrder(orderId);
                }
                )).then(()=>{}
                );
            }
            ;
            return closeHandler();
        }
        possibleOrderStatuses() {
            return [1, 2, 5, 6, ];
        }
        accountManagerInfo() {
            const summaryProps = [{
                text: 'Opening Balance',
                wValue: this._openingBalance,
                formatter: 'fixed',
            }, {
                text: 'Available Margin',
                wValue: this._availMargin,
                formatter: 'fixed',
            }, ];
            return {
                accountTitle: 'Trading Sample',
                summary: summaryProps,
                orderColumns: ordersPageColumns,
                positionColumns: positionsPageColumns,
                possibleOrderStatuses: this.possibleOrderStatuses(),
                pages: [
                    {id:'Holdings',
                    title:'Holdings',
                    tables:[{
                        id:'HoldingsTable',
                    title:'',
                    columns:holdingsPageColumns,
                    getData: ()=>{
                        console.log("HOLDINGSSSSSSSSSSS",this.holdings())
                        return this.holdings()},
                    changeDelegate: this._changeHoldingssDelegate
                    }]
                    },
                    {id:'Funds',
                    title:'Funds',
                    tables:[{
                        id:'FundsTable',
                    title:'',
                    columns:fundsPageColumns,
                    getData: ()=>{
                        console.log("FUNDSSSSSSSSS",this.funds())
                        return this.funds()},
                    changeDelegate: this._changeFundsDelegate
                    }]
                    }
                ],
                contextMenuActions: (contextMenuEvent,activePageActions)=>{
                    return Promise.resolve(this._bottomContextMenuItems(activePageActions));
                }
                ,
            };
        }
        async symbolInfo(symbol) {
            const mintick = await this._host.getSymbolMinTick(symbol);
            const pipSize = mintick;
            const accountCurrencyRate = 1;
            const pointValue = 1;
            return {
                qty: {
                    min: 1,
                    max: 1e12,
                    step: 1,
                },
                pipValue: pipSize * pointValue * accountCurrencyRate || 1,
                pipSize: pipSize,
                minTick: mintick,
                description: '',
            };
        }
        currentAccount() {
            return '1';
        }
        async accountsMetainfo() {
            return [{
                id: '1',
                name: getUserId(),
            }, ];
        }
        _bottomContextMenuItems(activePageActions) {
            const separator = {
                separator: true
            };
            const sellBuyButtonsVisibility = this._host.sellBuyButtonsVisibility();
            if (activePageActions.length) {
                activePageActions.push(separator);
            }
            return activePageActions.concat([{
                text: 'Show Buy/Sell Buttons',
                action: ()=>{
                    if (sellBuyButtonsVisibility) {
                        sellBuyButtonsVisibility.setValue(!sellBuyButtonsVisibility.value());
                    }
                }
                ,
                checkable: true,
                checked: sellBuyButtonsVisibility !== null && sellBuyButtonsVisibility.value(),
            }, {
                text: 'Trading Settings...',
                action: ()=>{
                    this._host.showTradingProperties();
                }
                ,
            }, ]);
        }
        _buttonDropdownItems() {
            const defaultActions = this._host.defaultDropdownMenuActions();
            return defaultActions.concat([{
                text: 'Trading Settings...',
                action: ()=>{
                    this._host.showTradingProperties();
                }
                ,
            }, ]);
        }
        _updateOrderLast(order) {
            this._host.orderPartialUpdate(order.id, {
                last: order.last
            });
        }
        async _updateOrder(order) {
            this._host.orderUpdate(order);
        }
        _updatePosition(position) {
            this._host.positionUpdate(position);
        }
        _subscribeData(symbol, updateFunction) {
            const channelString = symbol.token || symbol.Token;
            const orderId = symbol.Nstordno || symbol.pId;
            let existSubscriptionItem = channelToSubscription.get(channelString);
            if (!existSubscriptionItem)
                existSubscriptionItem = {
                    id: orderId
                };
            const handler = {
                id: orderId,
                callback: updateFunction,
            };
            let handlers = null;
            if (existSubscriptionItem.handlers) {
                handlers = existSubscriptionItem.handlers;
                handlers.push(handler);
            } else {
                handlers = [handler];
            }
            existSubscriptionItem.handlers = handlers;
            channelToSubscription.set(channelString, existSubscriptionItem);
            if (window.subScribeWebsocket) {
                const symbolExchange = symbol.Exchange;
                const requiredExc = symbolExchange.split("::");
                const streamData = {
                    id: orderId,
                    value: requiredExc + "|" + channelString + "#"
                };
                window.subScribeWebsocket(streamData, undefined);
            }
        }
        _unsubscribeData(subsData) {
            const orderId = subsData.Nstordno || subsData.pId;
            channelToSubscription.forEach((value,channelString)=>{
                const subscriptionItem = channelToSubscription.get(channelString);
                if (subscriptionItem) {
                    const handlerIndex = subscriptionItem.handlers.findIndex((handler)=>handler.id === orderId);
                    if (handlerIndex !== -1) {
                        subscriptionItem.handlers.splice(handlerIndex, 1);
                        if (subscriptionItem.handlers.length === 0) {
                            channelToSubscription.delete(channelString);
                        }
                    }
                }
            }
            );
        }
    }
    function formatRequiredOrder(orderData) {
        var _a, _b, _c;
        var symdata=orderData.Trsym
        if (!orderData.symbol)
            orderData.symbol = orderData.Trsym;
        const order = {
            id: orderData.Nstordno,
            duration: orderData.Validity,
            limitPrice: orderData.Prc,
            profit: 0,
            qty: orderData.Qty,
            symdata:symdata,
            side: orderData.Trantype == "B" ? 1 : -1,
            status: orderStatus[orderData.Status],
            stopPrice: orderData.Trgprc,
            symbol: formSymbolrequestFormat(orderData),
            type: priceTypes[orderData.Prctype],
            transType: orderData.Trantype == "B" ? "BUY" : "SELL",
            execution: "",
            takeProfit: 0,
            stopLoss: 0,
            dispSym: orderData.Scripname.trim() || orderData.Trsym || orderData.Sym,
            updateTime: orderData.OrderedTime ? ((_a = orderData.OrderedTime.split(" ")[1]) !== null && _a !== void 0 ? _a : "--") : "--",
            instrument: (_b = orderData.formatScripName) !== null && _b !== void 0 ? _b : "--",
            product: orderData.Pcode + " / " + orderData.Prctype,
            quantity: orderData.Fillshares + " / " + orderData.Qty,
            exc: (_c = orderData.Exchange) !== null && _c !== void 0 ? _c : "--",
            orderParams: orderData,
        };
        return order;
    }
    function formatTrade(tradeData) {
        // console.log("TRADEEEE", tradeData)
        if (!tradeData.symbol)
            tradeData.symbol = tradeData.Nsetsym.slice(0,-3);
        const trade = {
            id: tradeData.Token1,
            profit: 0,
            qty: tradeData.Holdqty,
            side: 1,
            exc:tradeData.ExchSeg1,
            symbol: tradeData.Nsetsym.slice(0,-3),
            takeProfit: 0,
            stopLoss: 0,
            price:tradeData.Price,
            total:(tradeData.Holdqty*tradeData.Price).toFixed(2),
            date:1664706526000,
            orderParams: tradeData,
            cprice:tradeData.Ltp,
            profit:((tradeData.Holdqty*tradeData.Ltp)-(tradeData.Holdqty*tradeData.Price)).toFixed(2)
        };
        return trade;
    }
    function formatRequiredPosition(positionData) {
        var _a;
        if (!positionData.symbol)
            positionData.symbol = positionData.Tsym;
        const isBuy = Number(positionData.Netqty) >= 0;
        const avgPrice = isBuy ? Number(positionData.NetBuyavgprc) : Number(positionData.NetSellavgprc);
        const exc = positionData.Exchange;
        const bAvg = exc == "CDS" || exc == "BCD" ? (parseFloat(positionData.NetBuyavgprc).toFixed(4)) : (parseFloat(positionData.NetBuyavgprc).toFixed(2));
        const sAvg = exc == "CDS" || exc == "BCD" ? (parseFloat(positionData.NetSellavgprc).toFixed(4)) : (parseFloat(positionData.NetSellavgprc).toFixed(2));
        const pQty = Number(positionData.Netqty);
        const order = {
            id: positionData.Token,
            symbol: formSymbolrequestFormat(positionData),
            qty: pQty,
            side: isBuy ? 1 : -1,
            avgPrice: avgPrice,
            price: avgPrice,
            dispSym: positionData.companyname || positionData.Tsym || positionData.Symbol,
            exc: exc !== null && exc !== void 0 ? exc : "--",
            pType: (_a = positionData.Pcode) !== null && _a !== void 0 ? _a : "--",
            pQty: pQty,
            bAvg: bAvg,
            sAvg: sAvg,
            positionParams: positionData
        };
        return order;
    }
    function getUserId() {
        const queryParams = localStorage.getItem('userid');
        return queryParams;
    }
    function formatStreamingDataListToQuotes(data) {
        if (data) {
            const streamTickerList = Object.keys(data);
            streamTickerList.map((streamTick)=>{
                const subscriptionItem = channelToSubscription.get(streamTick);
                if (subscriptionItem === undefined) {
                    return;
                }
                const requiredSymData = data[streamTick];
                if (requiredSymData && requiredSymData.lp) {
                    subscriptionItem.handlers.forEach((handler)=>{
                        handler.callback(Number(requiredSymData.lp));
                    }
                    );
                }
            }
            );
        }
    }
    window.getUserId = getUserId;
    window.formatStreamingDataListToQuotes = formatStreamingDataListToQuotes;
    exports.BrokerSample = BrokerSample;
    Object.defineProperty(exports, '__esModule', {
        value: true
    });
}
)));
