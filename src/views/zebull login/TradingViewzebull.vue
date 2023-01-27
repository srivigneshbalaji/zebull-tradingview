<template>
  <div class="home">
    <div v-if="usernotfound" class="desktopview d-none d-sm-block">
      <v-snackbar class="pt-6 pr-6" style="z-index: 2 !important;" transition="slide-x-reverse-transition"
        v-model="snackbar" :timeout="10000" :value="true" :color="snackbarclr" absolute outlined top right>
        <v-icon class="mr-2" :color="snackbarclr">mdi-alert-outline</v-icon>
        {{ snackmsgbar }}
      </v-snackbar>
      <div class="myntlogoplace themebgcolor">
        <img src="@/assets/Mynt_pro_logo.svg" width="100%">
      </div>
      <div class="custappbar themebgcolor">
        <v-row no-gutters>
          <v-col cols="2" class="pa-0">
            <v-dialog v-model="usermun" width="300">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" style="margin:2px; height:34px;"
                  class="px-1 rounded-0 userbtn" text :ripple="false">
                  <v-list-item-title class="body-2 font-weight-medium themefontcolor">
                    <span class="themefontcolor">
                      {{ cliid }}
                    </span>
                  </v-list-item-title>
                </v-btn>
              </template>
              <v-card class="py-2 rounded-md elevation-0 themebgcolor">
                <v-list-item v-if="ssologinfo == 'ZebullOk'" class="pl-4 pr-0">
                  <v-list-item-avatar color="teal" class="text-center">
                    <p class="themefontcolor font-weight-bold headline text-uppercase mb-0">{{
                      cliname.slice(0, 1)
                    }}</p>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold themefontcolor">{{ cliname }}</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-bold themefontcolor">{{ cliid }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>

                <v-list-item @click="prosett()">
                  <v-list-item-content>
                    <v-list-item-title class="themefontcolor">Profile Settings</v-list-item-title>
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
                    <v-list-item-title class="themefontcolor">Dark color theme</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider class="mb-2"></v-divider>
                <v-list-item @click="logout()">
                  <v-list-item-content>
                    <v-list-item-title class="themefontcolor">Sign Out</v-list-item-title>
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
      </div>
      <!-- <v-dialog v-model="profilesetting" > -->
      <div v-if="profilesetting" class="prosetsty">
        <v-card width="620" height="94vh" class="py-4 rounded-md themebgcolor">
          <v-row no-gutters class="px-4">
            <v-col cols="10" class="text-left">
              <span class="themefontcolor" style="font-size: 20px;font-weight: 600;line-height: 28px;">Profile
                Settings</span>
            </v-col>
            <v-col cols="2" class="text-right">
              <v-btn icon @click="profilesetting = false">
                <v-icon class="themefontcolor" size="32">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-2"></v-divider>
          <div class="py-16"></div>
        </v-card>
      </div>
        <!-- <div v-if="optionchain" class="optchisty">
        <v-card :dark="showtheme" :color="showtheme ? '#131722' : '#ffffff'" min-width="960px" height="94vh"
          class="py-4 rounded-md">
          <v-row no-gutters class="px-4 pt-2">
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
                        d="M14 17a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                      <path
                        d="M5.005 16A1.003 1.003 0 0 1 4 14.992v-1.984A.998.998 0 0 1 5 12h1.252a7.87 7.87 0 0 1 .853-2.06l-.919-.925c-.356-.397-.348-1 .03-1.379l1.42-1.42a1 1 0 0 1 1.416.007l.889.882A7.96 7.96 0 0 1 12 6.253V5c0-.514.46-1 1-1h2c.557 0 1 .44 1 1v1.253a7.96 7.96 0 0 1 2.06.852l.888-.882a1 1 0 0 1 1.416-.006l1.42 1.42a.999.999 0 0 1 .029 1.377s-.4.406-.918.926a7.87 7.87 0 0 1 .853 2.06H23c.557 0 1 .447 1 1.008v1.984A.998.998 0 0 1 23 16h-1.252a7.87 7.87 0 0 1-.853 2.06l.882.888a1 1 0 0 1 .006 1.416l-1.42 1.42a1 1 0 0 1-1.415-.007l-.889-.882a7.96 7.96 0 0 1-2.059.852v1.248c0 .56-.45 1.005-1.008 1.005h-1.984A1.004 1.004 0 0 1 12 22.995v-1.248a7.96 7.96 0 0 1-2.06-.852l-.888.882a1 1 0 0 1-1.416.006l-1.42-1.42a1 1 0 0 1 .007-1.415l.882-.888A7.87 7.87 0 0 1 6.252 16H5.005zm3.378-6.193l-.227.34A6.884 6.884 0 0 0 7.14 12.6l-.082.4H5.005C5.002 13 5 13.664 5 14.992c0 .005.686.008 2.058.008l.082.4c.18.883.52 1.71 1.016 2.453l.227.34-1.45 1.46c-.004.003.466.477 1.41 1.422l1.464-1.458.34.227a6.959 6.959 0 0 0 2.454 1.016l.399.083v2.052c0 .003.664.005 1.992.005.005 0 .008-.686.008-2.057l.399-.083a6.959 6.959 0 0 0 2.454-1.016l.34-.227 1.46 1.45c.003.004.477-.466 1.422-1.41l-1.458-1.464.227-.34A6.884 6.884 0 0 0 20.86 15.4l.082-.4h2.053c.003 0 .005-.664.005-1.992 0-.005-.686-.008-2.058-.008l-.082-.4a6.884 6.884 0 0 0-1.016-2.453l-.227-.34 1.376-1.384.081-.082-1.416-1.416-1.465 1.458-.34-.227a6.959 6.959 0 0 0-2.454-1.016L15 7.057V5c0-.003-.664-.003-1.992 0-.005 0-.008.686-.008 2.057l-.399.083a6.959 6.959 0 0 0-2.454 1.016l-.34.227-1.46-1.45c-.003-.004-.477.466-1.421 1.408l1.457 1.466z">
                      </path>
                    </g>
                  </svg>
                </v-btn>
                <v-btn tile icon @click="optionchain = false">
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
                      <span style="font-size: 14px;font-weight: 600;line-height: 16px;">OL change</span>
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
                  <span style="font-size: 14px;font-weight: 600;line-height: 16px;">Strike Price</span>
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
                      <span style="font-size: 14px;font-weight: 600;line-height: 16px;">OL change</span>
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
                      <span class="mb-0" style="font-size: 12px;font-weight: 400;line-height: 16px;">546.87 <span class="green--text">(23.09)</span>
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
                      <span style="font-size: 12px;font-weight: 400;line-height: 16px;">733.17 <span class="red--text">(-13.21)</span>
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
      </div> -->

      <!-- </v-dialog> -->
      <div>
        <TVChartContainer />
      </div>
    </div>
    <div class="mobileview d-sm-none">
      <v-container fill-height class="SsoView">
        <v-card class="elevation-0 mx-auto">
          <p class="font-weight-bold title">no screen display</p>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
import TVChartContainer from '../../components/TVChartContainer.vue';

export default {
  data: () => ({
    /* eslint-disable */
    usernotfound: true,
    usermun: false,
    profilesetting: false,
    snackbar: false,
    snackbarclr: 'default',
    snackmsgbar: "",

    ssologinfo: "",
    logininfo: "",

    cliid: "",
    cliname: "",
    usession: "",

  }),

  components: {
    TVChartContainer
  },

  created() {
    var axiosThis = this;

    this.ssologinfo = localStorage.getItem("loginway");
    this.cliid = localStorage.getItem("userid");
    this.usession = localStorage.getItem("usession");
    this.cliname = localStorage.getItem("username");
    if ((this.cliid != null) && (this.usession != null) && (this.cliname != null)) {
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
  },

  methods: {
    prosett() {
      this.usermun = false;
      this.profilesetting = true;
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
}
</script>

<style>
/* .v-menu__content {
  border: none !important;
  box-shadow: 0 2px 4px #0003 !important;
  border-radius: 2px !important;
} */
.prosetsty {
  position: absolute;
  top: 20px;
  left: 27.5%;
  /* height:90vh; */
  /* transform: translate(-50%, -50%); */
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

.userbtn:hover {
  background-color: #99c1e61a !important;
}

.v-overlay__scrim {
  background-color: transparent !important;
}

.custappbar {
  width: 70px;
  height: 38px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 0;
}

.myntlogoplace {
  width: 99px;
  height: 38px;
  padding: 0 8px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.themebgcolor:root, .v-card:root {
  background-color: #000000 !important;
}

.themebgcolor:root:not(.theme-dark), .v-card:root:not(.theme-dark) {
  background-color: #ffffff !important;
}

.themefontcolor:root, .v-card:root {
  color: #ffffff !important;
}

.themefontcolor:root:not(.theme-dark), .v-card:root:not(.theme-dark) {
  color: #000000 !important;
}
</style>

<!-- <style lang="scss">
* { box-sizing: border-box; }
$duration: 20s;

@-webkit-keyframes ticker {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }

  100% {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes ticker {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }

  100% {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}

.ticker-wrap {
  
  width: 100%;
  overflow: hidden;
  background-color: rgba(rgb(133, 91, 91), 0.9); 
  box-sizing: content-box;

  .ticker {

    display: inline-block;
    height: 4rem;
    line-height: 4rem;  
    white-space: nowrap;
    padding-right: 100%;
    box-sizing: content-box;

    -webkit-animation-iteration-count: infinite; 
            animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
   -webkit-animation-name: ticker;
           animation-name: ticker;
    -webkit-animation-duration: $duration;
            animation-duration: $duration;

    &__item {
      display: inline-block;
      font-size: 16px;
      color: white;   

    }

  }

}
</style> -->
