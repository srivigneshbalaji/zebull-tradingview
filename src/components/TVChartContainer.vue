<template>
  <div class="TVChartContainer" :id="containerId" />
</template>
 <script type="text/javascript" src="../../public/broker-sample/dist/bundle.js"></script>
<script>
import { widget } from "../../public/charting_library";
import Datafeed from "../mixins/feedFactory.js";
import {ChartWatchlists} from "../mixins/marketWatchList.js";
import { getWatchlist } from '../mixins/apiConnectionPool.js';
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
      default: "RELIANCE",
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
      default: "/charting_library/",
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
    return {};
  },

  created: function () {
    this.$root.$refs.TVChartContainer = this;
  },
  mounted() {
    // const container = this.$refs.chartContainer;
    this.initTWChart();
    // console.log("Datafeed :: ",Datafeed)
  },

  methods: {
    initTWChart() {
      console.log("Datafeed :::::::: ", Datafeed);
      const widgetOptions = {
        symbol: this.symbol,
        datafeed: Datafeed,
        interval: this.interval,
        container: this.containerId,
        library_path: this.libraryPath,

        locale: getLanguageFromURL() || "en",
        disabled_features: ["use_localstorage_for_settings"],
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
          // console.log("host ======= ",host)
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
            supportEditAmount: false,
          },
          durations: [
            { name: "DAY", value: "DAY" },
            { name: "GTC", value: "GTC" },
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
          const button = tvWidget.createButton();

          button.setAttribute("title", "Click to show a notification popup");
          button.classList.add("apply-common-tooltip");

          button.addEventListener("click", () =>
            tvWidget.showNoticeDialog({
              title: "Notification",
              body: "TradingView Charting Library API works correctly",
              callback: () => {
                // eslint-disable-next-line no-console
                console.log("Noticed!");
              },
            })
          );

          button.innerHTML = "Check API";
        });

        tvWidget.watchList().then((watchlistObj) => {
          var chartWatchlist = new ChartWatchlists(watchlistObj);
           console.log("[chartWatchlist] chartWatchlist :: ",chartWatchlist)
          getWatchlist("mwGrpq").then((watchlists) => {  //get list of watchlist # this.brokerClass.watchlists()
            console.log("[chartWatchlist] watchlists :: ",watchlists,typeof(watchlists))
            // watchlists.forEach(watchlistdata => {
              // console.log("[watchlist ,I] ",watchlistdata)
              chartWatchlist.addWatchlist(watchlists);
            // });
          });

          function updateWatchlist(listId, name, name2) {
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

      // console.log("tvWidget @@@@=======> ", tvWidget); //.getList()
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
  height: calc(100vh - 12px);
}
</style>
