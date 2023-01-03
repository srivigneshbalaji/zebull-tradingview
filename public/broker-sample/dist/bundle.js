(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
    factory(global.Brokers = {}));
}(this, (function(exports) {
    'use strict';
    const holdingsPageColumns = [{
        label: 'Symbol',
        formatter: 'symbol',
        property: 'dispSym'
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
    const ordersPageColumns = [{
        label: 'Symbol',
        formatter: 'symbol',
        property: 'dispSym',
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
        let session = "XSR1aibK2gVWrjCUidhRp0U5SZ96LbOYxaUtnR3RJIGfHIZ2Gq0tpB13O1zMR1VgGAdAn1IYUooHrTMOcvkInUilf8gj4I63V6r9T9ySnQU8CUdtQAuEhJry5LS4hBFK7X2zPWushC0TQE0e2quUXzis5nIQ0SHUqAECcgL7KqAJXTpF4HzxaNFJKKYW5QnQPTNHlBLqRrM5MO0sxcZlW6mAlk9xyjKqJMNcmuk4ZRvu3ndu8Dbr49DVo0vcGuqi";
        // queryParams.userId="ZVK0106";
        // queryParams.session="T1RIB25UabTq25FdExo2c5fiYSm6sLFe30GS47YyRMVCe73gNhZE2xj1lVmrxofyvGcoqjzoggk4VcGOfZa8sHZ250VgY49pjSoDslmnOjSZY7eHWDe8I1PY73CBlb7bminCbRxzZMMJq1JfGk3RSZzGqGyiSV5lbrea2ZIu1Zznpu5Vu3IUUou3f7C7cOsO2Ucsri2MNmTtxG4crkdkCSclDm55fqBngH5uuUxUX6UWnHlJyoCT4yvzaDy6tEAC";
        if (!session)
            session = localStorage.getItem("userSession");
        const param = {
            method: requestMethod,
            credentials: 'include',
            headers: {
                "Authorization": "Bearer ZVK0106 XSR1aibK2gVWrjCUidhRp0U5SZ96LbOYxaUtnR3RJIGfHIZ2Gq0tpB13O1zMR1VgGAdAn1IYUooHrTMOcvkInUilf8gj4I63V6r9T9ySnQU8CUdtQAuEhJry5LS4hBFK7X2zPWushC0TQE0e2quUXzis5nIQ0SHUqAECcgL7KqAJXTpF4HzxaNFJKKYW5QnQPTNHlBLqRrM5MO0sxcZlW6mAlk9xyjKqJMNcmuk4ZRvu3ndu8Dbr49DVo0vcGuqi",
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
        const t = e.exchange || e.Exchange || e["exchange-traded"]
          , i = e.symbol || e.name || e.Tsym
          , n = e.token || e.Token || e.ticker || e.Ticker;
        return e.isSymbolSearch ? e.symbol : t && t.includes("::index") ? i.includes("::index") ? i : i + "::" + t : i + "::" + t + ":::" + t + ":::" + n
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
            title:'HoldingsTable',
            columns:holdingsPageColumns,
            getData: ()=>{
                return this.holdings()},
            changeDelegate: this._changeHoldingssDelegate
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
        if (!orderData.symbol)
            orderData.symbol = orderData.Trsym;
        const order = {
            id: orderData.Nstordno,
            duration: orderData.Validity,
            limitPrice: orderData.Prc,
            profit: 0,
            qty: orderData.Qty,
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
            tradeData.symbol = tradeData.Nsetsym;
        const trade = {
            id: tradeData.Token1,
            profit: 0,
            qty: tradeData.Holdqty,
            side: 1,
            exc:tradeData.ExchSeg1,
            symbol: tradeData.Nsetsym,
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
        const queryParams = window.queryParams;
        return "ZVK0106";
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
    var hold=[
        {
            "WCqty": "0",
            "BSEHOldingValue": "0.00",
            "hsflag": "Y",
            "Series1": "G",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "101.00",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "669GOI2024",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "100",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "10.00",
            "Scripcode": "800445",
            "LTPValuation": "0",
            "NSEHOldingValue": "10100.00",
            "Ysxtsym": "0",
            "Ltp": "101.00",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "669GS2024-GS",
            "CUqty": "0",
            "Token2": "800445",
            "Token1": "9962",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "100",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "101.00",
            "Series": "GS",
            "Colqty": "100",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "0.00",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "IN0020220052",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "40398.00",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "3372.62",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "ASTRAZEN",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "12",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "506820",
            "LTPValuation": "0",
            "NSEHOldingValue": "40137.00",
            "Ysxtsym": "0",
            "Ltp": "3366.50",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "ASTRAZEN-EQ",
            "CUqty": "0",
            "Token2": "506820",
            "Token1": "5610",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "12",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "3344.75",
            "Series": "EQ",
            "Colqty": "12",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "3366.50",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE203A01020",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "41423.80",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "902.30",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "AXISBANK",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "44",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "16.00",
            "Scripcode": "532215",
            "LTPValuation": "0",
            "NSEHOldingValue": "41430.40",
            "Ysxtsym": "0",
            "Ltp": "941.45",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "AXISBANK-EQ",
            "CUqty": "0",
            "Token2": "532215",
            "Token1": "5900",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "44",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "941.60",
            "Series": "EQ",
            "Colqty": "44",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "941.45",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE238A01034",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "39909.60",
            "hsflag": "Y",
            "Series1": "B",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "428.72",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "BECTORFOOD",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "92",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "543253",
            "LTPValuation": "0",
            "NSEHOldingValue": "39840.60",
            "Ysxtsym": "0",
            "Ltp": "433.80",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "BECTORFOOD-EQ",
            "CUqty": "0",
            "Token2": "543253",
            "Token1": "1628",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "92",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "433.05",
            "Series": "EQ",
            "Colqty": "92",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "433.80",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE495P01012",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "38675.00",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "1583.22",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "BESTAGRO",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "25",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "26.00",
            "Scripcode": "539660",
            "LTPValuation": "0",
            "NSEHOldingValue": "38423.75",
            "Ysxtsym": "0",
            "Ltp": "1547.00",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "BESTAGRO-EQ",
            "CUqty": "0",
            "Token2": "539660",
            "Token1": "2306",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "25",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "1536.95",
            "Series": "EQ",
            "Colqty": "25",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "1547.00",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE052T01013",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "38471.95",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "328.18",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "CMSINFO",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "121",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "543441",
            "LTPValuation": "0",
            "NSEHOldingValue": "38465.90",
            "Ysxtsym": "0",
            "Ltp": "317.95",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "CMSINFO-EQ",
            "CUqty": "0",
            "Token2": "543441",
            "Token1": "7603",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "121",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "317.90",
            "Series": "EQ",
            "Colqty": "121",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "317.95",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE925R01014",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "41713.75",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "122.91",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "DCBBANK",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "325",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "532772",
            "LTPValuation": "0",
            "NSEHOldingValue": "41730.00",
            "Ysxtsym": "0",
            "Ltp": "128.35",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "DCBBANK-EQ",
            "CUqty": "0",
            "Token2": "532772",
            "Token1": "13725",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "325",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "128.40",
            "Series": "EQ",
            "Colqty": "325",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "128.35",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE503A01015",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "39850.00",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "80.85",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "ENGINERSIN",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "500",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "532178",
            "LTPValuation": "0",
            "NSEHOldingValue": "39900.00",
            "Ysxtsym": "0",
            "Ltp": "79.70",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "ENGINERSIN-EQ",
            "CUqty": "0",
            "Token2": "532178",
            "Token1": "4907",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "500",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "79.80",
            "Series": "EQ",
            "Colqty": "500",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "79.70",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE510A01028",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "39875.00",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "182.40",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "EXIDEIND",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "220",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "500086",
            "LTPValuation": "0",
            "NSEHOldingValue": "39908.00",
            "Ysxtsym": "0",
            "Ltp": "181.25",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "EXIDEIND-EQ",
            "CUqty": "0",
            "Token2": "500086",
            "Token1": "676",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "220",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "181.40",
            "Series": "EQ",
            "Colqty": "220",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "181.25",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE302A01020",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "38582.25",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "379.50",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "GOKEX",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "105",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "26.00",
            "Scripcode": "532630",
            "LTPValuation": "0",
            "NSEHOldingValue": "38697.75",
            "Ysxtsym": "0",
            "Ltp": "367.45",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "GOKEX-EQ",
            "CUqty": "0",
            "Token2": "532630",
            "Token1": "11778",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "105",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "368.55",
            "Series": "EQ",
            "Colqty": "105",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "367.45",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE887G01027",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "45990.00",
            "hsflag": "Y",
            "Series1": "B",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "4359.66",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "ICRA",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "9",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "532835",
            "LTPValuation": "0",
            "NSEHOldingValue": "46396.35",
            "Ysxtsym": "0",
            "Ltp": "5110.00",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "ICRA-EQ",
            "CUqty": "0",
            "Token2": "532835",
            "Token1": "14523",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "9",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "5155.15",
            "Series": "EQ",
            "Colqty": "9",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "5110.00",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE725G01011",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "39327.20",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "457.50",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "MAXHEALTH",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "88",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "543220",
            "LTPValuation": "0",
            "NSEHOldingValue": "39388.80",
            "Ysxtsym": "0",
            "Ltp": "446.90",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "MAXHEALTH-EQ",
            "CUqty": "0",
            "Token2": "543220",
            "Token1": "22377",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "88",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "447.60",
            "Series": "EQ",
            "Colqty": "88",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "446.90",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE027H01010",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "38994.80",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "764.99",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "NH",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "52",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "539551",
            "LTPValuation": "0",
            "NSEHOldingValue": "38940.20",
            "Ysxtsym": "0",
            "Ltp": "749.90",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "NH-EQ",
            "CUqty": "0",
            "Token2": "539551",
            "Token1": "11840",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "52",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "748.85",
            "Series": "EQ",
            "Colqty": "52",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "749.90",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE410P01011",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "40251.00",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "4086.40",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "PERSISTENT",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "10",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "533179",
            "LTPValuation": "0",
            "NSEHOldingValue": "40279.50",
            "Ysxtsym": "0",
            "Ltp": "4025.10",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "PERSISTENT-EQ",
            "CUqty": "0",
            "Token2": "533179",
            "Token1": "18365",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "10",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "4027.95",
            "Series": "EQ",
            "Colqty": "10",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "4025.10",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE262H01013",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "40215.75",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "185.18",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "REDINGTON",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "215",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "22.00",
            "Scripcode": "532805",
            "LTPValuation": "0",
            "NSEHOldingValue": "40355.50",
            "Ysxtsym": "0",
            "Ltp": "187.05",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "REDINGTON-EQ",
            "CUqty": "0",
            "Token2": "532805",
            "Token1": "14255",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "215",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "187.70",
            "Series": "EQ",
            "Colqty": "215",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "187.05",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE891D01026",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "41943.00",
            "hsflag": "Y",
            "Series1": "B",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "117.70",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "SAKSOFT",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "341",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "27.00",
            "Scripcode": "590051",
            "LTPValuation": "0",
            "NSEHOldingValue": "41908.90",
            "Ysxtsym": "0",
            "Ltp": "123.00",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "SAKSOFT-EQ",
            "CUqty": "0",
            "Token2": "590051",
            "Token1": "11794",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "341",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "122.90",
            "Series": "EQ",
            "Colqty": "341",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "123.00",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE667G01023",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "52400.00",
            "hsflag": "Y",
            "Series1": "G",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "5147.00",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "SGBAUG30",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "10",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "10.00",
            "Scripcode": "800488",
            "LTPValuation": "0",
            "NSEHOldingValue": "52208.80",
            "Ysxtsym": "0",
            "Ltp": "5240.00",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "SGBAUG30-GB",
            "CUqty": "0",
            "Token2": "800488",
            "Token1": "11192",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "10",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "5220.88",
            "Series": "GB",
            "Colqty": "10",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "5240.00",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "IN0020220078",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "52300.00",
            "hsflag": "Y",
            "Series1": "G",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "5165.00",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "SGBJUNE30",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "10",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "10.00",
            "Scripcode": "800443",
            "LTPValuation": "0",
            "NSEHOldingValue": "51799.80",
            "Ysxtsym": "0",
            "Ltp": "5230.00",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "SGBJUN30-GB",
            "CUqty": "0",
            "Token2": "800443",
            "Token1": "10232",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "10",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "5179.98",
            "Series": "GB",
            "Colqty": "10",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "5230.00",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "IN0020220045",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "47127.40",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "1379.80",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "SHRIRAMFIN",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "34",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "511218",
            "LTPValuation": "0",
            "NSEHOldingValue": "47117.20",
            "Ysxtsym": "0",
            "Ltp": "1386.10",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "SHRIRAMFIN-EQ",
            "CUqty": "0",
            "Token2": "511218",
            "Token1": "4306",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "34",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "1385.80",
            "Series": "EQ",
            "Colqty": "34",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "1386.10",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE721A01013",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "38794.20",
            "hsflag": "Y",
            "Series1": "B",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "700.00",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "SIRCA",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "57",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "23.00",
            "Scripcode": "543686",
            "LTPValuation": "0",
            "NSEHOldingValue": "38603.25",
            "Ysxtsym": "0",
            "Ltp": "680.60",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "SIRCA-EQ",
            "CUqty": "0",
            "Token2": "543686",
            "Token1": "11050",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "57",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "677.25",
            "Series": "EQ",
            "Colqty": "57",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "680.60",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE792Z01011",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "39128.25",
            "hsflag": "Y",
            "Series1": "B",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "1140.50",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "STYLAMIND",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "35",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "526951",
            "LTPValuation": "0",
            "NSEHOldingValue": "39338.25",
            "Ysxtsym": "0",
            "Ltp": "1117.95",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "STYLAMIND-EQ",
            "CUqty": "0",
            "Token2": "526951",
            "Token1": "5186",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "35",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "1123.95",
            "Series": "EQ",
            "Colqty": "35",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "1117.95",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE239C01020",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "40140.80",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "5650.00",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "SUNCLAYLTD",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "8",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "520056",
            "LTPValuation": "0",
            "NSEHOldingValue": "40168.00",
            "Ysxtsym": "0",
            "Ltp": "5017.60",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "SUNCLAYLTD-EQ",
            "CUqty": "0",
            "Token2": "520056",
            "Token1": "29008",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "8",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "5021.00",
            "Series": "EQ",
            "Colqty": "8",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "5017.60",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE105A01035",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "36994.80",
            "hsflag": "Y",
            "Series1": "B",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "1642.27",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "TCPLPACK",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "24",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "100.00",
            "Scripcode": "523301",
            "LTPValuation": "0",
            "NSEHOldingValue": "36868.80",
            "Ysxtsym": "0",
            "Ltp": "1541.45",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "TCPLPACK-EQ",
            "CUqty": "0",
            "Token2": "523301",
            "Token1": "184",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "24",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "1536.20",
            "Series": "EQ",
            "Colqty": "24",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "1541.45",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE822C01015",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "34437.90",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "284.85",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "TRITURBINE",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "138",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "23.00",
            "Scripcode": "533655",
            "LTPValuation": "0",
            "NSEHOldingValue": "34437.90",
            "Ysxtsym": "0",
            "Ltp": "249.55",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "TRITURBINE-EQ",
            "CUqty": "0",
            "Token2": "533655",
            "Token1": "25584",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "138",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "249.55",
            "Series": "EQ",
            "Colqty": "138",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "249.55",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE152M01016",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "38506.50",
            "hsflag": "Y",
            "Series1": "A",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "30.20",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "UJJIVANSFB",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "1290",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "22.00",
            "Scripcode": "542904",
            "LTPValuation": "0",
            "NSEHOldingValue": "38571.00",
            "Ysxtsym": "0",
            "Ltp": "29.85",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "UJJIVANSFB-EQ",
            "CUqty": "0",
            "Token2": "542904",
            "Token1": "15228",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "1290",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "29.90",
            "Series": "EQ",
            "Colqty": "1290",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "29.85",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE551W01018",
            "Tprod": "MIS"
        },
        {
            "WCqty": "0",
            "BSEHOldingValue": "35559.70",
            "hsflag": "Y",
            "Series1": "B",
            "HUqty": "0",
            "YSXHOldingValue": "0.00",
            "CSEHOldingValue": "0.00",
            "Ttrind": "N",
            "DaysMTM": "0",
            "csflag": "Y",
            "WHqty": "0",
            "Pcode": "CNC",
            "Price": "1736.77",
            "Exch4": "0",
            "BuyQty": "0",
            "Bsetsym": "VESUVIUS",
            "Exch5": "0",
            "LTcse": "0.00",
            "MCXHOldingValue": "0.00",
            "Holdqty": "22",
            "Exch1": "nse_cm",
            "Exch2": "bse_cm",
            "Exch3": "0",
            "LTysx": "0.00",
            "Haircut": "20.00",
            "Scripcode": "520113",
            "LTPValuation": "0",
            "NSEHOldingValue": "35558.60",
            "Ysxtsym": "0",
            "Ltp": "1616.35",
            "Coltype": "LT",
            "Btst": "0",
            "LTmcxsxcm": "0.00",
            "Usedqty": "0",
            "Token5": "0",
            "Nsetsym": "VESUVIUS-EQ",
            "CUqty": "0",
            "Token2": "520113",
            "Token1": "3676",
            "Token4": "0",
            "Token3": "0",
            "SellableQty": "22",
            "Mcxsxcmsym": "0",
            "Csetsym": "0",
            "LTnse": "1616.30",
            "Series": "EQ",
            "Colqty": "22",
            "ExchSeg5": null,
            "ExchSeg2": "BSE",
            "ExchSeg1": "NSE",
            "LTbse": "1616.35",
            "ExchSeg4": null,
            "ExchSeg3": null,
            "isin": "INE386A01015",
            "Tprod": "MIS"
        }
    ]
    
    
    
}
)));
