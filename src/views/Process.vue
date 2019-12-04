<template>
  <span>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Filters</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Browse</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>skelevision</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="shrink">
           
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </span>
</template>

<script>
import { HTTP } from "../http-common";

export default {
  name: "process",
  data: () => ({
    data: null,
    drawer: null,
  }),
  methods: {
    getData() {
      HTTP.post(
        "eval",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
        .then(response => {
          console.log(response);
        })
        .catch(() => {
          console.log("FAILURE!!");
        });
    }
  },
  created: function() {
    // this.getData();
  },
  components: {
  }
};
</script>
