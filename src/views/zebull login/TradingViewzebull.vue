<template>
  <div class="home">
    <div v-if="usernotfound" class="desktopview d-none d-sm-block">
      <v-snackbar class="pt-6 pr-6" style="z-index: 2 !important;" transition="slide-x-reverse-transition"
        v-model="snackbar" :timeout="10000" :value="true" :color="snackbarclr" absolute outlined top right>
        <v-icon class="mr-2" :color="snackbarclr">mdi-alert-outline</v-icon>
        {{ snackmsgbar }}
      </v-snackbar>
      <div class="myntlogoplace">
        <img src="@/assets/Mynt_pro_logo.svg" width="100%">
      </div>
      <div class="custappbar">
        <v-row no-gutters>
          <v-col cols="2" class="pa-0">
            <v-dialog @click:outside="usermun = false" v-model="usermun" transition="dialog-top-transition" width="300">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="#99C1E6" v-bind="attrs" v-on="on" style="margin:2px; height:34px;" class="px-1 rounded-0"
                  text :ripple="false">
                  <v-list-item-title class="body-2 font-weight-medium black--text">
                    <span class="black--text">
                      {{ cliid }}
                    </span>
                  </v-list-item-title>
                </v-btn>
              </template>
              <v-card class="py-2 rounded-md elevation-0">
                <v-list-item v-if="ssologinfo == 'ZebullOk'" class="pl-4 pr-0">
                  <v-list-item-avatar color="teal" class="text-center">
                    <p class="white--text font-weight-bold headline text-uppercase mb-0">{{
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
          </v-col>
          <v-divider style="margin-bottom:6px;" vertical></v-divider>
          <v-col cols="10" class="pa-0">
            <v-list-item class="mt-n1 px-3">
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
          </v-col>
        </v-row>
      </div>
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
    logout() {
      localStorage.removeItem("loginway");
      localStorage.removeItem("userid");
      localStorage.removeItem("usession");
      localStorage.removeItem("username");
      this.authcode = null;
      this.$router.push("/");
      window.location.reload();
    },
  }
}
</script>

<style>
.v-menu__content {
  border: none !important;
  box-shadow: 0 2px 4px #0003 !important;
  border-radius: 2px !important;
}

.v-dialog__content {
  align-items: start !important;
  justify-content: right !important;
  right: 0% !important;
  top: 17px !important;
}

.v-dialog {
  box-shadow: 0 2px 4px #0003 !important;
}

.v-overlay__scrim {
  background-color: transparent !important;
}

.custappbar {
  width: 417px;
  height: 38px;
  background-color: white;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 0;
  border-left: thin solid #E0E3EB !important;
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
</style>
