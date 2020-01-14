<template>
  <span class="wrapper">
    <v-navigation-drawer :width="400" v-model="drawer" app clipped>
      <v-list dense nav>
        <v-subheader>Actions</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item @click="toUpload">
            <v-list-item-icon>
              <v-icon>mdi-upload-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="'Upload New File'"></v-list-item-title>
            <v-list-item-content></v-list-item-content>
          </v-list-item>

          <v-list-item @click="mine">
            <v-list-item-icon>
              <v-icon>mdi-pickaxe</v-icon>
            </v-list-item-icon>

            <v-list-item-title v-text="'Mine'"></v-list-item-title>
            <v-list-item-content></v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-divider></v-divider>
        <v-subheader>Active Relationship</v-subheader>
        <v-list-item-group v-model="curRel" color="primary">
          <v-list-item v-for="(rel, i) in relationships" :key="i">
            <v-list-item-title v-text="rel[0]"></v-list-item-title>
          </v-list-item>
        </v-list-item-group>

        <v-divider></v-divider>
        <v-subheader>Configuration</v-subheader>
        <v-list-group color="primary" prepend-icon="mdi-filter">
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

        <v-list-group color="primary" prepend-icon="mdi-ticket">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Activities</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(a, i) in labels" :key="i" link>
            <v-list-item-title v-text="a"></v-list-item-title>
            <v-list-item-action>
              <v-checkbox v-model="visibleActivities[i]" color="primary"></v-checkbox>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <router-link :to="{name: 'home'}">
        <v-toolbar-title>skelevision</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>

      <v-btn href="https://github.com/skelevision/skelevision" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content class="main-content">
      <cytoscape-dagre-graph-component :config="config" />
    </v-content>
  </span>
</template>

<script>
import GraphComponent from "../components/GraphComponent.vue";
import CytoscapeDagreGraphComponent from "../components/CytoscapeDagreGraphComponent.vue";

export default {
  name: "process",
  components: { CytoscapeDagreGraphComponent },
  data: () => ({
    // Cytoscape graph config data
    config: null,

    // skelevision graph data
    graphData: null,

    // UI
    drawer: true,

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
      ["Dependency", "dependency"]
    ],
    curRel: 0
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
          payload.forbiddenActivities.push(this.labels[i]);
        }
      }
      this.$http
        .post("mine", payload)
        .then(response => {
          if (response.status == 200) {
            this.curRel = 0;
            this.graphData = response.data;
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
    toUpload() {
      this.$router.push({ name: "home" });
    },
    updateCytoscapeConfig() {
      if (!this.graphData) {
        return;
      }

      let config = {
        height: "100%",
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#666",
              label: "data(label)",
              shape: "data(type)"
            }
          },
          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": "#ccc",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              opacity: 0.5
            }
          }
        ],
        layout: {
          name: "dagre"
        },
        elements: {
          nodes: null,
          edges: null
        }
      };

      // Set nodes
      let nodes = [];
      let visibleActivities = [];
      for (var i = 0; i < this.labels.length; i++) {
        if (this.visibleActivities[i]) {
          visibleActivities.push(this.labels[i]);
          nodes.push({
            data: {
              id: this.labels[i],
              label: this.labels[i],
              statistics: this.graphData.statistics.node[this.labels[i]],
              type: "round-rectangle"
            }
          });
        }
      }
      config.elements.nodes = nodes;

      // Set edges
      let edges = [];
      const curRel = this.relationships[this.curRel][1];
      const links = this.graphData.relationships[curRel];
      for (var i = 0; i < links.length; i++) {
        if (
          visibleActivities.includes(links[i][0]) &&
          visibleActivities.includes(links[i][1])
        ) {
          if (curRel === "dependency") {
            edges.push({
              data: {
                source: links[i][0],
                target: links[i][1],
                statistics: this.graphData.statistics.link[links[i][0]][links[i][1]]
              }
            });
          } else {
            edges.push({
              data: {
                source: links[i][0],
                target: links[i][1]
              }
            });
          }
        }
      }
      config.elements.edges = edges;

      this.config = config;
    }
  },
  created: function() {
    this.getLabels();
    this.mine();
  },
  watch: {
    graphData: function() {
      this.updateCytoscapeConfig();
    },
    curRel: function() {
      this.updateCytoscapeConfig();
    },
    visibleActivities: function() {
      this.updateCytoscapeConfig();
    }
  }
};
</script>

<style lang="sass" scoped>
a
  text-decoration: none
  color: rgba(0, 0, 0, 0.87)
  
span.wrapper
  height: 100%

.main-content
  height: calc(100%)
</style>