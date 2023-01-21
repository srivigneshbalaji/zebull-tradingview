<template>
  <div class="home">
    <div>
      <v-snackbar class="pt-6 pr-6" style="z-index: 2 !important;" transition="slide-x-reverse-transition"
        v-model="snackbar"  :timeout="10000" :value="true" :color="snackbarclr" absolute outlined top
        right>
        <v-icon class="mr-2" :color="snackbarclr">mdi-alert-outline</v-icon>
        {{ snackmsgbar }}
      </v-snackbar>
      <v-card v-if="usernotfound" class="appbarbor elevation-0 rounded-0 pl-2 pr-1">
        <v-row no-gutters>
          <v-col class="my-auto" cols="6">
            <div>
              <img src="@/assets/Mynt_pro_logo.svg" width="90px">
            </div>
          </v-col>
          <v-col cols="6" class="my-auto text-right">
            <div class="menusty">
              <v-menu down offset-y transition="slide-y-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-avatar color="teal" size="32" v-bind="attrs" v-on="on">
                    <span class="white--text font-weight-bold title text-uppercase">{{
                      email.slice(0,
                        1)
                    }}</span>
                  </v-avatar>
                </template>
                <v-card class="py-2 rounded-lg elevation-0">
                  <v-list-item class="pl-4 pr-0">
                    <v-list-item-avatar color="teal" class="text-center">
                      <p class="white--text font-weight-bold headline text-uppercase mb-0 ml-3">{{
                        email.slice(0, 1)
                      }}</p>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">{{ email }}</v-list-item-title>
                      <v-list-item-subtitle class="font-weight-bold">{{ actid }}</v-list-item-subtitle>
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
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <div v-if="usernotfound">
      <TVChartContainer />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mynturl } from '../../apiUrl.js'
import TVChartContainer from '../../components/TVChartContainer.vue';

export default {
  data: () => ({
    /* eslint-disable */
    usernotfound: true,
    snackbar: false,
    snackbarclr: 'default',
    snackmsgbar: "",

    usession: "",

    actid: "",
    email: "",
    susertoken: "",
  }),

  components: {
    TVChartContainer
  },

  mounted() {
    var axiosThis = this;
    this.actid = localStorage.getItem("actid");
    this.susertoken = localStorage.getItem("susertoken");
    this.email = localStorage.getItem("email");

    console.log("mynt", this.actid)
    console.log("cliixzxzd", this.actid, this.susertoken, this.email);

    // var data = 'jData={"uid":"ZP00100"}&jKey=9f0120dd5b6a30f3b6bc62874a609dcfc842accab1b11b8be6aca181074fbd9d';
    var data = `jData={"uid":"${this.actid}"}&jKey=${this.susertoken}`;

    var udmyntconfig = {
      method: 'post',
      url: `${mynturl}/UserDetails`,
      headers: {
        'Content-Type': 'text/plain',
      },
      data: data
    };

    axios(udmyntconfig)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        console.log("udmynt", response.data);
      })
      .catch(function (error) {
        console.log("udmynt err", error);
        axiosThis.usernotfound = false;
        axiosThis.snackbar = true;
        axiosThis.snackbarclr = 'warning';
        if (error.response.data.emsg == "Session Expired :  Invalid Session Key" && error.response.data.stat == "Not_Ok") {
          axiosThis.snackmsgbar = "Session expired, Kindly Sign in again.";
        } else {
          axiosThis.snackmsgbar = "User not found, Kindly Sign in.";
        }
        setTimeout(function () {
          axiosThis.$router.push("/MyntPro_Signin");
        }, 2000);
      });

  },

  methods: {
    logout() {
      var axiosThis = this;

      var data = `jData={"uid":"${this.actid}"}&jKey=${this.susertoken}`;
      var lomyntconfig = {
        method: 'post',
        url: `${mynturl}/Logout`,
        headers: {
          'Content-Type': 'text/plain',
        },
        data: data
      };

      axios(lomyntconfig)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          console.log("lomynt", response.data);
          if (response.data.stat == "Ok") {
            axiosThis.$router.push("/MyntPro_Signin");
          }

        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
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
</style>
