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
    },
    rel: {
      type: String,
      default: ""
    }
  },
  methods: {
    constructGraph() {
      this.graph = ForceGraph()(document.getElementById("graph"))
        //.linkDirectionalArrowLength(10)
        .linkWidth(0.1)
        .linkColor("#fafafa")
        .nodeCanvasObject(({ id, stats, x, y }, ctx) => {
          ctx.fillStyle = "#555555";
          ctx.fillRect(x - 18, y - 16, 36, 16);
          ctx.fillStyle = "#e33636";
          ctx.font = "4px Sans-Serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(id, x, y - 12);

          ctx.fillStyle = "#e33636";
          ctx.fillRect(x - 18, y - 8, 36, 8);

          ctx.fillStyle = "#ffffff";
          ctx.font = "4px Sans-Serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(stats.sum, x - 12, y - 4);
          ctx.fillText(stats.min, x, y - 4);
          ctx.fillText(stats.max, x + 12, y - 4);
        })

        .linkCanvasObjectMode(() => 'after')

        .linkCanvasObject((link, ctx) => {            
            //always after rectangle
            ctx.fillStyle = '#500555';
            ctx.fillRect(link.source.x-7, link.source.y, 4, 4);

            //always after triangle
            ctx.fillStyle = '#555555';
            ctx.beginPath(); 
            ctx.moveTo(link.target.x-7, link.target.y+8);  
            ctx.lineTo(link.target.x-3, link.target.y+8); 
            ctx.lineTo(link.target.x-5, link.target.y+4);
            ctx.fill();

            //always after draw the actual link
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = '#555555';
            ctx.beginPath();
            ctx.moveTo(link.source.x-5, link.source.y+8);
            ctx.lineTo(link.target.x-5, link.target.y+8);
            ctx.stroke();

            //always before rectangle
            ctx.fillStyle = '#500555';
            ctx.fillRect(link.target.x+3, link.target.y, 4, 4);

            //always before triangle
            ctx.fillStyle = '#555555';
            ctx.beginPath(); 
            ctx.moveTo(link.target.x+3, link.target.y+8);  
            ctx.lineTo(link.target.x+7, link.target.y+8); 
            ctx.lineTo(link.target.x+5, link.target.y+4);
            ctx.fill();

            //always before draw the actual link
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = '#555555';
            ctx.beginPath();
            ctx.moveTo(link.source.x+5, link.source.y+8);
            ctx.lineTo(link.target.x+5, link.target.y+8);
            ctx.stroke();

            //never together rectangles
            ctx.fillStyle = '#000000';
            ctx.fillRect(link.target.x-12, link.target.y, 4, 4);
            ctx.fillRect(link.source.x-12, link.source.y, 4, 4);

            //never together draw the actual link
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = '#555555';
            ctx.beginPath();
            ctx.moveTo(link.source.x-10, link.source.y+4);
            ctx.lineTo(link.target.x-10, link.target.y+4);
            ctx.stroke();

            //directly follows circle
            ctx.fillStyle = '#500555';
            ctx.beginPath(); 
            ctx.arc(link.source.x, link.source.y+2, 2.5, 0, 2 * Math.PI, false); 
            ctx.fill();

            //directly follows triangle
            ctx.fillStyle = '#555555';
            ctx.beginPath(); 
            ctx.moveTo(link.target.x-2, link.target.y+8);  
            ctx.lineTo(link.target.x+2, link.target.y+8); 
            ctx.lineTo(link.target.x, link.target.y+4);
            ctx.fill();

            //directly follows text
            const start = link.source;
            const end = link.target;
            const textPos = Object.assign(...['x', 'y'].map(c => ({
            [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
            })));
            const relLink = { x: end.x - start.x, y: end.y - start.y };
            let textAngle = Math.atan2(relLink.y, relLink.x);
            if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
            if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);
            ctx.font = "4px Sans-Serif";
            ctx.save();
            ctx.translate(textPos.x, textPos.y);
            ctx.rotate(textAngle);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = "#000000";
            ctx.fillText("Text", 0, 0);
            ctx.restore();

            //directly follows draw the actual link
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = '#555555';
            ctx.beginPath();
            ctx.moveTo(link.source.x, link.source.y+8);
            ctx.lineTo(link.target.x, link.target.y+8);
            ctx.stroke();
        })
        .nodeLabel("id");
    },
    updateGraph() {
      this.graph.graphData(this.graphData);
    },
    updateData() {
      const nodes = this.nodes
        .filter(i => this.nodeStatistics[i])
        .map(i => ({
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
    },
    rel: function() {
      console.log(this.rel);
    }
  }
};
</script>

<style lang="sass" scoped>

</style>