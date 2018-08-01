<template>
  <div>
    <Card :id="id" class="card-single">
      <template slot="cfg-view">

      </template>
      <template slot="form-view-title">{{cfg.name}}</template>
      <template slot="form-view">
        <el-button class="btn-save" @click="saveData" :loading="loading">{{loading?'加载中':'保 存'}}</el-button>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from './frame/card';
import img_Empty from '@/assets/decorate/img-empty.png';
import { mapGetters, mapState } from 'vuex';

export default {
  components: { Card },
  computed: {},
  data() {
    return {
      data: {},
      loading: false,
      img_Empty
    };
  },
  computed: {
    ...mapState(['user']),
    cfg: function() {
      if (this.data.data) {
        return this.data.data.data;
      } else {
        return {
          imageList: []
        };
      }
    }
  },
  props: {
    id: null
  },
  mounted: function() {
    var cpage = this;
    this.data = this.$store.state.decorate.cfg.find(item => {
      if (item != null) {
        return item.id == cpage.id;
      } else {
        return false;
      }
    });
  },
  methods: {
    // 接口方法
    saveData() {
      this.loading = true;
      // this.$store.dispatch('SaveComponent', this.data).then(res => {
      //   if (res.code == '0') {
      //     this.$message({
      //       message: '保存成功',
      //       type: 'success'
      //     });
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'warning'
      //     });
      //   }
      //   this.loading = false;
      // });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cfg-content {
  background-color: #eeeeee;
  overflow: hidden;
  text-align: center;
}
</style>

