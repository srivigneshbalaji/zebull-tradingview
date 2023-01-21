<template>
  <div class="home">
    <div>

      <v-snackbar class="pt-6 pr-6" style="z-index: 2 !important;" transition="slide-x-reverse-transition"
        v-model="snackbar" :timeout="10000" :value="true" :color="snackbarclr" absolute outlined top right>
        <v-icon class="mr-2" :color="snackbarclr">mdi-alert-outline</v-icon>
        {{ snackmsgbar }}
      </v-snackbar>
      <div class="myntlogoplace">
        <img src="@/assets/Mynt_pro_logo.svg" width="100%">
      </div>
      <div class="usermnusty">
        <!-- <v-avatar @click="usermun = true" color="teal" size="30">
          <span v-if="ssologinfo == 'ZebullOk'" class="white--text font-weight-bold title text-uppercase">{{
            cliname.slice(0, 1)
          }}</span>
        </v-avatar>
        <v-menu v-model="usermun" down offset-y transition="slide-y-transition">
          <v-card class="py-2 rounded-lg elevation-0">
            <v-list-item v-if="ssologinfo == 'ZebullOk'" class="pl-4 pr-0">
              <v-list-item-avatar color="teal" class="text-center">
                <p class="white--text font-weight-bold headline text-uppercase mb-0 ml-3">{{
                  cliname.slice(0, 1)
                }}</p>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">{{ cliname }}</v-list-item-title>
                <v-list-item-subtitle class="font-weight-bold">{{ cliid }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list>
              <v-list-item-group>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Profile Settings</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Account and Billing</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item>
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
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Dark color theme</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-divider class="my-2"></v-divider>
            <v-list-item @click="logout()">
              <v-list-item-content>
                <v-list-item-title>Sign Out</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-menu> -->
        <v-dialog class="zebulldialog" @click:outside="usermun = false" v-model="usermun"
          transition="dialog-top-transition" max-width="300">
          <template v-slot:activator="{ on, attrs }">
            <div class="pt-2" v-bind="attrs" v-on="on">
              <v-list-item-title class="body-2 font-weight-medium">
                <p class="mb-0 text-center px-1">
                  {{ cliid }}
                </p>
              </v-list-item-title>
            </div>
            <!-- <v-btn :ripple="false" class="elevation-0 px-0 black--text" text dark v-bind="attrs" v-on="on">
            </v-btn> -->
          </template>
          <v-card outlined class="py-2 rounded-lg elevation-0">
            <v-list-item v-if="ssologinfo == 'ZebullOk'" class="pl-4 pr-0">
              <v-list-item-avatar color="teal" class="text-center">
                <p class="white--text font-weight-bold headline text-uppercase mb-0 ">{{
                  cliname.slice(0, 1)
                }}</p>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">{{ cliname }}</v-list-item-title>
                <v-list-item-subtitle class="font-weight-bold">{{ cliid }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list>
              <v-list-item-group>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Profile Settings</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Account and Billing</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item>
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
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Dark color theme</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-divider class="my-2"></v-divider>
            <v-list-item @click="logout()">
              <v-list-item-content>
                <v-list-item-title>Sign Out</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-dialog>
      </div>
      <div class="indexbar">
        <v-row no-gutters>
          <v-col cols="6" class="pa-0">

            <v-list-item class="mt-n1">
              <v-list-item-content class="pa-0">
                <v-list-item-title class="caption mb-0 font-weight-bold">NIFTY 50</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content class="pa-0">
                <v-list-item-title class="overline">34345.00</v-list-item-title>
                <v-list-item-subtitle style="font-size:10px;" class="">80.9(12.0%)</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-col>
          <!-- <div class="indexbardivider"></div> -->
          <v-col cols="6" class="pa-0">
            <v-list-item class="mt-n1 pl-0">
              <v-list-item-content class="pa-0">
                <v-list-item-title class="caption mb-0 font-weight-bold">BANK NIFTY</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content class="pa-0">
                <v-list-item-title class="overline">34345.00</v-list-item-title>
                <v-list-item-subtitle style="font-size:10px;" class="">80.9(12.0%)</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-col>
        </v-row>
      </div>
      <!-- <v-card class="appbarbor elevation-0 rounded-0 pl-2 pr-1">
        <v-row no-gutters>
          <v-col class="my-auto" cols="6">
            <div>
              <img src="@/assets/Mynt_pro_logo.svg" width="90px">
            </div>
          </v-col>
          <v-col cols="6" class="my-auto text-right">

          </v-col>
        </v-row>
      </v-card> -->
    </div>

    <div>


      <TVChartContainer />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { apiurl } from '../../apiUrl.js'
import TVChartContainer from '../../components/TVChartContainer.vue';

export default {
  data: () => ({
    /* eslint-disable */
    usermun: false,
    snackbar: false,
    snackbarclr: 'default',
    snackmsgbar: "",

    ssologinfo: "",
    logininfo: "",
    authcode: "",

    cliid: "",
    cliname: "",
    usession: "",
  }),

  components: {
    TVChartContainer
  },

  mounted() {

    this.authcode = new URL(window.location.href).searchParams.get("authCode");
    console.log("authcode", this.authcode)
    var axiosThis = this;

    if (this.authcode != null) {
      var logininfo = "ZebullOk";
      localStorage.setItem("loginway", logininfo);
      localStorage.setItem("lastway", logininfo);

      // console.log("zebull", this.cliname)
      var axiosThis = this;

      if (this.authcode) {
        var ssoconfig = {
          method: "post",
          url: `${apiurl}/ssoclient_check?code=` + this.authcode,
          headers: {},
        };

        axios(ssoconfig)
          .then(function (response) {
            console.log("ssosignin sso", response.data);
            if (response.data.client_code !== undefined) {
              localStorage.setItem("userid", response.data.client_code);
              localStorage.setItem("username", response.data.clientName);
              localStorage.setItem("usession", response.data.clientsession);

              axiosThis.ssologinfo = localStorage.getItem("loginway");
              axiosThis.cliid = localStorage.getItem("userid");
              axiosThis.usession = localStorage.getItem("usession");
              axiosThis.cliname = localStorage.getItem("username");
              console.log("cliixzxzd sso", axiosThis.ssologinfo, axiosThis.cliid, axiosThis.usession, axiosThis.cliname);
            } else if ((axiosThis.cliid == null) || (axiosThis.usession == null) || (axiosThis.cliname == null)) {
              axiosThis.$router.push("/");
            }
            else {
              axiosThis.$router.push("/");
            }

          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    // else {
    //   var lastout = localStorage.getItem("lastway");

    //   console.log("logininfo", this.logininfo)
    //   this.usernotfound = false;
    //   this.snackbar = true;
    //   if (lastout != null) {
    //     console.log("logininfo if", this.logininfo, this.authcode)

    //     this.snackmsgbar = "Session expired, Kindly Sign in again.";
    //     setTimeout(function () {
    //       axiosThis.$router.push("/");
    //     }, 2000);
    //   } else {
    //     console.log("logininfo else", this.logininfo, this.authcode)

    //     this.snackmsgbar = "User not found, Kindly Sign in.";
    //     setTimeout(function () {
    //       axiosThis.$router.push("/");
    //     }, 2000);
    //   }
    //   this.snackbarclr = 'warning';
    //   localStorage.removeItem("lastway");
    // }
  },

  methods: {
    logout() {
      if ((this.cliname != null) && (this.ssologinfo == "ZebullOk") && (this.authcode != null)) {
        localStorage.removeItem("loginway");
        localStorage.removeItem("userid");
        localStorage.removeItem("usession");
        localStorage.removeItem("username");
        this.$router.push("/");
        window.location.reload();
      }
      // this.$router.push("/");
      // window.location.reload();
    },
  }
}
</script>

<style>
.appbarbor {
  border-bottom: 4px solid #E0E3EB !important;
}

.v-menu__content {
  border: none !important;
  box-shadow: 0 2px 4px #0003 !important;
  border-radius: 2px !important;
}

.v-dialog__content {
  max-width: 30% !important;
  align-items: start !important;
  left: calc(100% - 28%) !important;
  top: 20px !important;
}

.v-dialog {
  box-shadow: none !important;
}

.v-overlay__scrim {
  background-color: transparent !important;
}

.myntlogoplace {
  width: 99px;
  height: 38px;
  background-color: white;
  padding: 0 8px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.usermnusty {
  /* display:none; */
  width: 70px;
  height: 38px;
  background-color: white;
  position: absolute;
  top: 3px;
  right: 355px;
  margin: -3px -8.8px 0 0;
  z-index: 0;
  border-right: thin solid #E0E3EB !important;

}

.usermnusty:hover {
  background-color: #f0f3fa;
}

.indexbar {
  position: absolute;
  width: 347px;
  height: 38px;
  top: 3px;
  right: 8px;
  margin: -3px -8.8px 0 0;
  background-color: white;
}

.indexbardivider {
  border-right: thin solid #E0E3EB !important;

}
</style>
