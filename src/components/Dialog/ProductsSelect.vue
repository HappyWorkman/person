<template>
  <el-dialog title="添加商品" :visible.sync="visible" width="80%" :before-close="handleClose" top='8vh'>
    <div>
      <div class="d-header">
        <!-- <el-input v-if="!completeQuery" placeholder="商品关键字" @keydown.enter.native="fetchData()" v-model="keyword" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="fetchData()"></el-button>
        </el-input> -->
        <el-form :inline="true" :model="queryData">
          <el-form-item label="商品分组">
            <el-select v-model="queryData.groupid" placeholder="挑选分组" @change="fetchData()">
              <el-option v-for="item in categorys" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input size="medium" v-model="queryData.keyword" placeholder="请输入商品ID、名称"></el-input>
          </el-form-item>
          <el-form-item label="价格区间">
            <el-input style="width:120px;" size="medium" v-model="queryData.startDistributionPrice" placeholder="">
            </el-input> -
            <el-input style="width:120px;" size="medium" v-model="queryData.endDistributionPrice" placeholder="">
            </el-input>
          </el-form-item>

          <el-form-item label="销售状态" v-if="completeQuery">
            <el-select v-model="queryData.isMarketable" placeholder="挑选状态" @change="fetchData()">
              <el-option label="全部" value=""></el-option>
              <el-option label="已上架" value="true"></el-option>
              <el-option label="已下架" value="false"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item> -->
          <div class="btn-group">
            <el-button class="btn-query" @click="fetchData()">查询</el-button>
          </div>
          <!-- </el-form-item> -->
        </el-form>

      </div>
      <el-main>
        <el-table v-loading="loading" class="productlist-panel" :data="productList" style="width: 100%" border max-height=550>
          <el-table-column prop="sn" label="ID" width="100"></el-table-column>
          <el-table-column label="商品">
            <template slot-scope="scope">
              <div class="p-info">
                <img class="p-img" v-lazy="scope.row.listImage" :key="scope.row.listImage"/>
                <div style="margin-left: 10px">{{ scope.row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="distributionPrice" label="售价" width="80"></el-table-column>
          <el-table-column label="销售状态" width="80" align="center">
            <template slot-scope="scope">
              {{scope.row.marketable?'已上架':'已下架'}}
            </template>
          </el-table-column>
          <el-table-column prop="salesTotal" label="总销量" width="80"></el-table-column>

          <el-table-column prop="btn-group" label="操作" width="100">
            <template slot-scope="scope">
              <!-- -->
              <el-button class="btn-Bdel" type="text" v-if="isChecked(scope.row.sn)" @click="unSelect(scope.row)">{{pattern=='radio'?'已选择':'已添加'}}</el-button>
              <el-button class="btn-Badd" type="text" v-else @click="select(scope.row)">{{pattern=='radio'?'选择':'添加'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-panel" v-if="pages.totalCount>1">
          <el-pagination @current-change="storePageChange" layout="prev, pager, next" :page-size="pages.pageSize" :current-page="pages.pageNum" :page-count="pages.totalPages">
          </el-pagination>
        </div>
        <div class="dialog-footer" v-if="pattern=='submit'">
          <el-button style="width:100px;height:44px;" type="primary" @click="submit">确 定</el-button>
          <el-button style="width:100px;height:44px;" @click="handleClose">取 消</el-button>

        </div>
      </el-main>

    </div>

  </el-dialog>
</template>

<script>
import { getProductList } from '@/api/goods';
import { getGroupList } from '@/api/category';

export default {
  created() {},
  data() {
    return {
      loading: true,
      productList: [],
      // selected: [],
      loading: false,
      firstQueryDate: null,
      keyword: '',
      categorys: [
        { value: null, label: '全部' },
        { value: '1', label: '未分组' }
      ],
      queryData: {
        // isMarketable: '',
        // groupid: '',
        // keyword: ''
        // endDistributionPrice
        // startDistributionPrice
      },
      pages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 5
      },
      dialogVisible: true
    };
  },
  props: {
    visible: false,
    checked: {
      type: Array,
      defalut: []
    },
    limit: null,
    completeQuery: {
      type: Boolean,
      defalut: false
    },
    multiple: false,
    pattern: {
      type: String,
      default: 'radio'
    } // check radio submit
  },
  watch: {
    visible: function(newValue, oldValue) {
      if (newValue) {
        this.fetchData({
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize
        });
        // if (this.pattern == 'submit') {
        //   this.checked = this.checked;
        // }
        this.categorys = [];
        getGroupList().then(res => {
          if (res.code === '0') {
            this.categorys=[
              { value: null, label: '全部' },
              { value: '1', label: '未分组' }
            ],
            this.categorys.push(
              ...res.data.map(item => {
                return { value: item.id, label: item.name };
              })
            );
          }
        });
      }
    }
  },
  created() {
    // getGroupList().then(res => {
    //   if (res.code === '0') {
    //     this.categorys.push(
    //       ...res.data.map(item => {
    //         return { value: item.id, label: item.name };
    //       })
    //     );
    //   }
    // });
  },
  mounted() {
    // getGroupList().then(res => {
    //   if (res.code === '0') {
    //     this.categorys.push(
    //       ...res.data.map(item => {
    //         return { value: item.id, label: item.name };
    //       })
    //     );
    //   }
    // });
  },
  methods: {
    fetchData(param) {
      this.loading = true;
      param = param || {
        pageNum: this.pages.pageNum,
        // isMarketable: true,
        pageSize: this.pages.pageSize
      };
      if (this.completeQuery == false) param.isMarketable = true;

      if (this.queryData.keyword != null) param.word = this.queryData.keyword;

      if (
        this.queryData.isMarketable != null &&
        this.queryData.isMarketable != ''
      )
        param.isMarketable = this.queryData.isMarketable;
      if (this.queryData.groupid != null)
        param.productGroupId = this.queryData.groupid;

      if (this.queryData.endDistributionPrice != null)
        param.endDistributionPrice = this.queryData.endDistributionPrice * 1;
      if (this.queryData.startDistributionPrice != null)
        param.startDistributionPrice =
          this.queryData.startDistributionPrice * 1;
      getProductList(param).then(res => {
        this.loading = false;
        if (res.code === '0') {
          this.loading = false;
          this.productList = res.data.data;
          this.firstQueryDate = res.data.firstQueryDate;
          this.pages.totalPages = res.data.totalPages;
          this.pages.totalCount = res.data.total;
        }
      });
    },
    storePageChange(pageNum) {
      this.pages.pageNum = pageNum;
      this.fetchData({
        // isMarketable: true,
        word: this.keyword,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      });
    },
    handleClose(done) {
      this.$emit('update:visible', false);
    },
    isChecked(sn) {
      if (this.checked) {
        return (
          this.checked.find(res => {
            if (res.sn == sn) {
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
    select(product) {
      if (this.pattern == 'radio' || this.checked.length + 1 >= this.limit) {
        this.$emit('update:visible', false);
      }
      if (this.pattern != 'submit') {
        this.$emit('select', {
          name: product.name,
          listImage: product.listImage,
          distributionPrice: product.distributionPrice,
          marketPrice: product.marketPrice,
          id: product.id,
          sn: product.sn,
          goodsSn: product.goodsSn,
          goodsId: product.goodsId,
          sellingPoint: product.sellingPoint
        });
      } else {
        this.checked.push({
          name: product.name,
          listImage: product.listImage,
          distributionPrice: product.distributionPrice,
          marketPrice: product.marketPrice,
          id: product.id,
          sn: product.sn,
          goodsSn: product.goodsSn,
          goodsId: product.goodsId,
          sellingPoint: product.sellingPoint
        });
      }
    },
    unSelect(product) {
      if (this.pattern != 'submit') {
        this.$emit('unSelect', {
          id: product.id,
          sn: product.sn
        });
      } else {
        for (var i = 0; i < this.checked.length; i++) {
          if (this.checked[i].id == product.id) {
            this.checked.splice(i, 1);
            break;
          }
        }
      }
    },
    submit() {
      this.$emit('submit', this.checked);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.p-info {
  display: flex;
  align-items: center;
  .p-img {
    max-width: 30%;
    max-height: 70px;
    object-fit: cover;
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
.d-header {
  padding: 0 20px;
}
.dialog-footer {
  float: right;
  margin-top: 10px;
}
.el-form {
  position: relative;
}
.btn-group {
  position: absolute;
  right: 0;
  bottom: 25px;
  .btn-query {
    font-size: 14px;
    color: #ca303a;
    line-height: 14px;
    border: 1px solid #ca303a;
  }
}
</style>
