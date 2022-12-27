<template>
  <div class="TVChartContainer" :id="containerId" />
</template>

<script>
import { widget } from "../../public/charting_library";
// import Datafeed from '../mixins/datafeed.js';

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
      default: "AAPL",
      type: String,
    },
    interval: {
      default: "D",
      type: String,
    },
    containerId: {
      default: "tv_chart_container",
      type: String,
    },
    datafeedUrl: {
      default: "https://demo_feed.tradingview.com",
      type: String,
    },
    libraryPath: {
      default: "/charting_library/",
      type: String,
    },
    chartsStorageUrl: {
      default: "https://saveload.tradingview.com",
      type: String,
    },
    chartsStorageApiVersion: {
      default: "1.1",
      type: String,
    },
    clientId: {
      default: "tradingview.com",
      type: String,
    },
    userId: {
      default: "public_user_id",
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
      const widgetOptions = {
        symbol: this.symbol,
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.datafeedUrl),
        interval: this.interval,
        container_id: this.containerId,
        library_path: this.libraryPath,

        locale: getLanguageFromURL() || "en",
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates","dom_widget"],
        charts_storage_url: this.chartsStorageUrl,
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
            default_symbols: ["MSFT", "IBM", "AAPL"],
          },
        },

        // sample news feed widget 
        rss_news_feed: {
						"default": [ {
							url: "https://demo-feed-data.tradingview.com/news?symbol={SYMBOL}",
							name: "Yahoo Finance"
						} ]
					},

          broker_factory: function(host) {
             return new Brokers.BrokerSample(host, datafeed); 
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
							{ name: 'DAY', value: 'DAY' },
							{ name: 'GTC', value: 'GTC' },
						],
						orderDialogOptions: {
							customFields: [
								{
									id: '2410',
									inputType: 'ComboBox',
									title: 'Execution',
									items: [
										{
											text: 'General',
											value: 'General',
										},
										{
											text: 'Iceberg',
											value: 'Iceberg',
										},
										{
											text: 'AOL',
											value: 'AOL',
										},
									],
								},
							],
						},
					},
				}

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
  height: calc(100vh - 12px);
}
</style>
