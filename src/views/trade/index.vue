<template>
  <div class="app-container">
    <div class="header layer">
      <!-- 交易记录 title -->
      <el-row class="header-box">
        <div class="header-title">
          <h1>
            <svg-icon :icon-class="'trade-record'"></svg-icon>&nbsp;交易记录</h1>
        </div>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="交易号">
            <el-input v-model="searchForm.sn" placeholder="订单编号" size="small"></el-input>
          </el-form-item>
          <el-form-item label="买家">
            <el-input v-model="searchForm.member" placeholder="买家名称/手机号" size="small"></el-input>
          </el-form-item>
          <el-form-item label="商品信息">
            <el-input v-model="searchForm.product" placeholder="商品名称/商品ID" size="small"></el-input>
          </el-form-item>
          <!-- <el-form-item label="入账状态">
                    <el-select v-model="searchForm.status" placeholder="全部" size="small">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="已入账" value="already_executable"></el-option>
                    <el-option label="待入账" value="executable"></el-option>
                    <el-option label="异常" value="non_executable"></el-option>
                    </el-select>
                </el-form-item> -->
          <el-form-item label="结单时间">
            <el-date-picker size="small" v-model="searchForm.endDate" type="datetime" placeholder="订单完成时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="primary" @click="onSubmit" size="small">筛选</el-button>
            <el-button type="reset" @click="onReset" size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <el-main class="body layer">
      <el-tabs v-model="searchForm.status" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all">
          <trade-list :trade-records="tableData" v-loading="loading"></trade-list>
        </el-tab-pane>
        <el-tab-pane label="待入账" name="account">
          <trade-list :trade-records="tableData" v-loading="loading"></trade-list>
        </el-tab-pane>
        <el-tab-pane label="已入账" name="success">
          <trade-list :trade-records="tableData" v-loading="loading"></trade-list>
        </el-tab-pane>
      </el-tabs>
      <el-pagination style="text-align: right;margin-top: 30px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-main>
  </div>
</template>

<script>
import { getTradeRecords } from '@/api/finance';
import TradeList from '@/components/TradeList';

export default {
  data() {
    return {
      loading: false,
      searchForm: {
        sn: '',
        member: '',
        product: '',
        status: '',
        endDate: ''
      },
      tableData: [],
      activeName: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  components: { TradeList },
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
  created() {},
  mounted() {
    if (this.$route.params && this.$route.params.status != null) {
      this.searchForm.status = this.$route.params.status;
      this.handleClick({ name: this.$route.params.status });
    } else {
      this.handleClick();
    }
  },
  methods: {
    onSubmit() {
      this.getTradeRecords();
    },
    onReset() {
      this.searchForm = {
        sn: '',
        member: '',
        product: '',
        status: '',
        endDate: ''
      };
    },
    handleClick({ name } = { name: 'all' }) {
      this.searchForm.status = name;
      this.currentPage = 1;
      this.getTradeRecords();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.getTradeRecords();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getTradeRecords();
    },
    getTradeRecords() {
      if (this.loading) return;
      this.loading = true;
      let params = {};
      for (let key in this.searchForm) {
        this.searchForm[key] !== '' &&
          this.searchForm[key] !== 'all' &&
          (params[key] = this.searchForm[key]);
      }
      params.endDate && (params.endDate = +new Date(params.endDate));
      getTradeRecords(
        Object.assign(
          {},
          {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          },
          params
        )
      )
        .then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.tableData = res.data.data;
            this.total = res.data.total || 0;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>
<style  rel="stylesheet/scss" lang="scss">
.search-form {
  .el-form-item {
    margin-bottom: 10px;
    label {
      width: 68px;
    }
    .el-form-item__content {
      width: 140px;
    }
    .el-date-editor {
      width: 190px;
    }
    &.submit {
      margin-left: 70px;
      text-align: right;
      .el-form-item__content {
        width: 160px;
      }
    }
  }
}
.el-tabs__nav {
  > div {
    font-size: 24px;
    font-weight: normal;
  }
}
</style>
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
      .search-form {
        margin: 20px 30px;
        // display: inline-block;
        .submit {
          float: right;
          margin-right: -5px;
        }
      }
    }
  }
  .body {
    padding: 30px;
    .body-title {
      h3 {
        float: left;
      }
    }
  }
}
</style>
