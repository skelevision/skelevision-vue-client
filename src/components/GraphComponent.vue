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
      gData: {
        nodes: this.nodes.map(i => ({ id: i })),
        links: this.links
          .filter(id => id)
          .map(link => ({
            source: link[0],
            target: link[1]
          }))
      },
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
    }
  },
  methods: {
    setGraph() {
      this.graph = ForceGraph()(document.getElementById("graph"))
        .linkDirectionalArrowLength(10)
        .nodeCanvasObject(({ id, x, y }, ctx) => {
            ctx.fillStyle = '#555555';
            ctx.fillRect(x - 18, y - 8, 36, 16);
            ctx.fillStyle = '#e33636';
            ctx.font = '4px Sans-Serif'; 
            ctx.textAlign = 'center'; 
            ctx.textBaseline = 'middle'; 
            ctx.fillText(id, x, y-4);

            ctx.fillStyle = '#e33636';
            ctx.fillRect(x - 18, y, 36, 8);

            ctx.fillStyle = '#ffffff';
            ctx.font = '4px Sans-Serif'; 
            ctx.textAlign = 'center'; 
            ctx.textBaseline = 'middle'; 
            ctx.fillText(id, x-12, y+4);
            ctx.fillText(id, x, y+4);
            ctx.fillText(id, x+12, y+4);
        })
        .nodeLabel("id")
        .graphData(this.gData);
    }
  },
  mounted() {
    this.setGraph();
  },
  watch: {
    links: function() {
      this.gData.links = this.links
        .filter(id => id)
        .map(link => ({
          source: link[0],
          target: link[1]
        }));
      this.setGraph();
    }
  }
};
</script>

<style lang="sass" scoped>

</style>