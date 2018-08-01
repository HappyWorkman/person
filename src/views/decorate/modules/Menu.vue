<template>
  <div>
    <Card :id="id" class="card-menu" :namebrand="decorate.components['group_navigation'].name">
      <template slot="cfg-view">
        <div class="menu-panel" :class="cfg.style" v-if="cfg.menus.length<1">
          <div class="menu-item" v-for="(menu,index) in {half:'1234',third:'123456','quarter':'12345678'}[cfg.style]" :key="index">
            <img :src="img_Empty" class="icon-empty" />
          </div>
          <div class="model-tip-text">请点击该区域并在右侧配置框内添加导航</div>
        </div>
        <div class="menu-panel" :class="cfg.style" v-else>
          <div class="menu-item" v-for="(menu,index) in cfg.menus" :key="index">
            <img :src="menu.imageIcon" />
            <div class="menu-name">{{menu.name}}</div>
          </div>
        </div>
      </template>
      <template slot="form-view-title">{{cfg.name}}</template>
      <template slot="form-view">
        <div class="form-view-content">
          <div class="view-style view-box">
            <h2>排列样式</h2>
            <el-radio-group class="view-data" v-model="cfg.style">
              <el-radio class="black-radio" :label="'half'">2列展示</el-radio>
              <el-radio class="black-radio" :label="'third'">3列展示</el-radio>
              <el-radio class="black-radio" :label="'quarter'">4列展示</el-radio>
            </el-radio-group>
            <div class="view-tip">＊此列为每行展示的分组数，超过自动换行，最多添加2行</div>
          </div>
          <div class="view-box">
            <div class="view-title">
              <h2 class="title">添加商品分组</h2>
              <div class="progress">{{cfg.menus.length}}/{{{half:'4',third:'6',quarter:'8'}[cfg.style]}}</div>
            </div>

            <ul class="object-list">
              <li class="object-item" v-for="(item,index) in cfg.menus" :key="item.id">
                <div class="order-tool">
                  <div class="btn-up el-icon-arrow-up" @click="changemenuOrder(index,'up')"></div>
                  <div class="btn-down el-icon-arrow-down" @click="changemenuOrder(index,'down')"></div>
                </div>
                <div class="thumbnail">
                  <img :src="item.imageIcon" />
                </div>
                <div class="object-detail-info">
                  <el-tooltip :content="item.name" placement="top-start">
                    <div class="img-target">{{item.name}}</div>
                  </el-tooltip>
                </div>
                <div class="btn-delete-panel">
                  <div class="btn-delete el-icon-delete" @click="deMenu(item)"></div>
                </div>
              </li>
            </ul>
            <div class="btn-add btn-upload" @click="gsVisible=true;" v-if="cfg.menus.length<{half:'4',third:'6',quarter:'8'}[cfg.style]">
              <i class="el-icon-plus "></i>
              <span>添加商品分组</span>
            </div>
            <el-button type="text" @click="gotoMenu">编辑商品分组</el-button>
          </div>
        </div>
        <el-button class="btn-save" @click="saveData" :disabled="!needSave" :loading="loading">{{loading?'加载中':'保 存'}}</el-button>
      </template>
    </Card>
    <GroupsSelect  pattern="check" :limit="{half:'4',third:'6',quarter:'8'}[cfg.style]" :visible.sync="gsVisible" :checked="cfg.menus" @select="addMenu" @unSelect="deMenu"></GroupsSelect>
  </div>
</template>

<script>
import Card from './frame/card';
import img_Empty from '@/assets/decorate/menu-empty.png';
import GroupsSelect from '@/components/Dialog/GroupsSelect';
import { mapGetters, mapState } from 'vuex';

export default {
  components: { Card, GroupsSelect },
  computed: {},
  data() {
    return {
      data: {},
      gsVisible: false,
      loading: false,
      needSave: false,
      img_Empty
    };
  },
  watch: {
    cfg: {
      handler(newValue, oldValue) {
        if (newValue == oldValue) {
          this.needSave = true;
        } else {
          // console.log(newValue);
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
          menus: []
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
      if (
        this.cfg.menus.length >
        { half: '4', third: '6', quarter: '8' }[this.cfg.style]
      ) {
        this.$confirm('分组过多继续将删除多余分组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            while (
              this.cfg.menus.length >
              { half: '4', third: '6', quarter: '8' }[this.cfg.style]
            ) {
              this.cfg.menus.pop();
            }
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
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消操作'
            });
            return;
          });
      } else {
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
    },
    addMenu(data) {
      this.cfg.menus.push(data);
    },
    deMenu(data) {
      for (var i = 0; i < this.cfg.menus.length; i++) {
        if (this.cfg.menus[i].id == data.id) {
          this.cfg.menus.splice(i, 1);
          break;
        }
      }
    },
    changemenuOrder(index, type) {
      var menus = this.cfg.menus;
      if (index == menus.length - 1 && type == 'down') {
        return;
      }
      if (index == 0 && type == 'up') {
        return;
      }
      if (type == 'up') {
        menus[index - 1] = menus.splice(index, 1, menus[index - 1])[0];
      } else if (type == 'down') {
        menus[index + 1] = menus.splice(index, 1, menus[index + 1])[0];
      }
    },
    gotoMenu() {
      this.$router.push({ name: 'Category' });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import './frame/card.scss';
.btn-upload {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      // padding: 0 30px;
      font-size: 14px;
      height: 40px;
      color: #666;
      &:hover {
        background: #e1e1e1;
      }
    }
.cfg-content {
  background-color: #eeeeee;
  overflow: hidden;
  text-align: center;
}
// .form-view-content {
//   margin: 10px 13px 30px 13px;
//   overflow: hidden;
//   .btn-add-menu {
//     display: flex;
//     cursor: pointer;
//     justify-content: center;
//     align-items: center;
//     width: 100%;
//     font-size: 14px;
//     height: 40px;
//     color: #666;
//     background: #eeeeee;
//     margin-top: 10px;
//   }
// }

.menu-panel {
  width: 100%;
  overflow: hidden;
  .menu-item {
    display: inline-block;
    width: 25%;
    // height: 100px;
    text-align: center;
    padding: 10px;
    .menu-name {
      font-size: 14px;
      color: #666666;
      text-align: center;
      line-height: 14px;
    }
    img {
      width: 60px;
      height: 60px;
      object-fit: contain;
      margin-bottom: 8px;
    }
    .icon-empty {
      margin-top: 20px;
    }
  }

  .menu-item-empty {
    width: 25%;
    // height: 100px;
    img {
      width: 38px;
      height: 48px;
      margin: 26px auto;
    }
  }
  &.half {
    // max-height: 400px;
    .menu-item-empty {
      width: 50%;
      height: 200px;
      img {
        width: 100px;
        height: 126px;
        margin: 37px auto;
      }
    }
    .menu-item {
      width: 50%;
      height: 200px;
      .menu-name {
        font-size: 15px;
        line-height: 14px;
      }
      img {
        width: 140px;
        height: 140px;
        margin-bottom: 11px;
      }
    }
  }
  &.third {
    // max-height: 268px;
    .menu-item-empty {
      display: inline-block;
      width: 33%;
      height: 134px;
      text-align: center;
      img {
        width: 44px;
        height: 56px;
        object-fit: cover;
        margin: 39px auto;
      }
    }
    .menu-item {
      width: 33%;
      height: 133px;
      .menu-name {
        font-size: 14px;
        line-height: 14px;
      }
      img {
        width: 90px;
        height: 90px;
        margin-bottom: 6px;
      }
    }
  }
}
</style>

