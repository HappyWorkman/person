<template>
  <div>
    <!-- <Card :id="id" class="card-best" :namebrand="decorate.components['seckill'].name"> -->
    <Card :id="id" class="card-best" :namebrand="decorate.components['seckill'].name">
      <template slot="cfg-view">
        <div class="title-panel" :class="cfg.align" v-if="showTitle">
          <svg-icon v-if="cfg.icon!='none'" :icon-class="'decorate-'+cfg.icon" class="title-icon" />
          <div class="title-content">
            <h1>{{cfg.title}}</h1>
            <h3>{{cfg.subhead}}</h3>
          </div>
        </div>
        <div class="best-list best-base" v-if="cfg.style=='list'">
          <div class="best-item-empty" v-if="cfg.seckill.length<1">
            <img class="icon-empty" :src="emptyImg.best_list_empty" />
            <img class="icon-empty" :src="emptyImg.best_list_empty" />
            <div class="model-tip-text">请点击该区域并在右侧配置框内添加商品</div>
          </div>
          <div class="best-item" v-for="pinfo in cfg.seckill" :key="pinfo.id">
            <img class="p-thumb" :src="pinfo.goodsPic" />
            <div class="product-info">
              <div class="p-name">{{pinfo.name}}</div>
              <div class="p-time">{{seckillMonth}}月{{seckillDay}}日
                <span>{{seckillHours}}:{{seckillMin}}</span>准时开抢</div>
              <div class="p-price" style="margin-top:46px;">
                <div style="width:200px;">
                  <div class="p-distribution" v-if="pinfo.goodsPic">秒杀价{{'￥'+(pinfo.minSkPrice||999)}}
                    <span>{{'￥'+(pinfo.minOrigPrice||9999)}}</span>
                  </div>
                  <!-- <span class="p-market" v-if="pinfo.goodsPic">{{'￥'+(pinfo.minOrigPrice||9999)}}</span> -->
                </div>
                <div class="p-btn" style="font-size:12px;margin-left:0;">提醒我</div>
              </div>
            </div>
          </div>
        </div>
        <div class="best-line best-base" v-if="cfg.style=='line'">
          <div class="best-item" v-if="cfg.seckill.length<1">
            <img class="product-info" :src="emptyImg.best_line_empty" />
          </div>
          <div class="best-item" v-if="cfg.seckill.length<1">
            <img class="product-info" :src="emptyImg.best_line_empty" />
          </div>
          <div class="model-tip-text" v-if="cfg.seckill.length<1">请点击该区域并在右侧配置框内添加商品</div>
          <div class="best-item" v-if="cfg.seckill.length>0" v-for="pinfo in cfg.seckill" :key="pinfo.id">
            <img class="p-thumb" :src="pinfo.goodsPic" />
            <div class="p-name">{{pinfo.name}}</div>
            <div class="p-time">{{seckillMonth}}月{{seckillDay}}日
              <span>{{seckillHours}}:{{seckillMin}}</span>准时开抢</div>
            <div class="p-price">
              <div class="p-distribution"  v-if="pinfo.goodsPic" style="font-size:12px;">秒杀价{{'￥'+(pinfo.minSkPrice||999)}}</div>
              <div class="p-market" v-if="pinfo.goodsPic">{{'￥'+(pinfo.minOrigPrice||9999)}}</div>
            </div>
            <div class="p-btn">提醒我</div>
          </div>
        </div>
        <div class="best-single best-base" v-if="cfg.style=='single'">
          <div class="best-item-empty" v-if="cfg.seckill.length<1">
            <img class="icon-empty" :src="emptyImg.best_slide_empty" />
            <div class="model-tip-text">请点击该区域并在右侧配置框内添加商品</div>
          </div>
          <div class="best-item" v-for="pinfo in cfg.seckill" :key="pinfo.id">
            <img class="p-thumb" :src="pinfo.goodsPic" />
            <div class="product-info">
              <div class="p-neme">{{pinfo.name}}</div>
              <div class="p-time">{{seckillMonth}}月{{seckillDay}}日
                <span>{{seckillHours}}:{{seckillMin}}</span>准时开抢</div>
              <div class="p-price">
                <div class="p-distribution" v-if="pinfo.goodsPic">秒杀价{{'￥'+(pinfo.minSkPrice||999)}}</div>
                <div class="p-market" v-if="pinfo.goodsPic">{{'￥'+(pinfo.minOrigPrice||9999)}}</div>
                <div class="p-btn">提醒我</div>
              </div>
            </div>
          </div>
        </div>
        <div class="best-slide-wrapper" v-show="cfg.style=='slide2'||cfg.style=='slide'" ref="wrapper">
          <div class="best-slide" :class="cfg.style" v-if="cfg.seckill.length<1" :style="{width:30+170*6+'px'}">
            <div class="best-item">
              <img class="product-info" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
              <img class="product-info" v-if="cfg.style=='slide2'||cfg.style==null" v-on:mousemove.prevent :src="emptyImg.best_slide2_empty" />
            </div>
            <!-- <div class="best-item">
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
            </div> -->
            <div class="model-tip-text" style="text-align:left;margin-left:60px;" v-if="cfg.seckill.length<1">请点击该区域并在右侧配置框内添加商品</div>
          </div>
          <div class="best-slide best-base" :class="cfg.style" v-if="cfg.style=='slide' && cfg.seckill.length>0" :style="{width:30+170*(cfg.seckill.length<1?12:cfg.seckill.length)+'px'}">
            <div class="best-item" v-for="pinfo in cfg.seckill" :key="pinfo.id">
              <img class="p-thumb" :src="pinfo.goodsPic" />
              <div class="product-info">
                <div class="p-name">{{pinfo.name}}</div>
                <div class="p-time" style="font-size:12px;">{{seckillMonth}}月{{seckillDay}}日
                  <span>{{seckillHours}}:{{seckillMin}}</span>准时开抢</div>
                <div class="p-price">
                  <div class="p-distribution" v-if="pinfo.goodsPic" style="font-size:12px;">秒杀价{{'￥'+(pinfo.minSkPrice||999)}}</div>
                  <div class="p-market" v-if="pinfo.goodsPic">{{'￥'+(pinfo.minOrigPrice||9999)}}</div>
                </div>
                <div class="p-btn">提醒我</div>
              </div>
            </div>
          </div>
          <!-- <div class="best-slide best-base" :class="cfg.style" v-if="cfg.style=='slide2' && cfg.seckill.length>0" :style="{width:30+170*(cfg.seckill.length<1?12:cfg.seckill.length)+'px'}">
            <div class="best-item" v-for="pinfo in cfg.seckill" :key="pinfo.id">
              <div> <img class="p-thumb" :src="pinfo.goodsPic" />
                <div class="product-info">
                  <div class="p-name">{{pinfo.name}}</div>
                  <div class="p-price">
                    <div class="p-distribution" v-if="pinfo.goodsPic">{{'￥'+(pinfo.distributionPrice)}}</div>
                    <div class="p-market" v-if="pinfo.goodsPic">{{'￥'+(pinfo.distributionPrice)}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
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
              <!-- <el-radio class="black-radio" :label="'slide2'">双行左滑</el-radio> -->
              <el-radio class="black-radio" :label="'list'">列表详情</el-radio>
              <el-radio class="black-radio" :label="'single'">单列大图</el-radio>
            </el-radio-group>
          </div>
          <div class="view-box">
            <div class="view-title">
              <h2>添加秒杀活动</h2>
              <div class="progress">{{cfg.seckill.length}}/12</div>
            </div>
            <ul class="object-list product-list">
              <li class="object-item" v-for="(item,index) in cfg.seckill" :key="item.id">
                <div class="order-tool">
                  <div class="btn-up btn-item" @click="changeProductOrder(index,'up')">
                    <svg-icon iconClass="arrows-up"></svg-icon>
                  </div>
                  <div class="btn-down btn-item" @click="changeProductOrder(index,'down')">
                    <svg-icon iconClass="arrows-down"></svg-icon>
                  </div>

                </div>
                <div class="thumbnail">
                  <img :src="item.goodsPic" />
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
            <div class="btn-add btn-upload" @click="seckillDialog=true;fetchData()" v-show="cfg.seckill.length<12">
              <i class="el-icon-plus "></i>
              <span>添加秒杀</span>
            </div>
          </div>
          <div>
            <div>
              <h2>显示时间</h2>
              <p style="font-size:12px;">让该模块在指定的时间内显示在店铺,点击发布后生效</p>
              <el-radio-group v-model="showTime">
                <el-radio class="black-radio" :label="0">长期显示</el-radio>
                <el-radio class="black-radio" :label="1">时段显示</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <el-button class="btn-save" @click="saveData" :disabled="!needSave" :loading="loading">{{loading?'加载中':'保 存'}}</el-button>

      </template>
    </Card>
    <ProductsSelect :multiple="true" limit=12 :visible.sync="psVisible" :checked="cfg.seckill" @select="addProduct" @unSelect="delProduct"></ProductsSelect>
    <!-- 秒杀活动弹出框 -->
    <el-dialog title="添加秒杀活动" :visible.sync="seckillDialog" width="80%" top='8vh'>
      <el-row>
        <el-col :span="12">
          <el-select v-model="queryData.timeStatus" placeholder="挑选状态" @change="search">
            <el-option label="所有状态" value="">
            </el-option>
            <el-option label="待开始" value="0">
            </el-option>
            <el-option label="进行中" value="1">
            </el-option>
            <el-option label="已结束" value="2">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="关键字" @keydown.enter.native="search" v-model="input" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <!-- <el-button style="background:#CA303A;color:#fff" @click="gotoMenu">新建秒杀</el-button> -->
          <!-- <el-button type="warning" plain @click="search">查询</el-button> -->
        </el-col>
      </el-row>
      <div>
        <el-main>
          <el-table class="productlist-panel" max-height=550 :data="seckillData">
            <el-table-column label="商品主图" width="100">
              <template slot-scope="scope">
                <div class="p-info">
                  <img class="p-img" v-lazy="scope.row.goodsPic" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="活动名称">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="销售价&秒杀价" width="110">
              <template slot-scope="scope">￥{{scope.row.minSkPrice }}&￥{{ scope.row.minOrigPrice }}</template>
            </el-table-column>
            <el-table-column label="活动时间" width="150">
              <template slot-scope="scope">
                <div class="time-info">
                  <div>{{ scope.row.beginDateTime|parseTime }}</div>
                  <div>&</div>
                  <div>{{ scope.row.endDateTime |parseTime}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template slot-scope="scope">{{getStatus(scope.row.timeStatus)}}</template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button class="btn-Bdel" type="text" v-if="isChecked(scope.row.id)" @click="unSelect(scope.row)">已添加</el-button>
                <el-button class="btn-Badd" type="text" v-else @click="select(scope.row)" :disabled="scope.row.timeStatus==2">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-panel" v-if="seckillData.length>0">
            <el-pagination @current-change="pageChange" layout="prev, pager, next" :page-size="pages.pageSize" :current-page="pages.pageNum" :total="pages.totalPages">
            </el-pagination>
          </div>
        </el-main>
      </div>
    </el-dialog>
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
import ProductsSelect from '@/components/Dialog/ProductsSelect';
import { mapGetters, mapState } from 'vuex';
import { querySeckillList } from '@/api/seckill';

export default {
  components: { Card, ProductsSelect },
  computed: {},
  data() {
    return {
      seckillMonth: '',
      seckillDay: '',
      seckillHours: '',
      seckillMin: '',
      showTitle: true,
      input: '',
      effectiveBeginDate: '',
      effectiveEndDate: '',
      seckillData: [],
      data: {},
      queryData: {
        timeStatus: ''
      },
      loading: false,
      psVisible: false,
      needSave: false,
      seckillDialog: false,
      emptyImg: {
        img_Empty,
        best_list_empty,
        best_line_empty,
        best_slide_empty,
        best_slide2_empty
      },
      showTime: 0, //展示时间
      pages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 5
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
        console.log(newValue, oldValue);
        if (newValue == oldValue) {
          this.needSave = true;
        } else {
          // console.log(newValue);
        }
        if (
          newValue.icon == 'none' &&
          newValue.subhead == '' &&
          newValue.title == ''
        ) {
          this.showTitle = false;
        } else {
          this.showTitle = true;
        }
        if (newValue.seckill) {
          newValue.seckill.forEach(item => {
            // console.log(item)
            this.timestampToTime(item.beginDateTime);
          });
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['user', 'decorate']),
    cfg: function() {
      if (this.data.data) {
        console.log(this.data.data.data);
        return this.data.data.data;
      } else {
        return {
          seckill: []
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
    timestampToTime(timestamp) {
      var date = new Date(timestamp);
      // Y = date.getFullYear() + '-';
      this.seckillMonth =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1;
      this.seckillDay =
        date.getDate() < 10 ? '0' + (date.getDate() + 1) : date.getDate();
      this.seckillHours =
        date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      this.seckillMin =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      // s = date.getSeconds();
    },
    fetchData(params) {
      // 获取弹出秒杀活动列表
      querySeckillList(params).then(res => {
        if (res.code == 0) {
          this.seckillData = res.data.data.filter(res => {
            return res.timeStatus != 2;
          });
          this.pages.totalPages = res.data.total;
        }
      });
    },
    getStatus(type) {
      if (type == '0') {
        return '待开始';
      } else if (type == '1') {
        return '进行中';
      } else if (type == '2') {
        return '已结束';
      }
    },
    pageChange(pageNum) {
      // console.log(pageNum)
      this.pages.pageNum = pageNum;
      this.fetchData({
        pageNo: this.pages.pageNum,
        pageSize: this.pages.pageSize
      });
    },
    isChecked(id) {
      if (this.cfg.seckill) {
        return (
          this.cfg.seckill.find(res => {
            if (res.id == id) {
              return true;
            } else {
              return false;
            }
          }) != null
        );
      } else {
        return false;
      }
    },
    unSelect(data) {
      for (var i = 0; i < this.cfg.seckill.length; i++) {
        if (this.cfg.seckill[i].id == data.id) {
          this.cfg.seckill.splice(i, 1);
          break;
        }
      }
    },
    select(data) {
      // console.log(data);
      // this.$emit('select', data);
      // this.visible = false;
      this.cfg.seckill.push(data);
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

    search() {
      var self = this;
      // 状态查找
      if (self.queryData.timeStatus == '') {
        self.timeStatus = '';
      } else if (self.queryData.timeStatus == 0) {
        self.timeStatus = 0;
      } else if (self.queryData.timeStatus == 1) {
        self.timeStatus = 1;
      } else if (self.queryData.timeStatus == 2) {
        self.timeStatus = 2;
      }

      self.option = {
        timeStatus: self.timeStatus,
        keyword: self.input,
        beginDateTimeStart: self.effectiveBeginDate,
        beginDateTimeEnd: self.effectiveEndDate
      };

      self.fetchData({
        timeStatus: self.timeStatus,
        keyword: self.input,
        beginDateTimeStart: self.effectiveBeginDate,
        beginDateTimeEnd: self.effectiveEndDate
      });
    },
    gotoMenu() {
      this.$router.push({ name: 'seckill-add' });
    },
    addProduct(data) {
      this.cfg.seckill.push(data);
    },
    delProduct(data) {
      for (var i = 0; i < this.cfg.seckill.length; i++) {
        if (this.cfg.seckill[i].id == data.id) {
          this.cfg.seckill.splice(i, 1);
          break;
        }
      }
    },
    changeProductOrder(index, type) {
      var seckill = this.cfg.seckill;
      if (index == seckill.length - 1 && type == 'down') {
        return;
      }
      if (index == 0 && type == 'up') {
        return;
      }
      if (type == 'up') {
        seckill[index - 1] = seckill.splice(index, 1, seckill[index - 1])[0];
      } else if (type == 'down') {
        seckill[index + 1] = seckill.splice(index, 1, seckill[index + 1])[0];
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
.productlist-panel {
  .time-info,
  .price-info {
    text-align: center;
    .reduced-text {
      color: #ca303a;
    }
  }
  .p-info {
    display: flex;
    align-items: center;

    .p-img {
      max-width: 30%;
      // max-height: 70px;
      object-fit: cover;
    }
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
      .p-time {
        color: #D14C54;
        font-size: 12px;
        span {
          margin-left: 4px;
        }
      }
      .p-price {
        display: flex;
        align-items: baseline;
        height: 15px;
        margin-bottom: 20px;
        .p-distribution {
          font-size: 15px;
          color: #333333;
          line-height: 15px;
          margin-right: 7px;
          span{
            font-size: 10px;
            text-decoration: line-through;
            color:#999999;
          }
        }
        .p-market {
          font-size: 10px;
          text-decoration: line-through;
          color: #999999;
          text-align: center;
        }
        .p-btn {
          width: 60px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          font-size: 15px;
          background-color: #ca303a;
          color: #fff;
          margin-left: 180px;
          font-weight: normal;
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
    .p-time {
      color: #D14C54;
      font-size: 12px;
      text-align: left;
      span {
        margin-left: 4px;
      }
    }
    .p-price {
      display: flex;
      align-items: baseline;
      height: 15px;
      margin-bottom: 20px;
      .p-distribution {
        font-size: 15px;
        color: #333333;
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
    .p-btn {
      width: 60px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      background-color: #ca303a;
      color: #fff;
      // margin-left: 180px;
      font-weight: normal;
      margin-top: -14px;
      margin-bottom: 20px;
      // margin-left: -2px;
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
    }
    .p-thumb {
      -moz-user-select: none;
      object-fit: contain;
      width: 150px;
      height: 160px;
      margin-bottom: 5px;
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
      // margin-bottom: 8px;
    }
    .p-time {
      color: #D14C54;
      font-size: 12px;
      margin: 5px 0 20px 0;
      span {
        margin-left: 4px;
      }
    }
    .p-price {
      display: flex;
      align-items: baseline;
      height: 15px;
      margin-bottom: 13px;
      font-weight: bold;
      .p-distribution {
        font-size: 15px;
        color: #333333;
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
    .p-btn{
      width:60px;
      height:20px;
      line-height:20px;
      text-align:center;
      color:#fff;
      font-size:12px;
      background-color:#CA303A;
      margin:0 0 20px 0;
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
    }

    .el-input {
      border-radius: 0;
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
.pagination-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  .el-pagination {
    margin: 0 auto;
  }
}
</style>

