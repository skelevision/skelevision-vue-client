<template>
  <div>
    <div id="graph"></div>
  </div>
</template>

<script>
import ForceGraph from "force-graph";

export default {
  name: "GraphComponent",
  data() {
    return {
      graphData: null,
      graph: null
    };
  },
  props: {
    links: {
      type: Array,
      default: function() {
        return [];
      }
    },
    nodes: {
      type: Array,
      default: function() {
        return [];
      }
    },
    nodeStatistics: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  methods: {
    constructGraph() {
      this.graph = ForceGraph()(document.getElementById("graph"))
        .linkDirectionalArrowLength(10)
        .nodeCanvasObject(({ id, stats, x, y }, ctx) => {
          ctx.fillStyle = "#555555";
          ctx.fillRect(x - 18, y - 8, 36, 16);
          ctx.fillStyle = "#e33636";
          ctx.font = "4px Sans-Serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(id, x, y - 4);

          ctx.fillStyle = "#e33636";
          ctx.fillRect(x - 18, y, 36, 8);

          ctx.fillStyle = "#ffffff";
          ctx.font = "4px Sans-Serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(stats.sum, x - 12, y + 4);
          ctx.fillText(stats.min, x, y + 4);
          ctx.fillText(stats.max, x + 12, y + 4);
        })
        .nodeLabel("id");
    },
    updateGraph() {
      this.graph.graphData(this.graphData);
    },
    updateData() {
      const nodes = this.nodes.filter(i => this.nodeStatistics[i]).map(i => ({
        id: i,
        stats: this.nodeStatistics[i]
      }));
      debugger;
      const links = this.links
        .filter(
          link => this.nodes.includes(link[0]) && this.nodes.includes(link[1])
        )
        .map(link => ({
          source: link[0],
          target: link[1]
        }));

      this.graphData = {
        nodes: nodes,
        links: links
      };
    }
  },
  mounted() {
    this.updateData();
    this.constructGraph();
    this.updateGraph();
  },
  watch: {
    links: function() {
      this.updateData();
      this.updateGraph();
    },
    nodes: function() {
      this.updateData();
      this.updateGraph();
    }
  }
};
</script>

<style lang="sass" scoped>

</style>