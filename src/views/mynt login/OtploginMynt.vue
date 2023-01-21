<template>
    <div class="signupbgclr">
        <v-container fill-height class="SsoView">
            <v-row no-gutters>
                <v-col cols="8"></v-col>
                <v-col cols="4">
                    <v-snackbar class="pt-6 pr-6" style="z-index: 2 !important;" transition="slide-x-reverse-transition"
                        v-model="snackbar" :timeout="10000" :value="true" :color="snackbarclr" absolute outlined top
                        right>
                        <v-icon class="mr-2" :color="snackbarclr">mdi-alert-outline</v-icon>
                        {{ snackmsgbar }}
                    </v-snackbar>
                    <v-card max-width="400" class="mx-auto my-auto elevation-0 py-8 pb-1 rounded-lg text-center">
                        <div class="px-4 px-sm-2">
                            <div class="pb-8">
                                <img src="@/assets/Mynt_pro_logo.svg" width="40%">
                            </div>
                            <div>
                                <p class="black--text headline font-weight-medium">
                                    <v-row no-gutters>
                                        <v-col cols="2" class="text-left">
                                            <v-btn icon @click="goback()">
                                                <v-icon size="40">mdi-chevron-left</v-icon>
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="10" class="text-center">
                                            <span class="ml-n16">Get OTP</span>
                                        </v-col>
                                    </v-row>
                                </p>
                            </div>

                            <div class="px-4">
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-text-field class="mb-3" v-model="otpuserId" :rules="otpuseridRules"
                                        label="Client ID" required
                                        oninput="this.value = this.value.toUpperCase()"></v-text-field>

                                    <v-text-field class="mb-3" v-model="otppan"
                                        :append-icon="otppaneye ? 'mdi-eye' : 'mdi-eye-off'" :rules="otppanRules"
                                        :type="otppaneye ? 'text' : 'password'" label="PAN"
                                        @click:append="otppaneye = !otppaneye" required
                                        oninput="this.value = this.value.toUpperCase()"></v-text-field>

                                    <v-btn :disabled="!valid" color="#1e53e5" class="btnout mb-1 rounded-md elevation-0"
                                        block large @click="validate()">
                                        <span class="font-weight-bold white--text text-capitalize">
                                            Send OTP
                                        </span>
                                    </v-btn>

                                    <p class="mb-0 text-left">
                                        <v-list-item-title>
                                            <v-btn text :ripple="false" color="#1e53e5"
                                                class="forgotbtn px-0 mb-2 elevation-0" small @click="forgotPws()">
                                                <span class="font-weight-bold text-capitalize">I
                                                    forgot
                                                    password or can't sign in</span>
                                            </v-btn></v-list-item-title>
                                    </p>
                                </v-form>
                            </div>

                            <!-- <div v-else class="px-4">
                                <v-avatar color="teal" size="40" class="mb-4">
                                    <span class="white--text font-weight-bold title text-uppercase">{{
                                        email.slice(0,
                                            1)
                                    }}</span>
                                </v-avatar>
                                <p class="font-weight-bold mb-0">{{ actid }}</p>
                                <p class="font-weight-medium subtitle-2 mb-8">{{ email }}</p>

                                <v-btn color="#1e53e5" class="btnout mb-1 rounded-md elevation-0" block large
                                    @click="authoRize()">
                                    <span class="font-weight-bold white--text text-capitalize">
                                        Authorize
                                    </span>
                                </v-btn>
                                <p class="mb-0 text-left">
                                    <v-btn text :ripple="false" color="#1e53e5" class="forgotbtn px-0 mb-2 elevation-0"
                                        small @click="swacc()">
                                        <span class="font-weight-bold text-capitalize">
                                            switch account
                                        </span>
                                    </v-btn>
                                </p>
                            </div> -->

                            <v-card-subtitle style="font-size:12px;" class="text-center">
                                <p style="color:#858B95;">By continuing with MYNT pro by ZEBU, your agree our Terms and
                                    Privacy Policy
                                </p>
                            </v-card-subtitle>
                        </div>
                    </v-card>
                </v-col>


                <v-footer padless absolute>
                    <v-card flat tile width="100%" class="lighten-1 text-center">

                        <v-divider></v-divider>

                        <v-card-text style="font-size:12px; color:#858B95;">
                            <v-row no-gutters>
                                <v-col cols="11">
                                    <a class="footerrouterlink" target="blank"
                                        href="https://www.zebuetrade.com/">Zebu</a>
                                    Share and Wealth Managements Pvt. Ltd. | <a class="footerrouterlink" target="blank"
                                        href="https://www.sebi.gov.in/">SEBI</a> Registration No: INZ000174634 | <a
                                        class="footerrouterlink" target="blank" href="https://www.nseindia.com/">NSE</a>
                                    : 13179 | <a class="footerrouterlink" target="blank"
                                        href="https://www.bseindia.com/">BSE</a> :
                                    6550 | <a class="footerrouterlink" target="blank"
                                        href="https://www.mcxindia.com/">MCX</a> : 55730 |
                                    <a class="footerrouterlink" target="blank"
                                        href="https://www.cdslindia.com/index.html">CDSL</a> :
                                    12080400 | <a class="footerrouterlink" target="blank"
                                        href="https://www.amfiindia.com/">AMFI</a> ARN :
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
import axios from "axios";
// import { sha256 } from "js-sha256";
import { mynturl } from "../../apiUrl.js";

export default {
    data: () => ({
        snackbar: false,
        snackbarclr: 'default',
        snackmsgbar: "",
        valid: true,

        otpuserId: '',
        otpuseridRules: [
            v => !!v || 'Client Id is required',
        ],

        otppaneye: false,
        otppan: '',
        otppanRules: [
            v => !!v || 'PAN is required',
            v => /[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v) || 'PAN number must be valid',
        ],
    }),

    methods: {
        validate() {
            this.$refs.form.validate();
            if (this.$refs.form.validate() != false) {
                var axiosThis = this;

                var data = `jData={"uid":"${this.otpuserId}","pan":"${this.otppan}"}`;
                var config = {
                    method: 'post',
                    url: `${mynturl}/FgtPwdOTP`,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        console.log("validate", response.data);
                        if (response.data.ReqStatus == "OTP generation success") {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'success';
                            axiosThis.snackmsgbar = "OTP generation success, send through email/SMS.";
                            axiosThis.otpuserId = response.data.uid;
                            setTimeout(function () {
                                axiosThis.$router.push("/MyntPro_Signin");
                            }, 2000);
                        } else if (response.data.emsg == "Error Occurred : Wrong user id or user details" || response.data.ReqStatus
                            == "Invalid User") {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'error';
                            axiosThis.snackmsgbar = "Invalid User or Invalid Client ID.";
                        } else if (response.data.ReqStatus == "Invalid PAN") {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'error';
                            axiosThis.snackmsgbar = "Wrong PAN number.";
                        } else {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'error';
                            axiosThis.snackmsgbar = "OTP not generation, kindly try again.";
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        },
        goback() {
            this.$router.push("/MyntPro_Signin");
        },
        forgotPws() {
            this.$router.push("/Forgot_Password");
        },

    },
}
</script>

<style>
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

.forgotbtn.v-btn:before {
    background-color: white !important;
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