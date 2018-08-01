<template>
  <div class="layer bazaar">
    <div class="handel-panel">
      <div class="sort-panel">
        <el-select popper-class="el-select-text-dropdown" size="small" class="select-text" v-model="param.orderType" placeholder="请选择" @change="changeSort(1)">
          <el-option label="全部商品" value="yjiaScore">
          </el-option>
          <el-option label="最新发布" value="modifyDate">
          </el-option>
        </el-select>
        <div class="sort-box" :class="{desc:param.orderProfit === 'profitDesc'}" @click="changeSort(0)">
          <div>利润率</div>
          <div class="icon-group">
            <svg-icon iconClass="down"></svg-icon>
            <svg-icon iconClass="down"></svg-icon>
          </div>
        </div>
        <!-- <el-checkbox v-model="param.isStoraged" @change="pageNum = 1;search()">未选商品</el-checkbox> -->
      </div>
      <div class="filter-panel">
        <div class="price-panel">
          <div class="input-group">
            <el-input native-type="number" v-model.number="param.startPrice" placeholder="¥最低供货价"></el-input>
            <span>-</span>
            <el-input v-model.number="param.endPrice" placeholder="¥最高供货价"></el-input>
          </div>
        </div>
        <el-input class="input-place" v-model="param.shippingPlace" placeholder="货源地名称"></el-input>
        <el-input class="input-name" v-model="param.word" placeholder="商品名称"></el-input>
      </div>
      <div class="btn-group">
        <el-button @click="search" type="danger">搜索</el-button>
        <el-button @click="reset" type="info" plain style="margin-left:0px;">重置</el-button>
      </div>
    </div>
    <div class="product-panel">
      <ul class="product-list" v-loading="loading">
        <li class="product-item" v-for="(item,index) in productList" :key="index">
          <div class="p-content">
            <div class="p-image">
              <img v-lazy="item.listImage" />
            </div>
            <div class="p-name">
              {{item.fullName}}
            </div>
            <div class="p-profit">利润率:
              <span>{{item.profitPricePercent}}</span>
            </div>
            <div class="p-info">
              <div class="p-supply">供货价:
                <span style="color:#666666;">{{'￥'+item.yjiaSupplyPrice}}</span>
              </div>
            </div>
            <div class="p-footer">
              <div class="p-origin" v-if="item.shippingPlace!=null">
                <i class="el-icon-location-outline"></i>
                <span>{{item.shippingPlace}}</span>
              </div>
              <div class="checkstatus">
                <i class="el-icon-check" v-if="item.isStoraged"></i>{{item.isStoraged?'已选':''}}</div>
            </div>
            <div class="btn-group">
              <el-button type="danger" :disabled="item.isStoraged" @click="addProduct(item,false) " class="btn-add ">放入仓库中</el-button>
              <el-button type="danger" plain :disabled="item.isStoraged" @click="addProduct(item,true) " class="btn-sale ">售卖该商品</el-button>
            </div>
          </div>
        </li>
      </ul>
      <div class="pagination-panel " v-if="totalPages>1">
        <el-pagination @current-change="pageChange" layout="prev, pager, next" :page-size="pageSize" :current-page="pageNum" :page-count="totalPages">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getBazaarProductList, addBazaarProduct } from '@/api/goods';

export default {
  data() {
    return {
      value: '',
      param: {
        isStoraged: false,
        orderProfit: '', // profitDesc profitAsc
        orderType: 'yjiaScore', // yjiaScore modifyDate
        startPrice: null,
        endPrice: null,
        word: '',
        shippingPlace: ''
      },
      firstQueryDate: null,
      totalPages: 0,
      totalCount: 0,
      pageNum: 1,
      pageSize: 0,
      loading: false,
      productList: []
    };
  },
  mounted() {
    window.onresize = this.refresh;
    this.refresh();
  },
  created() {},
  computed: {},
  methods: {
    search() {
      this.loading = true;
      this.productList = [];
      getBazaarProductList({
        firstQueryDate: this.firstQueryDate,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        ...this.param,
        isStoraged: !this.param.isStoraged
      }).then(res => {
        if (res.code === '0') {
          this.loading = false;
          this.productList = res.data.data;
          this.totalPages = res.data.totalPages;
          this.totalCount = res.data.totalCount;
          this.firstQueryDate = res.data.firstQueryDate;
        }
      });
    },
    reset() {
      this.param.word = '';
      this.param.startPrice = '';
      this.param.endPrice = '';
      this.param.orderType = 'yjiaScore';
      this.param.shippingPlace = '';
      this.param.isStoraged = false;
      this.param.orderProfit = '';
      this.search();
    },
    refresh() {
      var rule = {
        1750: 6 * 3,
        1500: 5 * 3,
        1250: 4 * 3,
        800: 3 * 3
      };
      var current = null;
      if (document.body.clientWidth > 1750) {
        current = rule[1750];
      } else if (document.body.clientWidth > 1500) {
        current = rule[1500];
      } else if (document.body.clientWidth > 1250) {
        current = rule[1250];
      } else if (document.body.clientWidth > 800) {
        current = rule[800];
      }

      if (current != this.pageSize) {
        this.pageSize = current;
        this.pageNum = 1;
        this.search();
      }
    },
    changeSort(type) {
      if (type === 0) {
        this.param.orderProfit =
          this.param.orderProfit === 'profitDesc' ? 'profitAsc' : 'profitDesc';
      }
      this.search();
    },
    pageChange(pageNum) {
      this.pageNum = pageNum;
      this.search();
    },
    addProduct(product, isMarketable) {
      addBazaarProduct({
        productId: product.id,
        isMarketable
      }).then(res => {
        if (res.code === '0') {
          product.isStoraged = true;
          this.$message.success('添加成功');
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.bazaar {
  position: relative;
  padding-bottom: 40px;
  min-height: calc(100% - 40px);
  background-color: white;
  .pagination-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 10px;
    width: 100%;
    .el-pagination {
      margin: 0 auto;
    }
  }
}

.handel-panel {
  padding: 30px;
  background-color: #f9f9f9;
  position: relative;
  .sort-panel {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .select-text {
      margin-right: 30px;
      width: 100px;
    }
    .sort-box {
      cursor: pointer;
      margin-right: 40px;
    }
    .sort-box {
      width: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;

      .icon-group {
        margin-left: 10px;
        display: inline-block;
        .svg-icon {
          display: block;
          font-size: 12px;
        }
        .svg-icon:nth-child(1) {
          transform: rotate(180deg);
          color: #666;
        }
        .svg-icon:nth-child(2) {
          color: #999;
        }
      }
      &.desc {
        .icon-group {
          .svg-icon:nth-child(1) {
            transform: rotate(180deg);
            color: #999;
          }
          .svg-icon:nth-child(2) {
            color: #666;
          }
        }
      }
    }
    // .select-sort {
    //   width: 120px;
    //   border: none;
    // }
  }
  .filter-panel {
    margin-top: 16px;
    display: flex;
    // .el-input,
    .input-place,
    .price-panel {
      margin-right: 20px;
    }
    .input-place,
    .input-name {
      width: 170px;
    }
    .price-panel {
      .input-group {
        .el-input {
          width: 110px;
        }
      }
    }
  }
  .btn-group {
    position: absolute;
    right: 30px;
    bottom: 30px;
    .el-button {
      margin:0 5px;
    }
  }
}
.product-panel {
}
.product-list {
  list-style: none;
  padding: 0;
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
  li.product-item {
    height: 385px;
    vertical-align: top;
    display: inline-block;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
    width: 215px;
    // height: 380px;
    margin-right: 20px;
    margin-bottom: 20px;
    .p-content {
      background-color: #ffffff;
      font-size: 14px;
      color: #333;
      padding: 15px;

      .p-image {
        height: 185px;
        width: 185px;
        overflow: hidden;
        img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }
      .p-name {
        margin-top: 10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        height: 46px;
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
        line-height: 23px;
      }
      .p-profit {
        margin-top: 20px;
        font-size: 14px;
        color: rgba(102, 102, 102, 1);
        line-height: 18px;
        span {
          color: #ca303a;
        }
      }
      .p-info {
        margin: 10px 0 20px 0;
        font-size: 14px;
        color: rgba(102, 102, 102, 1);
        line-height: 18px;
        @include clearfix;
        .p-supply {
          float: left;
          span {
            font-size: 14px;
            color: rgba(102, 102, 102, 1);
            line-height: 18px;
          }
        }
      }
      .p-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .checkstatus {
          font-size: 14px;
          color: rgba(202, 48, 58, 1);
          line-height: 14px;
          i {
            margin-right: 5px;
          }
        }
        .p-origin {
          font-size: 14px;
          color: rgba(102, 102, 102, 1);
          line-height: 18px;
        }
      }
      .btn-group {
        margin-top: 30px;
        display: none;
        text-align: center;
        .btn-add {
          width: 185px;
          height: 44px;
          // background: rgba(202, 48, 58, 1);
          // color: white;
          margin: 0 auto 20px auto;
        }
        .btn-sale {
          margin: 0 auto;
          // color: #ca303a;
          // background-color: white;
          width: 185px;
          height: 44px;
          // border: 1px solid rgba(202, 48, 58, 1);
        }
        .is-disabled {
          background-color: #fff;
          border-color: #ebeef5;
          color: #c0c4cc;
        }
      }
    }
    &:hover {
      border: 1px solid #ca303a;
      .p-content {
        .p-name,
        .p-profit,
        .p-info,
        .checkstatus,
        .p-origin {
          display: none;
        }
        .btn-group {
          display: block;
        }
      }
      .p-name {
        overflow: initial;
        text-overflow: inherit;
        white-space: normal;
      }
    }
  }
}
/// 6列
@media screen and(min-width: 1750px) {
  .product-list {
    width: 1470px;
  }
  li.product-item {
    margin-right: 30px !important;
    &:nth-child(6n) {
      margin-right: 0;
    }
  }
}
/// 5列
@media screen and(min-width: 1530px) and(max-width: 1750px) {
  .product-list {
    width: 1155px;
  }
  li.product-item {
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
  .handel-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .filter-panel {
      margin-top: 0;
    }
    .btn-group {
      position: initial;
    }
  }
}

/// 4列
@media screen and(min-width: 1250px) and(max-width: 1530px) {
  .product-list {
    width: 920px;
  }
  li.product-item {
    &:nth-child(4n) {
      margin-right: 0;
    }
  }
}
/// 3列
@media screen and(min-width: 800px) and(max-width: 1250px) {
  .product-list {
    width: 685px;
  }
  li.product-item {
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
  .handel-panel {
    height: 200px;
    .btn-group {
      bottom: 10px;
      right: 10px;
    }
  }
}
</style>
