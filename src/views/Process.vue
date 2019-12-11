<template>
  <span class="wrapper">
    <v-navigation-drawer :width="400" v-model="drawer" app clipped>
      <v-list dense nav>
        <v-subheader>Actions</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item @click="mine">
            <!-- <v-list-item-icon>
            <v-icon v-text="'item.icon'"></v-icon>
            </v-list-item-icon>-->

            <v-list-item-content>
              <v-list-item-title v-text="'Mine'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <router-link :to="{name: 'home'}">
              <!-- <v-list-item-icon>
            <v-icon v-text="'item.icon'"></v-icon>
              </v-list-item-icon>-->

              <v-list-item-content>
                <v-list-item-title v-text="'Upload'"></v-list-item-title>
              </v-list-item-content>
            </router-link>
          </v-list-item>
        </v-list-item-group>
        <v-subheader>Settings</v-subheader>
        <v-list-group prepend-icon="mdi-card-search">
          <template v-slot:activator>
            <v-list-item-title>Search</v-list-item-title>
          </template>

          <v-list-group no-action sub-group>
            <template v-slot:activator>
              <v-list-item-title>Filters</v-list-item-title>
            </template>
            <v-list-item v-for="(activity, i) in labels" :key="i" link>
              <v-list-item-title v-text="activity"></v-list-item-title>

              <v-btn-toggle mandatory rounded dense v-model="filters[i]">
                <v-btn>
                  <v-icon>mdi-asterisk</v-icon>
                </v-btn>

                <v-btn>
                  <v-icon>mdi-adjust</v-icon>
                </v-btn>

                <v-btn>
                  <v-icon>mdi-cancel</v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-list-item>
          </v-list-group>

          <v-list-group no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>View Activities</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="(a, i) in labels" :key="i" link>
              <v-list-item-title v-text="a"></v-list-item-title>
              <v-list-item-action>
                <v-checkbox v-model="visibleActivities[i]" color="primary"></v-checkbox>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>

          <v-list-group sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>View Relationships</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item-group v-model="curRel" v-on:change="computeLinks">
              <v-list-item v-for="(rel, i) in relationships" :key="i">
                <v-list-item-title v-text="rel[0]"></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>skelevision</v-toolbar-title>
    </v-app-bar>

    <v-content class="main-content">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <graph-component v-if="data" :nodes="activeNodes" :links="visibleLinks" />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </span>
</template>

<script>
import GraphComponent from "../components/GraphComponent.vue";
export default {
  name: "process",
  data: () => ({
    // UI
    drawer: null,
    fab: false,

    // Data
    data: null,

    // Nodes (Labels)
    labels: [],
    filters: [],
    visibleActivities: [],

    // Relationships
    relationships: [
      ["Equivalence", "equivalence"],
      ["Never Together", "neverTogether"],
      ["Always After", "alwaysAfter"],
      ["Always Before", "alwaysBefore"],
      ["Dependecy", "dependency"]
    ],
    curRel: 0,
    visibleLinks: []
  }),
  methods: {
    mine() {
      let payload = {
        requiredActivities: [],
        forbiddenActivities: []
      };

      for (var i = 0; i < this.labels.length; i++) {
        if (this.filters[i] === 0) {
          payload.requiredActivities.push(this.labels[i]);
        }

        if (this.filters[i] === 2) {
          payload.requiredActivities.push(this.labels[i]);
        }
      }

      this.$http
        .post("mine", payload)
        .then(response => {
          if (response.status == 200) {
            this.data = response.data;
            this.computeLinks();
          }
        })
        .catch(() => {
          console.log("FAILURE!!");
        });
    },
    getLabels() {
      this.$http
        .get("labels")
        .then(response => {
          if (response.status == 200) {
            this.labels = response.data.labels;
            this.filters = [];
            this.visibleActivities = [];
            for (const a in this.labels) {
              this.filters.push(1);
              this.visibleActivities.push(true);
            }
          }
        })
        .catch(() => {
          console.log("FAILURE!!");
        });
    },
    computeLinks() {
      this.visibleLinks = [];
      if (this.data) {
        const i = this.relationships[this.curRel][1];
        this.visibleLinks = this.data.relationships[i];
      }
      return this.visibleLinks;
    }
  },
  created: function() {
    this.getLabels();
  },
  computed: {
    activeNodes: function() {
      const nodes = [];
      for (var i = 0; i < this.labels.length; i++) {
        if (this.visibleActivities[i]) {
          nodes.push(this.labels[i]);
        }
      }
      // TODO: Add node information
      return nodes;
    }
  },
  components: { GraphComponent }
};
</script>

<style lang="sass" scoped>
span.wrapper
  height: 100%

.main-content
  height: calc(100%)
</style>