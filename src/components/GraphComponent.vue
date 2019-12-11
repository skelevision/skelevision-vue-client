<template>
  <div>
    <p>Links: {{links}}</p>
    <p>Nodes: {{nodes}}</p>
  </div>
</template>

<script>
export default {
  name: "GraphComponent",
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
  }
};
</script>

<style lang="sass" scoped>

</style>