<template>
  <div class="app-container">
    <div class="header layer">
      <!-- 收益状况 title -->
      <el-row class="header-box">
        <el-col :span="24" class="header-title">
          <h1>
            <svg-icon :icon-class="'profit-status'"></svg-icon>&nbsp;收益状况</h1>
        </el-col>
        <el-col :span="24">
          <el-col :span="7" class="amount-box">
            <div class="amount-name">
              <span class="amount-type">已收入</span>
              <router-link :to="{name:'trade',params:{status:'success'}}" class="link">
                <div class="amount-detail">查看明细</div>
              </router-link>
            </div>
            <div class="amount-total">
              <span class="red">{{paidMoney|numberFormat}}</span>
            </div>
          </el-col>

          <el-col :span="7" class="amount-box">
            <div class="amount-name">
              <span class="amount-type">待入账</span>
              <router-link :to="{name:'trade',params:{status:'account'}}" class="link">
                <div class="amount-detail">查看明细</div>
              </router-link>
            </div>
            <div class="amount-total">
              <span>{{executable|numberFormat}}</span>
            </div>
          </el-col>

          <el-col :span="10" class="amount-box">
            <div class="amount-name">
              <span class="amount-type">可用余额</span>
              <router-link :to="{name:'withdraw'}" class="link">
                <div class="amount-detail">查看明细</div>
              </router-link>
            </div>
            <div class="amount-total">
              <span class="red">{{balance|numberFormat}}</span>
              <el-button type="primary" @click="gotoWithdraw" class="withdraw-deposit">提现</el-button>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </div>
    
    <el-main class="body layer">
      <el-row class="body-title">
        <span class="table-title">近期提现</span>
        <router-link :to="{name:'withdraw'}" class="link">查看更多</router-link>
      </el-row>
      <withdraw-list :withdraw-records="withdrawRecords"></withdraw-list>
    </el-main>
    <el-main class="body layer">
      <el-row class="body-title">
        <span class="table-title">近期交易</span>
        <router-link :to="{name:'trade'}" class="link">查看更多</router-link>
      </el-row>
      <trade-list :trade-records="tradeRecords"></trade-list>
    </el-main>
  </div>
</template>

<script>
import {
  getTradeRecords,
  getWithdrawRecords,
  getProfitStatus
} from '@/api/finance';
import TradeList from '@/components/TradeList';
import WithdrawList from '@/components/WithdrawList';
export default {
  data() {
    return {
      tradeRecords: [],
      withdrawRecords: [],
      gridData: [],
      paidMoney: 0,
      executable: 0,
      balance: 0
    };
  },
  components: { TradeList, WithdrawList },
  computed: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status];
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getProfitStatus();
      this.getTradeRecords();
      this.getWithdrawRecords();
    },
    gotoWithdraw() {
      this.$router.push({ name: 'withdrawApply' });
    },
    getTradeRecords() {
      getTradeRecords({
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        if (res.code == 0) {
          this.tradeRecords = res.data.data;
        }
      });
    },
    getWithdrawRecords() {
      getWithdrawRecords({
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        if (res.code == 0) {
          this.withdrawRecords = res.data.data;
        }
      });
    },
    getProfitStatus() {
      getProfitStatus().then(res => {
        if (res.code == '0') {
          this.paidMoney = res.data.paidMoney;
          this.balance = res.data.balance;
          this.executable = res.data.executable;
        }
      });
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
  // background-color: #f5f5f5;
  // padding: 20px;
  height: 100%;
  .header {
    .header-box {
      .header-title {
        padding: 40px 30px 0;
        border-bottom: 1px solid #f0f0f0;
      }
      .amount-box {
        padding: 20px 30px;
        .amount-name {
          padding: 10px 0;
          .amount-type {
            font-size: 24px;
          }
          .amount-detail {
            color: #999;
            font-size: 12px;
            float: right;
            line-height: 20px;
          }
        }
        .amount-total {
          font-size: 50px;
          line-height: 70px;
          .withdraw-deposit {
            font-size: 12px;
            padding: 10px 20px;
            line-height: 12px;
            border: 1px solid;
            position: absolute;
            bottom: 30px;
            right: 30px;
          }
        }
        .red {
          color: #c20000;
        }
      }
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
