<template>
  <div class="dashboard-container">
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  created() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
}
</style>
