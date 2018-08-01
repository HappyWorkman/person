<template>
  <div class="app-container">
    <!-- <div class="layer handel-panel" style="background:red;">

    </div> -->
    <div class="layer handel-panel">
      <!-- id="header" :class="true?'isFixed':''" -->
      <el-row :gutter="10" type="flex">
        <el-col class="filter-panel" :xs="20" :sm="20" :md="14" :lg="14">
          <el-select v-model="param.status" placeholder="订单状态" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="待支付" value="unpaid"></el-option>
            <el-option label="待发货" value="unshipped"></el-option>
            <el-option label="已发货" value="shipped"></el-option>
            <el-option label="待评价" value="unreviewed"></el-option>
            <el-option label="退款/售后" value="aftersalesorreturn"></el-option>
            <el-option label="交易关闭" value="close"></el-option>
            <el-option label="交易成功" value="success"></el-option>
          </el-select>
          <el-date-picker v-model="param.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col class="search-panel" :xs="4" :sm="4" :md="10" :lg="10">
          <el-input v-model="param.word" placeholder="订单号/联系电话/下单人" style="width:250px;"></el-input>
          <el-button type="danger" @click="search">搜索</el-button>
          <el-button @click="exportOrderList">导出订单</el-button>
        </el-col>
      </el-row>
      <div class="table-header">
        <div class="auto-panel">
          <div class="table-field">商品</div>
        </div>
        <div class="fixed-panel">
          <div class="table-field" style="width:60px">数量</div>
          <div class="table-field" style="width:90px">订单状态</div>
          <div class="table-field" style="width:120px">买家信息</div>
          <div class="table-field" style="width:120px">实收付款</div>
          <div class="table-field" style="width:80px">收入</div>
          <div class="table-field" style="width:120px">操作</div>
        </div>
      </div>
    </div>
    <ul class="order-list" v-loading="loading">
      <li class="layer order-item" v-for="(order,index) in orderList" :key="index">
        <div class="order-header">
          <div class="order-sn">单号：{{order.sn}}</div>
          <div>下单时间：{{order.createDate|parseTime}}</div>
          <!-- <el-button class="btn-delete-order"  icon="el-icon-delete">11111</el-button> -->
        </div>
        <div class="product-list">
          <el-table :data="order.productlist" border style="width: 100%" :show-header="false" :span-method="objectSpanMethod">
            <el-table-column label="商品">
              <template slot-scope="scope">
                <div class="product-info">
                  <div class="p-img">
                    <img :src="scope.row.thumbnail" />
                  </div>
                  <div class="p-content">
                    <div class="p-name"> {{ scope.row.name }}</div>
                    <div class="p-spe"> {{ scope.row.productSpecificationStr }}</div>
                    <div class="p-price">供货价 ￥{{ scope.row.yjiaSupplyPrice }} 销售价 ￥{{ scope.row.distributionPrice }} </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="60">
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="90">
            </el-table-column>
            <el-table-column label="买家信息" width="120">
              <template slot-scope="scope">
                <div>{{ scope.row.consignee }}</div>
                <div>{{ scope.row.phone }}</div>
              </template>
            </el-table-column>
            <el-table-column label="实收付款" width="120">
              <template slot-scope="scope">
                <div>￥{{ scope.row.amount }}</div>
                <div v-if="scope.row.freight=='0'">免运费</div>
                <div v-else>(运费:{{ scope.row.freight}})</div>
              </template>
            </el-table-column>
            <el-table-column label="收入" width="80">
              <template slot-scope="scope">￥{{ scope.row.incomeTotal }}</template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <router-link :to="{path:'detail',query: {oid:order.sn}}">
                  <el-button type="text" size="small" style="width:70px;">查看详情</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </li>
    </ul>
    <!-- <el-container class="app-container">
      <scroll-bar class="">
        <el-main class="edit-panel">
          <ul class="order-list" v-loading="loading">
            <li class="layer order-item" v-for="(order,index) in orderList" :key="index">
              <div class="order-header">
                <el-checkbox></el-checkbox>
                <div class="order-sn">单号：{{order.sn}}</div>
                <div>下单时间：{{order.createDate|parseTime}}</div>
                <el-button class="btn-delete-order"  icon="el-icon-delete"></el-button>
              </div>
              <div class="product-list">
                <el-table :data="order.productlist" border style="width: 100%" :show-header="false" :span-method="objectSpanMethod">
                  <el-table-column label="商品">
                    <template slot-scope="scope">
                      <div class="product-info">
                        <div class="p-img">
                          <img :src="scope.row.thumbnail" />
                        </div>
                        <div class="p-content">
                          <div class="p-name"> {{ scope.row.name }}</div>
                          <div class="p-spe"> {{ scope.row.productSpecificationStr }}</div>
                          <div class="p-price">供货价 ￥{{ scope.row.yjiaSupplyPrice }} 销售价 ￥{{ scope.row.distributionPrice }} </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="quantity" label="数量" width="60">
                  </el-table-column>
                  <el-table-column prop="status" label="订单状态" width="90">
                  </el-table-column>
                  <el-table-column label="买家信息" width="120">
                    <template slot-scope="scope">
                      <div>{{ scope.row.consignee }}</div>
                      <div>{{ scope.row.phone }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="实收付款" width="120">
                    <template slot-scope="scope">
                      <div>￥{{ scope.row.amount }}</div>
                      <div>(运费:{{ scope.row.freight+'' }})</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="收入" width="80">
                    <template slot-scope="scope">￥{{ scope.row.incomeTotal }}</template>
                  </el-table-column>
                  <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                      <router-link :to="{path:'detail',query: {oid:order.sn}}">
                        <el-button type="text" size="small">查看详情</el-button>
                      </router-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </li>
          </ul>
        </el-main>
      </scroll-bar>
    </el-container> -->
    <div class="pagination-panel" v-if="pages.totalPages>1">
      <el-pagination @current-change="pageChange" layout="prev, pager, next" :page-size="pages.pageSize" :current-page="pages.pageNum" :page-count="pages.totalPages">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import ScrollBar from '@/components/ScrollBar';
import { getOrderList, getExportOrderList } from '@/api/order';
import { formatTime } from '@/utils/index';
import { getToken } from '@/utils/auth';

export default {
  name: 'order',
  data() {
    return {
      scrollTop:'',
      loading: false,
      param: {
        word: '',
        status: '',
        date: []
      },
      pages: {
        total: null,
        totalPages: null,
        pageNum: 1,
        pageSize: 20
      },
      firstQueryDate: null,

      tableData: [],
      orderList: []
    };
  },
  created() {
    var data = {
      pageNum: this.pages.pageNum,
      pageSize: this.pages.pageSize
    };
    if (this.$route.params && this.$route.params.status) {
      this.param.status = this.$route.params.status;
      data.status = this.$route.params.status;
    }
    this.search(data);
  },
  mounted() {
    // this.exportOrderList({
    //   status:this.param.status,
    //   word:this.param.word,
    //   startTime:'',
    //   endTime:''
    // })
    window.addEventListener('scroll',this.handleScroll);
  },
  components: {
    ScrollBar
  },
  methods: {
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let headerTop = document.getElementById('header');
      console.log(scrollTop);
      if (scrollTop > 140) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    search(param) {
      param = param || {};
      this.loading = true;
      if (this.param.word != '') param.word = this.param.word;
      if (this.param.status != '') param.status = this.param.status;
      if (this.param.date && this.param.date.length != 0) {
        param.startTime = this.param.date[0].getTime();
        param.endTime = this.param.date[1].getTime();
      }
      getOrderList({
        ...param,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }).then(res => {
        this.loading = false;
        if (res.code === '0') {
          var data = res.data;

          this.firstQueryDate = data.firstQueryDate;
          this.pages.total = data.total;
          this.pages.totalPages = data.totalPages;
          this.orderList = data.data.map(item => {
            var orderinfo = item;
            var productlist = [];
            var shippinglist = [];

            item.orderDtoList &&
              item.orderDtoList.forEach(store => {
                // 商品总数 供合并列使用
                var proCount = 0;
                //统计未发货订单商品数量
                if (store.orderItemDtoList) {
                  proCount += store.orderItemDtoList.length;
                }
                if (store.shippingDtoList) {
                  store.shippingDtoList.forEach(product => {
                    //统计已发货订单商品数量
                    proCount += product.shippingItemDtos.length;

                    product.shippingItemDtos.forEach((shipingitem, index) => {
                      shipingitem.amount = item.amount;
                      shipingitem.status = product.statusShow;
                      shipingitem.freight = item.freight;
                      shipingitem.incomeTotal = item.incomeTotal;
                      shipingitem.consignee = item.consignee;
                      shipingitem.phone = item.phone;
                      //合并列配置

                      shipingitem.rowspanArr = [
                        1,
                        1,
                        index % product.shippingItemDtos.length === 0
                          ? product.shippingItemDtos.length
                          : 0,

                        index % proCount === 0 ? proCount : 0,
                        index % proCount === 0 ? proCount : 0,
                        index % proCount === 0 ? proCount : 0,
                        index % proCount === 0 ? proCount : 0
                      ];
                      shippinglist.push(shipingitem);
                    });
                  });
                }

                store.orderItemDtoList &&
                  store.orderItemDtoList.forEach((product, index) => {

                    product.amount = item.amount;
                    product.status = store.status;
                    product.freight = item.freight;
                    product.incomeTotal = item.incomeTotal;
                    product.consignee = item.consignee;
                    product.phone = item.phone;
                    //合并列配置
                    product.rowspanArr = [
                      1,
                      1,
                      index % store.orderItemDtoList.length === 0
                        ? store.orderItemDtoList.length
                        : 0,
                      index % proCount === 0 ? proCount : 0,
                      index % proCount === 0 ? proCount : 0,
                      index % proCount === 0 ? proCount : 0,
                      index % proCount === 0 ? proCount : 0
                    ];
                    productlist.push(product);
                  });
              });
            orderinfo.productlist = [...shippinglist, ...productlist];
            return orderinfo;
          });
        }
      });
    },
    exportOrderList() {
      // debugger;
      let token = getToken();
      // console.log(token);
      let status = this.param.status;
      let word = this.param.word;
      let startTime = '';
      let endTime = '';
      if (this.param.date.length != 0) {
        startTime = this.param.date[0].getTime();
        endTime = this.param.date[1].getTime();
      }
      window.location.href = getExportOrderList(
        token,
        status,
        word,
        startTime,
        endTime
      );
    },
    pageChange(pageNum) {
      this.pages.pageNum = pageNum;
      var data = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      };
      this.search(data);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      return {
        rowspan: row.rowspanArr[columnIndex],
        colspan: 1
      };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
// .app-container {
//   // color: #333;
//   height: 100%;
//   // height: calc(100% - 85px);
//   // overflow: hidden;
//   // text-align: center;
//   margin-top: 150px;
//   // .screen-view {
//   //   height: calc(100% - 180px);
//   // }
//   // .aside-panel,
//   // .el-aside {
//   //   text-align: left;
//   //   width: 25% !important;
//   //   min-width: 225px;
//   //   max-width: 340px;
//   // }
//   // .el-collapse {
//   //   padding: 23px 20px;
//   // }
// }
// .el-main {
//   padding: 0 10px 100px 10px;
//   overflow: hidden;
//   width: 100%;
//   margin: 0 auto;
//   text-align: left;
//   // .wx-header {
//   //   text-align: center;
//   //   font-size: 19px;
//   //   width: 400px;
//   //   height: 69px;
//   //   line-height: 69px;
//   //   background-color: #ffffff;
//   //   color: #333333;
//   // }
//   // .footer {
//   //   // height: 500px;
//   // }
// }
#header {
  // background: red;
  width: calc(100% - 317px);
  position: fixed;
  top: 105px;
  z-index: 999;
  // margin-bottom: 40px;
}
.handel-panel {
  padding: 40px;
  background-color: white;
  .filter-panel {
    padding: 0;
    text-align: left;
    font-size: 0;
    .el-select {
      width: 140px;
      margin-right: 10px;
    }
    .el-date-editor {
      width: 300px;
      .el-range-separator {
        padding: 0;
      }
    }
  }
  .search-panel {
    padding: 0;
    text-align: right;
    .el-input {
      width: calc(100% - 120px);
      max-width: 360px;
    }
    .el-button {
      width: 100px;
    }
  }
}

.isFixed {
  position: fixed;
  top: 105px;
  z-index: 4;
  // width: 80%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  margin-top: 40px;
  padding-top: 40px;
  color: #666;
  .table-field {
    padding: 0 12px;
  }
  .fixed-panel {
    display: flex;
  }
}

.order-list {
  list-style: none;
  padding: 0;
  margin: 0;
  // margin-top:246px;
  .order-item {
    background-color: white;

    .order-header {
      display: flex;
      align-items: center;
      padding: 30px 40px;
      position: relative;
      // border-bottom: 1px solid #eee;
      .order-sn {
        margin-right: 60px;
      }
      .btn-delete-order {
        position: absolute;
        right: 40px;
      }
    }
    .product-list {
      padding: 0 40px;
      text-align: center;
      padding-bottom: 20px;
      .product-info {
        display: flex;
        align-items: center;
        text-align: left;
        .p-spe {
          color: #999;
          font-size: 14px;
        }
        .p-img {
          min-width: 63px;
          max-width: 63px;
          height: 71px;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
    }
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
