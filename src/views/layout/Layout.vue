<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <navbar></navbar>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <app-main :style="{height:autoHeight}"></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout/components';

export default {
  name: 'layout',
  data() {
    return {
      autoHeight: document.documentElement.clientHeight - 85 + 'px'
    };
  },
  mounted() {
    window.onresize = () => {
      this.autoHeight = document.documentElement.clientHeight - 85 + 'px';
    };
  },
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.main-container {
  padding: 0;
  overflow: hidden;
}
</style>
