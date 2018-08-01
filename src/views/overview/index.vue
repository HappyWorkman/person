<template>
  <div class="app-container">
    <div class="pending-features layer">
      <h2>待处理事项</h2>
      <ul class="pending">
        <router-link :to="{name:'OrderList',params:{status:'unshipped'}}" class="link">
          <li class="pending-item-b">
            <svg-icon :icon-class="'overview-ship'"></svg-icon>
            <span class="name">待发货</span>
            <span class="number-b">{{untreatAffair.unshipped}}</span>
          </li>
        </router-link>
        <router-link :to="{name:'trade',params:{status:'account'}}" class="link">
          <li class="pending-item-b">
            <svg-icon :icon-class="'overview-withdraw'"></svg-icon>
            <span class="name">待入账</span>
            <span class="number-b">{{untreatAffair.unAmount}}</span>
          </li>
        </router-link>
        <router-link :to="{name:'trade',params:{status:'success'}}" class="link">
          <li class="pending-item-r">
            <svg-icon :icon-class="'overview-account'"></svg-icon>
            <span class="name">可提现</span>
            <span class="number-r">{{untreatAffair.amount | currency('')}}</span>
          </li>
        </router-link>
      </ul>
      <div class="quick-link">
        <h2>常用功能</h2>
        <ul class="link-list">
          <li>
            <router-link :to="{name:'Bazaar'}" class="link">
              <svg-icon :icon-class="'subject'"></svg-icon>
              <div class="title">选品中心</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'Goods'}" class="link">
              <svg-icon :icon-class="'shoppingbag'"></svg-icon>
              <div class="title">商品管理</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'Category'}" class="link">
              <svg-icon :icon-class="'classify'"></svg-icon>
              <div class="title">分类管理</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'OrderList'}" class="link">
              <svg-icon :icon-class="'order'"></svg-icon>
              <div class="title">订单管理</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'earnings'}" class="link">
              <svg-icon :icon-class="'withdraw'"></svg-icon>
              <div class="title">余额提现</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'collection'}" class="link">
              <svg-icon :icon-class="'data-menu'"></svg-icon>
              <div class="title">数据概况</div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="new-data-main layer">
      <el-row class="new-data">
        <el-col :span="12">
          <h2>最新数据</h2>
        </el-col>
        <el-col :span="12" class="time-range">
          <el-button class="btn-pl" size="small" plain :class="{active:time==0}" @click="checkNewData(0)">今天</el-button>
          <el-button class="btn-pl" size="small" plain :class="{active:time==1}" @click="checkNewData(1)">近7天</el-button>
          <el-button class="btn-pl" size="small" plain :class="{active:time==2}" @click="checkNewData(2)">近30天</el-button>
        </el-col>
      </el-row>
      <el-row class="new-data">
        <el-col :span="24">
          <el-col :span="4" class="data-item">
            <div class="name">访客量</div>
            <span class="number-b">{{latsetData.visitorVolume | toThousandslsFilter(latsetData.visitorVolume)}}</span>

            <div class="data-wrap">
              <span class="date">较{{dataTime[time].time}}</span>
              <span class="rate">{{latsetData.visitorVolumePercentage}}%</span>
              <i class="el-icon-sort-down green" v-if="latsetData.visitorVolumePercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>
          <el-col :span="3" class="data-item">
            <div class="name">已售商品</div>
            <span class="number-b">{{latsetData.soldGoods | toThousandslsFilter(latsetData.soldGoods)}}</span>

            <div class="data-wrap">
              <span class="date">较{{dataTime[time].time}}</span>
              <span class="rate">{{latsetData.soldGoodsPercentage}}%</span>
              <i class="el-icon-sort-down green" v-if="latsetData.soldGoodsPercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>
          <el-col :span="3" class="data-item">
            <div class="name">订单数</div>
            <span class="number-b">{{latsetData.orderNumber | toThousandslsFilter(latsetData.orderNumber)}}</span>

            <div class="data-wrap">
              <span class="date">较{{dataTime[time].time}}</span>
              <span class="rate">{{latsetData.orderNumberPercentage}}%</span>
              <i class="el-icon-sort-down green" v-if="latsetData.orderNumberPercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>
          <el-col :span="4" class="data-item">
            <div class="name">交易额</div>
            <span class="number-r">{{latsetData.transactionAmount | currency('')}}</span>

            <div class="data-wrap">
              <span class="date">较{{dataTime[time].time}}</span>
              <span class="rate">{{latsetData.transactionAmountPercentage}}%</span>
              <i class="el-icon-sort-down green" v-if="latsetData.transactionAmountPercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>
          <el-col :span="5" class="data-item">
            <div class="name">收入</div>
            <span class="number-r">{{latsetData.income | currency('')}}</span>
            <div class="data-wrap">
              <span class="date">较{{dataTime[time].time}}</span>
              <span class="rate">{{latsetData.incomePercentage}}%</span>
              <i class="el-icon-sort-down green" v-if="latsetData.incomePercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <div class="collection-member layer">
      <el-row>
        <el-col :span="12" class="collection-member-title">
          <h2>趋势图</h2>
        </el-col>
        <el-col :span="12" class="time-range">
          <el-button class="btn-pl" size="small" plain :class="{active:type==7}" @click="getaEchartTendency(7)">近7天</el-button>
          <el-button class="btn-pl" size="small" plain :class="{active:type==30}" @click="getaEchartTendency(30)">近30天</el-button>
        </el-col>
        <el-col class="chart-box-line">
          <div id="sevenData" class="chart-line"></div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="店铺信息" :visible.sync="shopInfoVisible">
      <el-row class="shop-info-wrap">
        <el-col :span="24" class="shop-logo">
          <span class="title">店铺LOGO：</span>
          <img :src="shopInfo.logo" alt="">
        </el-col>
        <el-col :span="24" class="shop-item">
          <div class="info-item">
            <div class="item-box">
              <span class="title">店铺名称：</span>
              <span>{{shopInfo.name}}</span>
            </div>
            <div class="item-box">
              <span class="title">开店时间：</span>
              <span>{{shopInfo.createDate || '无'}}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="item-box">
              <span class="title">绑定手机号：</span>
              <span>{{shopInfo.mobile || '无'}}</span>
            </div>
            <div class="item-box">
              <span class="title">店铺状态：</span>
              <span>{{shopInfo.status || '无'}}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="title">认证类型：</span>
            <span>个人</span>
          </div>
        </el-col>
        <el-col :span="24" class="shop-introduction">
          <span class="title">店铺简介：</span>
          <span>{{shopInfo.shopIntroduction || '无'}}</span>
        </el-col>
        <el-col :span="24" class="code-wrap">
          <el-col :span="12" class="code-item" v-if="shopInfo.wxMiniCodeImg">
            <div class="shop-code code">
              <img :src="shopInfo.wxMiniCodeImg" alt="">
              <span>查看店铺</span>
            </div>
          </el-col>
          <el-col :span="12" class="code-item" v-if="shopInfo.onlineServiceImg">
            <div class="service-code code">
              <img :src="shopInfo.onlineServiceImg" alt="">
              <span>咨询客服</span>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="添加店铺" :visible.sync="shopAddVisible">
      <div class="addShops">
        <svg-icon :icon-class="'shops'" style="font-size: 36px"></svg-icon>
        <span>多店铺功能暂未开放，敬请期待!</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getShopInfo,
  getLatsetData,
  getUntreatAffair,
  getTrendMap
} from '@/api/overview';
import echarts from 'echarts';
export default {
  data() {
    return {
      time: 0,
      type: 7,
      shopInfoVisible: false,
      shopAddVisible: false,
      dataTime: [{ time: '前一日' }, { time: '上一周' }, { time: '上一月' }],
      shopInfo: {},
      untreatAffair: {
        amount: 0,
        unAmount: 0,
        unshipped: 0
      },
      echartTendency: null,
      latsetData: {
        visitorVolume: 0, //今日访客数
        visitorVolumePercentage: '', //今日访客数增长率
        soldGoods: 0, //今日售出商品数
        soldGoodsPercentage: '', //今日售出商品数增长率
        orderNumber: 0, //今日订单数
        orderNumberPercentage: '', //今日订单数增长率
        transactionAmount: 0, //今日销售额
        transactionAmountPercentage: '', //今日销售额增长率
        income: 0, //今日利润
        incomePercentage: '' //今日利润增长率
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getShopInfo();
      this.getUntreatAffair();
      this.getLatsetData(0);
      this.getaEchartTendency(7);
    },
    getShopInfo() {
      getShopInfo().then(res => {
        if (res.code == 0) {
          this.shopInfo = res.data;
        }
      });
    },
    getUntreatAffair() {
      getUntreatAffair().then(res => {
        if (res.code == 0) {
          this.untreatAffair = res.data;
        }
      });
    },
    getLatsetData(key) {
      getLatsetData().then(res => {
        if (res.code == 0) {
          this.latsetData = res.data[key];
        }
      });
    },
    checkNewData(key) {
      this.time = key;
      this.getLatsetData(key);
    },
    //获取趋势图近七日数据
    getaEchartTendency(key) {
      this.type = key;
      getTrendMap(key)
        .then(res => {
          if (res.code == 0) {
            let echartTendency = res.data;
            echartTendency.echartsMultiSeriesDatas = JSON.parse(
              echartTendency.trandDatas
            );
            echartTendency.statisticalDimensionDatas = JSON.parse(
              echartTendency.trandName
            );
            echartTendency.xAxisDatas = JSON.parse(echartTendency.xAxisData);
            this.echartTendency = this.createEchartLine(
              'sevenData',
              '',
              echartTendency
            );
          } else this.$message.error(res.msg || '请求数据出错, 请稍后再试!');
        })
        .catch(err => {
          this.$message.error('请求数据出错, 请稍后再试!');
        });
    },
    // 生成线性图表
    createEchartLine(elementId, title, chartInfo, color) {
      let {
          statisticalDimensionDatas: legendList,
          echartsMultiSeriesDatas: dataList,
          xAxisDatas
        } = chartInfo,
        myChart = echarts.init(document.getElementById(elementId)),
        // 绘制图表
        options = {
          title: {
            text: title,
            textStyle: {
              color: '#666',
              fontSize: 14,
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: legendList.map(name => ({ icon: 'circle', name })),
            bottom: 10,
            left: 80,
            align: 'left'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisDatas
          },
          yAxis: {
            type: 'value'
            // splitLine: {
            //   show: true,
            //   lineStyle: {
            //     color: '#f0f0f0',
            //     type: 'dashed'
            //   }
            // }
          },
          series: dataList.map(d => ({
            name: d.name,
            type: d.type,
            data: d.data,
            stack: '总量',
            areaStyle: { normal: {} }
            // markLine: {
            //   silent: true
            // }
          }))
        };

      myChart.setOption(options);
      return myChart;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/mixin.scss';
@import '../../styles/variables.scss';
.app-container {
  .green {
    color: #30ca3e;
  }
  .header {
    display: flex;
    box-sizing: border-box;
    .header-info {
      display: flex;
      box-sizing: border-box;
      flex-direction: row;
      justify-content: space-between;
      flex: 7;
      margin-right: 20px;
      padding: 56px 40px 40px 40px;
      .info {
        display: flex;
        flex-direction: row;
        .info-dec {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 20px;
          padding: 10px 0 10px 0;
          .name {
            font-size: 30px;
            font-weight: 600;
            vertical-align: top;
            span {
              display: inline-block;
              font-size: 14px;
              color: $themeColor;
              vertical-align: top;
            }
          }
          .time {
            font-size: 14px;
          }
        }
      }
    }
    .add {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      padding: 0 40px 0 40px;
      .add-wrap {
        cursor: pointer;
        text-align: center;
        .add-text {
          margin-top: 30px;
          font-size: 16px;
        }
      }
    }
  }
  h2 {
    font-weight: inherit;
    font-weight: bold;
    font-size: 24px;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    margin: 30px;
  }
  .btn-pl {
    padding-left: 14px;
    padding-right: 14px;
    min-width: 68px;
  }
  .pending-features {
    ul.pending {
      width: 78%;
      min-width: 946px;
      padding: 0 30px;
      margin: 0;
      list-style: none;
      font-size: 55px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 30px 0;
      li {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 45px;
        &.pending-item-b {
          .svg-icon,
          .number-b {
            color: #30a1ca;
          }
        }
        &.pending-item-r {
          .svg-icon,
          .number-b {
            color: #ca303a;
          }
        }
        // margin-right: 100px;
        .svg-icon {
          width: 40px;
          height: 40px;
          margin-right: 8px;
          color: rgba(153, 153, 153, 1);
        }
        .name {
          font-size: 16px;
          color: #666;
          margin-right: 40px;
        }
        .number-b {
          color: rgba(51, 51, 51, 1);
        }
        .number-r {
          color: rgba(202, 48, 58, 1);
        }
      }
    }
    .quick-link {
      margin-top: 60px;
      background-color: #fcfcfc;
      ul.link-list {
        padding: 0 20px 22px 30px;
        margin: 0;
        list-style: none;
        width: 67%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
          // display: inline-block;
          height: 40px;
          // margin-right: 50px;
          padding: 5px 10px;
          .link {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
          .svg-icon {
            font-size: 26px;
            color: #999;
            margin-right: 5px;
          }
          .title {
            height: 30px;
            line-height: 30px;
            width: 64px;
            font-size: 16px;
            color: rgba(102, 102, 102, 1);
          }
        }
        li:hover {
          background-color: #eee;
        }
      }
    }
  }

  .new-data {
    // .new-data-title {
    //   padding: 30px 20px;
    //   // border-bottom: 1px solid #eeeeee;
    //   font-size: 24px;
    // }
    .time-range {
      padding: 24px 30px;
      text-align: right;
      // border-bottom: 1px solid #eeeeee;
      .active {
        border: 1px solid #c20000;
        color: #c20000;
      }
    }
    .data-item {
      margin-left: 30px;
      display: inline-block;
      padding: 15px 0 20px 0;
      text-align: left;
      .number-b {
        color: $menuTitleColor;
        font-size: 48px;
      }
      .number-r {
        color: $themeColor;
        font-size: 48px;
      }
      .name {
        color: $menuFontColor;
        font-size: 16px;
        // margin-top: 15px;

        margin-bottom: 10px;
      }
      .data-wrap {
        margin-top: 30px;
        color: $menuIconColor;
        font-size: 14px;
      }
    }
  }
  .collection-member {
    // .collection-member-title {
    //   padding: 30px 20px;
    //   font-size: 24px;
    //   text-align: left;
    // }
    .time-range {
      padding: 24px 30px;
      text-align: right;
      .active {
        border: 1px solid #c20000;
        color: #c20000;
      }
    }
    .chart-box-line {
      margin: 0 30px;
      width: calc(100% - 60px);
      min-height: 500px;
      .chart-line {
        width: 100%;
        min-height: 500px;
      }
    }
  }

  // @media screen and(min-width: 1280px) {
  //   .shop-info-wrap {
  //     padding-left: 40px;
  //     padding-right: 40px;
  //   }
  // }
  // .shop-info-wrap {
  //   .shop-logo {
  //     margin-bottom: 30px;
  //   }
  //   .title {
  //     display: inline-block;
  //     vertical-align: top;
  //     color: $menuTitleColor;
  //     font-size: 14px;
  //     font-weight: 600;
  //     margin-bottom: 16px;
  //   }
  //   .shop-item {
  //     display: flex;
  //     flex-direction: row;
  //     justify-content: space-between;
  //   }
  //   .shop-introduction {
  //     display: flex;
  //     flex-direction: row;
  //     .title {
  //       min-width: 75px;
  //     }
  //   }
  //   .code-wrap {
  //     padding-top: 40px;
  //     .code-item {
  //       display: flex;
  //       justify-content: center;
  //       .code {
  //         display: flex;
  //         flex-direction: column;
  //         justify-content: center;
  //         align-items: center;
  //         width: 240px;
  //         height: 287px;
  //         span {
  //           margin-top: 10px;
  //           font-size: 16px;
  //           color: $menuTitleColor;
  //         }
  //       }
  //     }
  //   }
  // }
  .addShops {
    text-align: center;
  }
}
</style>
