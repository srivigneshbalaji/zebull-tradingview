<template>
  <div class="TVChartContainer" :id="containerId" />
</template>
<script type="text/javascript" src="../../public/broker-sample/dist/bundle.js"></script>
<script>
import { widget } from "../../public/charting_library";
import Datafeed from "../mixins/feedFactory.js";
import {ChartWatchlists,getMWValues} from "../mixins/marketWatchList.js";
import { fetchfromZebullAPI,getWatchlistdata } from '../mixins/apiConnectionPool.js';
var userid = localStorage.getItem('userid');
var usession = localStorage.getItem('usession');
import {logMessage,setLogging} from '../utils/helpers.js';
function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export default {
  name: "TVChartContainer",
  props: {
    symbol: {
      default: "RELIANCE_NSE",
      type: String,
    }, //RELIANCE
    interval: {
      default: "1",
      type: String,
    },
    containerId: {
      default: "tv_chart_container",
      type: String,
    },
    datafeedUrl: {
      default: "",
      type: String,
    },
    libraryPath: {
      default: "./charting_library/",
      type: String,
    },
    chartsStorageUrl: {
      default: "",
      type: String,
    },
    chartsStorageApiVersion: {
      default: "1.1",
      type: String,
    },
    clientId: {
      default: "ZEBU",
      type: String,
    },
    userId: {
      default: "",
      type: String,
    },
    fullscreen: {
      default: false,
      type: Boolean,
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    studiesOverrides: {
      type: Object,
    },
  },
  tvWidget: null,

  data() {
    return {
    };
  },
  created: function () {
    this.$root.$refs.TVChartContainer = this;
  },
  mounted() {
    this.initTWChart();
    setLogging(process.env.NODE_ENV==="development")
  },

  methods: {
    initTWChart() {
      logMessage(`"Datafeed :::::::: ", ${Datafeed}`);
      const widgetOptions = {
        symbol: this.symbol,
        datafeed: Datafeed,
        interval: this.interval,
        container: this.containerId,
        library_path: this.libraryPath,
        timezone: 'Asia/Kolkata',
        locale: getLanguageFromURL() || "en",
        disabled_features: ["use_localstorage_for_settings"],
        disabled_features: ["header_screenshot"],
        enabled_features: ["dom_widget"],
        // charts_storage_url: this.chartsStorageUrl,
        charts_storage_api_version: this.chartsStorageApiVersion,
        client_id: this.clientId,
        user_id: this.userId,
        fullscreen: this.fullscreen,
        autosize: this.autosize,
        studies_overrides: this.studiesOverrides,

        // right side widget to watchlist
        widgetbar: {
          details: true,
          news: true,
          watchlist: true,
          datawindow: true,
          watchlist_settings: {
            default_symbols: [],
          },
        },
        //"RELIANCE","HDFC","TATAELXSI"
        // sample news feed widget
        rss_news_feed: {
          default: [
            {
              url: "https://demo-feed-data.tradingview.com/news?symbol={SYMBOL}",
              name: "Yahoo Finance",
            },
          ],
        },

        broker_factory: function (host) {
         
          return new Brokers.BrokerSample(host, Datafeed);
        },
        broker_config: {
          configFlags: {
            supportBottomWidget: true,
            supportNativeReversePosition: true,
            supportClosePosition: true,
            supportPLUpdate: true,
            supportLevel2Data: false,
            showQuantityInsteadOfAmount: true,
            supportEditAmount: true,
            supportStopLimitOrders:true,
            supportPlaceOrderPreview :true,
            supportModifyOrderPreview:true
          },
          durations: [
            { name: "DAY", value: "DAY" },
            { name: "IOC", value: "IOC" },
          ],
          orderDialogOptions: {
            customFields: [
              {
                id: "2410",
                inputType: "ComboBox",
                title: "Execution",
                items: [
                  {
                    text: "General",
                    value: "General",
                  },
                  {
                    text: "Iceberg",
                    value: "Iceberg",
                  },
                  {
                    text: "AOL",
                    value: "AOL",
                  },
                ],
              },
            ],
          },
        },
      };

const tvWidget = new widget(widgetOptions);
      this.tvWidget = tvWidget;

      tvWidget.onChartReady(() => {
        tvWidget.headerReady().then(() => {
          const exitAllPosButton = tvWidget.createButton({align:"right"});
          const fundButton = tvWidget.createButton({align:"right"});
          const refreshButton = tvWidget.createButton();
          // const logoutButton = tvWidget.createButton({align:"right"});
          fundButton.setAttribute("title", "Add Funds");
          refreshButton.setAttribute("title","Reset Chart");
          // logoutButton.setAttribute("title","Logout from your Account");
          exitAllPosButton.setAttribute("title","Exit All Open Positions");
          // button.classList.add("apply-common-tooltip");

          fundButton.addEventListener("click", () =>
          window.open("https://fund.zebull.in/", '_blank')
            // tvWidget.showNoticeDialog({
            //   title: "Notification",
            //   body: "TradingView Charting Library API works correctly",
            //   callback: () => {
            //     // eslint-disable-next-line no-console
            //     console.log("Noticed!");
            //   },
            // })
          );
          fundButton.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32" fill="none"><rect x="5.15" y="11.7666" width="18.5" height="14.3" rx="0.65" stroke="black" stroke-width="0.7"/><path d="M20.8036 6.13442L5.72228 11.2492C5.40084 11.3582 5.47921 11.8333 5.81863 11.8333H20.9C21.0657 11.8333 21.2 11.699 21.2 11.5333V6.41853C21.2 6.2131 20.9982 6.06844 20.8036 6.13442Z" stroke="black" stroke-width="0.7"/></svg>';
          refreshButton.innerHTML='<svg width="21" height="19" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.1188 22.2377C11.88 22.2377 12.6391 22.1602 13.3748 22.0073C13.4194 21.9986 13.4617 21.9811 13.4995 21.9559C13.5372 21.9307 13.5696 21.8983 13.5947 21.8605C13.6198 21.8227 13.6372 21.7803 13.6458 21.7358C13.6544 21.6912 13.654 21.6454 13.6448 21.601C13.6356 21.5566 13.6176 21.5144 13.592 21.477C13.5663 21.4395 13.5335 21.4076 13.4954 21.3829C13.4573 21.3583 13.4147 21.3414 13.3701 21.3334C13.3254 21.3253 13.2796 21.3262 13.2353 21.336C12.5455 21.4793 11.833 21.552 11.1188 21.552C5.3657 21.552 0.685713 16.872 0.685713 11.1188C0.685713 5.3657 5.3657 0.685713 11.1188 0.685713C16.872 0.685713 21.552 5.3657 21.552 11.1188C21.552 12.1131 21.4114 13.0892 21.1378 14.0314L19.9004 12.2036C19.8758 12.1649 19.8437 12.1316 19.806 12.1055C19.7683 12.0794 19.7257 12.0612 19.6808 12.0518C19.636 12.0425 19.5897 12.0423 19.5447 12.0511C19.4997 12.06 19.4569 12.0778 19.419 12.1035C19.381 12.1292 19.3485 12.1622 19.3236 12.2007C19.2986 12.2391 19.2816 12.2822 19.2735 12.3273C19.2655 12.3725 19.2665 12.4188 19.2767 12.4635C19.2869 12.5082 19.3059 12.5504 19.3326 12.5876L20.9636 14.9976C20.9708 15.0082 20.9821 15.0147 20.9904 15.0243C21.0051 15.0415 21.0202 15.0569 21.0384 15.0713C21.0565 15.0857 21.0761 15.0967 21.0966 15.1069C21.1086 15.1131 21.1172 15.1227 21.1302 15.1275C21.1392 15.1309 21.1481 15.1292 21.157 15.1316C21.1662 15.134 21.1734 15.1402 21.1827 15.1419C21.2042 15.1461 21.226 15.1481 21.2478 15.1481C21.2506 15.1481 21.2537 15.1471 21.2568 15.1471C21.2677 15.1467 21.2784 15.1436 21.2893 15.1419C21.3315 15.1368 21.3723 15.1238 21.4097 15.1035C21.4196 15.0984 21.4302 15.0956 21.4398 15.0895L23.8494 13.4581C23.8867 13.4329 23.9187 13.4005 23.9434 13.3629C23.9682 13.3253 23.9853 13.2832 23.9938 13.239C24.0023 13.1948 24.002 13.1493 23.993 13.1052C23.9839 13.0611 23.9662 13.0192 23.941 12.9819C23.9157 12.9446 23.8834 12.9127 23.8458 12.8879C23.8082 12.8631 23.766 12.846 23.7218 12.8375C23.6776 12.829 23.6321 12.8293 23.588 12.8384C23.5439 12.8474 23.502 12.8651 23.4648 12.8904L21.8677 13.9714C22.1132 13.0457 22.238 12.0898 22.238 11.1188C22.238 4.98787 17.2498 0 11.1192 0C4.98753 0 0 4.98787 0 11.1188C0 17.2498 4.98788 22.2377 11.1188 22.2377Z" fill="black"/></svg>';
          exitAllPosButton.innerHTML='<svg width="24" height="18" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.0262038 11.6829V11.1951C0.0262038 10.8537 0.20963 10.6829 0.576482 10.6829H2.8038C3.17065 10.6829 3.35408 10.8537 3.35408 11.1951V11.3902C3.35408 12.0081 3.4851 12.4309 3.74713 12.6585C4.00917 12.8862 4.48957 13 5.18834 13H6.41991C7.10121 13 7.57288 12.878 7.83492 12.6341C8.11442 12.3902 8.25418 11.935 8.25418 11.2683V10.9756C8.25418 10.5041 8.04455 10.1463 7.62529 9.90244C7.2235 9.64228 6.71689 9.4878 6.10547 9.43902C5.49405 9.39024 4.83022 9.30081 4.11399 9.17073C3.41522 9.02439 2.76013 8.84553 2.14871 8.63415C1.53729 8.4065 1.02195 7.97561 0.602686 7.34146C0.200895 6.69106 0 5.86179 0 4.85366V4C0 2.73171 0.384322 1.74797 1.15296 1.04878C1.92161 0.349593 2.98723 0 4.34982 0H6.97019C8.35026 0 9.42461 0.349593 10.1933 1.04878C10.9619 1.74797 11.3462 2.73171 11.3462 4V4.46341C11.3462 4.80488 11.1628 4.97561 10.7959 4.97561H8.56862C8.20177 4.97561 8.01834 4.80488 8.01834 4.46341V4.31707C8.01834 3.68293 7.88732 3.25203 7.62529 3.02439C7.36325 2.79675 6.88285 2.68293 6.18408 2.68293H5.16214C4.4459 2.68293 3.95676 2.81301 3.69473 3.07317C3.45016 3.31707 3.32787 3.80488 3.32787 4.53659V5C3.32787 5.76423 4.04411 6.20325 5.47658 6.31707C6.96146 6.43089 8.28038 6.70732 9.43334 7.14634C10.0448 7.39024 10.5514 7.82927 10.9532 8.46341C11.3724 9.0813 11.582 9.87805 11.582 10.8537V11.6829C11.582 12.9512 11.1977 13.935 10.4291 14.6341C9.66044 15.3333 8.59482 15.6829 7.23223 15.6829H4.37602C3.01343 15.6829 1.94781 15.3333 1.17917 14.6341C0.410525 13.935 0.0262038 12.9512 0.0262038 11.6829Z" fill="#1E53E5"/><path d="M21.6721 11.122V6.19512C21.6721 6.01626 21.5673 5.92683 21.3577 5.92683H18.8945C18.3355 5.92683 17.9425 6.04065 17.7154 6.26829C17.4883 6.47967 17.3747 6.84553 17.3747 7.36585V11.561C17.3747 12.0813 17.4883 12.4553 17.7154 12.6829C17.9425 12.8943 18.3355 13 18.8945 13H19.8379C21.0607 13 21.6721 12.374 21.6721 11.122ZM18.9731 15.6829H18.3705C16.9904 15.6829 15.9248 15.3415 15.1736 14.6585C14.4224 13.9756 14.0468 12.9919 14.0468 11.7073V7.21951C14.0468 5.93496 14.4224 4.95122 15.1736 4.26829C15.9248 3.58537 16.9904 3.2439 18.3705 3.2439H24.4235C24.8078 3.2439 25 3.41463 25 3.7561V18.5122C25 18.8374 24.8078 19 24.4235 19H22.2224C21.8556 19 21.6721 18.8374 21.6721 18.5122V14.3415H21.5673C21.148 15.2358 20.2833 15.6829 18.9731 15.6829Z" fill="#1E53E5"/></svg>'; 
          
          refreshButton.addEventListener("click", () =>
            tvWidget.activeChart().executeActionById("chartReset")
          );        
          // logoutButton.addEventListener("click", () =>{
          //   console.log("Logout");
          // }
          // ); 
          // logoutButton.innerHTML='Logout'; 
          exitAllPosButton.addEventListener("click", () =>{
            console.log("Positions Exit");
            tvWidget.showConfirmDialog({
              title:"Exit All Position",
              body:"Are you sure about exiting All Open Positions",
              callback:(res) => {
                console.log("Result of dialog box",res);
                if(res==true){
                  let myHeaders = new Headers();
                  myHeaders.append("Authorization", `Bearer ${userid} ${usession}`)
                  const request = {
                    method:"POST",
                    redirect: 'follow',
                    headers: myHeaders,
                };
                  const response = fetchfromZebullAPI("https://zebull.in/rest/MobullService/api/positionAndHoldings/squareOffAllPositions",request);
                  console.log("API SqOff",response);
                }
              }
            })
          }
          ); 
        });

        tvWidget.watchList().then(async  (watchlistObj) => {
          var chartWatchlist = new ChartWatchlists(watchlistObj);
           console.log(`"[chartWatchlist] Init chartWatchlist :: "`,watchlistObj,chartWatchlist)

          // getWatchlistdata("mwGrpq").then((watchlists) => {  //get list of watchlist # this.brokerClass.watchlists()
            var mwid =await getMWValues();
             console.log(`"MWID >>>>>>>>>>>>>>>",${mwid}`,mwid)
            var watchlists = mwid.values;
            watchlists.forEach((watchlist,i) => {
              
                chartWatchlist.addWatchlist({"id":watchlist,"name":watchlist});

            })
              // var mwid =await getMWValues();
             
              // let a = [];
              // for(let i in mwid.values){
              //   logMessage(`"II",${i,mwid.values[i]}`)
              //   a.push({"id":mwid.values[i],"name":mwid.values[i]})
              // }
              // chartWatchlist.addWatchlist(a);
            // });
          // });
        //  updateWatchlist("WatchHere")

          //  chartWatchlist.getme()
        // chartWatchlist.createWatchlist("WatchHere","HDFC","HDFC")
          function updateWatchlist(listId, name, name2) {
            logMessage(`"[watchlist] updateWatchlist listId",${listId}`)
            chartWatchlist.updateWatchlist(listId);
          }
          function renameWatchList(listId, oldName, newName) {
            window.dataLayer.push({
              event: "tv-watchlist-renamed",
            });
            chartWatchlist.renameWatchlist(listId, oldName, newName);
          }
          function createWatchlist(listId, name, symbols) {
            
            window.dataLayer.push({
              event: "tv-watchlist-created",
            });
            chartWatchlist.createWatchlist(listId, name, symbols);
          }
          function deleteWatchlist(listId) {
            
            window.dataLayer.push({
              event: "tv-watchlist-deleted",
            });
            chartWatchlist.deleteWatchlist(listId);
          }
          watchlistObj.onListChanged().subscribe(null, updateWatchlist, false);
          watchlistObj.onListRenamed().subscribe(null, renameWatchList, false);
          watchlistObj.onListAdded().subscribe(null, createWatchlist, false);
          watchlistObj.onListRemoved().subscribe(null, deleteWatchlist, false);
        });
      });
    },
  },
  destroyed() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.TVChartContainer {
  height: calc(100vh);
}
</style>
