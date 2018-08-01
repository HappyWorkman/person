<template>
  <div>
    <Card :id="id" class="card-search" :namebrand="decorate.components['product_search'].name">
      <template slot="cfg-view">
        <div class="search-panel" :class="cfg.style">
          <div class="search-box">
            <svg-icon class="search-icon" icon-class="search"></svg-icon>
            <div class="search-text">搜索</div>
          </div>
        </div>
      </template>
      <template slot="form-view-title">{{cfg.name}}</template>
      <template slot="form-view">
        <div class="form-view-content">
          <div class="view-style view-box">
            <div class="view-title">搜索样式</div>
            <el-radio-group class="view-data" v-model="cfg.style">
              <el-radio class="black-radio" :label="'style1'">样式1</el-radio>
              <el-radio class="black-radio" :label="'style2'">样式2</el-radio>
              <el-radio class="black-radio" :label="'style3'">样式3</el-radio>
            </el-radio-group>
          </div>
        </div>
        <el-button class="btn-save" @click="saveData" :disabled="!needSave" :loading="loading">{{loading?'加载中':'保 存'}}</el-button>
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
      img_Empty,
      needSave: false
    };
  },
  watch: {
    cfg: {
      handler(newValue, oldValue) {
        if (newValue == oldValue) {
          this.needSave = true;
        } else {
          // console.log(newValue)
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['user', 'decorate']),
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
      this.$store.dispatch('SaveComponent', this.data).then(res => {
        if (res.code == '0') {
          this.needSave = false;
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
        this.loading = false;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import './frame/card.scss';
.search-panel {
  height: 50px;
  padding: 10px 13px;

  .search-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 30px;
    background-color: #eeeeee;
  }
  .search-icon {
    color: #666;
    margin: 0 10px;
  }
  .search-text {
    color: #666;
    font-size: 14px;
  }
  &.style2 {
    .search-box {
      justify-content: center;
    }
  }
  &.style3 {
    .search-box {
      background-color: white;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>

