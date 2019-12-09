<template>
  <span>
    <v-navigation-drawer :width="400" v-model="drawer" app clipped>
      <v-list dense nav>
        <v-list-group v-if="this.labels" prepend-icon="mdi-filter" value="true">
          <template v-slot:activator>
            <v-list-item-title>Filters</v-list-item-title>
          </template>
          <v-list-item v-for="(activity, i) in this.labels" :key="i" link>
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

        <v-list-group prepend-icon="mdi-card-search">
          <template v-slot:activator>
            <v-list-item-title>Browse</v-list-item-title>
          </template>

          <v-list-group no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>View Activities</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="(a, i) in labels" :key="i" link>
              <v-list-item-title v-text="a"></v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-group sub-group no-action>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>View Relationships</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="(crud, i) in relationships" :key="i" @click>
              <v-list-item-title v-text="crud"></v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>skelevision</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="shrink">visualization</v-col>
        </v-row>
        <v-btn @click="mine" absolute dark fab bottom right color="pink">
          <v-icon>mdi-pickaxe</v-icon>
        </v-btn>
      </v-container>
    </v-content>
  </span>
</template>

<script>
export default {
  name: "process",
  data: () => ({
    data: null,
    labels: [],
    filters: [],
    drawer: null,
    relationships: [
      "Equivalence",
      "Never Together",
      "Always After",
      "Always Before",
      "Dependecy"
    ]
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
          console.log(response);
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
            for (const a in this.labels) {
              this.filters.push(1);
            }
          }
        })
        .catch(() => {
          console.log("FAILURE!!");
        });
    }
  },
  created: function() {
    // this.getData();
    this.getLabels();
  },
  components: {}
};
</script>
