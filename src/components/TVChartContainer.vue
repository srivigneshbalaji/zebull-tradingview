<template>
  <div>
    <div v-if="usernotfound" class="desktopview d-none d-sm-block">
      <div class="TVChartContainer" :id="containerId" />
      <v-snackbar class="pt-6 pr-6" style="z-index: 2 !important;" transition="slide-x-reverse-transition"
        v-model="snackbar" :timeout="10000" :value="true" :color="snackbarclr" absolute outlined top right>
        <v-icon class="mr-2" :color="snackbarclr">mdi-alert-outline</v-icon>
        {{ snackmsgbar }}
      </v-snackbar>
      <div class="myntlogoplace">
        <v-card :color="showtheme ? '#131722' : '#ffffff'" width="100%" class="px-2 rounded-0 elevation-0">
          <img src="@/assets/Mynt_pro_logo.svg" width="100%">
        </v-card>
      </div>
      <div class="custappbar">
        <v-card :color="showtheme ? '#131722' : '#ffffff'" width="100%" class="rounded-0 elevation-0">
          <v-row no-gutters>
            <v-col cols="2" class="pa-0">
              <v-dialog v-model="usermun" width="300">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn :dark="showtheme" v-bind="attrs" v-on="on" style="margin:2px; height:34px;"
                    class="px-1 rounded-0 userbtn" text :ripple="false">
                    <v-list-item-title class="body-2 font-weight-medium">
                      <span>
                        {{ cliid }}
                      </span>
                    </v-list-item-title>
                  </v-btn>
                </template>
                <v-card :dark="showtheme" :color="showtheme ? '#131722' : '#ffffff'"
                  class="py-2 rounded-md elevation-0">
                  <v-list-item v-if="ssologinfo == 'ZebullOk'" class="pl-4 pr-0">
                    <v-list-item-avatar color="teal" class="text-center">
                      <p class="white--text font-weight-bold headline text-uppercase mb-0">{{
                        cliname.slice(0, 1)
                      }}</p>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold ">{{ cliname }}</v-list-item-title>
                      <v-list-item-subtitle class="font-weight-bold ">{{ cliid }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>

                  <v-list-item @click="prosett()">
                    <v-list-item-content>
                      <v-list-item-title>Profile Settings</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <!-- <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Account and Billing</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item> -->
                  <!-- <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Help Center</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>What's new</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-content class="text-center">
                        <v-list-item-title><v-badge content="11" color="#f7525f"></v-badge></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item> -->
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Dark color theme</v-list-item-title>
                    </v-list-item-content>
                    <v-switch v-model="themeswitch" class="ma-0 pa-0"></v-switch>
                  </v-list-item>

                  <v-divider class="mb-2"></v-divider>
                  <v-list-item @click="logout()">
                    <v-list-item-content>
                      <v-list-item-title>Sign Out</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-dialog>
            </v-col>
            <!-- <v-divider style="margin-bottom:6px;" vertical></v-divider>
          <v-col cols="10" class="pa-0 ">
            <v-list-item class="mt-n1 px-3 ">
              <v-list-item-content class="pa-0">
                <v-list-item-title class="caption mb-0 font-weight-bold">NIFTY 50</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content class="pa-0 pr-3 text-right">
                <v-list-item-title class="overline">34345.00</v-list-item-title>
                <v-list-item-subtitle style="font-size:10px;" class="">80.9(12.0%)</v-list-item-subtitle>
              </v-list-item-content>

              <v-divider style="margin-bottom:6px;" vertical></v-divider>

              <v-list-item-content class="pa-0 pl-3">
                <v-list-item-title class="caption mb-0 font-weight-bold">BANK NIFTY</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content class="pa-0 text-right">
                <v-list-item-title class="overline">34345.00</v-list-item-title>
                <v-list-item-subtitle style="font-size:10px;" class="">80.9(12.0%)</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col> -->
          </v-row>
        </v-card>
      </div>
      <!-- <div class="optchibtn"> -->
      <v-btn :dark="showtheme" @click="optchi" text small class="optchibtn rounded-sm elevation-0" :ripple="false">
        <span class="font-weight-bold">OC</span>
      </v-btn>
      <!-- </div> -->

      <!-- <v-dialog v-model="profilesetting" > -->
      <div v-if="profilesetting" ref="prosettcard" class="prosetsty prosettcard" @mousedown="prosettMouseDown"
        @mouseup="prosettDragElement">
        <slot name="content">
          <v-card :dark="showtheme" :color="showtheme ? '#131722' : '#ffffff'" min-width="620" height="94vh"
            class="py-4 rounded-md">
            <v-row no-gutters class="px-4" style="cursor: -webkit-grabbing; cursor: grabbing;">
              <v-col cols="10" class="text-left">
                <span style="font-size: 20px;font-weight: 600;line-height: 28px;">Profile
                  Settings</span>
              </v-col>
              <v-col cols="2" class="text-right">
                <v-btn tile icon @click="profilesetting = false">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17"
                    fill="currentColor">
                    <path d="m.58 1.42.82-.82 15 15-.82.82z"></path>
                    <path d="m.58 15.58 15-15 .82.82-15 15z"></path>
                  </svg>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>
            <div class="py-16"></div>
          </v-card>
        </slot>
      </div>

      <div id="optchiid" ref="optchicard" class="optchisty optchicard" @mousedown="optchiMouseDown"
        @mouseup="optchiDragElement">
        <slot name="content">
          <v-card :dark="showtheme" :color="showtheme ? '#131722' : '#ffffff'" min-width="960px" height="94vh"
            class="py-4 rounded-md">
            <v-row no-gutters class="px-4 pt-2" style="cursor: -webkit-grabbing; cursor: grabbing;">
              <v-col cols="11" class="text-left">
                <v-row no-gutters>
                  <v-col cols="2" class="text-left pl-4">
                    <p class="font-weight-bold title mb-0">NIFTY 50</p>

                  </v-col>
                  <v-col cols="4" class="text-left pl-0">
                    <p class="font-weight-medium subtitle-1 mb-0">Fut: <span
                        class="font-weight-bold title">17891.00</span> <span
                        class="green--text font-weight-regular body-1">22.30 (1.31%)</span></p>
                  </v-col>
                  <v-col cols="4" class="text-left">
                    <p class="font-weight-medium subtitle-1 mb-0">Spot: <span
                        class="font-weight-bold title">17891.00</span> <span
                        class="red--text font-weight-regular body-1">-61.30 (7.31%)</span></p>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="1" class="text-right px-0">
                <v-row no-gutters>
                  <v-btn tile icon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
                      <g fill="currentColor" fill-rule="evenodd">
                        <path fill-rule="nonzero"
                          d="M14 17a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z">
                        </path>
                        <path
                          d="M5.005 16A1.003 1.003 0 0 1 4 14.992v-1.984A.998.998 0 0 1 5 12h1.252a7.87 7.87 0 0 1 .853-2.06l-.919-.925c-.356-.397-.348-1 .03-1.379l1.42-1.42a1 1 0 0 1 1.416.007l.889.882A7.96 7.96 0 0 1 12 6.253V5c0-.514.46-1 1-1h2c.557 0 1 .44 1 1v1.253a7.96 7.96 0 0 1 2.06.852l.888-.882a1 1 0 0 1 1.416-.006l1.42 1.42a.999.999 0 0 1 .029 1.377s-.4.406-.918.926a7.87 7.87 0 0 1 .853 2.06H23c.557 0 1 .447 1 1.008v1.984A.998.998 0 0 1 23 16h-1.252a7.87 7.87 0 0 1-.853 2.06l.882.888a1 1 0 0 1 .006 1.416l-1.42 1.42a1 1 0 0 1-1.415-.007l-.889-.882a7.96 7.96 0 0 1-2.059.852v1.248c0 .56-.45 1.005-1.008 1.005h-1.984A1.004 1.004 0 0 1 12 22.995v-1.248a7.96 7.96 0 0 1-2.06-.852l-.888.882a1 1 0 0 1-1.416.006l-1.42-1.42a1 1 0 0 1 .007-1.415l.882-.888A7.87 7.87 0 0 1 6.252 16H5.005zm3.378-6.193l-.227.34A6.884 6.884 0 0 0 7.14 12.6l-.082.4H5.005C5.002 13 5 13.664 5 14.992c0 .005.686.008 2.058.008l.082.4c.18.883.52 1.71 1.016 2.453l.227.34-1.45 1.46c-.004.003.466.477 1.41 1.422l1.464-1.458.34.227a6.959 6.959 0 0 0 2.454 1.016l.399.083v2.052c0 .003.664.005 1.992.005.005 0 .008-.686.008-2.057l.399-.083a6.959 6.959 0 0 0 2.454-1.016l.34-.227 1.46 1.45c.003.004.477-.466 1.422-1.41l-1.458-1.464.227-.34A6.884 6.884 0 0 0 20.86 15.4l.082-.4h2.053c.003 0 .005-.664.005-1.992 0-.005-.686-.008-2.058-.008l-.082-.4a6.884 6.884 0 0 0-1.016-2.453l-.227-.34 1.376-1.384.081-.082-1.416-1.416-1.465 1.458-.34-.227a6.959 6.959 0 0 0-2.454-1.016L15 7.057V5c0-.003-.664-.003-1.992 0-.005 0-.008.686-.008 2.057l-.399.083a6.959 6.959 0 0 0-2.454 1.016l-.34.227-1.46-1.45c-.003-.004-.477.466-1.421 1.408l1.457 1.466z">
                        </path>
                      </g>
                    </svg>
                  </v-btn>
                  <v-btn tile icon @click="optchiidcls">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17"
                      fill="currentColor">
                      <path d="m.58 1.42.82-.82 15 15-.82.82z"></path>
                      <path d="m.58 15.58 15-15 .82.82-15 15z"></path>
                    </svg>
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
            <v-divider class="mt-3 mb-6"></v-divider>
            <div class="px-4">
              <v-row no-gutters class="px-4">
                <v-col cols="5" class="text-center">
                  <v-card class="pa-2" outlined tile>
                    <span class="green--text" style="font-size: 16px;font-weight: 600;line-height: 28px;">Calls</span>
                  </v-card>
                </v-col>
                <v-col cols="2" class="text-center">
                  <v-card class="pa-2" outlined tile>
                    <span style="font-size: 16px;font-weight: 600;line-height: 28px;">Strike</span>
                  </v-card>
                </v-col>
                <v-col cols="5" class="text-center">
                  <v-card class="pa-2" outlined tile>
                    <span class="red--text" style="font-size: 16px;font-weight: 600;line-height: 28px;">Puts</span>
                  </v-card>
                </v-col>
              </v-row>

              <v-row no-gutters class="px-4 mt-4">
                <v-col cols="5" class="text-center">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-center">
                      <v-card class="px-1 py-2 elevation-0" tile>
                        <span style="font-size: 14px;font-weight: 600;line-height: 16px;">OL</span>
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-card class="px-1 py-2 elevation-0" tile>
                        <span style="font-size: 14px;font-weight: 600;line-height: 16px;">OL
                          change</span>
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-card class="px-1 py-2 elevation-0" tile>
                        <span style="font-size: 14px;font-weight: 600;line-height: 16px;">LTP</span>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="2" class="text-center">
                  <v-card class="px-1 py-2 elevation-0" tile>
                    <span style="font-size: 14px;font-weight: 600;line-height: 16px;">Strike
                      Price</span>
                  </v-card>
                </v-col>
                <v-col cols="5" class="text-center">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-center">
                      <v-card class="px-1 py-2 elevation-0" tile>
                        <span style="font-size: 14px;font-weight: 600;line-height: 16px;">LTP</span>
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-card class="px-1 py-2 elevation-0" tile>
                        <span style="font-size: 14px;font-weight: 600;line-height: 16px;">OL</span>
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-card class="px-1 py-2 elevation-0" tile>
                        <span style="font-size: 14px;font-weight: 600;line-height: 16px;">OL
                          change</span>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-row v-for="n in 12" :key="n" no-gutters class="px-4">
                <v-col cols="5" class="text-center">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-center">
                      <v-card class="pa-1" outlined tile>
                        <span style="font-size: 12px;font-weight: 400;line-height: 16px;">0.65</span>
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-card class="pa-1" outlined tile>
                        <span style="font-size: 12px;font-weight: 400;line-height: 16px;">-9.08</span>
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-card class="pa-1" outlined tile>
                        <span class="mb-0" style="font-size: 12px;font-weight: 400;line-height: 16px;">546.87 <span
                            class="green--text">(23.09)</span>
                        </span>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="2" class="text-center">
                  <v-card class="pa-1" outlined tile>
                    <span style="font-size: 14px;font-weight: 600;line-height: 16px;">17,546.87</span>
                  </v-card>
                </v-col>
                <v-col cols="5" class="text-center">
                  <v-row no-gutters>
                    <v-col cols="4" class="text-center">
                      <v-card class="pa-1" outlined tile>
                        <span style="font-size: 12px;font-weight: 400;line-height: 16px;">733.17
                          <span class="red--text">(-13.21)</span>
                        </span>
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-card class="pa-1" outlined tile>
                        <span style="font-size: 12px;font-weight: 400;line-height: 16px;">-9.08</span>
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-card class="pa-1" outlined tile>
                        <span style="font-size: 12px;font-weight: 400;line-height: 16px;">0.65</span>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </slot>
      </div>
      <!-- </v-dialog> -->

      <div class="mobileview d-sm-none">
        <v-container fill-height class="SsoView">
          <v-card class="elevation-0 mx-auto">
            <p class="font-weight-bold title">no screen display</p>
          </v-card>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="../../public/broker-sample/dist/bundle.js"></script>
<script>
import { widget } from "../../public/charting_library";
import Datafeed from "../mixins/feedFactory.js";
import { ChartWatchlists, getMWValues } from "../mixins/marketWatchList.js";
import { fetchfromZebullAPI, getWatchlistdata } from '../mixins/apiConnectionPool.js';
var userid = localStorage.getItem('userid');
var usession = localStorage.getItem('usession');
var theme = 'Light';
import { logMessage, setLogging } from '../utils/helpers.js';
function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export default {
  name: "TVChartContainer",
  name: "DraggableCards",

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
    title: String,
    subtitle: String,
    text: String,
    image: String,
    optchirandomTilt: Boolean,
    prosettrandomTilt: Boolean,
    optchirandomMax: {
      type: Number,
      default: 15,
    },
    optchirandomMin: {
      type: Number,
      default: 10,
    },
    prosettrandomMax: {
      type: Number,
      default: 15,
    },
    prosettrandomMin: {
      type: Number,
      default: 10,
    },
  },
  tvWidget: null,

  data() {
    return {
      usernotfound: true,
      usermun: false,
      profilesetting: false,
      optionchain: false,
      snackbar: false,
      snackbarclr: 'default',
      snackmsgbar: "",

      ssologinfo: "",
      logininfo: "",

      cliid: "",
      cliname: "",
      usession: "",
      themeswitch: false,
      showtheme: false,

      optchipos1: 0,
      optchipos2: 0,
      optchipos3: 0,
      optchipos4: 0,
      optchirotate: 0,

      prosettpos1: 0,
      prosettpos2: 0,
      prosettpos3: 0,
      prosettpos4: 0,
      prosettrotate: 0,
    };
  },

  created: function () {
    var axiosThis = this;

    this.ssologinfo = localStorage.getItem("loginway");
    this.cliid = localStorage.getItem("userid");
    this.usession = localStorage.getItem("usession");
    this.cliname = localStorage.getItem("username");
    console.log("clidexx", this.cliid, this.usession, this.cliname)
    if ((this.cliid != null) && (this.usession != null) && (this.cliname != null) && (this.cliid.length > 0) && (this.usession.length > 0) && (this.cliname.length > 0)) {
      this.usernotfound = true;
    } else {
      this.usernotfound = false;
      this.snackbar = true;
      this.snackbarclr = 'warning';
      this.snackmsgbar = "User not found, Kindly Sign in.";
      setTimeout(function () {
        axiosThis.$router.push("/");
      }, 2000)
    }

    this.$root.$refs.TVChartContainer = this;
  },

  mounted() {
    this.initTWChart();
    setLogging(process.env.NODE_ENV === "development")
    this.theme = 'Dark';

    if (this.optchirandomTilt) {
      this.optchirotate =
        Math.floor(Math.random() * (this.optchirandomMax - this.optchirandomMin)) +
        this.optchirandomMin;}

    if (this.prosettrandomTilt) {
      this.prosettrotate =
        Math.floor(Math.random() * (this.prosettrandomMax - this.prosettrandomMin)) +
        this.prosettrandomMin;}
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
        custom_css_url: '../../css/styles.css',

        // charts_storage_url: this.chartsStorageUrl,
        charts_storage_api_version: this.chartsStorageApiVersion,
        client_id: this.clientId,
        user_id: this.userId,
        fullscreen: this.fullscreen,
        autosize: this.autosize,
        studies_overrides: this.studiesOverrides,
        theme: this.theme,
        // right side widget to watchlist
        widgetbar: {
          calendar: true,
          details: true,
          news: true,
          watchlist: true,
          datawindow: true,
          watchlist: true,
          hotlist: true,
          chat: true,
          publicchats: true,
          notes: true,
          streams: true,
          // publicchats_with_select: true,
          // alerts_manage: true,
          // alerts_log: true,
          // market_summary: true,
          // reuters_calendar: true,
          // earnings_calendar: true,
          // messages_with_select: true,
          // notifications_user: true,
          // notifications_following: true,
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
            supportStopLimitOrders: true,
            supportPlaceOrderPreview: true,
            supportModifyOrderPreview: true
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
          const exitAllPosButton = tvWidget.createButton({ align: "right" });
          const fundButton = tvWidget.createButton({ align: "right" }
            // {
            //     title: 'dropdown',
            //     tooltip: 'tooltip for this dropdown',
            //     items: [
            //         {
            //             title: 'item#1',
            //             onSelect: () => {console.log('1');},
            //         },
            //         {
            //             title: 'item#2',
            //             onSelect: () => {console.log('2');},
            //         },
            //         {
            //             title: 'item#3',
            //             onSelect: () => {console.log('3');},
            //         }
            //     ],
            //     icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><g fill="none" stroke="currentColor"><circle cx="10" cy="10" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path stroke-linecap="square" d="M17.5 7.5l-7 13"/></g></svg>`,
            // }
          );
          const refreshButton = tvWidget.createButton();
          const themeButton = tvWidget.createButton({ align: "left", });

          // const logoutButton = tvWidget.createButton({align:"right"});
          fundButton.setAttribute("title", "Add Funds");
          refreshButton.setAttribute("title", "Reset Chart");
          themeButton.setAttribute("title", "Theme");

          // logoutButton.setAttribute("title","Logout from your Account");
          exitAllPosButton.setAttribute("title", "Exit All Open Positions");
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
          // fundButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32" fill="none"><rect x="5.15" y="11.7666" width="18.5" height="14.3" rx="0.65" stroke="black" stroke-width="0.7"/><path d="M20.8036 6.13442L5.72228 11.2492C5.40084 11.3582 5.47921 11.8333 5.81863 11.8333H20.9C21.0657 11.8333 21.2 11.699 21.2 11.5333V6.41853C21.2 6.2131 20.9982 6.06844 20.8036 6.13442Z" stroke="black" stroke-width="0.7"/></svg>';
          // refreshButton.innerHTML = '<svg width="21" height="19" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.1188 22.2377C11.88 22.2377 12.6391 22.1602 13.3748 22.0073C13.4194 21.9986 13.4617 21.9811 13.4995 21.9559C13.5372 21.9307 13.5696 21.8983 13.5947 21.8605C13.6198 21.8227 13.6372 21.7803 13.6458 21.7358C13.6544 21.6912 13.654 21.6454 13.6448 21.601C13.6356 21.5566 13.6176 21.5144 13.592 21.477C13.5663 21.4395 13.5335 21.4076 13.4954 21.3829C13.4573 21.3583 13.4147 21.3414 13.3701 21.3334C13.3254 21.3253 13.2796 21.3262 13.2353 21.336C12.5455 21.4793 11.833 21.552 11.1188 21.552C5.3657 21.552 0.685713 16.872 0.685713 11.1188C0.685713 5.3657 5.3657 0.685713 11.1188 0.685713C16.872 0.685713 21.552 5.3657 21.552 11.1188C21.552 12.1131 21.4114 13.0892 21.1378 14.0314L19.9004 12.2036C19.8758 12.1649 19.8437 12.1316 19.806 12.1055C19.7683 12.0794 19.7257 12.0612 19.6808 12.0518C19.636 12.0425 19.5897 12.0423 19.5447 12.0511C19.4997 12.06 19.4569 12.0778 19.419 12.1035C19.381 12.1292 19.3485 12.1622 19.3236 12.2007C19.2986 12.2391 19.2816 12.2822 19.2735 12.3273C19.2655 12.3725 19.2665 12.4188 19.2767 12.4635C19.2869 12.5082 19.3059 12.5504 19.3326 12.5876L20.9636 14.9976C20.9708 15.0082 20.9821 15.0147 20.9904 15.0243C21.0051 15.0415 21.0202 15.0569 21.0384 15.0713C21.0565 15.0857 21.0761 15.0967 21.0966 15.1069C21.1086 15.1131 21.1172 15.1227 21.1302 15.1275C21.1392 15.1309 21.1481 15.1292 21.157 15.1316C21.1662 15.134 21.1734 15.1402 21.1827 15.1419C21.2042 15.1461 21.226 15.1481 21.2478 15.1481C21.2506 15.1481 21.2537 15.1471 21.2568 15.1471C21.2677 15.1467 21.2784 15.1436 21.2893 15.1419C21.3315 15.1368 21.3723 15.1238 21.4097 15.1035C21.4196 15.0984 21.4302 15.0956 21.4398 15.0895L23.8494 13.4581C23.8867 13.4329 23.9187 13.4005 23.9434 13.3629C23.9682 13.3253 23.9853 13.2832 23.9938 13.239C24.0023 13.1948 24.002 13.1493 23.993 13.1052C23.9839 13.0611 23.9662 13.0192 23.941 12.9819C23.9157 12.9446 23.8834 12.9127 23.8458 12.8879C23.8082 12.8631 23.766 12.846 23.7218 12.8375C23.6776 12.829 23.6321 12.8293 23.588 12.8384C23.5439 12.8474 23.502 12.8651 23.4648 12.8904L21.8677 13.9714C22.1132 13.0457 22.238 12.0898 22.238 11.1188C22.238 4.98787 17.2498 0 11.1192 0C4.98753 0 0 4.98787 0 11.1188C0 17.2498 4.98788 22.2377 11.1188 22.2377Z" fill="black"/></svg>';
          exitAllPosButton.innerHTML = '<svg width="24" height="18" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.0262038 11.6829V11.1951C0.0262038 10.8537 0.20963 10.6829 0.576482 10.6829H2.8038C3.17065 10.6829 3.35408 10.8537 3.35408 11.1951V11.3902C3.35408 12.0081 3.4851 12.4309 3.74713 12.6585C4.00917 12.8862 4.48957 13 5.18834 13H6.41991C7.10121 13 7.57288 12.878 7.83492 12.6341C8.11442 12.3902 8.25418 11.935 8.25418 11.2683V10.9756C8.25418 10.5041 8.04455 10.1463 7.62529 9.90244C7.2235 9.64228 6.71689 9.4878 6.10547 9.43902C5.49405 9.39024 4.83022 9.30081 4.11399 9.17073C3.41522 9.02439 2.76013 8.84553 2.14871 8.63415C1.53729 8.4065 1.02195 7.97561 0.602686 7.34146C0.200895 6.69106 0 5.86179 0 4.85366V4C0 2.73171 0.384322 1.74797 1.15296 1.04878C1.92161 0.349593 2.98723 0 4.34982 0H6.97019C8.35026 0 9.42461 0.349593 10.1933 1.04878C10.9619 1.74797 11.3462 2.73171 11.3462 4V4.46341C11.3462 4.80488 11.1628 4.97561 10.7959 4.97561H8.56862C8.20177 4.97561 8.01834 4.80488 8.01834 4.46341V4.31707C8.01834 3.68293 7.88732 3.25203 7.62529 3.02439C7.36325 2.79675 6.88285 2.68293 6.18408 2.68293H5.16214C4.4459 2.68293 3.95676 2.81301 3.69473 3.07317C3.45016 3.31707 3.32787 3.80488 3.32787 4.53659V5C3.32787 5.76423 4.04411 6.20325 5.47658 6.31707C6.96146 6.43089 8.28038 6.70732 9.43334 7.14634C10.0448 7.39024 10.5514 7.82927 10.9532 8.46341C11.3724 9.0813 11.582 9.87805 11.582 10.8537V11.6829C11.582 12.9512 11.1977 13.935 10.4291 14.6341C9.66044 15.3333 8.59482 15.6829 7.23223 15.6829H4.37602C3.01343 15.6829 1.94781 15.3333 1.17917 14.6341C0.410525 13.935 0.0262038 12.9512 0.0262038 11.6829Z" fill="#1E53E5"/><path d="M21.6721 11.122V6.19512C21.6721 6.01626 21.5673 5.92683 21.3577 5.92683H18.8945C18.3355 5.92683 17.9425 6.04065 17.7154 6.26829C17.4883 6.47967 17.3747 6.84553 17.3747 7.36585V11.561C17.3747 12.0813 17.4883 12.4553 17.7154 12.6829C17.9425 12.8943 18.3355 13 18.8945 13H19.8379C21.0607 13 21.6721 12.374 21.6721 11.122ZM18.9731 15.6829H18.3705C16.9904 15.6829 15.9248 15.3415 15.1736 14.6585C14.4224 13.9756 14.0468 12.9919 14.0468 11.7073V7.21951C14.0468 5.93496 14.4224 4.95122 15.1736 4.26829C15.9248 3.58537 16.9904 3.2439 18.3705 3.2439H24.4235C24.8078 3.2439 25 3.41463 25 3.7561V18.5122C25 18.8374 24.8078 19 24.4235 19H22.2224C21.8556 19 21.6721 18.8374 21.6721 18.5122V14.3415H21.5673C21.148 15.2358 20.2833 15.6829 18.9731 15.6829Z" fill="#1E53E5"/></svg>';
          themeButton.innerHTML = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z" /></svg>';
          fundButton.innerHTML = '<svg width="28" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.85 9.64832H5.65C5.29101 9.64832 5 9.93933 5 10.2983V23.2983C5 23.6573 5.29101 23.9483 5.65 23.9483H22.85C23.209 23.9483 23.5 23.6573 23.5 23.2983V10.2983C23.5 9.93933 23.209 9.64832 22.85 9.64832Z" stroke="black" stroke-width="0.7"/><path d="M20.6536 4.01613L5.57229 9.13091C5.25085 9.23991 5.32922 9.71501 5.66864 9.71501H20.75C20.9157 9.71501 21.05 9.58071 21.05 9.41501V4.30024C21.05 4.09481 20.8482 3.95015 20.6536 4.01613Z" stroke="black" stroke-width="0.7"/></svg>';
          refreshButton.innerHTML = '<svg width="28" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.999 23C13.6151 23 14.2295 22.9373 14.8249 22.8135C14.861 22.8065 14.8953 22.7923 14.9259 22.7719C14.9564 22.7515 14.9826 22.7253 15.0029 22.6947C15.0232 22.6641 15.0373 22.6298 15.0443 22.5937C15.0512 22.5576 15.0509 22.5206 15.0435 22.4846C15.036 22.4487 15.0215 22.4145 15.0007 22.3843C14.9799 22.3539 14.9534 22.3281 14.9225 22.3081C14.8917 22.2882 14.8572 22.2745 14.8211 22.268C14.785 22.2615 14.7479 22.2622 14.712 22.2701C14.1537 22.3861 13.5771 22.445 12.999 22.445C8.34275 22.445 4.55498 18.6568 4.55498 14C4.55498 9.34319 8.34275 5.55504 12.999 5.55504C17.6554 5.55504 21.4432 9.34319 21.4432 14C21.4432 14.8048 21.3294 15.5949 21.108 16.3575L20.1065 14.878C20.0865 14.8467 20.0606 14.8198 20.0301 14.7986C19.9995 14.7775 19.9651 14.7628 19.9287 14.7552C19.8925 14.7476 19.855 14.7475 19.8186 14.7546C19.7822 14.7618 19.7475 14.7762 19.7168 14.797C19.6861 14.8178 19.6598 14.8445 19.6396 14.8757C19.6194 14.9068 19.6056 14.9417 19.5991 14.9782C19.5926 15.0148 19.5934 15.0522 19.6017 15.0884C19.6099 15.1246 19.6253 15.1587 19.6469 15.1889L20.967 17.1396C20.9728 17.1482 20.9819 17.1534 20.9887 17.1612C21.0006 17.1751 21.0128 17.1876 21.0275 17.1993C21.0422 17.2109 21.058 17.2198 21.0746 17.2281C21.0843 17.2331 21.0913 17.2409 21.1018 17.2447C21.1091 17.2475 21.1163 17.2461 21.1235 17.2481C21.1309 17.25 21.1368 17.255 21.1443 17.2564C21.1617 17.2598 21.1793 17.2614 21.197 17.2614C21.1992 17.2614 21.2018 17.2606 21.2043 17.2606C21.2131 17.2603 21.2217 17.2578 21.2306 17.2564C21.2647 17.2523 21.2977 17.2418 21.328 17.2253C21.336 17.2212 21.3446 17.2189 21.3524 17.214L23.3026 15.8935C23.3328 15.8731 23.3587 15.8469 23.3787 15.8164C23.3987 15.786 23.4126 15.7519 23.4195 15.7161C23.4263 15.6803 23.4261 15.6435 23.4188 15.6078C23.4115 15.5721 23.3971 15.5382 23.3767 15.508C23.3563 15.4778 23.3301 15.452 23.2997 15.4319C23.2693 15.4119 23.2351 15.398 23.1993 15.3911C23.1635 15.3843 23.1267 15.3845 23.091 15.3919C23.0553 15.3992 23.0214 15.4135 22.9913 15.434L21.6987 16.309C21.8974 15.5597 21.9984 14.7859 21.9984 14C21.9984 9.03736 17.9612 5 12.9994 5C8.03667 5 4 9.03736 4 14C4 18.9626 8.03696 23 12.999 23Z" fill="black"/></svg>';

          themeButton.addEventListener('click', () => {
            console.log("themeButton");
            if (theme == 'Dark') {
              theme = 'Light';
              this.showtheme = false;
              themeButton.innerHTML = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z" /></svg>';
              fundButton.innerHTML = '<svg width="28" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.85 9.64832H5.65C5.29101 9.64832 5 9.93933 5 10.2983V23.2983C5 23.6573 5.29101 23.9483 5.65 23.9483H22.85C23.209 23.9483 23.5 23.6573 23.5 23.2983V10.2983C23.5 9.93933 23.209 9.64832 22.85 9.64832Z" stroke="black" stroke-width="0.7"/><path d="M20.6536 4.01613L5.57229 9.13091C5.25085 9.23991 5.32922 9.71501 5.66864 9.71501H20.75C20.9157 9.71501 21.05 9.58071 21.05 9.41501V4.30024C21.05 4.09481 20.8482 3.95015 20.6536 4.01613Z" stroke="black" stroke-width="0.7"/></svg>';
              refreshButton.innerHTML = '<svg width="28" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.999 23C13.6151 23 14.2295 22.9373 14.8249 22.8135C14.861 22.8065 14.8953 22.7923 14.9259 22.7719C14.9564 22.7515 14.9826 22.7253 15.0029 22.6947C15.0232 22.6641 15.0373 22.6298 15.0443 22.5937C15.0512 22.5576 15.0509 22.5206 15.0435 22.4846C15.036 22.4487 15.0215 22.4145 15.0007 22.3843C14.9799 22.3539 14.9534 22.3281 14.9225 22.3081C14.8917 22.2882 14.8572 22.2745 14.8211 22.268C14.785 22.2615 14.7479 22.2622 14.712 22.2701C14.1537 22.3861 13.5771 22.445 12.999 22.445C8.34275 22.445 4.55498 18.6568 4.55498 14C4.55498 9.34319 8.34275 5.55504 12.999 5.55504C17.6554 5.55504 21.4432 9.34319 21.4432 14C21.4432 14.8048 21.3294 15.5949 21.108 16.3575L20.1065 14.878C20.0865 14.8467 20.0606 14.8198 20.0301 14.7986C19.9995 14.7775 19.9651 14.7628 19.9287 14.7552C19.8925 14.7476 19.855 14.7475 19.8186 14.7546C19.7822 14.7618 19.7475 14.7762 19.7168 14.797C19.6861 14.8178 19.6598 14.8445 19.6396 14.8757C19.6194 14.9068 19.6056 14.9417 19.5991 14.9782C19.5926 15.0148 19.5934 15.0522 19.6017 15.0884C19.6099 15.1246 19.6253 15.1587 19.6469 15.1889L20.967 17.1396C20.9728 17.1482 20.9819 17.1534 20.9887 17.1612C21.0006 17.1751 21.0128 17.1876 21.0275 17.1993C21.0422 17.2109 21.058 17.2198 21.0746 17.2281C21.0843 17.2331 21.0913 17.2409 21.1018 17.2447C21.1091 17.2475 21.1163 17.2461 21.1235 17.2481C21.1309 17.25 21.1368 17.255 21.1443 17.2564C21.1617 17.2598 21.1793 17.2614 21.197 17.2614C21.1992 17.2614 21.2018 17.2606 21.2043 17.2606C21.2131 17.2603 21.2217 17.2578 21.2306 17.2564C21.2647 17.2523 21.2977 17.2418 21.328 17.2253C21.336 17.2212 21.3446 17.2189 21.3524 17.214L23.3026 15.8935C23.3328 15.8731 23.3587 15.8469 23.3787 15.8164C23.3987 15.786 23.4126 15.7519 23.4195 15.7161C23.4263 15.6803 23.4261 15.6435 23.4188 15.6078C23.4115 15.5721 23.3971 15.5382 23.3767 15.508C23.3563 15.4778 23.3301 15.452 23.2997 15.4319C23.2693 15.4119 23.2351 15.398 23.1993 15.3911C23.1635 15.3843 23.1267 15.3845 23.091 15.3919C23.0553 15.3992 23.0214 15.4135 22.9913 15.434L21.6987 16.309C21.8974 15.5597 21.9984 14.7859 21.9984 14C21.9984 9.03736 17.9612 5 12.9994 5C8.03667 5 4 9.03736 4 14C4 18.9626 8.03696 23 12.999 23Z" fill="black"/></svg>';
              tvWidget.changeTheme('Light')
            }
            else if (theme == 'Light') {
              theme = 'Dark';
              this.showtheme = true;
              tvWidget.changeTheme('Dark');
              themeButton.innerHTML = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#FBC02D" d="M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13"/></svg>';
              fundButton.innerHTML = '<svg width="28" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.85 9.64832H5.65C5.29101 9.64832 5 9.93933 5 10.2983V23.2983C5 23.6573 5.29101 23.9483 5.65 23.9483H22.85C23.209 23.9483 23.5 23.6573 23.5 23.2983V10.2983C23.5 9.93933 23.209 9.64832 22.85 9.64832Z" stroke="#ffffff" stroke-width="1"/><path d="M20.6536 4.01613L5.57229 9.13091C5.25085 9.23991 5.32922 9.71501 5.66864 9.71501H20.75C20.9157 9.71501 21.05 9.58071 21.05 9.41501V4.30024C21.05 4.09481 20.8482 3.95015 20.6536 4.01613Z" stroke="#ffffff" stroke-width="1"/></svg>';
              refreshButton.innerHTML = '<svg width="28" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.999 23C13.6151 23 14.2295 22.9373 14.8249 22.8135C14.861 22.8065 14.8953 22.7923 14.9259 22.7719C14.9564 22.7515 14.9826 22.7253 15.0029 22.6947C15.0232 22.6641 15.0373 22.6298 15.0443 22.5937C15.0512 22.5576 15.0509 22.5206 15.0435 22.4846C15.036 22.4487 15.0215 22.4145 15.0007 22.3843C14.9799 22.3539 14.9534 22.3281 14.9225 22.3081C14.8917 22.2882 14.8572 22.2745 14.8211 22.268C14.785 22.2615 14.7479 22.2622 14.712 22.2701C14.1537 22.3861 13.5771 22.445 12.999 22.445C8.34275 22.445 4.55498 18.6568 4.55498 14C4.55498 9.34319 8.34275 5.55504 12.999 5.55504C17.6554 5.55504 21.4432 9.34319 21.4432 14C21.4432 14.8048 21.3294 15.5949 21.108 16.3575L20.1065 14.878C20.0865 14.8467 20.0606 14.8198 20.0301 14.7986C19.9995 14.7775 19.9651 14.7628 19.9287 14.7552C19.8925 14.7476 19.855 14.7475 19.8186 14.7546C19.7822 14.7618 19.7475 14.7762 19.7168 14.797C19.6861 14.8178 19.6598 14.8445 19.6396 14.8757C19.6194 14.9068 19.6056 14.9417 19.5991 14.9782C19.5926 15.0148 19.5934 15.0522 19.6017 15.0884C19.6099 15.1246 19.6253 15.1587 19.6469 15.1889L20.967 17.1396C20.9728 17.1482 20.9819 17.1534 20.9887 17.1612C21.0006 17.1751 21.0128 17.1876 21.0275 17.1993C21.0422 17.2109 21.058 17.2198 21.0746 17.2281C21.0843 17.2331 21.0913 17.2409 21.1018 17.2447C21.1091 17.2475 21.1163 17.2461 21.1235 17.2481C21.1309 17.25 21.1368 17.255 21.1443 17.2564C21.1617 17.2598 21.1793 17.2614 21.197 17.2614C21.1992 17.2614 21.2018 17.2606 21.2043 17.2606C21.2131 17.2603 21.2217 17.2578 21.2306 17.2564C21.2647 17.2523 21.2977 17.2418 21.328 17.2253C21.336 17.2212 21.3446 17.2189 21.3524 17.214L23.3026 15.8935C23.3328 15.8731 23.3587 15.8469 23.3787 15.8164C23.3987 15.786 23.4126 15.7519 23.4195 15.7161C23.4263 15.6803 23.4261 15.6435 23.4188 15.6078C23.4115 15.5721 23.3971 15.5382 23.3767 15.508C23.3563 15.4778 23.3301 15.452 23.2997 15.4319C23.2693 15.4119 23.2351 15.398 23.1993 15.3911C23.1635 15.3843 23.1267 15.3845 23.091 15.3919C23.0553 15.3992 23.0214 15.4135 22.9913 15.434L21.6987 16.309C21.8974 15.5597 21.9984 14.7859 21.9984 14C21.9984 9.03736 17.9612 5 12.9994 5C8.03667 5 4 9.03736 4 14C4 18.9626 8.03696 23 12.999 23Z" fill="#ffffff"/></svg>';
              setTimeout(() => {
                tvWidget.activeChart().applyOverrides({
                  'paneProperties.backgroundGradientStartColor': 'black',
                  'paneProperties.backgroundGradientEndColor': 'black',
                });
              }, 0);
            }
          });

          refreshButton.addEventListener("click", () =>
            tvWidget.activeChart().executeActionById("chartReset")
          );
          // logoutButton.addEventListener("click", () =>{
          //   console.log("Logout");
          // }
          // ); 
          // logoutButton.innerHTML='Logout'; 
          exitAllPosButton.addEventListener("click", () => {
            console.log("Positions Exit");
            tvWidget.showConfirmDialog({
              title: "Exit All Position",
              body: "Are you sure about exiting All Open Positions",
              callback: (res) => {
                console.log("Result of dialog box", res);
                if (res == true) {
                  let myHeaders = new Headers();
                  myHeaders.append("Authorization", `Bearer ${userid} ${usession}`)
                  const request = {
                    method: "POST",
                    redirect: 'follow',
                    headers: myHeaders,
                  };
                  const response = fetchfromZebullAPI("https://zebull.in/rest/MobullService/api/positionAndHoldings/squareOffAllPositions", request);
                  console.log("API SqOff", response);
                }
              }
            })
          }
          );
        });

        tvWidget.watchList().then(async (watchlistObj) => {
          var chartWatchlist = new ChartWatchlists(watchlistObj);
          console.log(`"[chartWatchlist] Init chartWatchlist :: "`, watchlistObj, chartWatchlist)

          // getWatchlistdata("mwGrpq").then((watchlists) => {  //get list of watchlist # this.brokerClass.watchlists()
          var mwid = await getMWValues();
          console.log(`"MWID >>>>>>>>>>>>>>>",${mwid}`, mwid)
          var watchlists = mwid.values;
          watchlists.forEach((watchlist, i) => {

            chartWatchlist.addWatchlist({ "id": watchlist, "name": watchlist });

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
      
        tvWidget.onContextMenu(function() {
        return [
        //   {
        //     position: "top",
        //     text: "First top menu item, time: " + unixtime + ", price: " + price,
        //     click: function() { alert("First clicked."); }
        // },
        // { text: "-", position: "top" },
        // { text: "-Objects Tree..." },
        {
            position: "top",
            text: "Option Chain",
            click: function() { document.getElementById("optchiid").style.display = "block";}
        },];
    },
      );
   
      });
    },
    optchiidcls() {
      document.getElementById("optchiid").style.display = "none";
    },
    optchi() {
      this.optionchain = true;
      this.profilesetting = false;
    },
    optchiMouseDown(oc) {
      oc = oc || window.event;
      oc.preventDefault();
      // get the mouse cursor position at startup:
      this.optchipos3 = oc.clientX;
      this.optchipos4 = oc.clientY;
      // call a function whenever the cursor moves:
      document.onmousemove = this.optchielementDrag;
      // this.$refs.optchicard.style.cursor = "grabbing";
      this.$refs.optchicard.style.zIndex = 50;
    },
    optchielementDrag(oc) {
      oc = oc || window.event;
      oc.preventDefault();
      // calculate the new cursor position:
      this.optchipos1 = this.optchipos3 - oc.clientX;
      this.optchipos2 = this.optchipos4 - oc.clientY;
      this.optchipos3 = oc.clientX;
      this.optchipos4 = oc.clientY;
      // set the element's new position:
      this.$refs.optchicard.style.margin = 0;
      this.$refs.optchicard.style.top =
        this.$refs.optchicard.offsetTop - this.optchipos2 + "px";
      this.$refs.optchicard.style.left =
        this.$refs.optchicard.offsetLeft - this.optchipos1 + "px";
      this.$emit('drag', oc);
    },
    optchiDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      this.$refs.optchicard.style.zIndex = 1;
    },

    prosett() {
      this.usermun = false;
      this.optionchain = false;
      this.profilesetting = true;
    },
    prosettMouseDown(ps) {
      ps = ps || window.event;
      ps.preventDefault();
      // get the mouse cursor position at startup:
      this.prosettpos3 = ps.clientX;
      this.prosettpos4 = ps.clientY;
      // call a function whenever the cursor moves:
      document.onmousemove = this.prosettelementDrag;
      // this.$refs.prosettcard.style.cursor = "grabbing";
      this.$refs.prosettcard.style.zIndex = 50;
    },
    prosettelementDrag(ps) {
      ps = ps || window.event;
      ps.preventDefault();
      // calculate the new cursor position:
      this.prosettpos1 = this.prosettpos3 - ps.clientX;
      this.prosettpos2 = this.prosettpos4 - ps.clientY;
      this.prosettpos3 = ps.clientX;
      this.prosettpos4 = ps.clientY;
      // set the element's new position:
      this.$refs.prosettcard.style.margin = 0;
      this.$refs.prosettcard.style.top =
        this.$refs.prosettcard.offsetTop - this.prosettpos2 + "px";
      this.$refs.prosettcard.style.left =
        this.$refs.prosettcard.offsetLeft - this.prosettpos1 + "px";
      this.$emit('drag', ps);
    },
    prosettDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      this.$refs.prosettcard.style.zIndex = 1;
    },

    logout() {
      localStorage.removeItem("loginway");
      localStorage.removeItem("userid");
      localStorage.removeItem("usession");
      localStorage.removeItem("username");
      this.authcode = null;
      this.$router.push("/");
      window.location.reload();
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

<style>
/* .v-menu__content {
  border: none !important;
  box-shadow: 0 2px 4px #0003 !important;
  border-radius: 2px !important;
} */
.prosetsty {
  position: absolute !important;
  top: 40px;
  left: 50%;
  transform: translate(-50%, 0%);
  box-shadow: 0 2px 4px #0003 !important;
}

.optchisty {
  /* align-items: start !important;
  justify-content: center !important; */
  /* height:90vh; */
  position: absolute !important;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0%);
  box-shadow: 0 2px 4px #0003 !important;
}

.v-dialog {
  box-shadow: 0 2px 4px #0003 !important;
  transition: none !important;
  /* margin-right: 117px !important; */
  margin-right: 0px !important;
}

.v-dialog__content {
  align-items: start !important;
  justify-content: right !important;
  right: 0% !important;
  top: 17px !important;
}

.userbtn:hover:root {
  background-color: #f0f3fa !important;
}

.userbtn:hover:root:not(.theme-dark) {
  background-color: #2A2E39 !important;
}

.v-overlay__scrim {
  background-color: transparent !important;
}

.custappbar {
  width: 69px;
  height: 38px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 0;
}

.myntlogoplace {
  width: 99px;
  height: 38px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.optchibtn {
  padding: 0 !important;
  position: absolute;
  top: 130px;
  left: 60px;
  z-index: 0;
}

#optchiid {
  display: none;
}

/* .themebgcolor:root:not(.theme-dark) {
  background-color: #ffffff !important;
}

.themebgcolor:root {
  background-color: #131722 !important;
}

.themefontcolor:root:not(.theme-dark) {
  color: #000000 !important;
}

.themefontcolor:root {
  color: #ffffff !important;
} */
</style>

