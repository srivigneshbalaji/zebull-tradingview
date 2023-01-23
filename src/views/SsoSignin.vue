<template>
  <div class="signupbgclr">
    <v-container fill-height class="SsoView">
      <v-row no-gutters>
        <v-col cols="8"></v-col>
        <v-col cols="4">
          <v-card max-width="400" class="mx-auto my-auto elevation-0 py-8 pb-1 rounded-lg text-center">
            <div class="px-4 px-sm-2">
              <div class="pb-12">
                <img src="@/assets/Mynt_pro_logo.svg" width="40%">
              </div>
              <!-- <div class="pb-16">
            <img src="@/assets/tvlogo.svg" width="60%">
          </div> -->

              <!-- <img src="@/assets/Group 277.svg" class="mt-2 mb-6" width="100%"> -->
              <v-card-action>
                <div class="px-4">
                  <!-- to="/tv" -->
                  <v-btn @click="signIn()" outlined :ripple="false" block large class="btnout mb-6 rounded-md">
                    <span style="color:black;">
                      sign in with ZEBULL
                    </span>
                  </v-btn>

                  <!-- <v-btn @click="myntIn()" outlined :ripple="false" block large class="btnout mb-2 rounded-md">
                    <span style="color:black;">
                      sign in with Client ID
                    </span>
                  </v-btn> -->

                  <v-row no-gutters class="my-4">
                    <v-col cols="5">
                      <v-divider class="mx-2 mt-2" color="#DBE3EA"></v-divider>
                    </v-col>
                    <v-col cols="2">
                      <p class="text-center caption mb-0"> or </p>
                    </v-col>
                    <v-col cols="5">
                      <v-divider class="mx-2 mt-2" color="#DBE3EA"></v-divider>
                    </v-col>
                  </v-row>

                  <v-btn href="https://oa.zebull.in" target="_blank" outlined :ripple="false" block large
                    class="btnout mb-2 rounded-md"><span style="color:black;">
                      Open an account
                    </span></v-btn>
                </div>
              </v-card-action>

              <v-card-subtitle style="font-size:12px;" class="text-center">
                <p style="color:#858B95;">By continuing with MYNT pro by ZEBU, your agree our Terms and Privacy Policy
                </p>
              </v-card-subtitle>
              <!-- <div>
                <a href="https://www.zebuetrade.com/">
                  <img src="@/assets/zebuLogo.svg" width="30%">
                </a>
              </div> -->
              <!-- <v-card-subtitle style="font-size:10px; color:#858B95;" class="text-center font-weigth-regular">
                <p>Member name : Zebu Share and Wealth Managements Pvt. Ltd. <br>
                  NSE / BSE / MCX , SEBI Registration No: INZ000174634,<br> CDSL : 12080400
                  AMFI ARN : 113118 , Research Analyst : INH200006044
                </p> 

              </v-card-subtitle> -->
            </div>
          </v-card>
        </v-col>
        <v-footer padless absolute>
          <v-card flat tile width="100%" class="lighten-1 text-center">

            <v-divider></v-divider>

            <v-card-text style="font-size:12px; color:#858B95;">
              <v-row no-gutters>
                <v-col cols="11">
                  <a class="footerrouterlink" target="blank" href="https://www.zebuetrade.com/">Zebu</a>
                  Share and Wealth Managements Pvt. Ltd. | <a class="footerrouterlink" target="blank"
                    href="https://www.sebi.gov.in/">SEBI</a> Registration No: INZ000174634 | <a class="footerrouterlink"
                    target="blank" href="https://www.nseindia.com/">NSE</a> : 13179 | <a class="footerrouterlink"
                    target="blank" href="https://www.bseindia.com/">BSE</a> :
                  6550 | <a class="footerrouterlink" target="blank" href="https://www.mcxindia.com/">MCX</a> : 55730 |
                  <a class="footerrouterlink" target="blank" href="https://www.cdslindia.com/index.html">CDSL</a> :
                  12080400 | <a class="footerrouterlink" target="blank" href="https://www.amfiindia.com/">AMFI</a> ARN :
                  113118 | Research Analyst : INH200006044
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="1">
                  <p class="mb-0">v1.0.0.0</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-footer>
      </v-row>
    </v-container>

  </div>
</template>

<script>
// import axios from "axios";
import { appurl } from "../apiUrl.js";

export default {
  data: () => ({
    actid: "",
    email: "",
    susertoken: "",

    udmynt: [],
  }),
  methods: {
    signIn() {
      location.href = `https://zebull.in/?mode=SSO&vendor=MyZebu&redirectUrl=${appurl}/zebull-tv`;
    },
    myntIn() {

      if ((this.actid != null) && (this.email != null) && (this.udmynt.actid == this.actid) && (this.udmynt.email == this.email)) {
        this.$router.push("/myntpro-tv");
        console.log("udmynt if", this.udmynt.actid, this.udmynt.email, this.actid, this.email);
      } else {
        this.$router.push("/MyntPro_Signin");
        console.log("udmynt else", this.udmynt.actid, this.udmynt.email, this.actid, this.email);
      }
    }
  },
  // mounted() {
  //   // if (this.logininfo == "MyntOk") {}
  //   this.actid = localStorage.getItem("actid");
  //   this.susertoken = localStorage.getItem("susertoken");
  //   this.email = localStorage.getItem("email");

  //   console.log("cliixzxzd", this.actid, this.susertoken, this.email);
  //   var axiosThis = this;

  //   var data = `jData={"uid":"${this.actid}"}&jKey=${this.susertoken}`;

  //   var udmyntconfig = {
  //     method: 'post',
  //     url: `${mynturl}/UserDetails`,
  //     headers: {
  //       'Content-Type': 'text/plain',
  //     },
  //     data: data
  //   };

  //   axios(udmyntconfig)
  //     .then(function (response) {
  //       // console.log(JSON.stringify(response.data));
  //       axiosThis.udmynt = response.data;
  //       console.log("udmynt sign", axiosThis.udmynt.email, axiosThis.udmynt.actid);

  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });

  // },
};
</script>

<style>
.v-application,
.v-application .display-1,
.v-application .headline,
.v-application .title,
.v-application .subtitle-1,
.v-application .subtitle-2,
.v-application .body-1,
.v-application .body-2,
.v-application .caption,
.v-application .overline {
  font-family: -apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}

.btnout {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}

::-webkit-scrollbar {
  width: 0;
}

.signupbgclr {
  background-color: white !important;
  height: 100vh !important;
  overflow-y: hidden !important;
}

.SsoView {
  height: 100vh !important;
  overflow-y: scroll !important;
}

.footerrouterlink {
  text-decoration: none !important;
  color: #1e53e5;
}

@media only screen and (max-width: 600px) {
  .signupbgclr {
    background-color: white !important;
  }

  .btn:hover {
    background-color: #ECEEF0 !important;
  }
}
</style>