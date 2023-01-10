<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    
    </v-app-bar>

    <v-main>
   <TVChartContainer/>
    </v-main>
  </v-app>
</template>

<script>
import TVChartContainer from './components/TVChartContainer.vue';

export default {
  name: 'App',

  components: {
    TVChartContainer,
  },

  data: () => ({
    //
  }),
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>