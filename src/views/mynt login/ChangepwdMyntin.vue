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
                            <p class="black--text headline font-weight-medium">
                                <span>Change or Forgot Password</span>
                            </p>

                            <div class="px-4">
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-text-field :disabled="userIdvalid" class="mb-3" v-model="userId"
                                        :rules="useridRules" label="Client ID" required
                                        oninput="this.value = this.value.toUpperCase()"></v-text-field>

                                    <v-text-field class="mb-3" v-model="oldpassword" required
                                        :append-icon="oldpwseye ? 'mdi-eye' : 'mdi-eye-off'" :rules="oldpwsRules"
                                        :type="oldpwseye ? 'text' : 'password'" label="Old Password or Received Password"
                                        hint="Enter the old Password for Change Password or received Password through email/SMS for Forgot Password."
                                        @click:append="oldpwseye = !oldpwseye"></v-text-field>

                                    <v-text-field class="mb-3" v-model="newpassword" required
                                        :append-icon="newpwseye ? 'mdi-eye' : 'mdi-eye-off'" :rules="newpwsRules"
                                        :type="newpwseye ? 'text' : 'password'" label="New Password"
                                        hint="New Password couldn't be changed as it is among the previous 3 passwords."
                                        @click:append="newpwseye = !newpwseye"></v-text-field>

                                    <v-btn :disabled="!valid" color="#1e53e5" class="btnout mb-1 rounded-md elevation-0"
                                        block large @click="validate()">
                                        <span class="font-weight-bold white--text text-capitalize">
                                            Reset Password
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
import { sha256 } from "js-sha256";

export default {
    data: () => ({
        snackbar: false,
        snackbarclr: 'default',
        snackmsgbar: "",
        userIdvalid: true,

        valid: true,

        fgotpwdcliid: '',
        userId: '',
        useridRules: [
            v => !!v || 'Client Id is required',
        ],

        newpwseye: false,
        newpassword: '',
        newpwsRules: [
            v => !!v || 'New Password is required',
            v => v.length >= 8 || 'New Password of minimum 8 characters',
            v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) || 'New Password must contain at least lowercase letter, one number, a special character and one uppercase letter',

        ],

        oldpwseye: false,
        oldpassword: '',
        oldpwsRules: [
            v => !!v || 'Old Password is required',
        ],
    }),

    methods: {
        validate() {
            var oldshapass = sha256(this.oldpassword);

            this.$refs.form.validate();
            if (this.$refs.form.validate() != false) {
                var axiosThis = this;
                var data = `jData={"uid":"${this.userId}","oldpwd":"${oldshapass}","pwd":"${this.newpassword}"}`;

                var config = {
                    method: 'post',
                    url: `${mynturl}/Changepwd`,
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    data: data
                };
                console.log("pandob data", data);

                axios(config)
                    .then(function (response) {
                        // console.log(JSON.stringify(response.data));
                        console.log("Changepwd", response.data);

                        if (response.data.dmsg == "Password Change Success. Your new password will expire in 15 days") {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'success';
                            axiosThis.snackmsgbar = "Password Change Success. Your new password will expire in 15 days";
                            setTimeout(function () {
                                axiosThis.$router.push("/MyntPro_Signin");
                                localStorage.removeItem("FgotPwduserid");
                            }, 3000);
                        } else if (response.data.emsg == "Error Occurred : Password couldn't be changed as it is among the previous 3 passwords") {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'error';
                            axiosThis.snackmsgbar = "Password couldn't be changed as it is among the previous 3 passwords";
                        } else if (response.data.emsg == "Error Occurred : Please enter an alphanumeric password of minimum 8 characters. Refer password criteria for more details") {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'error';
                            axiosThis.snackmsgbar = "Please enter an alphanumeric password. Refer password criteria for more details";
                        }
                        else if (response.data.emsg == "Error Occurred : Invalid Old Password") {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'error';
                            axiosThis.snackmsgbar = "Invalid Old Password";
                            axiosThis.oldpassword = '';
                        } else {
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'warning';
                            axiosThis.snackmsgbar = "something went wrong, please try again";
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
        this.fgotpwdcliid = localStorage.getItem("FgotPwduserid");
        console.log("this.fgotpwdcliid", this.fgotpwdcliid)
        if (this.fgotpwdcliid != null) {
            this.userId = this.fgotpwdcliid;
            this.userIdvalid = true;
        } else {
            this.userId = '';
            this.userIdvalid = false;
        }

        // var axios = require('axios');

    },

    computed: {
        Otpbtn() {
            return this.otpvalid.length === this.otplength;

        },
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