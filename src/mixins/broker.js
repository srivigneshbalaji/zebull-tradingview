

export let BrokerApiInstance = null;
export class BrokerApi {
    constructor(host, quotesProvider, odinUrl, authToken, odinApiKey, inHouseUrl, userProfile) {
        this._accountManagerData = {
            title: 'ZEBU',
            overallPl: 0,
            equityPl: 0,
            todayPl: 0
        };
        this._positionById = {};
        this._basketLid = {};
        this._positions = [];
        this._holdings = [];
        this._trades = []
        this._nseFundsDetails = [];
        this._mcxFundsDetails = [];
        this._orderById = {};
        this._tradeById = {};
        this._orderTrades = {};
        this._orders = [];
        this._executions = [];
        this._idsCounter = 1;
        this._authToken = authToken
        this._headers = {
            "Authorization": "Bearer " + authToken,
            "x-api-key": odinApiKey,
            "content-type": "application/json"
        }
        this._inhouseHeaders = {
            "Authorization": "Bearer " + authToken
        }
        this._quotesProvider = quotesProvider;
        this._host = host;
        this._odinUrl = odinUrl
        this._inHouseUrl = inHouseUrl
        this._watchlists = []
        this._host.setButtonDropdownActions(this._buttonDropdownItems());
        this._accountsMetaInfo = []
        this._preferences = {}
        this._userProfile = userProfile
        this._shouldFetchGTDOrders = false
        const sellBuyButtonsVisibility = this._host.sellBuyButtonsVisibility();
        if (sellBuyButtonsVisibility !== null) {
            sellBuyButtonsVisibility.subscribe(() => {
                this._host.setButtonDropdownActions(this._buttonDropdownItems());
            });
        }
        const domPanelVisibility = this._host.domPanelVisibility();
        if (domPanelVisibility) {
            domPanelVisibility.subscribe(() => {
                this._host.setButtonDropdownActions(this._buttonDropdownItems());
            });
        }
        const orderPanelVisibility = this._host.orderPanelVisibility();
        if (orderPanelVisibility) {
            orderPanelVisibility.subscribe(() => {
                this._host.setButtonDropdownActions(this._buttonDropdownItems());
            });
        }
        this._amChangeDelegate = this._host.factory.createDelegate();
        this._holdingsPriceChangeDelegate = this._host.factory.createDelegate();
        this._fundsChangeDelegate = this._host.factory.createDelegate();
        this._mcxfundsChangeDelegate = this._host.factory.createDelegate();

        this._tradesChangeDelegate = this._host.factory.createDelegate();
        this._positionChangeDelegate = this._host.factory.createDelegate();
        this._closedPositionChangeDelegate = this._host.factory.createDelegate();
        this._overallPlValue = this._host.factory.createWatchedValue(this._accountManagerData.overallPl);
        this._todayPlValue = this._host.factory.createWatchedValue(this._accountManagerData.todayPl);
        this._equityPlValue = this._host.factory.createWatchedValue(this._accountManagerData.equityPl);
        this._amChangeDelegate.subscribe(null, (values) => {
            this._overallPlValue.setValue(values.overallPl);
            this._equityPlValue.setValue(values.equityPl);
            this._todayPlValue.setValue(values.todayPl);
        });
        // _getPositions(); 
        this._gettingAccountsMetaInfo = this._getAccountsMetaInfo()
        this.init()
        BrokerApiInstance = this
    }

    init() {
        try {
            this._getOrders().then((_) => {
                this._getTrades().then((_) => {
                    this._trades.forEach((trade) => {
                        if (this._orderTrades.hasOwnProperty(trade.orderNumber)) {
                            this._orderTrades[trade.orderNumber].push(trade.id)
                        } else {
                            this._orderTrades[trade.orderNumber] = [trade.id]
                        }
                    })
                    this._orders.forEach((order, index) => {
                        if (this._orderTrades.hasOwnProperty(order.id)) {
                            var total_value = 0.0
                            var total_quantity = 0
                            this._orderTrades[order.id].forEach((trade_id) => {
                                var trade = this._tradeById[trade_id]
                                var price = parseFloat(trade.tradedPrice) || 0.00
                                var qty = parseInt(trade.tradedQty)
                                total_value += price * qty
                                total_quantity += qty
                            })
                            order.tradedPrice = total_value / total_quantity
                            this._orders[index] = order
                        }
                    })
                })
            })
            this._getWatchlists()
            this._getHoldings()
            this._getPreferences()
            this.q = Queue({
                results: []
            })
            this.q.concurrency = 1
            this.q.autostart = true
            this.q.timeout = 1000
            this.q.on('timeout', function(next, job) {
                logMessage(`Queue: Job Timeout: ${job.toString().replace(/\n/g, '')}`)
                next()
            })
            this.q.start()
            this.omsFeed = new Omsfeed(this._host, this, this.q, this._authToken)
        } catch (error) {
            console.log("I am erroring")
            console.log("broker error" + error, error.stack)
        }

    }
    connectionStatus() {
        return 1 /* Connected */ ;
    }
    socket_disconnect() {
        this.omsFeed.disconnectSocket()
    }
    socket_initialize() {
        this.omsFeed.setupSocket()
    }
    isTradable(symbol) {
        return this._quotesProvider.resolveSymbol(symbol, () => {}, () => {}).then((symbolInfo) => {
            if (symbolInfo.isTradable != undefined) {
                if (!symbolInfo.isTradable) {
                    return Promise.resolve(false)
                } else {
                    return Promise.resolve(true)
                }
            } else {
                return Promise.resolve(true)
            }
        }).catch((error) => {
            return Promise.resolve(true);
        })

    }
    watchlists() {
        return this._getWatchlists()
    }

    updateWatchlist(listId, payload) {
        return this._inhouseRequest(this._inHouseUrl, 'watchlist/stocks/' + listId, payload, undefined, 'PUT').then((res) => Promise.resolve(res))
    }

    deleteWatchlist(listId) {
        return this._inhouseRequest(this._inHouseUrl, 'watchlist/' + listId, undefined, undefined, 'DELETE').then((res) => Promise.resolve(res))
    }

    createWatchlist(payload) {
        return this._inhouseRequest(this._inHouseUrl, 'watchlist/stocks', payload, undefined, 'POST').then((res) => Promise.resolve(res))
    }

    subscribeFcmByToken(token) {
        return this._inhouseRequest(this._inHouseUrl, 'callback/registerFcm', {
            web_fcm_token: token
        }, undefined, 'POST').then((res) => Promise.resolve(res))
    }
    unSubscribeFcmByToken(token) {
        return this._inhouseRequest(this._inHouseUrl, 'callback/deRegisterFcm', {
            web_fcm_token: token
        }, undefined, 'POST').then((res) => Promise.resolve(res))
    }

    getRequiredMargin(preOrder) {
        const handler = (params) => {

            return this._quotesProvider.getTokensFromSymbol([params.symbol]).then((response) => {
                    return response[0]
                }).then((symbolData) => {
                    return this._odinRequest(this._odinUrl, 'transactional/v1/getOrderMarginInfo', {
                        "FETraceId": "",
                        "LegDetails": [{
                            "LegNo": 1,
                            "BuyOrSell": (params.side == 1 ? 1 : 2),
                            "MarketSegment": _marketSegmentId(symbolData.market_segment_id),
                            "Quantity": parseInt(params.qty),
                            "MktFlag": parseInt(params.market),
                            "OldPrice": parseFloat(params.oldPrice) * parseFloat(params.priceScale),
                            "OldQuantity": parseInt(params.oldQty),
                            "Price": parseFloat(params.limitPrice) * parseFloat(params.priceScale),
                            "ProductType": (params.margin.toString() == '1' ? "M" : (params.margin.toString() == '2' ? 'MF' : 'D')),
                            "Token": parseInt(symbolData.token.toString())
                        }],
                        "Mode": params.mode,
                        "NoOfLegs": 1
                    }, "POST")
                }).then((response) => Promise.resolve(response))
                .catch((e) => {})
        }
        return handler(preOrder)
    }

    // symbol: data_symbol as string,
    // 		side: side,
    // 		order_type: order_type,
    // 		qty: Number(qtyInput.value),
    // 		validity: Number(validityTypeSelect.getAttribute('validity') as string),
    // 		margin: margin,
    // 		limitPrice: Number(priceInput.value), 
    // 		triggerPrice: sl_input.value
    openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank')
        // https://odin.asthatrade.com/NetNet/EDISGatewayResponse.aspx
        if (newWindow) newWindow.opener = null
        var aa = setInterval(() => {
            if (newWindow.closed) {
                clearInterval(aa)
            }
        }, 1000)
    }
    async checkEdis(params, token, odin_exchange) {
        if (params.validity == 3 && this._userProfile.others.POA.toString() != "0" && params.side.toString() == "-1") {
            return {
                need_edis: false,
                allowed: false,
                message: "To place Sell GTD orders, please complete Power of Attorney(POA)"
            }
        }
        if (this._userProfile.others.POA.toString() != "0" && params.side.toString() == "-1" && odin_exchange == "NSE_EQ" && params.margin.toString() != '1') {
            return await this._odinRequest(this._odinUrl, 'transactional/v1/getDPDetailsEDIS', undefined, "GET").then((res) => {
                this._dpClientId = res.data.nBeneficiaryAccountNumber
                this._dpId = res.data.sDPId
            }).then(() => {
                return this._odinRequest(this._odinUrl, "transactional/v1/getEDISSummary/" + this._userProfile.others.userCode + "/" + params.qty.toString() + "/1/" + token.toString() + "/NSDL/1/" + (params.margin.toString() == "2" ? "MF" : "D"))
            }).then((res) => {
                if (res.data.ResponseStatus == true) {
                    return {
                        need_edis: true,
                        allowed: true,
                        res: res
                    }
                } else {
                    if (res.data.DPDetail.QuantityToHold == 0) {
                        return {
                            need_edis: false,
                            allowed: true
                        }
                    } else {
                        return {
                            need_edis: false,
                            allowed: false,
                            message: "Unsettled quantity is not allowed to sell"
                        }
                    }

                }
            })
        } else {
            return {
                need_edis: false,
                allowed: true
            }
        }
    }

    setOrderProperties(params) {
        if (params.margin == undefined) {
            params.margin = '1'
        }
        if (params.order_type == undefined) {
            if (params.type == 1) {
                params.order_type = '1'
            } else {
                params.order_type = '2'
            }
        }
        return params
    }

    getBrokerage(order) {
        const payload = {
            exchange: _marketSegmentId(order.market_segment_id),
            tradeType: (order.margin.toString() === '1' ? "INTRADAY" : (order.margin.toString() === '2' ? 'MTF' : 'DELIVERY')),
            instrumentType: ((order.odin_option_type == "CE" || order.odin_option_type == "PE") ? "OPTIONS" : (order.symbol.substr(order.symbol.length - 3) == "FUT" ? "FUTURES" : "")),
            buySell: (order.side == 1 ? "BUY" : "SELL"),
            symbol: order.odin_symbol,
            price: (order.lot_size) * (order.market_type == 1 ? parseFloat(order.limitPrice) : order.ltp),
            quantity: parseInt(order.qty)
        }
        return this._inhouseRequest(this._inHouseUrl, 'orderMargin', payload, "", "POST")
    }

    placeOrder(preOrder, listenerId = '') {
        const handler = (params) => {
            this._host.activateBottomWidget();
            params = this.setOrderProperties(params)

            this.q.push(function(cb) {
                logMessage(`Broker: Place order started`)
                BrokerApiInstance._quotesProvider.resolveSymbol(params.symbol, (symbolInfo) => {
                    BrokerApiInstance.checkEdis(params, symbolInfo.odin_token, symbolInfo.odin_exchange).then((res) => {
                        if (res.need_edis && res.allowed) {
                            var object = {
                                userCode: BrokerApiInstance._userProfile.others.userCode,
                                managerIP: "odin.asthatrade.com",
                                sessionID: BrokerApiInstance._userProfile.others.ocToken,
                                channel: "WEB",
                                isin: symbolInfo.isin,
                                isinName: symbolInfo.odin_security_description,
                                exchangeCd: "NSE",
                                ProductType: (params.margin.toString() == "2" ? "MF" : "D"),
                                product: 1,
                                instrument: "Equity",
                                quantity: res.res.data.DPDetail.QuantityToHold,
                                dpId: BrokerApiInstance._dpId,
                                clientId: BrokerApiInstance._dpClientId,
                                depository: "NSDL",
                                productcode: "MOBILEAPI",
                                userId: BrokerApiInstance._userProfile.user_id,
                                groupId: BrokerApiInstance._userProfile.others.groupId,
                                settlmtCycle: (res.nSettlementType == 1 ? "T1" : "T2"),
                                amo: 'N'
                            }
                            var str = new URLSearchParams(object).toString()
                            // BrokerApiInstance.openInNewTab("https://odin.asthatrade.com/NetNet/EDISGatewayRequest.aspx?enct="+base64url(str))
                            BrokerApiInstance.openInNewTab("https://odin.asthatrade.com/NetNet/EDISGatewayRequest.aspx?enct=" + Buffer.from(str).toString('base64'))
                            cb()
                            return Promise.resolve("Done")
                        } else if (res.allowed) {
                            const handler = (params) => {

                                BrokerApiInstance._host.activateBottomWidget();
                                const order = {
                                    "scrip_info": {
                                        "exchange": symbolInfo.odin_exchange,
                                        "scrip_token": symbolInfo.odin_token.toString(),
                                        "symbol": symbolInfo.odin_symbol,
                                        "series": symbolInfo.odin_series,
                                        "expiry_date": symbolInfo.odin_expiry_date,
                                        "strike_price": symbolInfo.odin_strike_price,
                                        "option_type": symbolInfo.odin_option_type
                                    },

                                    "transaction_type": (params.side.toString() === '1' ? "BUY" : "SELL"),
                                    "product_type": (params.margin.toString() === '1' ? "INTRADAY" : (params.margin.toString() === '2' ? 'MTF' : 'DELIVERY')),
                                    "order_type": (params.order_type.toString() === '2' ? "RL-MKT" : (params.order_type.toString() === '1' ? 'RL' : (params.order_type.toString() === '3' ? 'SL' : 'SL-MKT'))),
                                    "quantity": (symbolInfo.odin_exchange === "NSE_FO" ? parseInt(params.qty) * parseInt(symbolInfo.odin_lot_size) : params.qty),
                                    "price": parseFloat(params.limitPrice || params.seenPrice || 0),
                                    "trigger_price": parseFloat(params.triggerPrice || 0),
                                    "disclosed_quantity": 0,
                                    "validity": (params.validity ? .toString() === '2' ? "IOC" : (params.validity ? .toString() === "3" ? "GTD" : "DAY")),
                                    "validity_days": (params.validity ? .toString() === "3" ? 360 : 0),
                                    "is_amo": params.is_amo,
                                    "order_identifier": (params.validity ? .toString() === "3" ? "GTD " : ""),
                                    "listenerId": listenerId
                                }
                                BrokerApiInstance.updateOrder(order, "new", cb)
                                logMessage(`Broker: Place order after transformation: ${JSON.stringify(order)}`)
                                return Promise.resolve("Done")
                            };

                            return handler(preOrder);
                        } else if (!res.allowed) {
                            BrokerApiInstance._host.showNotification("Order not allowed", res.message, 0)
                            cb()
                        }
                    })
                }, undefined, undefined)
            })

            return Promise.resolve("Done")
        };
        return handler(preOrder);
    }

    modifyOrder(order) {
        const handler = (params) => {
            this.q.push(function(cb) {
                return BrokerApiInstance._quotesProvider.resolveSymbol(params.symbol, (symbolInfo) => {
                    var edis_params = params
                    var aa = BrokerApiInstance._orderById[order.order_id]
                    edis_params.margin = (aa.product.toUpperCase().toUpperCase() == "DELIVERY" ? '3' : (aa.product.toUpperCase().toUpperCase() == "MTF" ? '2' : '1'))
                    return BrokerApiInstance.checkEdis(edis_params, symbolInfo.odin_token, symbolInfo.odin_exchange).then((res) => {
                        if (res.need_edis) {
                            var object = {
                                userCode: BrokerApiInstance._userProfile.others.userCode,
                                managerIP: "odin.asthatrade.com",
                                sessionID: BrokerApiInstance._userProfile.others.ocToken,
                                channel: "MOB",
                                isin: symbolInfo.isin,
                                isinName: symbolInfo.odin_security_description,
                                exchangeCd: "NSE",
                                ProductType: (aa.product.toString().toUpperCase() == "DELIVERY" ? "D" : "MF"),
                                product: 1,
                                instrument: "Equity",
                                quantity: res.res.data.DPDetail.QuantityToHold,
                                dpId: BrokerApiInstance._dpId,
                                clientId: BrokerApiInstance._dpClientId,
                                depository: "NSDL",
                                productcode: "ODINAERO",
                                userId: BrokerApiInstance._userProfile.user_id,
                                groupId: BrokerApiInstance._userProfile.others.groupId,
                                amo: 'N'
                            }
                            var str = new URLSearchParams(object).toString()
                            BrokerApiInstance.openInNewTab("https://odin.asthatrade.com/NetNet/EDISGatewayRequest.aspx?enct=" + Buffer.from(str).toString('base64'))
                            return Promise.resolve("Done")
                        } else {
                            const order = {
                                "order_type": (params.order_type.toString() == '2' ? "RL-MKT" : (params.order_type.toString() == '1' ? 'RL' : (params.order_type.toString() == '3' ? 'SL' : 'SL-MKT'))),
                                "quantity": (symbolInfo.odin_exchange === "NSE_FO" ? parseInt(params.qty) * parseInt(symbolInfo.odin_lot_size) : params.qty),
                                "price": parseFloat(params.limitPrice || 0),
                                "trigger_price": (params.triggerPrice || 0),
                                "validity": (params.validity ? .toString() == "2" ? "IOC" : params.validity ? .toString() == "3" ? "GTD" : "DAY"),
                                "validity_days": aa.validity_days,
                                "disclosed_quantity": 0,
                                "traded_quantity": (aa.traded_quantity == null ? 0 : (symbolInfo.odin_exchange === "NSE_FO" ? parseInt(aa.traded_quantity) * parseInt(symbolInfo.odin_lot_size) : aa.traded_quantity)),
                                "order_id": params.order_id,
                                "market_segment_id": symbolInfo.odin_market_segment_id
                            }
                            return BrokerApiInstance.updateOrder(order, "modify", cb);
                            // return Promise.resolve("Done")
                        }
                    })
                }, undefined, undefined)
            })


        };
        handler(order)
        return Promise.resolve("Done");
    }
    editPositionBrackets(positionId, positionBrackets) {
        const handler = (id, brackets) => {
            const position = this._positionById[id];
            if (position) {
                const modifiedPosition = Object.assign({}, position);
                modifiedPosition.takeProfit = (brackets && brackets.takeProfit) || (position && position.takeProfit) || null;
                modifiedPosition.stopLoss = (brackets && brackets.stopLoss) || (position && position.stopLoss) || null;
                this._updatePosition(modifiedPosition);
            }
            return Promise.resolve();
        };
        return handler(positionId, positionBrackets);
    }
    closePosition(positionId, qty) {
        const position = this._positionById[positionId];
        var product = positionId.split("|")[1]
        var margin = ""
        if (product == "INTRADAY") {
            margin = '1'
        } else if (product == "DELIVERY") {
            margin = '3'
        } else {
            margin = '2'
        }
        const handler = (position, margin) => {
            window.dataLayer.push({
                event: 'tv-closed-position'
            })
            return this.placeOrder({
                symbol: position.symbol,
                side: position.side === -1 /* Sell */ ? 1 /* Buy */ : -1 /* Sell */ ,
                order_type: '2' /* Market */ ,
                qty: qty || position.qty,
                margin: margin
            });
        };
        return handler(position, margin);
    }
    orders() {
        return Promise.resolve(this._getOrders());
    }
    positions() {
        return Promise.resolve(this._getPositions());
        // return Promise.resolve(this._positions.slice());
    }

    chartContextMenuActions(e, t) {
        var aa = []
        aa.push({
            text: "Create New Buy Order ..",
            checkable: false,
            checked: false,
            symbolInfo: this.symbolInfo(e.symbol),
            checkedStateSource: (function(_) {}),
            action: (function(_) {
                BuySellWIndowInstance.ShowOrderDialog({
                    symbol: e.symbol,
                    limitPrice: e.formattedValue,
                    side: 1
                }, () => {})
                // CustomDialogs.showOrderDialog(window.customOrderDialog, {
                //     symbol: e.symbol, 
                //     limitPrice: e.formattedValue,
                //     side: 1
                // })
                // const root = ReactDOM.unstable_createRoot(
                //     document.body
                // );

                // ReactDOM.render(<ChartBuySell order={{symbol: e.symbol, 
                //     limitPrice: e.formattedValue,
                //     side: 1
                // }}/>, document.body)
                // CreateOrderDialogContext({
                //     symbol: e.symbol, 
                //     limitPrice: e.formattedValue,
                //     side: 1
                // })
                // <ChartBuySell order={{symbol: e.symbol, limitPrice: e.formattedValue, side: 1 }} display={true} />
            }),
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.9792 16.6205C19.7396 16.8955 19.3241 16.9285 19.044 16.6948L14.3924 12.8117L14.072 12.5442L13.7516 12.8117L9.10009 16.6947C8.82008 16.9285 8.40456 16.8955 8.16495 16.6205C7.92467 16.3447 7.94981 15.9272 8.22144 15.6822L14.0721 10.4057L19.9227 15.6822C20.1943 15.9272 20.2195 16.3447 19.9792 16.6205ZM18.4032 17.4624C19.1009 18.0448 20.1362 17.9626 20.7332 17.2774C21.3318 16.5902 21.2692 15.55 20.5924 14.9396L14.407 9.36109L14.0721 9.05908L13.7373 9.36109L7.55171 14.9396C6.87492 15.55 6.81229 16.5902 7.41096 17.2774C8.00796 17.9626 9.04326 18.0448 9.74094 17.4624L14.072 13.8468L18.4032 17.4624Z"></path></svg>'
        }, {
            text: "Create New Sell Order ..",
            checkable: false,
            checked: false,
            symbolInfo: this.symbolInfo(e.symbol),
            checkedStateSource: (function(_) {}),
            action: (function(_) {
                BuySellWIndowInstance.ShowOrderDialog({
                    symbol: e.symbol,
                    limitPrice: e.formattedValue,
                    side: -1
                })
            }),
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.9792 12.2892C19.7396 12.0142 19.3241 11.9812 19.044 12.2149L14.3924 16.098L14.072 16.3655L13.7516 16.098L9.10009 12.2149C8.82008 11.9812 8.40456 12.0142 8.16495 12.2892C7.92467 12.565 7.94981 12.9825 8.22144 13.2275L14.0721 18.504L19.9227 13.2275C20.1943 12.9825 20.2195 12.565 19.9792 12.2892ZM18.4032 11.4472C19.1009 10.8648 20.1362 10.9471 20.7332 11.6323C21.3318 12.3195 21.2692 13.3597 20.5924 13.9701L14.407 19.5486L14.0721 19.8506L13.7373 19.5486L7.55171 13.9701C6.87492 13.3597 6.81229 12.3195 7.41096 11.6323C8.00796 10.9471 9.04326 10.8648 9.74094 11.4473L14.072 15.0628L18.4032 11.4472Z"></path></svg>'
        })

        return Promise.resolve(aa)
    }

    //     * `text` : String
    // * `checkable` : Boolean. Set it to true if you need a checkbox.
    // * `checked` : Boolean. Value of the checkbox.
    // * `checkedStateSource`: function. Getter is executed to get current checkbox value.
    // * `enabled`: Boolean
    // * `action`: function. Action is executed when user clicks the item. It has 1 argument - value of the checkbox if exists.
    executions(symbol) {
        return Promise.resolve(this._executions
            .filter((data) => {
                return data.symbol === symbol;
            }));
    }
    async addExecutionWithoutRefresh(execution) {
        return this._quotesProvider.tokenInfo({
            market_segment_id: execution.exchange,
            token: execution.token
        }).then((symbol) => {
            execution.exchange = _marketSegmentId(execution.exchange)
            execution.symbol = symbol.symbol
            this._executions.push(execution)
            this._tradeById[execution.id] = execution
            this._trades.push(execution)
            this._host.executionUpdate(execution)


            this._tradesChangeDelegate.fire(execution)
            return Promise.resolve()
        })
    }
    async addExecution(execution) {
        this._quotesProvider.tokenInfo({
            market_segment_id: execution.market_segment_id,
            token: execution.token
        }).then((symbol) => {
            execution.symbol = symbol.symbol
            this._executions.push(execution)
            this._tradeById[execution.id] = execution
            this._trades.push(execution)
            this._host.executionUpdate(execution)


            this._tradesChangeDelegate.fire(execution)
            return Promise.resolve()
        }).then((_) => {
            return this._refreshPositions()
        }).then(() => {
            return this._refreshOrders()
        }).then((pos) => {
            return Promise.resolve(pos)
        }).catch((e) => {
            Promise.reject(e)
        })

    }

    async _refreshOrders() {
        this._orders = [];
        this._orderById = {}
        await this._getOrders()
        for (const order of this._orders) {
            this._host.orderUpdate(order)
            let lid_index = this._basketLid[order.id]
            if (lid_index !== undefined && lid_index !== "") {
                order.listenerId = lid_index
                OrderOMSFeedSub.NotifyOrder({
                    order: order
                })
            }
        }
        Promise.resolve(this._orders);
    }
    async _refreshPositions() {
        await sleep(2000)
        this._positions = [];
        this._positionById = {}
        Promise.resolve(this._getPositions());
    }

    removeOrderLids(lids) {
        var new_map = this._basketLid
        Object.keys(new_map).forEach(function(key, index) {
            if (lids.includes(new_map[key])) {
                new_map[key] = undefined
            }
        })
        this._basketLid = new_map
    }

    reversePosition(positionId) {
        const position = this._positionById[positionId];
        if (position.product.toUpperCase() == "MTF" || position.product.toUpperCase() == "DELIVERY") {
            return Promise.reject("Cannot reverse DELIVERY or MTF positions")
        }
        const handler = () => {
            window.dataLayer.push({
                event: 'tv-reversed-position'
            })
            return this.placeOrder({
                symbol: position.symbol,
                side: position.side === -1 /* Sell */ ? 1 /* Buy */ : -1 /* Sell */ ,
                type: 2 /* Market */ ,
                qty: position.qty * 2,
                margin: '1',
                order_type: '2',
                validity: "2"

            });
        };
        return handler();
    }
    cancelOrder(orderId) {
        const order = this._orderById[orderId];
        const handler = async () => {
            this.q.push(function(cb) {
                order.status = 1 /* Canceled */ ;
                var url
                if (order.validity == "GTD") {
                    url = 'transactional/v1/orders/regular/' + order.exchange + '/' + order.id + '?validity=GTD&validity_days=' + order.validity_days.toString()
                } else {
                    url = 'transactional/v1/orders/regular/' + order.exchange + '/' + order.id
                }
                return BrokerApiInstance._odinRequest(BrokerApiInstance._odinUrl, url, undefined, 'DELETE').then((response) => {
                        return response
                    }).then(() => {
                        order.status = 1
                        BrokerApiInstance.updateOrder(order, "cancel");
                        cb()
                        return Promise.resolve("Order Cancelled")
                    })
                    .catch((e) => Promise.reject(e))
            })

        };
        return handler();
    }
    cancelOrders(symbol, side, ordersIds) {
        const closeHandler = () => {
            return Promise.all(ordersIds.map((orderId) => {
                return this.cancelOrder(orderId);
            })).then(() => {}); // tslint:disable-line:no-empty
        };
        return closeHandler();
    }
    accountManagerInfo() {
        const summaryProps = [{
                text: 'Overall Positions P&L',
                wValue: this._overallPlValue,
                formatter: 'fixed', // default value
            },
            {
                text: "MTM",
                wValue: this._todayPlValue,
                formatter: 'fixed', // default value
            },
            {
                text: 'Equity P&L',
                wValue: this._equityPlValue,
                formatter: 'fixed', // default value
            },
        ];
        return {
            accountTitle: 'Astha Trade',
            summary: summaryProps,
            customFormatters: [{
                    name: 'custom_uppercase',
                    format: (inputs) => String(inputs.value).toUpperCase(),
                },
                {
                    name: 'custom_integer',
                    format: (inputs) => parseInt(inputs.value)
                }
            ],
            // ordersPage: {
            //     orderColumns: ordersPageColumns
            // },
            orderColumns: ordersPageColumns,
            positionColumns: positionsPageColumns,
            pages: [
                // {   
                //     id: 'closed_positions', 
                //     title: 'All Positions', 
                //     tables: [
                //         {
                //             id: 'closed_positions_table', 
                //             columns: closedPositionsPageColumns, 
                //             getData: ()=>{
                //                 return this._getPositions(); 
                //             }, 
                //             changeDelegate: this._closedPositionChangeDelegate,
                //         }
                //     ]

                // },
                {
                    id: 'trades',
                    title: 'Trades',
                    tables: [{
                        id: 'trades',
                        columns: tradesColumns,
                        getData: () => {
                            return this._getTrades();
                        },
                        changeDelegate: this._tradesChangeDelegate,
                    }]
                },
                // {
                //     id: 'accountsummary',
                //     title: 'Account Summary',
                //     tables: [
                //         {
                //             id: 'accountsummary',
                //             columns: accountSummaryColumns,
                //             getData: () => {
                //                 return Promise.resolve([this._accountManagerData]);
                //             },
                //             initialSorting: {
                //                 columnId: 'balance',
                //                 asc: false,
                //             },
                //             changeDelegate: this._amChangeDelegate,
                //         },
                //     ],
                // },
                {
                    id: 'funds',
                    title: 'Funds',
                    tables: [{
                            id: 'nsefundsummary',
                            columns: fundSummaryColumns,
                            title: "NSE FUNDS",
                            getData: () => {
                                return this._getNseFunds();
                            },
                            initialSorting: {
                                columnId: 'id',
                                asc: true
                            },
                            changeDelegate: this._fundsChangeDelegate,
                        },
                        {
                            id: 'mcxfundsummary',
                            title: "MCX FUNDS",
                            columns: fundSummaryColumns,
                            getData: () => {
                                return this._getMCXFunds();
                            },
                            initialSorting: {
                                columnId: 'id',
                                asc: true
                            },
                            changeDelegate: this._mcxfundsChangeDelegate,
                        },
                    ],
                },
                {
                    id: 'holdings',
                    title: 'Holdings',
                    tables: [{
                        id: 'holdings',
                        columns: holdingColumns,
                        getData: () => {
                            return this._getHoldings();
                        },
                        initialSorting: {
                            columnId: 'symbol',
                            asc: false,
                        },
                        changeDelegate: this._holdingsPriceChangeDelegate,
                    }, ],
                },
            ],
            contextMenuActions: (contextMenuEvent, activePageActions) => {
                return Promise.resolve(this._bottomContextMenuItems(activePageActions));
            },
        };
    }
    async symbolInfo(symbol) {
        const mintick = await this._host.getSymbolMinTick(symbol);
        const pipSize = mintick; // pip size can differ from minTick
        const accountCurrencyRate = 1; // account currency rate
        const pointValue = 1; // USD value of 1 point of price
        return {
            qty: {
                min: 1,
                max: Number.MAX_VALUE,
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

    async _getAccountsMetaInfo() {
        return this._odinRequest(this._odinUrl, 'authentication/v1/user/profile', undefined, 'GET').then(response => {
            if (response.data != 'undefined') {

                var aa = [{
                    id: '1',
                    name: response.data.user_name
                }]
                this._accountsMetaInfo = aa
                return Promise.resolve(aa)
            } else {
                return Promise.reject(response)
            }
        }).catch((e) => Promise.reject(e))
    }
    async accountsMetainfo() {
        var aa = await this._gettingAccountsMetaInfo.then((_) => {
            return Promise.resolve(this._accountsMetaInfo)
        })
        return aa

        // return [
        //     {
        //         id: '1',
        //         name: 'Test account',
        //     },
        // ];
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
                action: () => {
                    if (sellBuyButtonsVisibility) {
                        sellBuyButtonsVisibility.setValue(!sellBuyButtonsVisibility.value());
                    }
                },
                checkable: true,
                checked: sellBuyButtonsVisibility !== null && sellBuyButtonsVisibility.value(),
            },
            {
                text: 'Trading Settings...',
                action: () => {
                    this._host.showTradingProperties();
                },
            },
        ]);
    }
    _buttonDropdownItems() {
        const defaultActions = this._host.defaultDropdownMenuActions();
        return defaultActions.concat([{
            text: 'Trading Settings...',
            action: () => {
                this._host.showTradingProperties();
            },
        }, ]);
    }
    // _createPositionForOrder(order) {
    //     const positionId = order.symbol;
    //     let position = this._positionById[positionId];
    //     const orderSide = order.side;
    //     const orderQty = order.qty;
    //     order.avgPrice = order.price;
    //     if (position) {
    //         const sign = order.side === position.side ? 1 : -1;
    //         if (sign > 0) {
    //             position.avgPrice = (position.qty * position.avgPrice + order.qty * order.price) / (position.qty + order.qty);
    //         }
    //         else {
    //             position.avgPrice = position.avgPrice;
    //             const amountToClose = Math.min(orderQty, position.qty);
    //             this._accountManagerData.balance += (order.price - position.avgPrice) * amountToClose * (position.side === -1 /* Sell */ ? -1 : 1);
    //         }
    //         position.qty = position.qty + order.qty * sign;
    //         if (position.qty < 0) {
    //             position.side = position.side === -1 /* Sell */ ? 1 /* Buy */ : -1 /* Sell */;
    //             position.qty *= -1;
    //         }
    //     }
    //     else {
    //         position = Object.assign(Object.assign({}, order), { id: positionId, avgPrice: order.price });
    //     }
    //     const execution = {
    //         id: `${this._idsCounter++}`,
    //         brokerSymbol: order.brokerSymbol,
    //         price: order.price,
    //         qty: orderQty,
    //         side: orderSide,
    //         symbol: order.symbol,
    //         time: Date.now(),
    //     };
    //     this._executions.push(execution);
    //     this._host.executionUpdate(execution);
    //     this._updatePosition(position);
    //     this._recalculateAMData();
    // }
    _updateOrderLast(order) {
        this._host.orderPartialUpdate(order.id, {
            last: order.last
        });
    }
    updateOrder(order, type, callback) {
        if (type == "new") {
            return this._placeOrder(order, callback)

        } else if (type == "modify") {
            return this._modifyOrder(order, callback)
        } else {
            this._quotesProvider.resolveSymbol(order.symbol, (symbolInfo) => {
                // order.exchange = _marketSegmentId(order.exchange)
                var qty_divisor = 1
                if (order.exchange == "NSE_FO") {
                    qty_divisor = symbolInfo.odin_lot_size
                }
                order.remQty = parseInt(order.remQty) / qty_divisor
                order.traded_quantity = parseInt(order.traded_quantity) / qty_divisor
                order.qty = parseInt(order.qty) / qty_divisor
                order.lot_size = parseInt(symbolInfo.odin_lot_size)

                if (order.exchange == "NSE_CUR") {
                    order.limitPrice = order.limitPrice / 100000
                    order.stopPrice = order.stopPrice / 100000
                }
                const hasOrderAlready = Boolean(this._orderById[order.id]);
                var oldOrder = this._orderById[order.id]
                this._orderById[order.id] = order;
                if (!hasOrderAlready) {

                    order.message = {
                        text: order.displayMessage
                    }
                    this._orders.push(order)
                    this._host.orderUpdate(order);
                } else {
                    if (oldOrder.displayMessage.indexOf("Margin Shortfall") != -1) {
                        order.displayMessage = oldOrder.displayMessage
                    } else if (oldOrder.message == "Trading in this scrip is not allowed") {
                        order.displayMessage = oldOrder.displayMessage
                    }
                    var changeIdx
                    this._orders.forEach(function(currentValue, index, arr) {
                        if (currentValue.id == order.id) {
                            changeIdx = index
                        }
                    })
                    this._orders[changeIdx] = order
                    this._host.orderUpdate(order);
                }
                let lid_index = this._basketLid[order.id]
                if (lid_index !== "") {
                    order.listenerId = lid_index
                    OrderOMSFeedSub.NotifyOrder({
                        order: order
                    })
                }

                // if( order.status == 5){
                //     this._host.showNotification("Order execution failed",order.displayMessage ,0)
                // }
            })


            return;
        }
    }
    _updatePosition(position) {
        const hasPositionAlready = Boolean(this._positionById[position.id]);
        if (hasPositionAlready && !position.qty) {
            this._unsubscribeData(position.id);
            const index = this._positions.indexOf(position);
            if (index !== -1) {
                this._positions.splice(index, 1);
            }
            delete this._positionById[position.id];
            this._host.positionUpdate(position);
            return;
        }
        if (!hasPositionAlready) {
            this._positions.push(position);
            this._subscribeData(position.symbol, position.id, (last) => {
                if (position.last === last) {
                    return;
                }
                position.last = last;
                position.profit = (position.last - position.price) * position.qty * (position.side === -1 /* Sell */ ? -1 : 1);
                this._host.plUpdate(position.symbol, position.profit);
                this._host.positionPartialUpdate(position.id, position);
                this._recalculateAMData();
            });
        }
        this._positionById[position.id] = position;
        this._host.positionUpdate(position);
    }
    _subscribeData(symbol, id, updateFunction) {
        this._quotesProvider.subscribeTtQuotes([], [symbol], (symbols) => {
            const deltaData = symbols;

            if (deltaData.s !== 'ok' && deltaData.s !== 'success') {
                return;
            }
            if (typeof deltaData.v.lp === 'number') {
                updateFunction(deltaData.v);
            }
        }, getDatafeedSubscriptionId(id));
    }
    _unsubscribeData(id) {
        this._quotesProvider.unsubscribeQuotes(getDatafeedSubscriptionId(id));
    }
    _recalculateAMData() {

        let pl = 0;
        this._positions.forEach((position) => {
            pl += (position.overallPl) || 0;
        });
        // this._accountManagerData.pl = pl;
        this._accountManagerData.overallPl = pl;

        pl = 0;
        this._positions.forEach((position) => {
            pl += (position.totalPl) || 0;
        });

        this._accountManagerData.todayPl = pl;

        pl = 0;
        this._holdings.forEach((holding) => {
            pl += holding.unrealized_pnl
        })

        this._accountManagerData.equityPl = pl;
        this._amChangeDelegate.fire(this._accountManagerData);
    }

    async _getOrders() {
        if (this._orders.length == 0) {

            var aa = this._odinRequest(this._odinUrl, 'transactional/v1/orders?offset=1&limit=1000');
            var bb = this._odinRequest(this._odinUrl, 'transactional/v1/gtdOrders?offset=1&limit=1000')
            var temporders = []
            return Promise.all([aa, bb]).then((res) => {
                this._orders = []
                var promiseArray = []

                if (res[0].hasOwnProperty("data")) {
                    for (const order of res[0]["data"]) {
                        var limitPrice = ""
                        var stopPrice = ""
                        if (order.order_identifier.toString().indexOf("GTD") !== -1) {
                            continue
                        }
                        if (order.order_type == "RL" || order.order_type == "RL-MKT") {
                            limitPrice = order.order_price
                        } else if (order.order_type == "SL" || order.order_type == "SL-MKT") {
                            stopPrice = order.trigger_price
                        }
                        promiseArray.push(this._quotesProvider.tokenInfo({
                            market_segment_id: _exchangeMap(order.exchange),
                            token: order.scrip_token
                        }))
                        var shortfall_idx

                        if ((shortfall_idx = order.error_reason.indexOf("ShortFall=")), shortfall_idx != -1) {
                            var shortfall = order.error_reason.slice(shortfall_idx + 10, order.error_reason.length)
                            order.error_reason = "Margin Shortfall of Rs " + shortfall
                        }
                        if (order.error_reason == "New Positions for given scrip are not allowed by  member") {
                            order.error_reason = "Trading in this scrip is not allowed"
                        }
                        var qty_divisor
                        if (order.exchange == "NSE_FO") {
                            qty_divisor = order.market_lot
                        } else {
                            qty_divisor = 1
                        }

                        let no = {
                            id: order.order_id,
                            market_segment_id: _exchangeMap(order.exchange),
                            token: order.scrip_token,
                            // symbol: order.scrip_token.toString(),
                            side: (order.transaction_type == "BUY" ? 1 : -1),
                            order_type: (order.order_type || "REJECTED"),
                            type: (order.order_type) == 'RL-MKT' ? 2 : (order.order_type == 'RL' ? 1 : (order.order_type == 'SL-MKT' ? 3 : 4)),
                            product: (order.product_type || ""),
                            qty: order.total_quantity / qty_divisor,
                            remQty: order.pending_quantity / qty_divisor,
                            traded_quantity: order.traded_quantity / qty_divisor,
                            lot_size: order.market_lot,
                            displayMessage: (order.error_reason == "" ? "Placed" : order.error_reason),
                            message: {
                                text: (order.error_reason == "" ? "Placed" : order.error_reason)
                            },
                            status: _getOrderStatus(order.status),
                            tradedPrice: "0",
                            limitPrice: parseFloat(order.order_price.toString()) || 0.00,
                            stopPrice: parseFloat(order.trigger_price.toString()) || 0.00,
                            order_id: order.order_id,
                            duration: order.validity,
                            exchange: order.exchange,
                            is_amo_order: (order.is_amo_order ? "Yes" : "No")
                        }
                        temporders.push(
                            no
                        )
                    }
                }
                if (res[1].hasOwnProperty("data")) {
                    for (const order of res[1]["data"]) {
                        var limitPrice = ""
                        var stopPrice = ""
                        if (order.order_type == "RL" || order.order_type == "RL-MKT") {
                            limitPrice = order.order_price
                        } else if (order.order_type == "SL" || order.order_type == "SL-MKT") {
                            stopPrice = order.trigger_price
                        }
                        promiseArray.push(this._quotesProvider.tokenInfo({
                            market_segment_id: _exchangeMap(order.exchange),
                            token: order.scrip_token
                        }))
                        let no = {
                            id: order.order_id,
                            market_segment_id: _exchangeMap(order.exchange),
                            token: order.scrip_token,
                            // symbol: order.scrip_token.toString(),
                            side: (order.transaction_type == "BUY" ? 1 : -1),
                            order_type: (order.order_type || "REJECTED"),
                            type: (order.order_type) == 'RL-MKT' ? 2 : (order.order_type == 'RL' ? 1 : (order.order_type == 'SL-MKT' ? 3 : 4)),
                            product: (order.product_type || ""),
                            qty: order.total_quantity / order.market_lot,
                            remQty: order.pending_quantity / order.market_lot,
                            traded_quantity: order.traded_quantity / order.market_lot,
                            lot_size: order.market_lot,
                            displayMessage: (order.error_reason == "" ? "Placed" : order.error_reason),
                            message: {
                                text: (order.error_reason == "" ? "Placed" : order.error_reason)
                            },
                            status: _getGtdOrderStatus(order.status),
                            tradedPrice: "0",
                            limitPrice: parseFloat(order.order_price.toString()) || 0.00,
                            stopPrice: parseFloat(order.trigger_price.toString()) || 0.00,
                            order_id: order.order_id,
                            duration: "GTT",
                            exchange: order.exchange,
                            is_amo_order: (order.is_amo_order ? "Yes" : "No"),
                            validity_days: order.validity_days,
                            validity: "GTD"
                        }
                        temporders.push(
                            no
                        )
                    }
                }
                return Promise.all(promiseArray);
            }).then((res) => {

                temporders.forEach((order, i) => {
                    order.symbol = res[i].symbol
                    this._orders.push(
                        order
                    )
                    this._orderById[order.order_id] = order
                })


                return Promise.resolve(this._orders)
            })
        } else {
            return this._orders
        }

    }
    async _getTrades() {
        if (this._trades.length == 0) {
            return this._odinRequest(this._odinUrl, 'transactional/v1/trades/?offset=1&limit=10000').then((response) => {
                if (response.hasOwnProperty("data")) {
                    response.data.forEach(async (trade) => {
                        var t = {
                            id: trade.trade_no,
                            // symbol: _getSymbolFromPosition(trade.exchange,trade.instrument,trade.symbol,trade.series,trade.strike_price, trade.option_type),
                            exchange: _exchangeMap(trade.exchange),
                            token: trade.scrip_token,
                            side: (trade.transaction_type == "BUY" ? 1 : -1),
                            type: trade.order_type,
                            product: trade.product_type,
                            tradedQty: trade.trade_quantity,
                            tradedPrice: trade.trade_price,
                            tradeTime: trade.trade_timestamp,
                            orderNumber: trade.order_id,
                            time: Date.now()
                        }

                        await this.addExecutionWithoutRefresh(t)
                    })
                }
                return Promise.resolve(this._trades)
            })
        } else {
            return Promise.resolve(this._trades)
        }
    }
    async _getPositions() {
        if (this._positions.length == 0) {
            return this._odinRequest(this._odinUrl, 'transactional/v1/portfolio/positions/all').then((response) => {
                this._positions = []
                if (response.hasOwnProperty("data")) {
                    response.data.forEach((position) => {
                        if (position.daily_or_expiry == "EXPIRY") {

                            this._quotesProvider.tokenInfo({
                                market_segment_id: _exchangeMap(position.exchange),
                                token: position.scrip_token
                            }).then((symbol) => {
                                let ini_np = {
                                    id: symbol.symbol + "|" + position.product_type,
                                    symbol: symbol.symbol,
                                    product: position.product_type,
                                    side: (position.net_quantity > 0 ? 1 : -1),
                                    qty: (position.exchange == 'NSE_CUR' ? Math.abs(position.net_quantity) : Math.abs(position.net_quantity) / parseInt(position.market_lot)),
                                    lot_size: parseInt(position.market_lot),
                                    avgPrice: (position.exchange == 'NSE_CUR' ? (Math.abs(position.net_quantity) > 0 ? Math.abs((parseFloat(position.net_value) / (parseFloat(position.net_quantity)))) : 0) / parseInt(position.market_lot) : (Math.abs(position.net_quantity) > 0 ? Math.abs((parseFloat(position.net_value) / (parseFloat(position.net_quantity)))) : 0)),
                                    last: position.ltp,
                                    realizedPl: _getRealizedPl(position),
                                    unrealizedPl: _getUnrealizedPl(position, parseFloat(position.ltp)),
                                    totalPl: 0,
                                    overallPl: 0,
                                    buyQty: position.buy_quantity,
                                    buyAvg: position.avg_buy_price,
                                    sellQty: position.sell_quantity,
                                    sellAvg: position.avg_sell_price,
                                    unsettled_qty: Math.abs(position.unsetteled_quantity) / parseInt(position.market_lot)

                                }
                                this._positions.push(ini_np);
                                this._positionById[ini_np.id] = ini_np
                                this._host.positionUpdate(ini_np);
                                this._subscribeData(symbol.symbol, "POS" + ini_np.id, (v) => {
                                    var foundIndex = this._positions.findIndex(x => x.symbol == symbol);
                                    let realizedPl = _getRealizedPl(position)
                                    let unrealizedPl = _getUnrealizedPl(position, parseFloat(v.lp))
                                    let realizedOverallPl = _getRealizedOverallPl(position)
                                    let unrealizedOverallPl = _getUnrealizedOverallPl(position, parseFloat(v.lp))
                                    let np = {
                                        id: symbol.symbol + "|" + position.product_type,
                                        symbol: symbol.symbol,
                                        product: position.product_type,
                                        side: (position.net_quantity > 0 ? 1 : -1),
                                        qty: (position.exchange == 'NSE_CUR' ? Math.abs(position.net_quantity) : Math.abs(position.net_quantity) / parseInt(position.market_lot)),
                                        lot_size: parseInt(position.market_lot),
                                        avgPrice: (position.exchange == 'NSE_CUR' ? (Math.abs(position.net_quantity) > 0 ? Math.abs((parseFloat(position.net_value) / (parseFloat(position.net_quantity)))) : 0) / parseInt(position.market_lot) : (Math.abs(position.net_quantity) > 0 ? Math.abs((parseFloat(position.net_value) / (parseFloat(position.net_quantity)))) : 0)),
                                        last: v.lp,
                                        realizedPl: realizedPl,
                                        unrealizedPl: unrealizedPl,
                                        totalPl: realizedPl + unrealizedPl,
                                        overallPl: realizedOverallPl + unrealizedOverallPl,
                                        buyQty: position.buy_quantity,
                                        buyAvg: position.avg_buy_price,
                                        sellQty: position.sell_quantity,
                                        sellAvg: position.avg_sell_price,
                                        unsettled_qty: Math.abs(position.unsetteled_quantity) / parseInt(position.market_lot)
                                    }
                                    this._positions[foundIndex] = np
                                    this._positionById[np.id] = np
                                    // this._host.positionUpdate(ini_np);
                                    this._host.plUpdate(np.id, Number(np.totalPl.toFixed(2)));
                                    this._host.positionPartialUpdate(np.id, np);
                                    this._recalculateAMData()
                                    // holding.last_price = last
                                })
                            })

                        }


                    })
                }
                return this._positions;
            })
        } else {
            Promise.resolve(this._positions)
        }

    }
    async _getHoldings() {
        if (this._holdings.length == 0) {
            return this._odinRequest(this._odinUrl, 'transactional/v1/portfolio/holdings').then((response) => {
                this._holdings = []
                response.data.forEach((holding) => {
                    this._holdings.push({
                        id: "NSE:" + holding.security_info[0].symbol + "-EQ",
                        symbol: "NSE:" + holding.security_info[0].symbol + "-EQ",
                        average_price: holding.average_price,
                        last_price: holding.last_price,
                        quantity: holding.total_free,
                        market_value: parseInt(holding.total_free) * parseFloat(holding.last_price),
                        days_change: 0,
                        unrealized_pnl: (parseFloat(holding.last_price) - parseFloat(holding.average_price)) * parseInt(holding.total_free),
                        unrealized_pnl_per: (parseFloat(holding.last_price) - parseFloat(holding.average_price)) * parseInt(holding.total_free) / parseFloat(holding.average_price) * 100,
                        holding_type: holding.product

                    })
                    this._subscribeData("NSE:" + holding.security_info[0].symbol + "-EQ", "NSE:" + holding.security_info[0].symbol + "-EQ", (v) => {
                        if (parseFloat(holding.last_price) === v.lp) {
                            return
                        }
                        var foundIndex = this._holdings.findIndex(x => x.id == "NSE:" + holding.security_info[0].symbol + "-EQ");
                        this._holdings[foundIndex] = {
                            id: "NSE:" + holding.security_info[0].symbol + "-EQ",
                            symbol: "NSE:" + holding.security_info[0].symbol + "-EQ",
                            average_price: holding.average_price,
                            quantity: holding.total_free,
                            market_value: parseInt(holding.total_free) * v.lp,
                            days_change: parseFloat(v.ch),
                            last_price: v.lp,
                            unrealized_pnl: (v.lp - holding.average_price) * holding.total_free,
                            unrealized_pnl_per: (v.lp - holding.average_price) / holding.average_price * 100,
                            holding_type: holding.product
                        }
                        this._holdingsPriceChangeDelegate.fire({
                            id: "NSE:" + holding.security_info[0].symbol + "-EQ",
                            symbol: "NSE:" + holding.security_info[0].symbol + "-EQ",
                            average_price: holding.average_price,
                            quantity: holding.total_free,
                            market_value: parseInt(holding.total_free) * v.lp,
                            days_change: parseFloat(v.ch),
                            last_price: v.lp,
                            unrealized_pnl: (v.lp - holding.average_price) * holding.total_free,
                            unrealized_pnl_per: (v.lp - holding.average_price) / holding.average_price * 100,
                            holding_type: holding.product
                        })

                        // holding.last_price = last
                    })
                })

                return this._holdings;
            })
        } else {
            return Promise.resolve(this._holdings)
        }

    }
    async _getNseFunds() {
        return this._odinRequest(this._odinUrl, 'transactional/v1/peridiocityWiseBalance').then((response) => {
            this._nseFundsDetails = []
            var nse_data = response.data.filter((element) => {
                return element.name == "NSE Combined"
            })[0].data
            if (nse_data === undefined) {
                return Promise.resolve(this._nseFundsDetails)
            }
            nse_data.forEach((period, index) => {
                let id = ""
                let sortProp = 0
                let isTotalRow = false
                let ttp = {
                    id: "Total Trading Power",
                    value: 0
                }
                switch (index) {
                    case 0:
                        id = "Deposit"
                        sortProp = 0

                        break;
                    case 7:
                        id = "Funds Transferred"
                        sortProp = 1
                        break;
                    case 9:
                        id = "Collateral"
                        sortProp = 2
                        break;
                    case 16:
                        id = "Credit for sale"
                        sortProp = 3
                        break;
                    case 21:
                        id = "Option CFS"
                        sortProp = 4
                        break;
                    case 26:
                        id = "Limit Utilization"
                        sortProp = 5
                        break;
                    case 8:
                        id = "Funds Withdrawal"
                        sortProp = 6
                        break;
                    case 36:
                        id = "MM Profit/Loss"
                        sortProp = 7
                        break;
                    case 31:
                        id = "Booked Profit/Loss"
                        sortProp = 8
                        break;
                    case 24:
                        id = "Total Trading Power"
                        sortProp = 9
                        isTotalRow = true
                        break;
                    case 41:
                        id = "Total Utilization"
                        sortProp = 10
                        isTotalRow = true
                        break;
                    case 42:
                        id = "Net Available"
                        sortProp = 11
                        isTotalRow = true
                        break;
                    default:
                        break;
                }
                if (id != "") {
                    this._nseFundsDetails.push({
                        id: id,
                        value: parseFloat(period.nTotal),
                        sortProp: sortProp,
                        isTotalRow: isTotalRow
                    })
                }

            })
            // var order = ["Deposit","Funds Transferred", "Collateral", "Credit for sale", "Option CFS", "Limit Utilization", "Funds Withdrawal", "MM Profit/Loss", "Booked Profit/Loss"]
            // this._nseFundsDetails = this._nseFundsDetails.sort(function(a,b){
            //     return order.indexOf(a.id) - order.indexOf(b.id)
            // })
            // console.log(this._nseFundsDetails)

            return this._nseFundsDetails
        })
    }

    async _getMCXFunds() {
        return this._odinRequest(this._odinUrl, 'transactional/v1/peridiocityWiseBalance').then((response) => {
            this._mcxFundsDetails = []
            var mcx_data = response.data.filter((element) => {
                return element.name == "Commodity Combined"
            })[0].data
            if (mcx_data === undefined) {
                return Promise.resolve(this._mcxFundsDetails)
            }
            mcx_data.forEach((period, index) => {
                let id = ""
                let sortProp = 0
                let isTotalRow = false
                let ttp = {
                    id: "Total Trading Power",
                    value: 0
                }
                switch (index) {
                    case 0:
                        id = "Deposit"
                        sortProp = 0

                        break;
                    case 7:
                        id = "Funds Transferred"
                        sortProp = 1
                        break;
                    case 9:
                        id = "Collateral"
                        sortProp = 2
                        break;
                    case 16:
                        id = "Credit for sale"
                        sortProp = 3
                        break;
                    case 21:
                        id = "Option CFS"
                        sortProp = 4
                        break;
                    case 26:
                        id = "Limit Utilization"
                        sortProp = 5
                        break;
                    case 8:
                        id = "Funds Withdrawal"
                        sortProp = 6
                        break;
                    case 36:
                        id = "MM Profit/Loss"
                        sortProp = 7
                        break;
                    case 31:
                        id = "Booked Profit/Loss"
                        sortProp = 8
                        break;
                    case 24:
                        id = "Total Trading Power"
                        sortProp = 9
                        isTotalRow = true
                        break;
                    case 41:
                        id = "Total Utilization"
                        sortProp = 10
                        isTotalRow = true
                        break;
                    case 42:
                        id = "Net Available"
                        sortProp = 11
                        isTotalRow = true
                        break;
                    default:
                        break;
                }
                if (id != "") {
                    this._mcxFundsDetails.push({
                        id: id,
                        value: parseFloat(period.nTotal),
                        sortProp: sortProp,
                        isTotalRow: isTotalRow
                    })
                }

            })
            // var order = ["Deposit","Funds Transferred", "Collateral", "Credit for sale", "Option CFS", "Limit Utilization", "Funds Withdrawal", "MM Profit/Loss", "Booked Profit/Loss"]
            // this._nseFundsDetails = this._nseFundsDetails.sort(function(a,b){
            //     return order.indexOf(a.id) - order.indexOf(b.id)
            // })
            // console.log(this._nseFundsDetails)

            return this._mcxFundsDetails
        })
    }


    async _placeOrder(order, callback) {

        return this._odinRequest(this._odinUrl, 'transactional/v1/orders/regular', order, "POST").then((response) => {
            if (response.status === 'success') {

                // this._host.showNotification("Order placement","Order placed successfully" ,1)
                this._basketLid[response.data.orderId] = order.listenerId
                OrderOMSFeedSub.NotifyOrder({
                    response: {
                        success: response,
                        type: 'Place',
                        listenerId: order.listenerId
                    }
                })
                callback()
            } else {

                this._host.showNotification("Order placement", response.message, 0)
                OrderOMSFeedSub.NotifyOrder({
                    response: {
                        error: response.message,
                        listenerId: order.listenerId
                    }
                })
                OrderOMSFeedSub.NotifyOrder({
                    order: {
                        listenerId: order.listenerId,
                        status: 6,
                        order_id: ''
                    }
                })
                callback()
                // _triggerFeedIfAmoFail(response.message,order.listenerId)
            }
        }).catch((error) => {

            this._host.showNotification("Order placement failed", error.message, 0)
            OrderOMSFeedSub.NotifyOrder({
                response: {
                    error: error,
                    listenerId: order.listenerId
                }
            })
            callback()
        })
    }

    async _modifyOrder(order, callback) {
        var url
        if (order.validity == "GTD") {
            url = 'transactional/v1/orders/regular/' + _marketSegmentId(order.market_segment_id) + '/' + order.order_id + '?validity=GTT&validity_days=' + order.validity_days.toString()
        } else {
            url = 'transactional/v1/orders/regular/' + _marketSegmentId(order.market_segment_id) + '/' + order.order_id
        }
        return this._odinRequest(this._odinUrl, url, order, "PUT").then((response) => {
            if (response.status != 'success') {
                // this._host.showNotification("Order modification","Order modified successfully" ,1)

                this._host.showNotification("Order modification", response.message, 0)
                OrderOMSFeedSub.NotifyOrder({
                    response: {
                        error: response
                    }
                })
                callback()
            } else {
                OrderOMSFeedSub.NotifyOrder({
                    response: {
                        success: response,
                        type: 'Place'
                    }
                })
                callback()
            }
        }).catch((error) => {
            this._host.showNotification("Order modification failed", error.message, 0)
            OrderOMSFeedSub.NotifyOrder({
                response: {
                    error: error
                }
            })
            callback()
        })
    }
    async _odinRequest(odinUrl, urlPath, body, method = "GET") {
        // Send user cookies if the URL is on the same origin as the calling script.
        const options = {};
        if (this._headers !== undefined) {
            options.headers = this._headers;
        }
        if (body !== undefined) {
            options.body = JSON.stringify(body)
        }
        options.method = method

        return fetch(`${odinUrl}${urlPath}`, options)
            .then((response) => {
                return response.text()
            })
            .then((responseTest) => JSON.parse(responseTest))
            .catch((error) => console.log(error));
    }

    async _inhouseRequest(inHouseUrl, urlPath, body, params, method = "GET") {
        // Send user cookies if the URL is on the same origin as the calling script.
        const options = {};
        if (this._inhouseHeaders !== undefined) {
            options.headers = this._inhouseHeaders;
        }
        if (body !== undefined && method != "GET") {
            options.body = JSON.stringify(body)
        }
        var url = new URL(`${inHouseUrl}${urlPath}`)

        url.search = new URLSearchParams(params).toString();
        options.method = method
        return fetch(url, options)
            .then((response) => {
                return response.text()
            })
            .then((responseTest) => JSON.parse(responseTest))
            .catch((error) => console.log(error));
    }

    async _getWatchlists() {
        if (this._watchlists.length == 0) {
            return this._inhouseRequest(this._inHouseUrl, 'watchlists', "", "", "GET").then((response) => {
                return Promise.all(response.response.map((watchlist) => {
                    return Promise.all(watchlist.watchlistStocks.map((stock) => this._quotesProvider._getSymbolFromTokens({
                            market_segment_id: stock.marketSegmentId.toString(),
                            token: stock.scripToken.toString()
                        })))
                        .then(results => {
                            var watchlistMap = {
                                id: watchlist.ID,
                                name: watchlist.watchlistName,
                                readonly: watchlist.defaultProfile,
                                symbols: results.map((aa) => aa.symbol),
                                wlPosition: watchlist.wlPosition
                            }

                            this._watchlists.push(watchlistMap)
                            return Promise.resolve(watchlistMap)
                        })
                })).then(() => Promise.resolve(this._watchlists))
            }).then(() => Promise.resolve(this._watchlists))
        }
        return Promise.resolve(this._watchlists)
    }

    async _getPreferences() {
        return this._inhouseRequest(this._inHouseUrl, 'user/preferences', "", "", "GET").then((response) => {
            this._preferences = response.response
            return Promise.resolve(this._preferences)
        })
    }

    async setTheme(theme) {
        this._preferences.chartTheme = theme
        const response = await this._inhouseRequest(this._inHouseUrl, 'user/preferences', this._preferences, "", "PUT");
        return Promise.resolve(response);
    }
}

