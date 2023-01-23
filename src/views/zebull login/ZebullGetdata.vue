<template>
    <div class="home">
        <v-container fill-height class="SsoView">
            <v-card class="elevation-0 mx-auto">
                <v-progress-circular size="100" indeterminate color="#1e53e5"></v-progress-circular>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios'
import { apiurl } from '../../apiUrl.js'

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
        authcode: "",

        cliid: "",
        cliname: "",
        usession: "",
        jwtdecode: [],

    }),



    created() {
        this.authcode = new URL(window.location.href).searchParams.get("authCode");
        console.log("authcode", this.authcode)
        var axiosThis = this;

        if (this.authcode != null) {
            var logininfo = "ZebullOk";
            localStorage.setItem("loginway", logininfo);
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
                            var usersess = response.data.clientsession;
                            axiosThis.jwtdecode = axiosThis.parseJwt(usersess);
                            console.log("usersess var", usersess, axiosThis.jwtdecode)

                            localStorage.setItem("userid", response.data.client_code);
                            localStorage.setItem("username", response.data.clientName);
                            localStorage.setItem("usession", axiosThis.jwtdecode.sessionID);

                            axiosThis.ssologinfo = localStorage.getItem("loginway");
                            axiosThis.cliid = localStorage.getItem("userid");
                            axiosThis.usession = localStorage.getItem("usession");
                            axiosThis.cliname = localStorage.getItem("username");
                            console.log("cliixzxzd sso", axiosThis.ssologinfo, axiosThis.cliid, axiosThis.usession, axiosThis.cliname);
                            if ((axiosThis.cliid != null) || (axiosThis.usession != null) || (axiosThis.cliname != null)) {
                                axiosThis.$router.push("/zebull-tv");
                                window.location.reload();
                            } else {
                                axiosThis.usernotfound = false;
                                axiosThis.snackbar = true;
                                axiosThis.snackbarclr = 'warning';
                                axiosThis.snackmsgbar = "Session expired, Kindly Sign in again.";
                                setTimeout(function () {
                                    axiosThis.$router.push("/");
                                }, 2000);
                            }
                        }
                        else {
                            axiosThis.usernotfound = false;
                            axiosThis.snackbar = true;
                            axiosThis.snackbarclr = 'warning';
                            axiosThis.snackmsgbar = "User not found, Kindly Sign in.";
                            setTimeout(function () {
                                axiosThis.$router.push("/");
                            }, 2000);
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        } else {
            this.$router.push("/");

        }
    },

    methods: {
        parseJwt(token) {
            // console.log("parseJwt json", JSON.parse(atob(token.split('.')[1])))
            return JSON.parse(atob(token.split('.')[1]));
        }
    }
}
</script>  