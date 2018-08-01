<template>
  <div>
    <Card :id="id" class="card-best" :namebrand="decorate.components['group_product'].name">
      <template slot="cfg-view">
        <div class="group-list">
          <div @click="currentGroupIndex=index;" :class="{checked:currentGroupIndex==index}" class="group-item " v-for="(gitem,index) in cfg.menus.length==0?groups:cfg.menus " :key="gitem.name ">{{gitem.name}}</div>
        </div>

        <div v-if="cfg.menus.length<1 " :class="cfg.style " class="product-list">
          <img class="icon-empty " :src="cfg.style=='list' ?emptyImg.best_list_empty:emptyImg.best_line_empty " />
          <img class="icon-empty " :src="cfg.style=='line' ?emptyImg.best_line_empty:emptyImg.best_list_empty " />
        </div>
        <ul v-else :class="cfg.style " class="product-list">
          <template v-for="pinfo in cfg.menus[currentGroupIndex].plist ">
            <li v-if="cfg.style=='line'" class="product-item" :key="pinfo.id">
              <img class="p-thumb" :src="pinfo.listImage" />
              <div class="p-name">{{pinfo.name}}</div>
              <!-- v-if="pinfo.sellingPoint" -->
              <div class="p-sellPoint" v-if="pinfo.sellingPoint">{{pinfo.sellingPoint}}</div>
              <div class="p-price">
                <div class="p-distribution" v-if="pinfo.listImage">{{'￥'+(pinfo.distributionPrice||0)}}</div>
                <div class="p-market" v-if="pinfo.listImage">{{'￥'+(pinfo.marketPrice||0)}}</div>
              </div>
            </li>
            <li v-else class="product-item" :key="pinfo.id">
              <img class="p-thumb" :src="pinfo.listImage" />
              <div class="product-info">
                <div class="p-name">{{pinfo.name}}</div>
                <div class="p-sellPoint" v-if="pinfo.sellingPoint">{{pinfo.sellingPoint}}</div>
                <div class="p-price">
                  <div class="p-distribution" v-if="pinfo.listImage">{{'￥'+(pinfo.distributionPrice||0)}}</div>
                  <div class="p-market" v-if="pinfo.listImage">{{'￥'+(pinfo.marketPrice||0)}}</div>
                </div>
              </div>
            </li>
          </template>
        </ul>
        <div class="view-more">
          <div class="view-text">查看更多商品</div>
          <div class="view-icon"></div>
        </div>
        <div class="model-tip-text" v-if="cfg.menus.length<1 ">请点击该区域并在右侧配置框内添加分组</div>
      </template>
      <template slot="form-view-title">{{cfg.name}}</template>
      <template slot="form-view">
        <div class="form-view-content">
          <div class="view-box">
            <div class="view-title ">商品展示样式</div>
            <el-radio-group class="title-head-align" v-model="cfg.style">
              <el-radio class="black-radio" :label="'line'">双列展示</el-radio>
              <el-radio class="black-radio" :label="'list'">列表详情</el-radio>
            </el-radio-group>
          </div>
          <div class="view-box">
            <div class="view-title ">
              <div class="title ">添加商品分组</div>
              <div class="progress">{{cfg.menus.length}}/4</div>
            </div>
            <ul class="menu-list object-list">
              <li class="object-item menu-item " v-for="(item,index) in cfg.menus " :key="item.id ">
                <div class="order-tool ">
                  <div class="btn-up el-icon-arrow-up " @click="changemenuOrder(index, 'up') "></div>
                  <div class="btn-down el-icon-arrow-down " @click="changemenuOrder(index, 'down') "></div>
                </div>
                <div class="thumbnail ">
                  <img :src="item.imageIcon " />
                </div>
                <div class="menu-detail-info ">
                  <el-tooltip :content="item.name " placement="top-start ">
                    <div class="img-target" style="font-size:12px;margin-left:10px;">{{item.name}}</div>
                  </el-tooltip>
                </div>
                <div class="btn-delete-panel ">
                  <div class="btn-delete el-icon-delete " @click="deMenu(item) "></div>
                </div>
              </li>
            </ul>
            <div class="btn-add btn-upload" @click="gsVisible=true; " v-if="cfg.menus.length<4 ">
              <i class="el-icon-plus "></i>
              <span>添加商品分组</span>
            </div>
          </div>
        </div>
        <el-button class="btn-save " @click="saveData" :disabled="!needSave" :loading="loading ">{{loading?'加载中':'保 存'}}</el-button>
      </template>
    </Card>
    <GroupsSelect pattern="check" limit=4 :visible.sync="gsVisible " :checked="cfg.menus " @select="addMenu " @unSelect="deMenu "></GroupsSelect>
  </div>
</template>

<script>
import Card from './frame/card';
import Bscroll from 'better-scroll';
import img_Empty from '@/assets/decorate/img-empty.png';
import best_list_empty from '@/assets/decorate/commodity_3.png';
import best_line_empty from '@/assets/decorate/commodity_4.png';
import best_slide_empty from '@/assets/decorate/commodity_5.png';
import best_slide2_empty from '@/assets/decorate/commodity_6.png';
import GroupsSelect from '@/components/Dialog/GroupsSelect';
import { mapGetters, mapState } from 'vuex';

import { getProductList } from '@/api/goods';

export default {
  components: { Card, GroupsSelect },
  computed: {},
  data() {
    return {
      data: {},
      groups: [
        {
          id: 1,
          name: '分组1',
          plist: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
          id: 2,
          name: '分组2',
          plist: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
          id: 3,
          name: '分组3',
          plist: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
          id: 4,
          name: '分组4',
          plist: [1, 2, 3, 4, 5, 6, 7, 8]
        }
      ],
      currentGroupIndex: 0,
      loading: false,
      gsVisible: false,
      needSave: false,
      emptyImg: {
        img_Empty,
        best_list_empty,
        best_line_empty,
        best_slide_empty,
        best_slide2_empty
      }
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
    },
    currentGroup: function() {}
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
    getMenuProductList(menu) {
      getProductList({
        isMarketable: true,
        pageNum: 1,
        pageSize: 8,
        productGroupId: menu.id
      }).then(res => {
        if (res.code === '0') {
          menu.plist = res.data.data;
        }
      });
    },
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
    },
    addMenu(data) {
      this.cfg.menus.push(data);
      this.getMenuProductList(data);
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
// .btn-add-menu {
//   display: flex;
//   cursor: pointer;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   font-size: 14px;
//   height: 40px;
//   color: #666;
//   background: #eeeeee;
// }
.title-panel {
  display: flex;
  height: 36px;
  justify-content: flex-start;
  align-items: center;
  margin: 30px 13px 0 13px;
  &.center {
    justify-content: center;
  }
  &.right {
    justify-content: flex-end;
  }
  .title-icon {
    font-size: 34px;
    margin-right: 10px;
  }
  .title-content {
    h1 {
      padding: 0;
      margin: 0 0 4px 0;
      font-size: 20px;
      color: #666666;
      line-height: 20px;
    }
    h3 {
      padding: 0;
      margin: 0;
      font-size: 14px;
      color: #999999;
      line-height: 14px;
    }
  }
}
.best-list {
  margin: 25px 13px 0 13px;
  .best-item {
    display: flex;
    .product-info {
      display: block;
      margin: 5px 0 25px 10px;
      width: calc(100% - 130px);
      .p-name {
        font-size: 14px;
        color: #666666;
        line-height: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 8px;
      }
      .p-sellPoint{
        font-size:12px;
      }
      .p-price {
        display: flex;
        align-items: baseline;
        height: 15px;
        margin-bottom: 20px;
        .p-distribution {
          font-size: 15px;
          color: #ca303a;
          line-height: 15px;
          margin-right: 7px;
        }
        .p-market {
          font-size: 10px;
          text-decoration: line-through;
          color: #999999;
          text-align: center;
        }
      }
    }
    .p-thumb {
      width: 120px;
      object-fit: contain;
      height: 120px;
      margin-bottom: 13px;
    }
  }
  .best-item-empty {
    overflow: hidden;
    .icon-empty {
      height: 120px;
      display: block;
      object-fit: cover;
      margin-bottom: 20px;
    }
  }
}
.best-line {
  margin: 25px 13px 0 13px;
  font-size: 0;
  .best-item {
    overflow: hidden;
    display: inline-block;
    width: calc(50% - 10px);
    text-align: center;
    &:nth-child(2n) {
      margin-left: 14px;
    }
    .product-info {
      display: block;
      margin: 0 auto;
      margin-bottom: 25px;
      width: 100%;
      //
    }
    .p-thumb {
      width: 180px;
      object-fit: contain;
      height: 180px;
      margin-bottom: 13px;
    }
    .p-name {
      font-size: 14px;
      color: #666666;
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 8px;
    }
    
    .p-price {
      display: flex;
      align-items: baseline;
      height: 15px;
      margin-bottom: 20px;
      .p-distribution {
        font-size: 15px;
        color: #ca303a;
        line-height: 15px;
        margin-right: 7px;
      }
      .p-market {
        font-size: 10px;
        text-decoration: line-through;
        color: #999999;
        text-align: center;
      }
    }
  }
}
.product-list {
  text-align: left;
  list-style: none;
  padding: 0 13px;

  .icon-empty {
    // margin: 0 13px 20px 13px;
    width: 100%;
    height: 100%;
    object-fit: contain;
    margin-bottom: 20px;
  }
  .product-item {
    padding: 0 13px;
  }
  &.list {
    margin: 0 auto;
    .product-item {
      display: flex;
      .product-info {
        display: block;
        margin: 5px 0 25px 10px;
        width: calc(100% - 130px);
        .p-name {
          font-size: 14px;
          color: #666666;
          line-height: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 8px;
        }
        .p-sellPoint{
          font-size: 12px;
          color:#999999;
          margin-bottom: 20px;
        }
        .p-price {
          display: flex;
          align-items: baseline;
          height: 15px;
          margin-bottom: 20px;
          .p-distribution {
            font-size: 15px;
            color: #ca303a;
            line-height: 15px;
            margin-right: 7px;
          }
          .p-market {
            font-size: 10px;
            text-decoration: line-through;
            color: #999999;
            text-align: center;
          }
        }
      }
      .p-thumb {
        width: 120px;
        object-fit: contain;
        height: 120px;
        margin-bottom: 13px;
      }
    }
  }
  &.line {
    .icon-empty {
      overflow: hidden;
      display: inline-block;
      width: calc(50% - 13px);

      text-align: center;
      &:nth-child(2n) {
        margin-left: 14px;
      }
    }
    .product-item {
      overflow: hidden;
      display: inline-block;
      width: calc(50% - 10px);
      text-align: center;
      &:nth-child(2n) {
        margin-left: 14px;
      }
      .product-info {
        display: block;
        margin: 0 auto;
        margin-bottom: 25px;
        width: 100%;
        //
      }
      .p-thumb {
        width: 180px;
        object-fit: contain;
        height: 180px;
        margin-bottom: 13px;
      }
      .p-name {
        font-size: 14px;
        color: #666666;
        line-height: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 8px;
        text-align: left;
      }
      .p-sellPoint{
        font-size: 12px;
        color:#999999;
        margin-bottom: 15px;
        text-align: left;
      }
      .p-price {
        display: flex;
        align-items: baseline;
        height: 15px;
        margin-bottom: 20px;
        .p-distribution {
          font-size: 15px;
          color: #ca303a;
          line-height: 15px;
          margin-right: 7px;
        }
        .p-market {
          font-size: 10px;
          text-decoration: line-through;
          color: #999999;
          text-align: center;
        }
      }
    }
  }
}
.view-more {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  .view-text {
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    line-height: 14px;
    margin-right: 4px;
  }
  .view-icon {
    width: 12px;
    height: 12px;
    background-size: contain;
    background-image: url('../../../assets/icon/Oval.png');
  }
}
// .form-view-content {
//   margin: 10px 13px 30px 13px;
//   overflow: hidden;
//   .view-box {
//     .view-title {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       margin: 10px 0;
//     }
//   }
// }
.group-list {
  display: flex;
  justify-content: space-around;
  .group-item {
    cursor: pointer;
    font-size: 16px;
    line-height: 20px;

    color: #666666;
    margin: 25px 0;
    &.checked {
      color: #ca303a;
      border-bottom: 1px solid #ca303a;
    }
  }
}
</style>

