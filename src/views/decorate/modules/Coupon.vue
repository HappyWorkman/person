<template>
  <div>
    <Card :id="id" class="card-coupon" :namebrand="decorate.components['coupon'].name">
      <template slot="cfg-view">
        <div class="coupon-list-wrapper" ref="wrapper">
          <ul class="coupon-list" :class="cfg.style" :style="{width:30+{style1:134,style2:210,style3:160}[cfg.style]*(cfg.coupons.length<1?6:cfg.coupons.length)+'px'}">
            <li class="coupon-item" v-for="item in cfg.coupons" :key="item.id">
              <div class="fullCutPrice">{{item.fullCutPrice||0}}</div>
              <div>
                <div class="tip-text">{{item.name}}</div>
                <div class="coupon-threshold" v-if="item.thresholdPrice!=0">满{{item.thresholdPrice}}可使用</div>
                <div class="coupon-threshold" v-else>无金额门槛</div>
              </div>

              <div class="coupon-item-suffix" v-if="cfg.style=='style2'">
                <div class="btn-get">领取</div>
              </div>
              <div class="btn-get" v-else>立即领取</div>
            </li>
            <li class="coupon-empty-item" :class="cfg.style" v-if="cfg.coupons.length==0" v-for="item in [1,2,3,4,5,6]" :key="item">
              <img class="empty-icon" :src="style1_Empty" v-if="cfg.style=='style1'" />
              <img class="empty-icon" :src="style2_Empty" v-if="cfg.style=='style2'" />
              <img class="empty-icon" :src="style3_Empty" v-if="cfg.style=='style3'" />
            </li>
          </ul>
        </div>
      </template>
      <template slot="form-view-title">{{cfg.name}}</template>
      <template slot="form-view">
        <div class="form-view-content">
          <div class="view-style view-box">
            <h2>排列样式</h2>
            <el-radio-group class="view-data" v-model="cfg.style">
              <el-radio class="black-radio" :label="'style1'">样式1</el-radio>
              <el-radio class="black-radio" :label="'style2'">样式2</el-radio>
              <el-radio class="black-radio" :label="'style3'">样式3</el-radio>
            </el-radio-group>
          </div>
          <div class="view-box">
            <div class="view-title">
              <h2 class="title">优惠券列表</h2>
              <div class="progress">{{cfg.coupons.length}}/6</div>
            </div>

            <ul class="object-list">
              <li class="object-item" v-for="(item,index) in cfg.coupons" :key="item.id">
                <div class="order-tool">
                  <div class="btn-up el-icon-arrow-up" @click="changemenuOrder(index, 'up')"></div>
                  <div class="btn-down el-icon-arrow-down" @click="changemenuOrder(index, 'down')"></div>
                </div>
                <!-- <div class="thumbnail">
                  <img :src="item.imageIcon" />
                </div> -->
                <div class="coupon-detail-info">
                  <el-tooltip :content="item.name" placement="top-start">
                    <div class="img-target">{{item.name}}</div>
                  </el-tooltip>
                </div>
                <div class="btn-delete-panel">
                  <div class="btn-delete el-icon-delete" @click="delCoupon(item)"></div>
                </div>
              </li>
            </ul>
            <div class="btn-add btn-upload" @click="addCoupon" v-if="cfg.coupons.length<6">
              <i class="el-icon-plus"></i>
              <span>添加优惠券</span>
            </div>
            <el-button type="text" @click="gotoMenu">编辑优惠券</el-button>
          </div>
        </div>
        <el-button class="btn-save" @click="saveData" :disabled="!needSave" :loading="loading">{{loading?'加载中':'保 存'}}</el-button>
      </template>
    </Card>
    <el-dialog title="优惠券挑选" :visible.sync="visible" width="80%" :before-close="handleClose" top='8vh'>
      <el-container>
        <el-header>
          <el-select v-model="queryData.status" placeholder="状态" style="width:120px;" @change="search">
            <el-option label="发放中" value="0">
            </el-option>
            <el-option label="已领完" value="1">
            </el-option>
          </el-select>
          <el-select v-model="queryData.receiveType" placeholder="领取资格" style="width:120px;" @change="search">
            <el-option label="所有" value="null">
            </el-option>
            <el-option label="通用" value="0">
            </el-option>
            <el-option label="新人" value="1">
            </el-option>
          </el-select>
          <el-input placeholder="商品关键字" @keydown.enter.native="search" v-model="queryData.keyWord" class="input-with-select" style="width:200px;">
            
          </el-input>
          <el-button type="danger" @click="search">搜索</el-button>
          <!-- <el-button @click="search">查询</el-button> -->
          <!-- <el-button-group> -->
            <router-link class="link" to="/marketing/coupon">
              <el-button style="float:right;margin-right:-19px;" type="danger" plain class="btn-add" icon="el-icon-add">编辑优惠券</el-button>
            </router-link>
          <!-- </el-button-group> -->
        </el-header>
        <el-main>
          <el-table class="coupon-list-panel" :data="couponList" style="width:100%" border max-height=550>
            <el-table-column label="优惠券名称" min-width="90">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column label="面额&门槛" min-width="90" align="center">
              <template slot-scope="scope">
                <div class="price-info">
                  <div class="reduced-text">￥{{scope.row.fullCutPrice }}</div>
                  <!-- <div class="reduced-text" v-else>{{scope.row.discountRate }}折</div> -->
                  <div>&</div>
                  <div>￥{{ scope.row.thresholdPrice }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="有效时间" min-width="150" align="center">
              <template slot-scope="scope">
                <div class="time-info" v-if="scope.row.effectiveType=='0'">
                  <div>{{ scope.row.effectiveBeginDate|parseTime }}</div>
                  <div>&</div>
                  <div>{{ scope.row.effectiveEndDate |parseTime}}</div>
                </div>
                <div v-else>领取当日开始{{scope.row.effectiveDays}}天内有效</div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template slot-scope="scope">
                {{getStatus(scope.row.status)}}
              </template>

            </el-table-column>
            <el-table-column label="领取资格" width="180">
              <template slot-scope="scope">
                {{getreceiveQualificationName(scope.row.receiveType)}}
              </template>
            </el-table-column>
            <el-table-column label="限领/人" width="80" align="center">
              <template slot-scope="scope">
                {{scope.row.limitNumber}}
              </template>
            </el-table-column>
            <el-table-column prop="btn-group" label="操作" width="100">
              <template slot-scope="scope">
                <el-button class="btn-Bdel" type="text" v-if="isChecked(scope.row.id)" @click="unSelect(scope.row)">已添加</el-button>
                <el-button class="btn-Badd" type="text" v-else @click="select(scope.row)" :disabled="scope.row.status ==2">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-panel" v-if="couponList.length>0">
            <el-pagination @current-change="pageChange" layout="prev, pager, next" :page-size="couponPages.pageSize" :current-page="couponPages.pageNum" :total="couponPages.totalPages">
            </el-pagination>
          </div>
        </el-main>
      </el-container>

      <!-- <el-button-group>
        <router-link class="link" to="/marketing/coupon">
          <el-button type="danger" plain class="btn-add" icon="el-icon-add">编辑优惠券</el-button>
        </router-link>
      </el-button-group> -->
    </el-dialog>
  </div>

</template>

<script>
import Card from './frame/card';
import style1_Empty from '@/assets/decorate/coupon-style1-empty.png';
import style2_Empty from '@/assets/decorate/coupon-style2-empty.png';
import style3_Empty from '@/assets/decorate/coupon-style3-empty.png';

import { mapGetters, mapState } from 'vuex';
import { queryCouponList } from '@/api/coupon';
import Bscroll from 'better-scroll';

export default {
  components: { Card },
  computed: {},
  data() {
    return {
      userCoupon: '',
      visible: false,
      needSave:false,
      checked: [],
      couponList: [],
      queryData: {
        name: '',
        status: '0', //nunll所有0发送中1已领完2已结束3已删除
        receiveType: 'null', //领取资格0:全部用户，1:新用户
        keyWord: ''
      },
      input: '',
      data: {},
      loading: false,
      style1_Empty,
      style2_Empty,
      style3_Empty,
      couponPages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 5
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
        // if(newValue.icon =='none' && newValue.subhead==''&& newValue.title==''){
        //   this.showTitle = false;
        // }else{
        //   this.showTitle = true;
        // }
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
          coupons: []
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
    this.betterscroll = new Bscroll(this.$refs.wrapper, {
      scrollX: true,
      scrollY: false
    });
    // this.fetchCouponList({
    //   pageNum: this.couponPages.pageNum,
    //   pageSize: this.couponPages.pageSize,
    // });
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
    delCoupon(data) {
      for (var i = 0; i < this.cfg.coupons.length; i++) {
        if (this.cfg.coupons[i].id == data.id) {
          this.cfg.coupons.splice(i, 1);
          break;
        }
      }
    },
    changemenuOrder(index, type) {
      var coupon = this.cfg.coupons;
      if (index == coupon.length - 1 && type == 'down') {
        return;
      }
      if (index == 0 && type == 'up') {
        return;
      }
      if (type == 'up') {
        coupon[index - 1] = coupon.splice(index, 1, coupon[index - 1])[0];
      } else if (type == 'down') {
        coupon[index + 1] = coupon.splice(index, 1, coupon[index + 1])[0];
      }
    },
    gotoMenu() {
      this.$router.push({ name: 'coupon' });
    },

    addCoupon() {
      // debugger;
      this.visible = true;
      this.fetchCouponList({
        pageNum: this.couponPages.pageNum,
        pageSize: this.couponPages.pageSize,
        status: this.queryData.status,
        receiveType: this.queryData.receiveType
      });
    },
    fetchCouponList(param) {
      this.loading = true;
      queryCouponList(param).then(res => {
        if (res.code === '0') {
          this.loading = false;
          this.couponList = res.data.content;
          this.couponPages.totalPages = res.data.total;
        }
      });
    },
    pageChange(pageNum) {
      this.couponPages.pageNum = pageNum;
      this.fetchCouponList({
        pageNum: this.couponPages.pageNum,
        pageSize: this.couponPages.pageSize,
        status: this.queryData.status,
        receiveType: this.queryData.receiveType
      });
    },
    getreceiveQualificationName(type) {
      if (type == '0') {
        return '通用';
      } else {
        return '新人';
      }
      // return { allMember: '全部用户', newMember: '新人用户' }[type];
    },
    getStatus(type) {
      if (type == '0') {
        this.editDisabled = false;
        return '发送中';
      } else if (type == '1') {
        this.editDisabled = false;
        return '已领完';
      } else if (type == '2') {
        this.editDisabled = false;
        return '已结束';
      } else if (type == '3') {
        this.editDisabled = false;
        return '已删除';
      }
    },
    isChecked(id) {
      if (this.cfg.coupons) {
        return (
          this.cfg.coupons.find(res => {
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
    handleClose(done) {
      this.visible = false;
    },
    select(data) {
      console.log(data);
      // this.$emit('select', data);
      // this.visible = false;
      this.cfg.coupons.push(data);
    },
    unSelect(data) {
      for (var i = 0; i < this.cfg.coupons.length; i++) {
        if (this.cfg.coupons[i].id == data.id) {
          this.cfg.coupons.splice(i, 1);
          break;
        }
      }
    },
    search() {
      // debugger;
      var self = this;
      // 用户类型
      if (self.queryData.receiveType == 0) {
        self.receiveType = 0;
      } else if (self.queryData.receiveType == 1) {
        self.receiveType = 1;
      } else {
        self.receiveType = null;
      }
      // 状态
      if (self.queryData.status == 0) {
        self.status = 0;
      } else if (self.queryData.status == 1) {
        self.status = 1;
      }
      // debugger;
      self.fetchCouponList({
        pageNum: self.couponPages.pageNum,
        pageSize: self.couponPages.pageSize,
        name: self.queryData.keyWord,
        receiveType: self.receiveType,
        status: self.status
      });
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
.pagination-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  // position: absolute;
  // bottom: 0px;
  margin-top: 10px;
  width: 100%;
  .el-pagination {
    margin: 0 auto;
  }
}
.el-dialog {
  .el-header {
    // text-align: right;
    margin-left: -22px;
  }
  .el-button-group {
    display: flex;
    justify-content: flex-start;
    .btn-add {
    }
  }
  .el-main {
    padding: 0 0 20px 0;
  }
}

.coupon-detail-info {
  text-align: center;
  width: calc(100% - 40px);
}
// ----------------cfg-view-------------------

.coupon-list-wrapper {
  width: 100%;
  overflow: hidden;
}
.coupon-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  // display: flex;
}
.coupon-list.style1 {
  height: 170px;
  .coupon-item {
    display: inline-block;
    width: 134px;
    height: 170px;
    margin-right: 20px;
    text-align: center;
    position: relative;
    margin: 0px;
    white-space: nowrap;

    .fullCutPrice {
      margin-top: 22px;
      height: 46px;
      font-size: 40px;
      color: #CA303A;
    }
    .tip-text {
      margin: 0 auto;
      // width: 36px;
      font-size: 12px;
      color: rgba(153, 153, 153, 1);
    }
    .coupon-threshold {
      margin-top: 28px;
      margin-bottom: 3px;
      font-size: 12px;
      color: rgba(153, 153, 153, 1);
    }
    .btn-get {
      margin: 0 auto;
      color: white;
      font-size: 14px;
      line-height: 20px;
      width: 70px;
      height: 20px;
      background:#CA303A;
      margin-bottom: 24px;
    }
    &:after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -40px;
      width: 1px;
      height: 80px;
      background: rgba(216, 216, 216, 1);
    }
    &:nth-last-child(1):after {
      display: none;
    }
  }
  .coupon-empty-item {
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 134px;
    height: 170px;
    text-align: center;
  }
}
.coupon-list.style2 {
  height: 100px;
  padding-left: 13px;
  .coupon-item {
    margin: 18px 0 18px 5px;
    cursor: pointer;
    float: left;
    // width: 150px;
    height: 65px;
    // background-image: url(../../../assets/decorate/coupon-red.png);
    // background-size: contain;
    // background-repeat: no-repeat;
    background-color: #CA303A;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-right: 40px;
    .fullCutPrice {
      font-size: 40px;
      color: rgba(255, 255, 255, 1);
      line-height: 40px;
      position: relative;
      margin-left: 14px;
      margin-right: 8px;
      &:before {
        content: '¥';
        position: absolute;
        left: -7px;
        top: -13px;
        font-size: 10px;
        color: rgba(255, 255, 255, 1);
      }
    }
    .tip-text {
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
    }
    .coupon-threshold {
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
      line-height: 14px;
      // width: 85px;
    }
    .btn-get {
      width: 1em;
      height: 28px;
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
      line-height: 14px;
    }
  }
  .coupon-item-suffix {
    position: absolute;
    right: -35px;
    background-image: url(../../../assets/decorate/coupon-style2-red.png);
    width: 35px;
    height: 65px;
    background-size: contain;
    background-repeat: no-repeat;
    // margin-left: 35px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 5px;
  }
  .coupon-empty-item {
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 65px;
    text-align: center;
    margin: 18px 5px;
    img {
      width: 100%;
    }
  }
}
.coupon-list.style3 {
  height: 100px;
  padding-left: 13px;
  .coupon-item {
    margin: 18px 10px 18px 0;
    padding: 6px 0;
    float: left;
    width: 126px;
    height: 70px;
    background-image: url(../../../assets/decorate/coupon-style3-red.png);
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    .fullCutPrice {
      font-size: 24px;
      color: rgba(255, 255, 255, 1);
      line-height: 24px;
      margin-left: 21px;
      position: relative;
      &:before {
        content: '¥';
        position: absolute;
        left: -10px;
        bottom: -3px;
        vertical-align: bottom;
        font-size: 10px;
        color: rgba(255, 255, 255, 1);
      }
    }
    .tip-text {
      position: absolute;
      bottom: 6px;
      left: 0px;
      font-size: 8px;
      transform: scale(0.66);
      color: rgba(255, 255, 255, 1);
      line-height: 14px;
      width: 100%;
      text-align: center;
    }
    .coupon-threshold {
      font-size: 10px;
      transform: scale(0.83) translate(-6px);
      color: rgba(255, 255, 255, 1);
      // padding-left: 10px;
      width: 100%;
      margin-left: 5px;
      margin-top: 1px;
      text-align: left;
    }
    .btn-get {
      position: absolute;
      right: 0;
      top: 11px;
      // width: 120px;

      text-align: center;
      font-size: 12px;
      transform: scale(0.66);
      color: white;
    }
  }
  .coupon-empty-item {
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 65px;
    text-align: center;
    margin: 18px 5px;
    img {
      width: 100%;
    }
  }
}
</style>


