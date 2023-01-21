<template>
    <div class="signupbgclr">
        <v-container fill-height class="SsoView">
            <v-row no-gutters>
                <v-col cols="8"></v-col>
                <v-col cols="4">
                    <v-snackbar class="pt-6 pr-6" style="z-index: 2 !important;" transition="slide-x-reverse-transition"
                        v-model="snackbar" :timeout="10000" :value="true" :color="snackbarclr" absolute outlined
                        top right>
                        <v-icon class="mr-2" :color="snackbarclr">mdi-alert-outline</v-icon>
                        {{ snackmsgbar }}
                    </v-snackbar>
                    <v-card max-width="400" class="mx-auto my-auto elevation-0 py-8 pb-1 rounded-lg text-center">
                        <div class="px-4 px-sm-2">
                            <div class="pb-8">
                                <img src="@/assets/Mynt_pro_logo.svg" width="40%">
                            </div>
                            <p class="black--text headline font-weight-medium">
                                <span>Forgot Password</span>
                            </p>

                            <div class="px-4">
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-text-field class="mb-3" v-model="userId" :rules="useridRules" label="Client ID"
                                        required oninput="this.value = this.value.toUpperCase()"></v-text-field>

                                    <v-text-field class="mb-3" v-model="pan"
                                        :append-icon="paneye ? 'mdi-eye' : 'mdi-eye-off'" :rules="panRules"
                                        :type="paneye ? 'text' : 'password'" label="PAN"
                                        @click:append="paneye = !paneye" required
                                        oninput="this.value = this.value.toUpperCase()"></v-text-field>

                                    <v-text-field class="mb-3" v-model="dob" placeholder="DDMMYYYY" :rules="dobRules"
                                        label="DOB" type="number" required></v-text-field>

                                    <v-btn :disabled="!valid" color="#1e53e5" class="btnout mb-1 rounded-md elevation-0"
                                        block large @click="validate()">
                                        <span class="font-weight-bold white--text text-capitalize">
                                            Unblock & Reset
                                        </span>
                                    </v-btn>

                                    <p class="mb-0 text-left">
                                        <v-btn text :ripple="false" color="#1e53e5"
                                            class="forgotbtn px-0 mb-2 elevation-0" small @click="backtoMyntin()">
                                            <span class="font-weight-bold text-capitalize">
                                                back to sign in
                                            </span>
                                        </v-btn>
                                    </p>
                                </v-form>
                            </div>
                            <div class="py-16"></div>
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
import axios from 'axios'
import { mynturl } from '../../apiUrl.js'

export default {
    data: () => ({
        snackbar: false,
        snackbarclr: 'default',
        snackmsgbar: "",

        valid: true,

        userId: '',
        useridRules: [
            v => !!v || 'Client Id is required',
        ],

        dob: '',
        dobRules: [
            v => !!v || 'Date of birth is required',
            v => /[0-3]{1}[0-9]{1}[0-1]{1}[0-9]{1}[0-9]{4}$/.test(v) || 'Date of birth must be [DDMMYYYY eg: 01012000]',
            v => v.length == 8 || 'Date of birth must be valid',
        ],

        paneye: false,
        pan: '',
        panRules: [
            v => !!v || 'PAN is required',
            v => /[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v) || 'PAN number must be valid',
        ],
    }),

    methods: {
        validate() {
            this.$refs.form.validate();
            if (this.$refs.form.validate() != false) {
                var axiosThis = this;

                var data = `jData={"uid":"${this.userId}","pan":"${this.pan}","dob":"${this.dob}"}`;

                var config = {
                    method: 'post',
                    url: `${mynturl}/ForgotPassword`,
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    data: data
                };
                console.log("pandob data", data);

                axios(config)
                    .then(function (response) {
                        // console.log(JSON.stringify(response.data));
                        console.log("pandob", response.data);
                        if (response.data.emsg == "Error Occurred : Wrong user id or user details") {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'error';
                            axiosThis.snackmsgbar = "Invalid User or Invalid Client ID";
                            axiosThis.userId = "";
                            axiosThis.dob = "";
                            axiosThis.pan = "";
                        } else if (response.data.stat == "Ok") {
                            localStorage.setItem("FgotPwduserid", axiosThis.userId);
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'success';
                            axiosThis.snackmsgbar = "New password is send through email/SMS.";
                            localStorage.removeItem("ylisft");
                            localStorage.removeItem("actid");
                            localStorage.removeItem("email");
                            localStorage.removeItem("loginway");
                            localStorage.removeItem("susertoken");
                            setTimeout(function () {
                                axiosThis.$router.push("/Change_Password");
                            }, 2000);

                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        },
        backtoMyntin() {
            this.$router.push("/MyntPro_Signin");
        },
    },

    mounted() {
        // var axios = require('axios');

    },
}
</script>

<style>
.v-input input::-webkit-outer-spin-button,
.v-input input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
}
</style>