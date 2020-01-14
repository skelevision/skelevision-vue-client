<template>
  <div id="holder">
    <cytoscape
      v-if="config && renderComponent"
      :config="config"
      :preConfig="preConfig"
      :afterCreated="afterCreated"
    />
  </div>
</template>

<script>
import dagre from "cytoscape-dagre";

export default {
  data() {
    return {
      renderComponent: true
    };
  },
  props: {
    config: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  methods: {
    preConfig(cytoscape) {
      console.log("calling pre-config");
      // cytoscape: this is the cytoscape constructor
      cytoscape.use(dagre);
    },
    afterCreated(cy) {
      // cy: this is the cytoscape instance
      console.log("after created");
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    }
  },
  mounted: function() {},
  watch: {
    config: function() {
      this.forceRerender();
    }
  }
};
</script>

<style lang="sass" scoped>
</style>