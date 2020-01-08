<template>
  <v-app>
    <router-view />
    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),
  created: function() {
    this.$vuetify.theme.dark = false;
  }
};
</script>
