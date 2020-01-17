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
import popper from "cytoscape-popper";
import dagre from "cytoscape-dagre";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

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
      cytoscape.use(popper);
    },
    afterCreated(cy) {
      // cy: this is the cytoscape instance
      console.log("after created");
      let f = this.makePopper;
      let e = cy.elements();
      e.forEach(function(ele) {
        f(ele);
      });

    },
    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },
    makePopper(ele) {
      let ref = ele.popperRef(); // used only for positioning

      ele.tippy = tippy(ref, {
        // tippy options:
        content: () => {
          let content = document.createElement("div");

          content.innerHTML = ele.id();

          return content;
        },
        trigger: "manual" // probably want manual mode
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