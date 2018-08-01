<template>
  <div class="app-container">
    <div class="header layer" v-if="$route.meta.listview">
      <!-- 数据概况 title -->
      <div class="header-box">
        <div class="header-title">
          <svg-icon :icon-class="'yingxiao'"></svg-icon>
          <span>营销中心</span>
        </div>
        <div :span="12" class="header-tip">
          更多营销功能敬请期待
        </div>
      </div>
      <el-row class="">
        <el-menu :default-active="activeMenu" mode="horizontal">
          <el-menu-item index="1" class="menu-item">
            <router-link to="./coupon">优惠券活动&nbsp;<span class="numBackground" v-if="isShowCouponNum">{{couponNum}}</span></router-link>
          </el-menu-item>
          <el-menu-item index="2" class="menu-item">
            <router-link to="./seckill">秒杀活动&nbsp;<span class="numBackground" v-if="isShowSeckillNum">{{seckillNum}}</span></router-link>
          </el-menu-item>
        </el-menu>
      </el-row>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';
import { queryCouponList } from '@/api/coupon';
import { querySeckillList } from '@/api/seckill';
export default {
  data() {
    return {
      activeMenu: '1',
      isShowCouponNum: false,
      couponNum: '',
      isShowSeckillNum: false,
      seckillNum: '',
      couponPages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 10
        // name:'',
        // receiveType:0,
        // status:0
      }
    };
  },
  computed: {},
  components: { Breadcrumb },
  created() {},
  mounted(){
      let options = {
        pageNum:1,
        pageSize:10
      }
      // 优惠券活动
      queryCouponList(options).then(res => {
        if (res.code == 0) {
          if (res.data.content.length <= 0) {
            this.isShowCouponNum = false;
          } else {
            this.isShowCouponNum = true;
            this.couponNum = res.data.total;
          }
        }
      });
      // 秒杀活动
      querySeckillList(options).then(res => {
        if (res.code == 0) {
          if (res.data.data <= 0) {
            this.isShowSeckillNum = false;
          } else {
            this.isShowSeckillNum = true;
            this.seckillNum = res.data.total;
          }
        }
      });
    
  },
  updated() {
    if (this.$route.name == 'seckill') {
      this.activeMenu = '2';
    }else{
      this.activeMenu = '1';
    }
  },
  watch:{
    
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.numBackground{
  display: inline-block;
  width: 30px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  background: #999999;
  color: white;
  border-radius: 10px;
  font-size: 14px;
  margin-top:-2px;
}
.header {
  padding: 60px 40px 0 40px;
  background-color: white;
  .header-title {
    font-size: 34px;
    span {
      font-weight: bold;
      font-size: 30px;
      color: #333333;
      line-height: 30px;
    }
  }
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 50px;
  }
  .header-tip {
    font-size: 16px;
    color: #999999;
    line-height: 14px;
  }
  .menu-item {
    font-size: 22px;
    color: #999999;
    line-height: 24px;
    &.is-active {
      color: #ca303a;
      .numBackground{
        display: inline-block;
        width: 30px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background: #CA303A;
        color: white;
        border-radius: 10px;
        font-size: 14px;
        margin-top:-2px;
      }
    }
  }
}
</style>
