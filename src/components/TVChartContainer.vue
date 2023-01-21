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
          const fundButton = tvWidget.createButton();
          const refreshButton = tvWidget.createButton();
          const logoutButton = tvWidget.createButton({align:"right"});
          const exitAllPosButton = tvWidget.createButton();
          fundButton.setAttribute("title", "Add Funds to your Account");
          refreshButton.setAttribute("title","Reset Chart");
          logoutButton.setAttribute("title","Logout from your Account");
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
          fundButton.innerHTML = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24" version="1.1"><g id="surface1"><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 20.277344 15.109375 C 20.46875 15.109375 20.644531 15.265625 20.71875 15.5 L 23.933594 23.054688 C 24.023438 23.28125 23.984375 23.738281 23.980469 24 L 0.0195312 24 L 0.0195312 23.347656 C 0.0195312 23.230469 0.0429688 23.117188 0.0898438 23.015625 L 3.351562 15.449219 C 3.433594 15.238281 3.597656 15.109375 3.773438 15.109375 L 9.765625 15.109375 L 8.441406 12.050781 C 8.363281 11.925781 8.296875 11.792969 8.234375 11.648438 L 8.027344 11.167969 C 8.007812 11.191406 7.988281 11.214844 7.964844 11.230469 L 7.621094 11.492188 L 7.5625 11.527344 C 7.167969 11.769531 6.703125 11.632812 6.421875 11.1875 C 6.398438 11.234375 6.367188 11.273438 6.332031 11.300781 L 5.988281 11.5625 C 5.96875 11.574219 5.949219 11.585938 5.925781 11.59375 C 5.5 11.855469 4.996094 11.675781 4.726562 11.167969 C 4.71875 11.1875 4.707031 11.203125 4.691406 11.21875 L 4.347656 11.480469 L 4.289062 11.515625 C 3.261719 12.039062 2.726562 10.785156 2.304688 9.769531 L 2.191406 9.507812 L 1.671875 8.351562 L 1.65625 8.3125 C 1.261719 7.304688 1.277344 6.425781 1.296875 5.425781 C 1.296875 5.253906 1.296875 5.085938 1.296875 4.847656 C 1.296875 4.847656 1.296875 4.847656 1.296875 4.832031 C 1.285156 4.34375 1.359375 3.863281 1.507812 3.417969 C 1.644531 3.023438 1.871094 2.691406 2.15625 2.476562 L 5.117188 0.183594 C 5.394531 -0.0507812 5.742188 -0.0625 6.03125 0.148438 C 6.335938 0.375 6.59375 0.691406 6.796875 1.074219 L 10.171875 3.179688 L 10.1875 3.179688 C 10.230469 3.203125 10.277344 3.230469 10.328125 3.265625 L 11.859375 2.085938 L 17.480469 15.109375 Z M 9.960938 12.742188 L 11.71875 16.851562 C 11.945312 16.675781 12.214844 16.628906 12.46875 16.71875 C 12.722656 16.808594 12.9375 17.03125 13.066406 17.332031 L 15.355469 15.566406 C 15.085938 14.933594 15.246094 14.128906 15.71875 13.765625 L 12.050781 5.253906 C 11.578125 5.617188 10.972656 5.402344 10.699219 4.773438 L 8.945312 6.132812 L 9.015625 6.289062 L 10.4375 9.601562 C 10.589844 9.359375 10.773438 9.15625 10.980469 8.996094 C 11.917969 8.269531 13.125 8.699219 13.667969 9.957031 C 14.210938 11.214844 13.890625 12.824219 12.949219 13.550781 C 12.007812 14.277344 10.804688 13.847656 10.261719 12.589844 L 10.246094 12.558594 L 10.191406 12.601562 C 10.117188 12.660156 10.035156 12.707031 9.953125 12.742188 Z M 8.359375 4.789062 L 9.570312 3.847656 L 6.4375 2.085938 C 6.394531 2.0625 6.355469 2.019531 6.328125 1.96875 C 6.171875 1.652344 5.96875 1.386719 5.730469 1.183594 C 5.613281 1.09375 5.472656 1.09375 5.359375 1.183594 L 2.511719 3.390625 C 2.332031 3.535156 2.1875 3.746094 2.101562 4.003906 C 1.996094 4.289062 2.027344 4.589844 2.027344 5.027344 C 2.03125 5.035156 2.03125 5.042969 2.027344 5.050781 C 2.027344 5.214844 2.027344 5.425781 2.027344 5.632812 C 2.011719 6.527344 1.925781 7.042969 2.253906 7.886719 L 2.761719 9.007812 C 2.769531 9.019531 2.777344 9.035156 2.785156 9.054688 C 2.785156 9.070312 2.835938 9.175781 2.898438 9.316406 C 3.214844 10.070312 3.605469 11.003906 4.171875 10.722656 L 4.421875 10.527344 C 4.332031 10.3125 4.25 10.089844 4.171875 9.875 C 4.089844 9.660156 4.03125 9.496094 3.957031 9.328125 C 3.878906 9.144531 3.925781 8.914062 4.0625 8.804688 C 4.195312 8.699219 4.371094 8.761719 4.449219 8.945312 C 4.523438 9.117188 4.601562 9.324219 4.683594 9.535156 C 4.957031 10.269531 5.269531 11.101562 5.730469 10.882812 L 6.058594 10.621094 C 6.078125 10.609375 6.097656 10.597656 6.117188 10.589844 C 6.003906 10.328125 5.902344 10.066406 5.804688 9.804688 C 5.730469 9.613281 5.664062 9.429688 5.589844 9.257812 C 5.527344 9.140625 5.515625 8.984375 5.566406 8.855469 C 5.617188 8.726562 5.71875 8.648438 5.828125 8.652344 C 5.933594 8.652344 6.03125 8.738281 6.078125 8.871094 C 6.152344 9.042969 6.230469 9.25 6.3125 9.464844 C 6.582031 10.195312 6.894531 11.03125 7.355469 10.808594 L 7.6875 10.550781 C 7.707031 10.53125 7.730469 10.519531 7.757812 10.511719 L 7.199219 9.238281 C 7.121094 9.054688 7.167969 8.820312 7.304688 8.714844 C 7.441406 8.609375 7.617188 8.671875 7.695312 8.851562 L 8.738281 11.269531 C 8.988281 11.847656 9.324219 12.082031 9.617188 12.050781 C 9.722656 12.046875 9.820312 12.003906 9.910156 11.933594 C 9.957031 11.902344 10 11.859375 10.035156 11.808594 C 10.035156 11.777344 10.058594 11.761719 10.082031 11.746094 C 10.101562 11.714844 10.121094 11.6875 10.136719 11.652344 C 10.296875 11.273438 10.296875 10.804688 10.136719 10.425781 L 10.136719 10.402344 C 10.117188 10.347656 10.09375 10.289062 10.070312 10.234375 L 7.882812 5.21875 C 7.808594 5.042969 7.847656 4.824219 7.972656 4.710938 C 8.097656 4.597656 8.265625 4.632812 8.359375 4.789062 Z M 10.308594 16.398438 L 4.054688 16.398438 L 1.285156 22.699219 L 22.722656 22.699219 L 19.988281 16.386719 L 16.632812 16.386719 L 13.433594 18.863281 L 16.386719 18.863281 C 16.566406 18.851562 16.734375 18.96875 16.828125 19.175781 C 16.921875 19.378906 16.921875 19.636719 16.828125 19.84375 C 16.734375 20.046875 16.566406 20.167969 16.386719 20.152344 L 8.316406 20.152344 C 8.140625 20.167969 7.96875 20.046875 7.875 19.84375 C 7.785156 19.640625 7.785156 19.382812 7.875 19.179688 C 7.96875 18.972656 8.140625 18.855469 8.316406 18.871094 L 11.386719 18.871094 L 10.316406 16.402344 Z M 10.308594 16.398438 "/></g></svg>';
          refreshButton.addEventListener("click", () =>
            tvWidget.activeChart().executeActionById("chartReset")
          );        
          refreshButton.innerHTML='<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24" version="1.1"><g id="surface1"><path style=" stroke:none;fill-rule:evenodd;fill:rgb(26.27451%,25.098039%,25.098039%);fill-opacity:1;" d="M 19.15625 12.796875 C 19.1875 13.0625 19.203125 13.332031 19.203125 13.601562 C 19.203125 17.578125 15.976562 20.796875 12 20.796875 C 8.179688 20.796875 5.027344 17.8125 4.816406 14 C 4.605469 10.183594 7.40625 6.871094 11.203125 6.445312 L 11.203125 9.601562 L 17.601562 4.796875 L 11.203125 0 L 11.203125 3.226562 C 5.828125 3.640625 1.601562 8.125 1.601562 13.601562 C 1.601562 19.34375 6.257812 24 12 24 C 17.742188 24 22.398438 19.34375 22.398438 13.601562 C 22.398438 13.328125 22.390625 13.0625 22.375 12.796875 Z M 19.15625 12.796875 "/></g></svg>';
          logoutButton.addEventListener("click", () =>{
            console.log("Logout");
          }
          ); 
          logoutButton.innerHTML='Logout'; 
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
          exitAllPosButton.innerHTML='<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24" version="1.1"><g id="surface1"><path style=" stroke:none;fill-rule:nonzero;fill:rgb(60.392157%,81.960784%,29.411765%);fill-opacity:1;" d="M 22.371094 19.671875 L 1.628906 19.671875 C 0.960938 19.671875 0.417969 19.128906 0.417969 18.460938 L 0.417969 10.574219 C 0.417969 9.902344 0.960938 9.363281 1.628906 9.363281 L 22.371094 9.363281 C 23.039062 9.363281 23.582031 9.902344 23.582031 10.574219 L 23.582031 18.460938 C 23.582031 19.128906 23.039062 19.671875 22.371094 19.671875 Z M 22.371094 19.671875 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(96.862745%,69.803922%,22.352941%);fill-opacity:1;" d="M 13.0625 5.390625 C 13.0625 5.976562 12.585938 6.453125 12 6.453125 C 11.414062 6.453125 10.9375 5.976562 10.9375 5.390625 C 10.9375 4.804688 11.414062 4.328125 12 4.328125 C 12.585938 4.328125 13.0625 4.804688 13.0625 5.390625 Z M 13.0625 5.390625 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(94.901961%,94.901961%,94.901961%);fill-opacity:1;" d="M 14.125 12.113281 C 13.890625 12.113281 13.707031 12.300781 13.707031 12.535156 L 13.707031 16.5 C 13.707031 16.730469 13.890625 16.917969 14.125 16.917969 C 14.355469 16.917969 14.542969 16.730469 14.542969 16.5 L 14.542969 12.535156 C 14.542969 12.300781 14.355469 12.113281 14.125 12.113281 Z M 14.125 12.113281 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(94.901961%,94.901961%,94.901961%);fill-opacity:1;" d="M 12.042969 12.1875 C 11.851562 12.058594 11.589844 12.109375 11.460938 12.300781 L 10.472656 13.769531 L 9.480469 12.300781 C 9.351562 12.109375 9.089844 12.058594 8.898438 12.1875 C 8.707031 12.316406 8.65625 12.574219 8.785156 12.765625 L 9.964844 14.515625 L 8.785156 16.265625 C 8.65625 16.457031 8.707031 16.71875 8.898438 16.847656 C 8.96875 16.894531 9.050781 16.917969 9.132812 16.917969 C 9.265625 16.917969 9.398438 16.851562 9.480469 16.734375 L 10.472656 15.265625 L 11.460938 16.734375 C 11.542969 16.851562 11.675781 16.917969 11.808594 16.917969 C 11.890625 16.917969 11.972656 16.894531 12.042969 16.847656 C 12.234375 16.71875 12.285156 16.457031 12.15625 16.265625 L 10.976562 14.515625 L 12.15625 12.765625 C 12.285156 12.574219 12.234375 12.316406 12.042969 12.1875 Z M 12.042969 12.1875 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(94.901961%,94.901961%,94.901961%);fill-opacity:1;" d="M 7.460938 12.953125 C 7.691406 12.953125 7.878906 12.765625 7.878906 12.535156 C 7.878906 12.300781 7.691406 12.113281 7.460938 12.113281 L 5.117188 12.113281 C 4.882812 12.113281 4.699219 12.300781 4.699219 12.535156 L 4.699219 16.5 C 4.699219 16.730469 4.882812 16.917969 5.117188 16.917969 L 7.460938 16.917969 C 7.691406 16.917969 7.878906 16.730469 7.878906 16.5 C 7.878906 16.269531 7.691406 16.082031 7.460938 16.082031 L 5.535156 16.082031 L 5.535156 14.976562 L 6.289062 14.976562 C 6.519531 14.976562 6.707031 14.789062 6.707031 14.558594 C 6.707031 14.328125 6.519531 14.140625 6.289062 14.140625 L 5.535156 14.140625 L 5.535156 12.953125 Z M 7.460938 12.953125 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(94.901961%,94.901961%,94.901961%);fill-opacity:1;" d="M 18.882812 12.113281 L 16 12.113281 C 15.765625 12.113281 15.582031 12.300781 15.582031 12.535156 C 15.582031 12.765625 15.765625 12.953125 16 12.953125 L 17.023438 12.953125 L 17.023438 16.5 C 17.023438 16.730469 17.210938 16.917969 17.441406 16.917969 C 17.671875 16.917969 17.859375 16.730469 17.859375 16.5 L 17.859375 12.953125 L 18.882812 12.953125 C 19.117188 12.953125 19.300781 12.765625 19.300781 12.535156 C 19.300781 12.300781 19.117188 12.113281 18.882812 12.113281 Z M 18.882812 12.113281 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(20%,20%,20%);fill-opacity:1;" d="M 22.371094 8.945312 L 17.207031 8.945312 L 13.46875 5.207031 C 13.375 4.476562 12.753906 3.910156 12 3.910156 C 11.246094 3.910156 10.625 4.476562 10.53125 5.207031 L 6.792969 8.945312 L 1.628906 8.945312 C 0.730469 8.945312 0 9.675781 0 10.574219 L 0 18.460938 C 0 19.359375 0.730469 20.089844 1.628906 20.089844 L 22.371094 20.089844 C 23.269531 20.089844 24 19.359375 24 18.460938 L 24 10.574219 C 24 9.675781 23.269531 8.945312 22.371094 8.945312 Z M 12 4.746094 C 12.355469 4.746094 12.644531 5.035156 12.644531 5.390625 C 12.644531 5.746094 12.355469 6.035156 12 6.035156 C 11.644531 6.035156 11.355469 5.746094 11.355469 5.390625 C 11.355469 5.035156 11.644531 4.746094 12 4.746094 Z M 10.746094 6.175781 C 11.007812 6.59375 11.472656 6.871094 12 6.871094 C 12.527344 6.871094 12.992188 6.59375 13.253906 6.175781 L 16.023438 8.945312 L 7.976562 8.945312 Z M 23.164062 18.460938 C 23.164062 18.898438 22.808594 19.253906 22.371094 19.253906 L 1.628906 19.253906 C 1.191406 19.253906 0.835938 18.898438 0.835938 18.460938 L 0.835938 10.574219 C 0.835938 10.136719 1.191406 9.78125 1.628906 9.78125 L 22.371094 9.78125 C 22.808594 9.78125 23.164062 10.136719 23.164062 10.574219 Z M 23.164062 18.460938 "/></g></svg>'; 
        });

        tvWidget.watchList().then(async  (watchlistObj) => {
          var chartWatchlist = new ChartWatchlists(watchlistObj);
           console.log(`"[chartWatchlist] Init chartWatchlist :: "`,watchlistObj,chartWatchlist)

          // getWatchlistdata("mwGrpq").then((watchlists) => {  //get list of watchlist # this.brokerClass.watchlists()
            var mwid =await getMWValues();
             console.log(`"MWID >>>>>>>>>>>>>>>",${mwid}`,mwid)
            var watchlists=mwid.values
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
  height: calc(100vh - 12px);
}
</style>
