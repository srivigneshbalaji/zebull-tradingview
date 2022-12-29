<template>
  <div class="TVChartContainer" :id="containerId" />
</template>
 <script type="text/javascript" src="../../public/broker-sample/dist/bundle.js"></script>
<script>
import { widget } from "../../public/charting_library";
import Datafeed from "../mixins/datafeed.js";

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
      default: "Bitfinex:BTC/USD",
      type: String,
    },
    interval: {
      default: "1D",
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

  data() {
    return {
      tradebook: [
        {
          Filltime: "09:34:06",
          usecs: "511861",
          Ordduration: "DAY",
          ExchordID: "1500000009969055",
          Qty: 25,
          ordergenerationtype: "--",
          strikeprice: "43200.00",
          AvgPrice: "86.30",
          Prctype: "L",
          Minqty: 0,
          Exchseg: "nse_fo",
          Pcode: "MIS",
          FillLeg: 1,
          Exchange: "NFO",
          accountId: "ZE1A40",
          Price: "86.30",
          Trantype: "B",
          companyname: "",
          Exchtime: "28-Dec-2022 09:34:06",
          bqty: 25,
          Filldate: "28-Dec-2022",
          AlgoCategory: "NA",
          Custofrm: "C",
          expdate: "1356791400",
          optiontype: "CE",
          AlgoID: "NA",
          Symbol: "42549",
          Filledqty: 25,
          Time: "28/12/2022 09:34:06",
          symbolname: "BANKNIFTY",
          BrokerClient: "--",
          NOReqID: "1",
          OrderUserMessage: "",
          Tsym: "BANKNIFTY29DEC2243200CE",
          Nstordno: "221228000004165",
          ReportType: "fill",
          Expiry: "29 Dec, 2022",
          stat: "Ok",
          PriceDenomenator: "1",
          panNo: "COIPG5230A",
          PriceNumerator: "1",
          posflag: "true",
          GeneralDenomenator: "1",
          FillId: "431120862",
          Fillqty: 25,
          series: "XX",
          GeneralNumerator: "1",
          user: "ZE1A40",
          remarks: "--",
          iSinceBOE: 1672200246,
        },
        {
          Filltime: "09:30:17",
          usecs: "843093",
          Ordduration: "DAY",
          ExchordID: "1700000010963206",
          Qty: 25,
          ordergenerationtype: "--",
          strikeprice: "42400.00",
          AvgPrice: "107.85",
          Prctype: "L",
          Minqty: 0,
          Exchseg: "nse_fo",
          Pcode: "MIS",
          FillLeg: 1,
          Exchange: "NFO",
          accountId: "ZE1A40",
          Price: "107.85",
          Trantype: "S",
          companyname: "",
          Exchtime: "28-Dec-2022 09:30:17",
          bqty: 25,
          Filldate: "28-Dec-2022",
          AlgoCategory: "NA",
          Custofrm: "C",
          expdate: "1356791400",
          optiontype: "PE",
          AlgoID: "NA",
          Symbol: "35074",
          Filledqty: 25,
          Time: "28/12/2022 09:30:27",
          symbolname: "BANKNIFTY",
          BrokerClient: "--",
          NOReqID: "1",
          OrderUserMessage: "",
          Tsym: "BANKNIFTY29DEC2242400PE",
          Nstordno: "221228000004081",
          ReportType: "fill",
          Expiry: "29 Dec, 2022",
          stat: "Ok",
          PriceDenomenator: "1",
          panNo: "COIPG5230A",
          PriceNumerator: "1",
          posflag: "true",
          GeneralDenomenator: "1",
          FillId: "602837565",
          Fillqty: 25,
          series: "XX",
          GeneralNumerator: "1",
          user: "ZE1A40",
          remarks: "--",
          iSinceBOE: 1672200027,
        },
        {
          Filltime: "09:30:17",
          usecs: "842978",
          Ordduration: "DAY",
          ExchordID: "1500000009791057",
          Qty: 25,
          ordergenerationtype: "--",
          strikeprice: "43200.00",
          AvgPrice: "68.50",
          Prctype: "L",
          Minqty: 0,
          Exchseg: "nse_fo",
          Pcode: "MIS",
          FillLeg: 1,
          Exchange: "NFO",
          accountId: "ZE1A40",
          Price: "68.50",
          Trantype: "S",
          companyname: "",
          Exchtime: "28-Dec-2022 09:30:17",
          bqty: 25,
          Filldate: "28-Dec-2022",
          AlgoCategory: "NA",
          Custofrm: "C",
          expdate: "1356791400",
          optiontype: "CE",
          AlgoID: "NA",
          Symbol: "42549",
          Filledqty: 25,
          Time: "28/12/2022 09:30:27",
          symbolname: "BANKNIFTY",
          BrokerClient: "--",
          NOReqID: "1",
          OrderUserMessage: "",
          Tsym: "BANKNIFTY29DEC2243200CE",
          Nstordno: "221228000004080",
          ReportType: "fill",
          Expiry: "29 Dec, 2022",
          stat: "Ok",
          PriceDenomenator: "1",
          panNo: "COIPG5230A",
          PriceNumerator: "1",
          posflag: "true",
          GeneralDenomenator: "1",
          FillId: "430963027",
          Fillqty: 25,
          series: "XX",
          GeneralNumerator: "1",
          user: "ZE1A40",
          remarks: "--",
          iSinceBOE: 1672200027,
        },
      ],
    };
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
      const widgetOptions = {
        symbol: this.symbol,
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: Datafeed, //new window.Datafeeds.UDFCompatibleDatafeed(this.datafeedUrl),
        interval: this.interval,
        container: this.containerId,
        library_path: this.libraryPath,

        locale: getLanguageFromURL() || "en",
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates", "dom_widget"],
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
          default: [
            {
              url: "https://demo-feed-data.tradingview.com/news?symbol={SYMBOL}",
              name: "Yahoo Finance",
            },
          ],
        },

        broker_factory: function (host) {
          console.log("host ======= ",host)
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
