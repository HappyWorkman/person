<template>
  <div class="app-container">
    <div class="layer order-status">
      <div>
        <svg-icon icon-class="tree" />
        <span>{{orderInfo.status}}</span>
      </div>
      <!-- <div class="order-time">{{}}</div> -->
    </div>
    <div class="layer order-info">
      <div class="title">订单详情</div>
      <div class="info-panel">
        <div class="field-panel">
          <div class="field-item">
            <span>订单编号：</span>{{orderInfo.sn}}</div>
          <div class="field-item">
            <span>支 付 号：</span>{{orderInfo.paymentSn}}</div>
          <div class="field-item">
            <span>支付方式：</span>{{orderInfo.paymentPluginName||'微信支付'}}</div>
        </div>
        <div class="field-panel">
          <div class="field-item">
            <span>下单时间：</span>{{orderInfo.createDate |parseTime}}</div>
          <div class="field-item">
            <span>支付时间：</span>{{orderInfo.payDate|parseTime}}</div>
        </div>
        <div class="field-panel space-between">
          <div class="field-item">
            <span>商品合计：</span>{{orderInfo.amount|currency('￥')}}</div>
          <div class="field-item">
            <span>运费：</span>{{orderInfo.freight|currency('￥')}}</div>
          <div class="field-item">
            <span>优惠券：</span>-{{orderInfo.couponDiscount|currency('￥')}}</div>
          <div class="field-item">
            <span>实付：</span>{{orderInfo.amountPaid|currency('￥')}}</div>
        </div>
      </div>
      <div class="user-info">
        <div class="user-base">
          <div>
            <span>收   件 人：</span>{{orderInfo.consignee}}</div>
          <div>
            <span>联系方式：</span>{{orderInfo.phone}}</div>
          <div>
            <span>总收入：</span>{{orderInfo.incomeTotal|currency('￥')}}</div>
        </div>
        <div class="user-addr">收货地址：{{orderInfo.address}}</div>
      </div>
    </div>
    <div class="order-list">
      <div class="order-item" v-for="(order,oindex) in orderList" :key="order.id">
        <div class="box-list" v-for="(box,bindex) in order.shippingDtoList" :key="box.id">
          <div class="order-header">
            <div class="title">
              <span class="name">仓库{{oindex+1}}（包裹{{bindex+1}}）</span>
              <span class="status">{{box.statusShow}}</span>
            </div>
            <div class="btn-group">
              <el-button class="btn-check" @click="getExpressData(box.sn)">查看物流</el-button>
            </div>
          </div>
          <div class="product-list">
            <el-table :data="box.shippingItemDtos" border style="width: 100%">
              <el-table-column label="商品">
                <template slot-scope="scope">
                  <div class="product-info">
                    <div class="p-img">
                      <img :src="scope.row.thumbnail" />
                    </div>
                    <div class="p-content">
                      <div class="p-name"> {{ scope.row.name }}</div>
                      <div class="p-spe"> {{ scope.row.productSpecificationStr }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单价" width="80">
                <template slot-scope="scope">￥{{ scope.row.distributionPrice }}</template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" width="60">
              </el-table-column>
              <el-table-column label="实付" width="80">
                <template slot-scope="scope">
                  <div>￥{{ scope.row.priceTotal }}</div>
                </template>
              </el-table-column>
              <el-table-column label="收入" width="80">
                <template slot-scope="scope">￥{{ scope.row.profitPriceTotal }}</template>
              </el-table-column>
            </el-table>
          </div>

        </div>

      </div>
      <div class="layer order-item" v-if="productList.length>0">
        <div class="box-list">
          <div class="order-header">
            <div class="title">
              <span class="name">仓库中</span>
              <span class="status" v-if="orderInfo.paymentSn">待发货</span>
            </div>
          </div>
          <div class="product-list">
            <el-table :data="productList" border style="width: 100%">
              <el-table-column label="商品">
                <template slot-scope="scope">
                  <div class="product-info">
                    <div class="p-img">
                      <img :src="scope.row.thumbnail" />
                    </div>
                    <div class="p-content">
                      <div class="p-name"> {{ scope.row.name }}</div>
                      <div class="p-spe"> {{ scope.row.productSpecificationStr }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="yjiaSupplyPrice" label="供货价" width="80"></el-table-column>
              <el-table-column prop="distributionPrice" label="销售价" width="80">
              </el-table-column>
              <el-table-column prop="quantity" label="数量" width="60">
              </el-table-column>
              <el-table-column label="实付" width="120">
                <template slot-scope="scope">
                  <div>￥{{ scope.row.priceTotal||0}}</div>
                </template>
              </el-table-column>
              <el-table-column label="收入" width="80">
                <template slot-scope="scope">￥{{ scope.row.profitPriceTotal||0 }}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="追踪物流" :visible.sync="dialogExpressVisible" top='10vh'>
      <div class="express-base">
        <div class="express-icon">
          <svg-icon icon-class="tree" />
        </div>
        <div class="express-info">
          <div>物流公司:{{currentExpressData.deliveryCorp}}</div>
          <div>快递单号:{{currentExpressData.trackingNo}}</div>
        </div>
      </div>
      <div class="express-log">
        <ul>
          <li v-for="(item,index) in currentExpressData.expressList" :key="index">
            <div class="express-time">{{item.time}}</div>
            <svg-icon icon-class="tree" />
            <div class="express-status">{{item.status}}</div>
          </li>
        </ul>
        <div class="line"></div>
      </div>
      <!-- <div class="btn-group">
        <el-button type="danger" class="btn-close" @click="dialogExpressVisible=true">确定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { getOrderDetail, getOrderExpress } from '@/api/order';
// import { formatTime } from '@/utils/index';

export default {
  name: 'detail',
  data() {
    return {
      oid: this.$route.query.oid,
      orderInfo: {},
      productList: [],
      dialogExpressVisible: false,
      orderList: [],
      currentExpressData: {}
    };
  },
  created() {
    var oid = this.$route.query.oid;
    if (oid) {
      getOrderDetail(oid).then(res => {
        if (res.code === '0') {
          this.orderInfo = res.data;
          this.orderList = res.data.orderDtoList;
          res.data.orderDtoList.forEach(item => {
            if (item.orderItemDtoList) {
              item.orderItemDtoList.forEach(product => {
                this.productList.push(product);
              });
            }
          });
        }
      });
    }
  },
  methods: {
    getExpressData(oid) {
      getOrderExpress(oid).then(res => {
        this.dialogExpressVisible = true;
        if (res.code === '0') {
          this.currentExpressData = res.data;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.order-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 40px 40px 40px;
  font-size: 24px;
  color: #ca303a;
  .order-time {
    font-size: 16px;
    line-height: 24px;
    color: #666;
  }
}

.order-info {
  .title {
    padding: 60px 40px 40px 40px;
    border-bottom: 1px solid #eee;
  }
  .info-panel {
    padding: 40px 0 40px 40px;
    display: flex;
    .field-panel {
      border-bottom: 1px solid #eee;
      padding-right: 40px;
      width: 33%;
      &.space-between {
        .field-item {
          justify-content: space-between;
        }
      }
      .field-item {
        display: flex; // justify-content: space-between;
        margin-bottom: 28px;
        span {
          min-width: 6em;
        }
      }
    }
  }
  .user-info {
    font-size: 16px;
    color: #666;
    padding: 40px;
    .user-base {
      display: flex;
      justify-content: space-between;
    }
    .user-addr {
      margin-top: 30px;
    }
  }
}

.order-item {
  .order-header {
    padding: 60px 40px 40px 40px;
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: #333;
    .title {
      .name {
      }
      .status {
        font-size: 16px;
        color: #ca303a;
      }
    }
    .btn-group {
      font-size: 16px;
      color: #ca303a;
    }
  }
  .product-list {
    padding: 0px 40px 40px 40px;
    margin-top: -1px;
    text-align: center;
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

.express-base {
  display: flex;
  .express-icon {
    width: 80px;
    height: 80px;
    border-radius: 100%;
    background-color: #ccc;
    font-size: 50px;
    text-align: center;
    line-height: 80px;
  }
  .express-info {
    padding: 18px;
  }
}
.express-log {
  // padding-top: 40px;
  // padding-left: 8px;
  position: relative;
  top: 40px;
  height: 550px;
  margin-bottom: 30px;
  .line {
    position: absolute;
    height: 90%;
    top: 50px;
    left: 8px;
    left: 137px;
    border-right: 3px dashed #eee;
    z-index: 9;
  }
  ul {
    @include clearfix;
    position: absolute;
    z-index: 10;
    top: 0px;
    left: 8px;
    height: 550px;
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: auto;
    // margin-bottom: 10px;
    li {
      display: flex;
      font-size: 16px;
      margin-bottom: 40px;
      .express-time {
        width: 90px;
        min-width: 90px;
        // margin-right: 80px;
      }
      .svg-icon {
        font-size: 20px;
        margin: 0 30px;
      }
      &:nth-child(1) {
        color: #ca303a;
      }
    }
  }
}
.btn-group {
  // margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}
</style>
