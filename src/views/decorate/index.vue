<template>
  <div class="screen-view">
    <el-header class="tool-panel" height="130">
      <div class="tool-panel-info ">
        <div class="tool-title ">店铺装修</div>
      </div>
      <div class="release-info ">
        <div>上次发布时间：{{decorate.lastReleasedDate |parseTime}}</div>
        <div class="tool-msg " v-if="decorate.isChanged||!decorate.released ">当前页面存在新增改动未发布</div>
      </div>
      <el-button type="danger" plain @click="releaseCfg">发布</el-button>
    </el-header>
    <el-container class="app-container ">
      <scroll-bar class="aside-panel">
        <el-aside>
          <div class="tempbox-panel" @click="showTemplist=true;"></div>
          <!-- <el-collapse v-model="activeNames " :accordion="false " class="tgroup-list ">
            <el-collapse-item :name="0 " :title="template.name ">
              <ul class="template-list ">
                <li class="theme-item " v-for="tkey in template.list " :key="tkey.id ">
                  <div class="s-img ">
                    <img :src="tkey.icon||template_img " />
                  </div>
                  <div class="s-name ">{{tkey.name}}</div>
                  <div class="s-wrap ">
                    <div class="btn-panel btn-view " @click="previewTemplate(tkey.previewImage) ">
                      <i class="el-icon-view "></i>
                      <div>点击预览</div>
                    </div>
                    <div class="btn-panel btn-add " @click="changeTemplate(tkey) ">
                      <i class="el-icon-circle-plus-outline "></i>
                      <div>点击添加</div>
                    </div>
                    <div class="c-remark "></div>
                  </div>
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse> -->
          <el-collapse v-model="activeNames " :accordion="false " class="cgroup-list ">
            <el-collapse-item v-for="cgroup in componentsGroup " :key="cgroup.index " :title="cgroup.name " :name="cgroup.id ">
              <ul class="components-list ">

                <li class="components-item " :class="{disabled:decorate.components[ckey].disabled || decorate.components[ckey].id==null} " v-for="ckey in cgroup.list " :key="ckey ">
                  <!-- {{decorate.components[ckey].disabled || decorate.components[ckey].id==null}} -->
                  <div class="c-img ">
                    <img :src="decorate.components[ckey].img " v-if="decorate.components[ckey].img " />
                  </div>
                  <div class="c-name ">{{decorate.components[ckey].name}}</div>
                  <div class="c-number ">{{componentsCount[ckey]||0}}</div>
                  <div class="c-wrap " @click="addComponent(decorate.components[ckey].key) ">
                    <i class="el-icon-circle-plus-outline "></i>
                    <div v-if="decorate.components[ckey].disabled ">无权限</div>
                    <div v-else>点击添加</div>
                    <div class="c-remark ">{{decorate.components[ckey].remark}}</div>
                  </div>
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </el-aside>
      </scroll-bar>
      <scroll-bar class="">
        <el-main class="edit-panel ">
          <div class="wx-header ">
            {{user.name}}
          </div>
          <div ref="cpanel ">
            <component v-for="card in decorate.cfg " v-if="card " v-bind:is="card.key " :id="card.id " :key="card.id "></component>
          </div>
          <div class="footer " :style="{height:decorate.viewfit+ 'px'} "></div>
        </el-main>
      </scroll-bar>
    </el-container>

    <el-dialog title="选择主题模板" custom-class="dialog-temp-list" :visible.sync="showTemplist" width="830px">
      <ul>
        <li v-for="tkey in template.list " :key="tkey.id ">
          <div class="temp-hover">
            <img :src="tkey.previewImage" />
            <el-button class="btn-view" type="danger" plain @click="previewTemplate(tkey.previewImage)">预览</el-button>
            <el-button class="btn-use" type="danger" @click="changeTemplate(tkey) ">立即应用</el-button>
          </div>
          <div class="temp-name">{{tkey.name}}</div>
        </li>
      </ul>
    </el-dialog>
    <div class="preview-template" v-if="showPreviewImage " @click="previewBack">
      <img :src="previewImage " />
      <div class="btn-back">
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollBar from '@/components/ScrollBar';
import { mapGetters, mapState } from 'vuex';
import { Message, MessageBox } from 'element-ui';
import {
  Carousel,
  Single,
  BestProduct,
  GProduct,
  GNavigation,
  PSearch,
  Coupon,
  Seckill
} from './modules';
import { getGroupList, getSystemTemplate } from '@/api/decorate';
import template_img from '@/assets/decorate/g1.png';

export default {
  data() {
    return {
      thistory: [],
      template: {
        id: 0,
        name: '主题模板',
        list: []
      },
      componentsGroup: [
        {
          id: 1,
          name: '商品模块',
          list: ['best_product', 'group_product']
        },
        {
          id: 2,
          name: '图文导航',
          list: ['image_single', 'image_carousel', 'group_navigation']
        },
        {
          id: 3,
          name: '其他组件',
          list: ['product_search']
        },
        {
          id: 4,
          name: '营销模式',
          list: ['coupon', 'seckill']
        }
      ],
      activeNames: [0, 1, 2, 3, 4],
      template_img,
      previewImage: null,
      showPreviewImage: false,
      showTemplist: false
    };
  },
  computed: {
    ...mapState(['user', 'decorate']),
    ...mapGetters(['componentsCount'])
  },

  mounted: function() {
    getGroupList().then(res => {
      // console.log(res)
      if (res.code == '0') {
        res.data.forEach(item => {
          if (this.decorate.components[item.templateKey]) {
            this.decorate.components[item.templateKey].id = item.id;
            this.decorate.components[item.templateKey].disabled = false;
          }
        });
      }
    });
    getSystemTemplate().then(res => {
      if (res.code == '0') {
        //test
        // res.data[0].thumb = template_img;
        this.template.list = res.data;
      }
    });
    this.$store.dispatch('GetUserTemplate');
  },
  components: {
    image_carousel: Carousel,
    image_single: Single,
    product_search: PSearch,
    best_product: BestProduct,
    group_product: GProduct,
    group_navigation: GNavigation,
    coupon: Coupon,
    seckill: Seckill,
    ScrollBar
  },
  methods: {
    action(id) {},
    addComponent(key) {
      console.log(key);
      var component = this.decorate.components[key];
      if (component.id != null && component.disabled != true) {
        this.$store
          .dispatch('AddComponent', this.decorate.components[key])
          .then(res => {
            console.log(res);
            if (res.code == '0') {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
            }
          });
      } else {
        this.$message('无权限控件不能添加。');
      }
    },
    releaseCfg() {
      this.$store.dispatch('Release').then(res => {
        if (res.code == '0') {
          Message({
            message: '发布成功',
            type: 'success',
            duration: 5 * 1000
          });
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          });
        }
      });
    },
    changeTemplate(data) {
      this.$confirm('此操作将替换现有模板配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // if (this.template.list) {
          //   var date = new Date();
          //   this.thistory.push({
          //     id: date.getTime(),
          //     name: `临时历史模板[${date.getHours()}:${date.getMinutes()}]`,
          //     thumb: template_img,
          //     data: this.decorate.cfg
          //   });
          // }
          this.$store.dispatch('ChangeTemplate', data.id);
          this.$message.success('设置成功');
          this.showTemplist = false;
        })
        .catch(() => {});
    },
    previewTemplate(img) {
      if (!this.showPreviewImage) {
        this.previewImage = img;
        this.showPreviewImage = true;
        this.showTemplist = false;
      }
    },
    previewBack() {
      this.showPreviewImage = false;
      this.showTemplist = true;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/variables.scss';
@import '../../styles/mixin.scss';
.app-container {
  color: #333;
  height: 100%;
  // height: calc(100% - 85px);
  overflow: hidden;
  text-align: center;
  margin-top: 150px;
  // .screen-view {
  //   height: calc(100% - 180px);
  // }
  .aside-panel,
  .el-aside {
    text-align: left;
    width: 25% !important;
    min-width: 225px;
    max-width: 340px;
  }
  .el-collapse {
    padding: 23px 20px;
  }
}
.tool-panel {
  width: calc(100% - 300px);
  height: 130px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.1),
    0px -4px 0px 0px rgba(248, 232, 232, 0.5);
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 85px;
  z-index: 1000;
  .tool-panel-info {
    .tool-title {
      min-width: 5em;
      font-size: 24px;
      font-weight: bold;
      color: #666666;
      line-height: 24px;
      margin-bottom: 8px;
    }
    .tool-msg {
      font-size: 14px;
      color: #ca303a;
      letter-spacing: 0;
      line-height: 14px;
    }
  }
  .release-info {
    width: 100%;
    text-align: right;
    font-size: 14px;
    line-height: 20px;
    margin-right: 10px;
    .tool-msg {
      color: #ca303a;
    }
  }
  .el-button {
    width: 100px;
    height: 44px;
  }
  .el-button:hover {
    color: #ffffff;
    background-color: #ca303a;
  }
}
.cgroup-list {
  background-color: #ffffff;
  transform: translateY(-10px);
}
.tgroup-list {
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.1);
  margin-bottom: 20px;
}
.components-list {
  list-style: none;
  padding: 0;
  margin: 0;
  .theme-item {
    text-align: center;
    width: 92px;
    height: 160px;
    display: inline-block;
    position: relative;
    .s-wrap {
      display: none;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // background-color: #cf444d;
      opacity: 0.9;
      font-size: 13px;
      color: white;
      // .el-icon-circle-plus-outline {
      //   font-size: 25px;
      // }
      .btn-panel {
        background-color: #cf444d;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        height: 80px;
        i {
          font-size: 25px;
          margin-bottom: 10px;
        }
        &:hover {
          background-color: #b7363e;
        }
      }
    }
    .s-img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100px;
      // background-color: red;
      border: 1px solid white;
      img {
        width: 50px;
        object-fit: contain;
      }
    }
    &:hover {
      .s-wrap {
        display: block;
      }
    }
    &.disabled:hover {
      .s-wrap {
        background-color: grey;
      }
    }
  }
  .components-item {
    text-align: center;
    width: 92px;
    display: inline-block;
    position: relative;
    // background-color: #ccc;

    .c-wrap {
      display: none;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #cf444de6;
      font-size: 13px;
      padding-top: 26px;
      color: white;
      .el-icon-circle-plus-outline {
        font-size: 25px;
      }
      .c-remark {
        width: 80px;
        margin: 0 auto;
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        line-height: 19px;
        margin-top: 20px;
      }
    }
    &:hover {
      .c-wrap {
        display: block;
      }
    }
    &.disabled:hover {
      .c-wrap {
        background-color: grey;
      }
    }
  }
  .c-img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    // background-color: red;
    border: 1px solid white;
    margin-top: 10px;
    img {
      width: 100%;
      object-fit: none;
    }
  }
  .c-name {
    font-weight: initial;
  }
  .c-number {
  }
}
.tempbox-panel {
  width: 225px;
  height: 143px;
  cursor: pointer;
  background-image: url(../../assets/decorate/change-temp1.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  &:hover {
    background-image: url(../../assets/decorate/change-temp0.png);
  }
}
.el-main {
  padding: 0 10px 100px 10px;
  overflow: hidden;
  max-width: 830px;
  min-width: 750px;
  margin: 0 auto;
  text-align: left;
  .wx-header {
    text-align: center;
    font-size: 19px;
    width: 400px;
    height: 69px;
    line-height: 69px;
    background-color: #ffffff;
    color: #333333;
  }
  .footer {
    // height: 500px;
  }
}
.dialog-temp-list {
  background-color: #f5f5f5;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    width: 710px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      border: 1px solid transparent;
      width: 230px;
      height: 374px;
      text-align: center;
      padding: 10px;
      // box-shadow: 0 1px 3px blue;
      background-color: white;
      .temp-hover {
        text-align: center;
      }
      .temp-name {
        height: 44px;
        line-height: 44px;
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
      }
      img {
        display: block;
        margin: 0 auto;
        width: 190px;
        height: 330px;
        object-fit: cover;
        object-position: top;
        outline: none;
        // box-shadow: 0 1px 3px red;
      }
      .el-button {
        display: none;
      }
      .btn-view {
        width: 190px;
        margin: 10px auto 20px auto;
        border-color:#d7d7d7;
        color:#333333;
        &:hover{
          border-color:#333333;
          background-color: rgba(255, 255, 255,1);
          color:#333333;
        }
      }
      .btn-use {
        width: 190px;
        margin: 0px auto;
      }
      &:hover {
        border: 1px solid #ca303a;
        .temp-name {
          display: none;
        }
        img {
          height: 226px;
        }
        .el-button {
          display: block;
        }
      }
    }
  }
}
.preview-template {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;
  text-align: center;
  overflow: auto;
  img {
    width: 600px;
    margin: 86px auto;
  }
  .btn-back {
    background-color: rgba(255, 255, 255, 0.5);
    color: #666;

    border-radius: 10em;
    width: 50px;
    height: 50px;
    line-height: 50px;

    position: absolute;
    top: 86px;
    left: 50%;
    margin-left: -360px;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-icon-close {
      font-size: 22px;
      font-weight: bold;
    }
    &:hover {
      background-color: white;
    }
  }
}
</style>
