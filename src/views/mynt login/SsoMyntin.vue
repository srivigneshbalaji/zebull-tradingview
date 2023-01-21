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
                            <div v-if="signinform">
                                <p class="black--text headline font-weight-medium">
                                    <span>Sign in with Client ID</span>
                                </p>
                            </div>
                            <div v-else>
                                <p class="black--text headline font-weight-medium">
                                    <span>Sign in with Existing Client ID</span>
                                </p>
                                <p class="font-weight-regular mb-0 title">Authorize MYNT pro</p>
                                <p class="font-weight-medium subtitle-2">Permission required by the app</p>
                            </div>

                            <div class="px-4">

                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <div v-if="signinform">
                                        <v-text-field class="mb-3" v-model="userId" :rules="useridRules"
                                            label="Client ID" required
                                            oninput="this.value = this.value.toUpperCase()"></v-text-field>

                                        <v-text-field class="mb-3" v-model="password"
                                            :append-icon="pwseye ? 'mdi-eye' : 'mdi-eye-off'" :rules="pwsRules"
                                            :type="pwseye ? 'text' : 'password'" label="Password"
                                            @click:append="pwseye = !pwseye"></v-text-field>
                                    </div>
                                    <div v-else>
                                        <v-avatar color="teal" size="40" class="mb-4">
                                            <span class="white--text font-weight-bold title text-uppercase">{{
                                                email.slice(0,
                                                    1)
                                            }}</span>
                                        </v-avatar>
                                        <p class="font-weight-bold mb-0">{{ actid }}</p>
                                        <p class="font-weight-medium subtitle-2 mb-8">{{ email }}</p>

                                        <!-- <v-btn color="#1e53e5" class="btnout mb-1 rounded-md elevation-0" block large
                                            @click="authoRize()">
                                            <span class="font-weight-bold white--text text-capitalize">
                                                Authorize
                                            </span>
                                        </v-btn>
                                        <p class="mb-0 text-left">
                                            <v-btn text :ripple="false" color="#1e53e5"
                                                class="forgotbtn px-0 mb-2 elevation-0" small @click="swacc()">
                                                <span class="font-weight-bold text-capitalize">
                                                    switch account
                                                </span>
                                            </v-btn>
                                        </p> -->
                                    </div>

                                    <v-text-field class="mb-3" v-model="twofact"
                                        :append-icon="twofacteye ? 'mdi-eye' : 'mdi-eye-off'" :rules="twofacteyeRules"
                                        :type="twofacteye ? 'text' : 'password'" label="PAN/DOB/OTP"
                                        @click:append="twofacteye = !twofacteye" required
                                        oninput="this.value = this.value.toUpperCase()"></v-text-field>

                                    <v-btn :disabled="!valid" color="#1e53e5" class="btnout mb-1 rounded-md elevation-0"
                                        block large @click="validate()">
                                        <span class="font-weight-bold white--text text-capitalize">
                                            Sign In
                                        </span>
                                    </v-btn>

                                    <p class="mb-0">
                                        <v-row no-gutters>
                                            <v-col cols="3" class="text-left pr-3">
                                                <v-btn text :ripple="false" color="#1e53e5"
                                                    class="forgotbtn px-0 mb-2 elevation-0" small @click="otpto()">
                                                    <span class="font-weight-bold text-capitalize">
                                                        GET OTP
                                                    </span>
                                                </v-btn>

                                            </v-col>
                                            <v-col cols="9" class="text-right">
                                                <v-list-item-title v-if="signinform">
                                                    <v-btn text :ripple="false" color="#1e53e5"
                                                        class="forgotbtn px-0 mb-2 elevation-0" small
                                                        @click="forgotPws()">
                                                        <span class="font-weight-bold text-capitalize">I
                                                            forgot
                                                            password or can't sign in</span>
                                                    </v-btn></v-list-item-title>
                                                <v-btn v-else text :ripple="false" color="#1e53e5"
                                                    class="forgotbtn px-0 mb-2 elevation-0" small @click="swacc()">
                                                    <span class="font-weight-bold text-capitalize">
                                                        switch account
                                                    </span>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
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
import { sha256 } from "js-sha256";
import { mynturl } from "../../apiUrl.js";

export default {
    data: () => ({
        snackbar: false,
        snackbarclr: 'default',
        snackmsgbar: "",
        signinform: true,
        uid: [],
        valid: true,

        userId: '',
        useridRules: [
            v => !!v || 'Client Id is required',
        ],

        pwseye: false,
        password: '',
        pwsRules: [
            v => !!v || 'Password is required',
        ],

        twofacteye: false,
        twofact: '',
        twofacteyeRules: [
            v => !!v || 'PAN/DOB/OTP is required',
            v => v.length >= 5 || 'PAN/DOB/OTP of minimum 5 characters or must be valid',
            // v => /[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v) || 'PAN number must be valid',
        ],

        actid: "",
        actidpws: "",
        email: "",
        susertoken: "",

        udmynt: [],
    }),

    methods: {
        validate() {
            this.$refs.form.validate();
            var shapass = sha256(this.password);
            // var apikey = "|Apikey10112022zebu";
            var apikey = "|Apikey18012023zebu";
            var addak = this.userId + apikey;
            var appkey = sha256(addak);

            if (this.$refs.form.validate() != false) {
                var axiosThis = this;
                var data =
                    // `jData={"uid":"${this.userId}","pwd":"${shapass}","factor2":"${this.twofact}","apkversion":"20220921","imei":"","vc":"PRO_MYNT","appkey":"${appkey}","source":"API"}`;
                    `jData={"uid":"${this.userId}","pwd":"${shapass}","factor2":"${this.twofact}","apkversion":"20220921","imei":"","vc":"PRO_MYNT","appkey":"${appkey}","source":"API"}`;
                var config = {
                    method: 'post',
                    url: `${mynturl}/QuickAuth`,
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    data: data
                };
                console.log("uid data", data);

                axios(config)
                    .then(function (response) {
                        // console.log(JSON.stringify(response.data));
                        console.log("uid res in", response.data);
                        if (response.data.emsg == "Invalid Input : Invalid User") {
                            console.log("uid if", response.data.emsg);
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'error';
                            axiosThis.snackmsgbar = "Invalid User or Invalid Client ID";
                            axiosThis.userId = "";
                            axiosThis.password = "";
                            axiosThis.twofact = "";
                        } else if (response.data.emsg == "Invalid Input : Wrong Password") {
                            console.log("uid else if w-pws", response.data.emsg);
                            axiosThis.signinform = true;
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'warning';
                            axiosThis.snackmsgbar = "Wrong Password.";
                            axiosThis.password = "";
                        } else if (response.data.emsg == "Invalid Input : Invalid OTP") {
                            console.log("uid else if otp", response.data.emsg);
                            axiosThis.signinform = true;
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'warning';
                            axiosThis.snackmsgbar = "Invalid OTP.";
                            axiosThis.twofact = "";
                        } else if (response.data.emsg == "Invalid Input : Wrong PAN/DOB/OTP") {
                            console.log("uid else if 2fa", response.data.emsg);
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'warning';
                            axiosThis.snackmsgbar = "Wrong PAN/DOB/OTP number.";
                            axiosThis.twofact = "";
                        } else if (response.data.emsg == "Invalid Input : User Blocked due to multiple wrong attempts") {
                            console.log("uid else if for pws", response.data.emsg);
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'error';
                            axiosThis.snackmsgbar = "User Blocked due to multiple wrong attempts.";
                            setTimeout(function () {
                                axiosThis.$router.push("/Forgot_Password");
                            }, 2000);
                        }
                        else if (response.data.emsg == "Invalid Input : Change Password" || response.data.emsg == "Invalid Input : Password Expired") {
                            console.log("uid else if cng", response.data.emsg);
                            axiosThis.signinform = true;
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'warning';
                            if (response.data.emsg == "Invalid Input : Change Password") {
                                axiosThis.snackmsgbar = "Password as Change, please set new Password.";
                            } else if (response.data.emsg == "Invalid Input : Password Expired") {
                                axiosThis.snackmsgbar = "Password Expired, please Change Password.";
                            }
                            axiosThis.userId = "";
                            axiosThis.password = "";
                            axiosThis.twofact = "";
                            setTimeout(function () {
                                axiosThis.$router.push("/Change_Password");
                            }, 2000);
                        }
                        var logininfo = "MyntOk";
                        axiosThis.uid = response.data;
                        localStorage.setItem("loginway", logininfo);
                        localStorage.setItem("lastway", logininfo);
                        localStorage.setItem("susertoken", response.data.susertoken);
                        localStorage.setItem("actid", response.data.actid);
                        localStorage.setItem("brkname", response.data.brkname);
                        localStorage.setItem("email", response.data.email);

                        localStorage.setItem("userid", response.data.actid);
                        localStorage.setItem("usession", response.data.susertoken);

                        if (response.data.susertoken && response.data.actid) {
                            axiosThis.$router.push("/myntpro-tv");
                            localStorage.setItem("ylisft", axiosThis.password);
                            // localStorage.setItem("ylifa", axiosThis.twofact);
                        }
                        // console.log("uid", axiosThis.uid, axiosThis.uid.susertoken, "rst", response.data.susertoken);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        otpto() {
            this.$router.push("/OTP_Sigin");
        },
        forgotPws() {
            this.$router.push("/Forgot_Password");
        },

        swacc() {
            this.signinform = true;
            this.valid = true;
            this.userId = "";
            this.password = "";
            this.twofact = "";
        },
    },

    mounted() {
        // if (this.logininfo == "MyntOk") {}
        this.actid = localStorage.getItem("actid");
        this.susertoken = localStorage.getItem("susertoken");
        this.email = localStorage.getItem("email");
        this.actidpws = localStorage.getItem("ylisft");

        if (this.actid != null && this.actid != "") {
            this.userId = this.actid;
            this.password = this.actidpws;
            this.twofact = "";
        } else {
            this.signinform = true;
            this.userId = "";
            this.password = "";
            this.twofact = "";
        }

        console.log("cliixzxzd s", this.actid, this.susertoken, this.email, (((this.actid != undefined) || (this.email != undefined) || (this.susertoken != undefined)) && ((this.actid != 0) || (this.email != 0))));
        var axiosthis = this;

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
                console.log("udmynt in ", response);
                axiosthis.udmynt = response.data;
                if ((response.data) && (response.data.actid == axiosthis.actid) && (response.data.email == axiosthis.email)) {
                    axiosthis.$router.push("/myntpro-tv");
                } else {
                    axiosthis.signinform = true;
                    axiosthis.userId = axiosthis.actid;
                    axiosthis.password = axiosthis.actidpws;
                    axiosthis.twofact = "";
                }
            })
            .catch(function (error) {
                console.log("udmynt err", error);
                if (error.response.data.emsg == "Session Expired :  Invalid Session Key") {
                    if ((axiosthis.actid == "undefined") || (axiosthis.email == "undefined") || (axiosthis.susertoken == "undefined") || (axiosthis.actid == 0) || (axiosthis.email == 0)) {
                        localStorage.removeItem("ylisft");
                        localStorage.removeItem("actid");
                        localStorage.removeItem("email");
                        localStorage.removeItem("loginway");
                        axiosthis.userId = "";
                        axiosthis.password = "";
                        axiosthis.twofact = "";
                        axiosthis.signinform = true;
                    } else {
                        axiosthis.signinform = false;
                    }
                } else {
                    localStorage.removeItem("ylisft");
                    localStorage.removeItem("actid");
                    localStorage.removeItem("email");
                    localStorage.removeItem("loginway");
                    axiosthis.signinform = true;
                }
            });

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