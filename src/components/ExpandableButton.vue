<template>
  <div class="expandable-button-wrapper">
      <button class="button" @click="isOpen = !isOpen">This is a button</button>
      <div class="menu-container" :class="{'open': isOpen}"></div>
  </div>
</template>


<script>
export default {
name: "process",
  data: () => ({
    isOpen: false
  }),
}
</script>

<style lang="sass" scoped>
.expandable-button-wrapper
    position: relative
    // width:

.menu-container
    position: absolute
    top: 0
    left: 0
    width: 0
    height: 0

.menu-container.open
    z-index: 100
    width: 100px
    height: 100px
    background: green
</style>