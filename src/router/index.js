import Vue from 'vue'
import VueRouter from 'vue-router'

import SsoSignin from '../views/SsoSignin.vue'

import ZebullGetdata from '../views/zebull login/ZebullGetdata.vue'
import TradingViewzebull from '../views/zebull login/TradingViewzebull.vue'

// import TradingViewmynt from '../views/mynt login/TradingViewmynt.vue'
// import SsoMyntin from '../views/mynt login/SsoMyntin.vue'
// import FgotpwsMyntin from '../views/mynt login/FgotpwsMyntin.vue'
// import ChangepwdMyntin from '../views/mynt login/ChangepwdMyntin.vue'
// import OtploginMynt from '../views/mynt login/OtploginMynt.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/zebull',
    name: 'trading view zebull get data',
    component: ZebullGetdata
  },
  {
    path: '/zebull-tv',
    name: 'trading view zebull',
    component: TradingViewzebull
  },

  // {
  //   path: '/myntpro-tv',
  //   name: 'trading view mynt',
  //   component: TradingViewmynt
  // },
  {
    path: '/',
    name: 'ssosignin',
    component: SsoSignin
  },
  // {
  //   path: '/MyntPro_Signin',
  //   name: 'Sso Mynt login',
  //   component: SsoMyntin
  // },
  // {
  //   path: '/Forgot_Password',
  //   name: 'Forgot Password',
  //   component: FgotpwsMyntin
  // },
  // {
  //   path: '/Change_Password',
  //   name: 'Change Password',
  //   component: ChangepwdMyntin
  // },
  // {
  //   path: '/OTP_Sigin',
  //   name: 'Otp Sigin',
  //   component: OtploginMynt
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
