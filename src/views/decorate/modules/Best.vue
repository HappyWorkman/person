<template>
  <div>
    <Card :id="id" class="card-best" :namebrand="decorate.components['best_product'].name">
      <template slot="cfg-view">
        <div class="title-panel" :class="cfg.align" v-if="showTitle">
          <svg-icon v-if="cfg.icon!='none'" :icon-class="'decorate-'+cfg.icon" class="title-icon" />
          <div class="title-content">
            <h1>{{cfg.title}}</h1>
            <h3>{{cfg.subhead}}</h3>
          </div>
        </div>
        <div class="best-list best-base" v-if="cfg.style=='list'">
          <div class="best-item-empty" v-if="cfg.plist.length<1">
            <img class="icon-empty" :src="emptyImg.best_list_empty" />
            <img class="icon-empty" :src="emptyImg.best_list_empty" />
            <div class="model-tip-text">请点击该区域并在右侧配置框内添加商品</div>
          </div>
          <div class="best-item" v-for="pinfo in cfg.plist" :key="pinfo.id">
            <img class="p-thumb" :src="pinfo.listImage" />
            <div class="product-info">
              <div class="p-name">{{pinfo.name}}</div>
              <!-- v-if="pinfo.sellingPoint" -->
              <div class="p-sellPoint" v-if="pinfo.sellingPoint">{{pinfo.sellingPoint}}</div>
              <div class="p-price">
                <div class="p-distribution" v-if="pinfo.listImage">{{'￥'+(pinfo.distributionPrice||0)}}</div>
                <div class="p-market" v-if="pinfo.listImage">{{'￥'+(pinfo.marketPrice||0)}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="best-line best-base" v-if="cfg.style=='line'">
          <div class="best-item" v-if="cfg.plist.length<1">
            <img class="product-info" :src="emptyImg.best_line_empty" />
          </div>
          <div class="best-item" v-if="cfg.plist.length<1">
            <img class="product-info" :src="emptyImg.best_line_empty" />
          </div>
          <div class="model-tip-text" v-if="cfg.plist.length<1">请点击该区域并在右侧配置框内添加商品</div>
          <div class="best-item" v-if="cfg.plist.length>0" v-for="pinfo in cfg.plist" :key="pinfo.id">
            <img class="p-thumb" :src="pinfo.listImage" />
            <div class="p-name">{{pinfo.name}}</div>
            <div class="p-sellPoint" v-if="pinfo.sellingPoint">{{pinfo.sellingPoint}}</div>
            <div class="p-price">
              <div class="p-distribution" v-if="pinfo.listImage">{{'￥'+(pinfo.distributionPrice||0)}}</div>
              <div class="p-market" v-if="pinfo.listImage">{{'￥'+(pinfo.marketPrice||0)}}</div>
            </div>
          </div>
        </div>
        <div class="best-single best-base" v-if="cfg.style=='single'">
          <div class="best-item-empty" v-if="cfg.plist.length<1">
            <img class="icon-empty" :src="emptyImg.best_single_empty" />
            <div class="model-tip-text">请点击该区域并在右侧配置框内添加商品</div>
          </div>
          <div class="best-item" v-for="pinfo in cfg.plist" :key="pinfo.id">
            <img class="p-thumb" :src="pinfo.listImage" />
            <div class="product-info">
              <div class="p-name">{{pinfo.name}}</div>
              <div class="p-sellPoint" v-if="pinfo.sellingPoint">{{pinfo.sellingPoint}}</div>
              <div class="p-price">
                <div class="p-distribution" v-if="pinfo.listImage">{{'￥'+(pinfo.distributionPrice||0)}}</div>
                <div class="p-market" v-if="pinfo.listImage">{{'￥'+(pinfo.marketPrice||0)}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="best-slide-wrapper" v-show="cfg.style=='slide2'||cfg.style=='slide'" ref="wrapper">
          <div class="best-slide" :class="cfg.style" v-if="cfg.plist.length<1" :style="{width:30+170*6+'px'}">
            <div class="best-item">
              <img class="product-info" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
              <img class="product-info" v-if="cfg.style=='slide2'||cfg.style==null" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
            </div>
            <div class="best-item">
              <img class="product-info" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
              <img class="product-info" v-if="cfg.style=='slide2'||cfg.style==null" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
            </div>
            <div class="best-item">
              <img class="product-info" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
              <img class="product-info" v-if="cfg.style=='slide2'||cfg.style==null" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
            </div>
            <div class="best-item">
              <img class="product-info" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
              <img class="product-info" v-if="cfg.style=='slide2'||cfg.style==null" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
            </div>
            <div class="best-item">
              <img class="product-info" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
              <img class="product-info" v-if="cfg.style=='slide2'||cfg.style==null" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
            </div>
            <div class="best-item">
              <img class="product-info" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
              <img class="product-info" v-if="cfg.style=='slide2'||cfg.style==null" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
            </div>
            <div class="model-tip-text" style="text-align:left;margin-left:60px;" v-if="cfg.plist.length<1">请点击该区域并在右侧配置框内添加商品</div>
          </div>
          <div class="best-slide best-base" :class="cfg.style" v-if="cfg.style=='slide' && cfg.plist.length>0" :style="{width:30+170*(cfg.plist.length<1?12:cfg.plist.length)+'px'}">
            <div class="best-item" v-for="pinfo in cfg.plist" :key="pinfo.id">
              <img class="p-thumb" :src="pinfo.listImage" />
              <div class="product-info">
                <div class="p-name">{{pinfo.name}}</div>
                <div class="p-sellPoint" v-if="pinfo.sellingPoint">{{pinfo.sellingPoint}}</div>
                <div class="p-price">
                  <div class="p-distribution" v-if="pinfo.listImage">{{'￥'+(pinfo.distributionPrice)}}</div>
                  <div class="p-market" v-if="pinfo.listImage">{{'￥'+(pinfo.marketPrice)}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="best-slide best-base" :class="cfg.style" v-if="cfg.style=='slide2' && cfg.plist.length>0" :style="{width:30+170*(cfg.plist.length<1?12:cfg.plist.length)+'px'}">
            <div class="best-item" v-for="pinfo in cfg.plist" :key="pinfo.id">
              <div> <img class="p-thumb" :src="pinfo.listImage" />
                <div class="product-info">
                  <div class="p-name">{{pinfo.name}}</div>
                  <div class="p-sellPoint" v-if="pinfo.sellingPoint">{{pinfo.sellingPoint}}</div>
                  <div class="p-price">
                    <div class="p-distribution" v-if="pinfo.listImage">{{'￥'+(pinfo.distributionPrice || 0)}}</div>
                    <div class="p-market" v-if="pinfo.listImage">{{'￥'+(pinfo.marketPrice ||0)}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </template>
      <template slot="form-view-title">
        <div class="form-view-title">{{cfg.name}}</div>
      </template>
      <template slot="form-view">
        <div class="form-view-content">
          <h2>模块名称</h2>
          <div class="title-box">
            <div class="title-item">
              <div class="title-head">主标题</div>
              <el-input placeholder="推荐商品" v-model="cfg.title" :maxlength=6>
                <i class="el-input__icon" slot="suffix"> {{cfg.title?cfg.title.length:0}}/6 </i>
              </el-input>
            </div>
            <div class="title-item">
              <div class="title-head">副标题</div>
              <el-input class="overlength" placeholder="EXPLOSION" v-model="cfg.subhead" :maxlength=12>
                <i class="el-input__icon" slot="suffix"> {{cfg.subhead?cfg.subhead.length:0}}/12 </i>
              </el-input>
            </div>
          </div>
          <div class="title-icon">
            <div class="title-head">标题图标</div>
            <div class="title-head-icon-list">
              <el-radio class="black-radio" v-model="cfg.icon" label="hot">
                <svg-icon icon-class="decorate-hot" class="title-radio-icon" />
              </el-radio>
              <el-radio class="black-radio" v-model="cfg.icon" label="kemp">
                <svg-icon icon-class="decorate-kemp" class="title-radio-icon" />
              </el-radio>
              <el-radio class="black-radio" v-model="cfg.icon" label="like">
                <svg-icon icon-class="decorate-like" class="title-radio-icon" />
              </el-radio>
              <el-radio class="black-radio" v-model="cfg.icon" label="gift">
                <svg-icon icon-class="decorate-gift" class="title-radio-icon" />
              </el-radio>
              <el-radio class="black-radio" v-model="cfg.icon" label="none">
                <div class="title-radio-text">无</div>
              </el-radio>
            </div>
          </div>
          <div>
            <div class="title-head">标题对齐方式</div>
            <el-radio-group class="title-head-align" v-model="cfg.align">
              <el-radio class="black-radio" label="left">居左显示</el-radio>
              <el-radio class="black-radio" label="center">居中显示</el-radio>
              <el-radio class="black-radio" label="right">居右显示</el-radio>
            </el-radio-group>
          </div>
          <div>
            <div class="title-head">商品展示样式</div>
            <el-radio-group class="title-head-align" v-model="cfg.style">
              <el-radio class="black-radio" :label="'line'">双列展示</el-radio>
              <el-radio class="black-radio" :label="'slide'">单行左滑</el-radio>
              <el-radio class="black-radio" :label="'slide2'">双行左滑</el-radio>
              <el-radio class="black-radio" :label="'list'">列表详情</el-radio>
              <el-radio class="black-radio" :label="'single'">单列大图</el-radio>
            </el-radio-group>
          </div>
          <div class="view-box">
            <div class="view-title">
              <h2>添加商品</h2>
              <div class="progress">{{cfg.plist.length}}/12</div>
            </div>
            <ul class="object-list product-list">
              <li class="object-item" v-for="(item,index) in cfg.plist" :key="item.id">
                <div class="order-tool">
                  <div class="btn-up btn-item" @click="changeProductOrder(index,'up')">
                    <svg-icon iconClass="arrows-up"></svg-icon>
                  </div>
                  <div class="btn-down btn-item" @click="changeProductOrder(index,'down')">
                    <svg-icon iconClass="arrows-down"></svg-icon>
                  </div>

                </div>
                <div class="thumbnail">
                  <img :src="item.listImage" />
                </div>
                <div class="object-detail-info">
                  <el-tooltip :content="item.name" placement="top-start">
                    <div class="img-target">{{item.name}}</div>
                  </el-tooltip>
                </div>
                <div class="btn-delete-panel">
                  <div class="btn-delete el-icon-delete" @click="delProduct(item)"></div>
                </div>
              </li>
            </ul>
            <div class="btn-add btn-upload" @click="psVisible=true;" v-show="cfg.plist.length<12">
              <i class="el-icon-plus "></i>
              <span>添加商品</span>
            </div>
          </div>
        </div>
        <el-button class="btn-save" @click="saveData" :disabled="!needSave" :loading="loading">{{loading?'加载中':'保 存'}}</el-button>
      </template>
    </Card>
    <ProductsSelect pattern="check" limit=12 :visible.sync="psVisible" :checked="cfg.plist" @select="addProduct" @unSelect="delProduct"></ProductsSelect>
  </div>
</template>

<script>
import Card from './frame/card';
import Bscroll from 'better-scroll';
import img_Empty from '@/assets/decorate/img-empty.png';
import best_list_empty from '@/assets/decorate/classification_1.png';
import best_line_empty from '@/assets/decorate/classification_2.png';
import best_slide_empty from '@/assets/decorate/classification_3.png';
import best_slide2_empty from '@/assets/decorate/classification_4.png';
import best_single_empty from '@/assets/decorate/Bursting_4.png';

import ProductsSelect from '@/components/Dialog/ProductsSelect';
import { mapGetters, mapState } from 'vuex';

export default {
  components: { Card, ProductsSelect },
  computed: {},
  data() {
    return {
      data: {},
      loading: false,
      psVisible: false,
      needSave: false,
      showTitle:true,
      emptyImg: {
        img_Empty,
        best_list_empty,
        best_line_empty,
        best_slide_empty,
        best_slide2_empty,
        best_single_empty
      }
    };
  },
  watch: {
    'cfg.style': function(val, oldVal) {
      if (val == 'slide' || val == 'slide2') {
        this.$nextTick(() => {
          this.betterscroll = new Bscroll(this.$refs.wrapper, {
            scrollX: true,
            scrollY: false
          });
        });
      }
    },
    cfg: {
      handler(newValue, oldValue) {
        if (newValue == oldValue) {
          this.needSave = true;
        } else {
          // console.log(newValue);
        }
        if(newValue.icon =='none' && newValue.subhead==''&& newValue.title==''){
          this.showTitle = false;
        }else{
          this.showTitle = true;
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
          plist: []
        };
      }
    }
  },
  props: {
    id: null
  },
  mounted: function() {
    // if (this.$refs.wrapper) {
    //   this.$nextTick(() => {
    //     this.betterscroll = new Bscroll(this.$refs.wrapper, {
    //       scrollX: true,
    //       scrollY: false
    //     });
    //   });
    // }
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
    },
    addProduct(data) {
      this.cfg.plist.push(data);
    },
    delProduct(data) {
      for (var i = 0; i < this.cfg.plist.length; i++) {
        if (this.cfg.plist[i].id == data.id) {
          this.cfg.plist.splice(i, 1);
          break;
        }
      }
    },
    changeProductOrder(index, type) {
      var plist = this.cfg.plist;
      if (index == plist.length - 1 && type == 'down') {
        return;
      }
      if (index == 0 && type == 'up') {
        return;
      }
      if (type == 'up') {
        plist[index - 1] = plist.splice(index, 1, plist[index - 1])[0];
      } else if (type == 'down') {
        plist[index + 1] = plist.splice(index, 1, plist[index + 1])[0];
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
.black-radio {
  margin: 5px 20px 5px 0;
}
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
    font-size: 36px;
    color: #666666;
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
        white-space: inherit;
        line-height: 20px;
      }
      .p-sellPoint{
        font-size:12px;
        color:#999999;
        margin-bottom: 20px;
        margin-top: -3px;
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
      margin-bottom: 20px;
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
      margin-bottom: 25px;
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
      white-space: inherit;
    }
    .p-sellPoint{
      font-size:12px;
      color:#999999;
      margin-bottom: 15px;
      margin-top: -3px;
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
.best-single {
  margin: 25px 13px 0 13px;
  .best-item {
    // display: flex;
    .product-info {
      margin: 5px 0 25px 10px;
      .p-name {
        font-size: 16px;
        color: #333333;
      }
      .p-sellPoint{
        font-size:12px;
        color:#999999;
        margin-bottom: 15px;
        margin-top: -3px;
      }
    }
    .p-thumb {
      width: 100%;
      object-fit: contain;
      margin-bottom: 13px;
    }
  }
  .best-item-empty {
    overflow: hidden;
    .icon-empty {
      // height: 430px;
      width: 100%;
      display: block;
      object-fit: cover;
      margin-bottom: 20px;
    }
  }
}
.best-slide-wrapper {
  width: 100%;
  overflow: hidden;
}
.best-slide {
  margin: 25px 13px 0 13px;

  font-size: 0;
  .best-item {
    display: inline-block;
    width: 150px;
    margin-right: 20px;
    .product-info {
      margin-bottom: 25px;
      .p-name {
        font-size: 14px;
        color: #666666;
        line-height: 14px;
      }
      .p-sellPoint{
        font-size:12px;
        color:#999999;
        margin-bottom: 17px;
        margin-top: 2px;
      }
    }
    .p-thumb {
      -moz-user-select: none;
      object-fit: contain;
      width: 150px;
      // height: 205px;
      margin-bottom: 20px;
    }
  }
}
.best-slide.slide2 {
  max-width: 1034px;
  .best-item {
    width: 133px;
    img {
      width: 133px;
    }
  }
}

.best-base {
  .best-item {
    .product-info {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .p-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      margin-bottom: 8px;
    }
    .p-price {
      display: flex;
      align-items: baseline;
      height: 15px;
      margin-bottom: 20px;
      font-weight: bold;
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

.form-view-title {
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  line-height: 16px;
  font-weight: bold;
}
.form-view-content {
  margin: 20px 13px 30px 13px;
  overflow: hidden;
  .title-head {
    font-weight: bold;
    font-size: 14px;
    color: #666666;
    margin: 10px 0;
  }
  .title-head-icon-list {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
    .el-radio {
      margin-left: 0;
    }
    .title-radio-icon {
      position: absolute;
      top: -30px;
      left: -5px;
      font-size: 24px;
    }
    .title-radio-text {
      position: absolute;
      top: -23px;
      left: 0px;
      font-size: 14px;
      font-weight: bold;
    }
  }
  .title-box {
    display: flex;
    justify-content: space-between;
    .title-item {
      width: calc(50% - 5px);
      .el-input__inner:hover {
        border-color: #999;
      }
    }

    .el-input {
      // border-radius: 0;
      margin-bottom: 5px;
    }
  }
  // .btn-add-product {
  //   display: flex;
  //   cursor: pointer;
  //   justify-content: center;
  //   align-items: center;
  //   width: 100%;
  //   font-size: 14px;
  //   height: 40px;
  //   color: #666;
  //   background: #eeeeee;
  //   &:hover {
  //     background: #e1e1e1;
  //   }
  // }
  // .product-list {
  //   list-style: none;
  //   padding: 0;
  // }
  .title-head-align {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>

