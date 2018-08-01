<template>
  <div class="app-container">
    <div class="header layer">
      <!-- 数据概况 title -->
      <el-row class="header-box">
        <el-col :span="12" class="header-title">
          <h1>
            <svg-icon :icon-class="'data-status'"></svg-icon>&nbsp;数据概况</h1>
        </el-col>
        <el-col :span="12" class="header-title time-range">
          <!-- <el-button :class="{active:time==1}" @click="switchTab(1)">今天</el-button> -->
          <el-button :class="{active:type=='7'}" @click="switchTab('7')">近7天</el-button>
          <el-button :class="{active:type=='30'}" @click="switchTab('30')">近30天</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="collection-member layer">
      <el-row>
        <el-col class="collection-member-title">关键指标</el-col>
        <el-col :span="24" class="amount-list" v-if="keyIndexInfo">
          <el-col :span="4" class="amount-box">
            <div class="amount-total">
              <span>{{keyIndexInfo.visitorVolume|numberFormat}}</span>
            </div>
            <div class="amount-type">访客量</div>
            <div class="amount-describe">较前一日
              <span>{{keyIndexInfo.visitorVolumePercentage.replace('-','')}}%</span>
              <i class="el-icon-sort-down" v-if="keyIndexInfo.visitorVolumePercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>

          <el-col :span="4" class="amount-box">
            <div class="amount-total">
              <span>{{keyIndexInfo.soldGoods|numberFormat}}</span>
            </div>
            <div class="amount-type">出售商品</div>
            <div class="amount-describe">较前一周
              <span>{{keyIndexInfo.soldGoodsPercentage.replace('-','')}}%</span>
              <i class="el-icon-sort-down" v-if="keyIndexInfo.soldGoodsPercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>

          <el-col :span="4" class="amount-box">
            <div class="amount-total">
              <span>{{keyIndexInfo.orderNumber|numberFormat}}</span>
            </div>
            <div class="amount-type">订单数</div>
            <div class="amount-describe">较前一月
              <span>{{keyIndexInfo.orderNumberPercentage.replace('-','')}}%</span>
              <i class="el-icon-sort-down" v-if="keyIndexInfo.orderNumberPercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>

          <el-col :span="6" class="amount-box">
            <div class="amount-total">
              <span class="red">{{keyIndexInfo.transactionAmount|numberFormat}}</span>
            </div>
            <div class="amount-type">交易额</div>
            <div class="amount-describe">较前一日
              <span>{{keyIndexInfo.transactionAmountPercentage.replace('-','')}}%</span>
              <i class="el-icon-sort-down" v-if="keyIndexInfo.transactionAmountPercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>

          <el-col :span="6" class="amount-box">
            <div class="amount-total">
              <span class="red">{{keyIndexInfo.income|numberFormat}}</span>
            </div>
            <div class="amount-type">收入</div>
            <div class="amount-describe">较前一日
              <span>{{keyIndexInfo.incomePercentage.replace('-','')}}%</span>
              <i class="el-icon-sort-down" v-if="keyIndexInfo.incomePercentage.includes('-')"></i>
              <i class="el-icon-sort-up red" v-else></i>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <div class="collection-member layer">
      <el-row>
        <el-col class="collection-member-title">趋势图</el-col>
        <el-col class="chart-box-line">
          <div id="sevenData" class="chart-line"></div>
        </el-col>
      </el-row>
    </div>
    <div class="header layer">
      <!-- 客户看板 title -->
      <el-row class="header-box">
        <el-col :span="24" class="header-title">
          <h1>
            <svg-icon :icon-class="'earnings'"></svg-icon>&nbsp;客户看板</h1>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="collection-member-title-ref">成交客户</el-col>
        <el-col class="chart-box-pie">
          <div id="tradingVolume" class="chart-pie"></div>
          <div id="tradingPeople" class="chart-pie"></div>
        </el-col>
      </el-row>
    </div>
    <div class="header layer">
      <!-- 商品看板 title -->
      <el-row class="header-box">
        <el-col :span="12" class="header-title">
          <h1>
            <svg-icon :icon-class="'pi-chart'"></svg-icon>&nbsp;商品看板</h1>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="collection-member-title-ref">售出商品</el-col>
        <el-col :span="10" class="chart-box-line">
          <div id="saleGoods" class="chart-line"></div>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="collection-member layer response">
        <el-row>
            <el-col class="collection-member-title">TOP10访问排行</el-col>
            <el-table :data="visitList" class="goods-list">
                <el-table-column label="商品">
                    <template slot-scope="scope" min-width="200">
                        <div class="goods-name">
                            <img class="goods-img" :src="scope.row.imgUrl">
                            <label>{{scope.row.productName}}</label>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="访客数" width="120"></el-table-column>
                <el-table-column prop="conversionRate" label="单品转化率" width="120"> </el-table-column>
            </el-table>
        </el-row>
    </div> -->
    <!-- <div class="collection-member layer response">
      <el-row>
        <el-col class="collection-member-title">TOP10付款排行</el-col>
        <el-col class="el-table-area">
          <el-table :data="payList" class="goods-list">
            <el-table-column label="商品" class-name="goods-td">
              <template slot-scope="scope" min-width="200">
                <div class="goods-name">
                  <img class="goods-img" :src="scope.row.img">
                  <label>{{scope.row.productName}}</label>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="付款件数" width="120"></el-table-column>
            <el-table-column prop="price" label="付款金额" width="120"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div> -->
  </div>
</template>

<script>
import {
  latestData,
  trendMap,
  transaction_customer,
  sellProduct,
  productPaymentTop
  // getTop10Visiting
} from '@/api/collection';
import echarts from 'echarts';
import request from '@/utils/request';
const types = {
  '7': 'week',
  '30': 'month'
};
export default {
  data() {
    return {
      dialogTableVisible: false,
      // keyIndexInfo:null,
      keyIndexInfos: [],
      gridData: [],
      type: '7',
      visitList: [],
      payList: [],
      echartPieMoney: null,
      echartPieClient: null,
      echartTendency: null,
      echartSold: null
    };
  },
  computed: {
    keyIndexInfo() {
      if (this.keyIndexInfos.length == 3)
        return this.keyIndexInfos[this.type == '7' ? 1 : 2];
      else return null;
    }
  },
  filters: {
    numberFormat(num) {
      let nStr = num + '',
        x = nStr.split('.'),
        x1 = x[0],
        x2 = x.length > 1 ? '.' + x[1] : '',
        rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    }
  },
  created() {},
  mounted() {
    this.init();
    window.onresize = () => {
      this.echartTendency && this.echartTendency.resize();
      this.echartPieMoney && this.echartPieMoney.resize();
      this.echartPieClient && this.echartPieClient.resize();
      this.echartSold && this.echartSold.resize();
    };
  },
  methods: {
    //初始化
    init() {
      this.latestData();
      this.trendMap();
      this.transaction_customer();
      this.sellProduct();
      this.productPaymentTop();
      // this.getTop10Visiting();
    },
    switchTab(tab) {
      this.type = tab;
      this.init();
    },
    // 获取关键指标
    latestData() {
      latestData()
        .then(res => {
          if (res.code == 0) {
            this.keyIndexInfos = res.data || [];
          } else throw res;
        })
        .catch(err => {
          this.$message.error(res.msg || '请求关键指标出错, 请稍后再试!');
        });
    },
    //获取趋势图近七日数据
    trendMap() {
      trendMap({ type: this.type })
        .then(res => {
          if (res.code == 0) {
            const echartTendency = {
              xAxisDatas: JSON.parse(res.data.xAxisData),
              statisticalDimensionDatas: JSON.parse(res.data.trandName),
              echartsMultiSeriesDatas: JSON.parse(res.data.trandDatas).map(
                t => {
                  t.type = 'line';
                  return t;
                }
              )
            };
            this.echartTendency = this.createEchartLine(
              'sevenData',
              `近${this.type}日数据`,
              echartTendency
            );
          } else
            this.$message.error(res.msg || '请求近七日数据出错, 请稍后再试!');
        })
        .catch(err => {
          this.$message.error('请求近七日数据出错, 请稍后再试!');
        });
    },
    // 成交客户
    transaction_customer() {
      transaction_customer({ type: this.type })
        .then(res => {
          if (res.code == 0) {
            const echartPieMoney = {
              statisticalDimensionDatas: [
                '新成交客户付款金额',
                '老成交客户付款金额'
              ],
              echartsSingleSeriesDatas: [
                {
                  name: '新成交客户付款金额',
                  value: res.data.newPrice
                },
                {
                  name: '老成交客户付款金额',
                  value: res.data.price
                }
              ]
            };
            const echartPieClient = {
              statisticalDimensionDatas: [
                '新成交客户付款金额',
                '老成交客户付款金额'
              ],
              echartsSingleSeriesDatas: [
                {
                  name: '新成交客户付款金额',
                  value: res.data.newMember
                },
                {
                  name: '老成交客户付款金额',
                  value: res.data.member
                }
              ]
            };
            this.echartPieMoney = this.createEchartPie(
              'tradingVolume',
              '成交金额占比',
              echartPieMoney,
              ['#FC666C', '#586BEA']
            );
            this.echartPieClient = this.createEchartPie(
              'tradingPeople',
              '成交人数占比',
              echartPieClient,
              ['#48965F', '#F3DF68']
            );
          } else throw res;
        })
        .catch(err => {
          this.$message.error(err.msg || '请求成交金额占比出错, 请稍后再试!');
        });
    },
    //售出商品
    sellProduct() {
      sellProduct({ type: this.type })
        .then(res => {
          if (res.code == 0) {
            // let echartSold=res.data;
            const echartSold = {
              xAxisDatas: res.data.xAxisData,
              statisticalDimensionDatas: res.data.productGroupName,
              echartsMultiSeriesDatas: res.data.productGroupData.map(t => {
                t.type = 'line';
                return t;
              })
            };
            this.echartSold = this.createEchartLine(
              'saleGoods',
              '按分类统计',
              echartSold
            );
          } else
            this.$message.error(res.msg || '请求售出商品出错, 请稍后再试!');
        })
        .catch(err => {
          this.$message.error('请求售出商品出错, 请稍后再试!');
        });
    },

    //获取top10访问排行
    // getTop10Visiting(){
    //     getTop10Visiting().then(res=>{
    //         if(res.code==0){
    //             this.visitList=res.data;
    //         }else
    //             this.$message.error(res.msg||'请求TOP10访问排序出错, 请稍后再试!');
    //     }).catch(err=>{
    //         this.$message.error('请求TOP10访问排序出错, 请稍后再试!');
    //     })
    // },
    //获取top10付款排行
    productPaymentTop() {
      productPaymentTop({ type: this.type })
        .then(res => {
          if (res.code == 0) {
            this.payList = res.data;
          } else throw res;
        })
        .catch(err => {
          this.$message.error(err.msg || '请求TOP10付款排序出错, 请稍后再试!');
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
            trigger: 'axis'
          },
          legend: {
            data: legendList.map(name => ({ icon: 'circle', name })),
            bottom: 10,
            left: 80,
            align: 'left'
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
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f0f0f0',
                type: 'dashed'
              }
            }
          },
          series: dataList.map(d => ({
            name: d.name,
            type: d.type,
            data: d.data,
            lineStyle: {
              type: 'dashed',
              width: 1
            },
            markLine: {
              silent: true
            }
          }))
        };
      myChart.setOption(options);
      return myChart;
    },
    // 生成饼图图表
    createEchartPie(elementId, title, chartInfo, color) {
      let {
          statisticalDimensionDatas: legendList,
          echartsSingleSeriesDatas: dataList
        } = chartInfo,
        myChart = echarts.init(document.getElementById(elementId)),
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
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            bottom: 0,
            data: legendList.map(name => ({ icon: 'circle', name }))
          },
          grid: {
            top: 0,
            bottom: '30%',
            containLabel: true
          },
          series: [
            {
              name: title,
              type: 'pie',
              radius: ['36%', '64%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: dataList
            }
          ]
        };
      color && Object.assign(options, { color });
      myChart.setOption(options);
      return myChart;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.link {
  font-size: 12px;
  float: right;
  line-height: 55px;
}

.app-container {
  padding: 20px;
  height: 100%;
  .header {
    .header-box {
      padding-bottom: 10px;
      .header-title {
        padding: 40px 30px 0;
        &.time-range {
          padding: 60px 30px 0;
          text-align: right;
          .active {
            border: 1px solid #c20000;
            color: #c20000;
          }
        }
      }
    }
  }
  .collection-member {
    position: relative;
    &-title {
      font-size: 24px;
      border-bottom: 1px solid #f0f0f0;
      padding: 40px 30px 30px;
      &-ref {
        border-bottom: 1px solid #f0f0f0;
        font-size: 24px;
        padding: 0 30px 30px;
      }
    }
    @media screen and (min-width: 1281px) {
      &.response {
        float: left;
        width: calc(50% - 10px);
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
          margin-left: 10px;
        }
      }
    }
    .el-table-area {
      padding: 30px;
      background: #fff;
      .goods-list {
        .goods-td {
          color: red;
        }
        .goods {
          &-name {
            display: inline-flex;
            .goods-img {
              width: 64px;
              height: 64px;
              min-width: 64px;
              margin-right: 10px;
            }
          }
        }
      }
    }

    .amount {
      &-list {
        padding: 20px 30px;
      }
      &-box {
        text-align: center;
      }
      &-type {
        font-size: 16px;
      }
      &-describe {
        font-size: 14px;
        padding-top: 30px;
      }
      &-total {
        font-size: 30px;
        line-height: 40px;
      }
    }
    .chart {
      &-title {
        padding: 30px;
        color: #666;
        font-size: 14px;
      }
    }
  }
  .chart-box-line {
    margin: 30px;
    width: calc(100% - 60px);
    min-height: 500px;
    .chart-line {
      width: 100%;
      min-height: 500px;
    }
  }
  .chart-box-pie {
    margin: 30px;
    width: calc(100% - 60px);
    min-height: 300px;
    .chart-pie {
      float: left;
      width: 50%;
      min-height: 300px;
    }
  }
  .body {
    padding: 30px;
    .body-title {
      .table-title {
        float: left;
        font-size: 24px;
        font-weight: normal;
      }
    }
  }
}
</style>
