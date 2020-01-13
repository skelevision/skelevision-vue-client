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
    linkStatistics: {
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
        .linkWidth(0.1)
        .linkColor("#fafafa")
        .nodeCanvasObject(({ id, stats, x, y }, ctx) => {
          ctx.fillStyle = "#d3d3d3";
          ctx.fillRect(x - 18, y - 16, 36, 16);
          ctx.fillStyle = "#b80b0b";
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

        .onNodeDragEnd(node => {
        node.fx = node.x;
        node.fy = node.y;
        })

        .linkCanvasObjectMode(() => "after")

        .linkCanvasObject((link, ctx) => {    
          if(link.source !=link.target) {    
            if (this.rel === "equivalence") { 
              ctx.fillStyle = '#b80b0b';
              ctx.beginPath(); 
              ctx.arc(link.source.x, link.source.y+2.5, 2.5, 0, 2 * Math.PI, false); 
              ctx.fill();
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = '#555555';
              ctx.beginPath();
              ctx.moveTo(link.source.x, link.source.y+4);
              ctx.lineTo(link.target.x, link.target.y+3.5);
              ctx.stroke();
            }
            
            if (this.rel === "alwaysAfter") { 
              ctx.fillStyle = '#b80b0b';
              ctx.fillRect(link.source.x-5, link.source.y, 4, 4);
              ctx.fillStyle = '#555555';
              ctx.beginPath();
              ctx.moveTo(link.target.x+2, link.target.y+4);  
              ctx.lineTo(link.target.x+6, link.target.y+4); 
              ctx.lineTo(link.target.x+4, link.target.y);
              ctx.fill();
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = '#555555';
              ctx.beginPath();
              ctx.moveTo(link.source.x-3, link.source.y+4);
              ctx.lineTo(link.target.x+4, link.target.y+3.5);
              ctx.stroke();
            }

            if (this.rel === "alwaysBefore") { 
              ctx.fillStyle = '#b80b0b';
              ctx.fillRect(link.target.x-4, link.target.y, 4, 4);
              ctx.fillStyle = '#555555';
              ctx.beginPath(); 
              ctx.moveTo(link.target.x-4, link.target.y+8);  
              ctx.lineTo(link.target.x, link.target.y+8); 
              ctx.lineTo(link.target.x-2, link.target.y+4);
              ctx.fill();
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = '#555555';
              ctx.beginPath();
              ctx.moveTo(link.source.x+3, link.source.y);
              ctx.lineTo(link.target.x-3, link.target.y+8);
              ctx.stroke();
            }

            if (this.rel === "neverTogether") { 
									 
              ctx.fillStyle = '#000000';
              ctx.fillRect(link.target.x-2, link.target.y, 4, 4);
              ctx.fillRect(link.source.x-2, link.source.y, 4, 4);
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = '#555555';
              ctx.beginPath();
              ctx.moveTo(link.source.x, link.source.y+4);
              ctx.lineTo(link.target.x, link.target.y+4);
              ctx.stroke();
            }

            if (this.rel === "dependency") { 
              ctx.fillStyle = '#b80b0b';
              ctx.beginPath(); 
              ctx.arc(link.source.x-3, link.source.y+2.5, 2.5, 0, 2 * Math.PI, false); 
              ctx.fill();
              ctx.fillStyle = '#555555';
              ctx.beginPath(); 
              ctx.moveTo(link.target.x+1, link.target.y+4);  
              ctx.lineTo(link.target.x+5, link.target.y+4); 
              ctx.lineTo(link.target.x+3, link.target.y);
              ctx.fill();

              //directly follows text
              const start = link.source;
              const end = link.target;
              const textPos = Object.assign(...['x', 'y'].map(c => ({
              [c]: start[c] + (end[c] - start[c]) / 2 })));
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
              ctx.fillText(link.dependency, 0, 0);
              ctx.restore();

              //directly follows draw the actual link
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = '#555555';
              ctx.beginPath();
              ctx.moveTo(link.source.x-3, link.source.y+4.5);
              ctx.lineTo(link.target.x+3, link.target.y+3.5);
              ctx.stroke();
            }
          }									
        })
        .nodeLabel("id");
        this.graph.d3Force('center', null);
        this.graph.d3Force('charge').strength(-100);   
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
      let links = null;
      if (this.rel === "dependency") {
        links = this.links
          .filter(
            link => this.nodes.includes(link[0]) && this.nodes.includes(link[1])
          )
          .map(link => ({
            source: link[0],
            target: link[1],
            dependency: this.linkStatistics[link[0]][link[1]],
          }));
      } else {
        links = this.links
          .filter(
            link => this.nodes.includes(link[0]) && this.nodes.includes(link[1])
          )
          .map(link => ({
            source: link[0],
            target: link[1]
          }));
      }

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