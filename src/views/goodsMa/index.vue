<template>
  <div class="app-container">
    <div class="header layer">
      <!-- <div class="tab-menu">
        <div class="tab-item">销售中</div>
        <div class="tab-item">仓库中</div>
      </div> -->
      <el-menu :default-active="activeMenu" class="tab-menu" mode="horizontal" @select="menuSelect">
        <el-menu-item index="1" style="margin-right:0;">销售中</el-menu-item>
        <el-menu-item index="2">仓库中</el-menu-item>
      </el-menu>
      <div class="filter-panel">
        <!-- <el-select v-model="value" placeholder="全部商品"></el-select> -->

        <!-- <el-date-picker v-model="value" type="date" placeholder="筛选日期">
        </el-date-picker> -->
        <el-row :gutter="0">
          <el-col :span="15">
            <el-select v-model="kolCategory" placeholder="商品分类" @change="search">
              <el-option v-for="item in categorys" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="search-panel" :span="9">
            <el-input v-model="keyword" placeholder="商品名称"></el-input>
            <el-button type="danger" @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-show="activeMenu=='1'" class="layer" style="padding:40px">
      <div class="handle-bar">
        <div class="title" style="font-size:20px;font-weight:bold">商品</div>
        <div class="btn-group">
          <router-link to="/product/bazaar">
            <el-button type="danger">发布商品</el-button>
          </router-link>
        </div>
      </div>
      <el-table class="productlist-panel" :data="saleProductList" style="width: 100%" border v-loading="loading">
        <!-- <el-table-column prop="goodsSn" label="ID" width="100"></el-table-column> -->
        <el-table-column label="商品">
          <template slot-scope="scope">
            <div class="p-info">
              <img class="p-img" v-lazy="scope.row.listImage" :key="scope.row.listImage"/>
              <div class="p-describe">
                <div style="margin-left: 10px;margin-top:20px;">{{ scope.row.name }}</div>
                <div style="color:#999999;font-size:12px;margin-left: 10px" v-if="scope.row.sellingPoint">{{scope.row.sellingPoint}}</div>
              </div>
              
            </div>
            <!-- <div class="sellPoint" style="display:flex;align-item:center;-webkit-box-align: center;justify-content:flex-start;height:23px;margin-top:-24px;">
              <div style="width:80px;height:23px;"></div>
              
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="distributionPrice" label="售价" width="60"></el-table-column>
        <el-table-column prop="salesTotal" label="总销量" width="70"></el-table-column>
        <el-table-column prop="btn-group" label="SKU" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" class="checksku" @click="checkSKUData(scope.row.id)">点击查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="货源状态" width="100">
          <template slot-scope="scope">
            <div :class="(scope.row.productStatus=='货源有效'?'goodsEffective':'goodsFish')">{{scope.row.productStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column label="分组" width="125" :render-header="foo">
          <!-- <el-tooltip content="每日库存" placement="top">
              <i class="el-icon-question"></i>
          </el-tooltip> -->
          <template slot-scope="scope">
            <div class="group-info" @click="currentGroupIds=[{id:scope.row.productGroupDto.id}];gsVisible=true;;currentProductId=scope.row.id">
              <!-- <svg-icon icon-class="edit" /> -->
              <div class="noGrop" v-if="scope.row.productGroupDto.name">{{scope.row.productGroupDto.name}}</div>
              <div class="noGrop noGroupColor" v-else>未分组</div>
              <svg-icon icon-class="edit-05" class="iconFirst" />
              <!-- <svg-icon icon-class="edit-icon2" class="iconSecond"></svg-icon> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="140" class="sortColumn" :render-header="fooSort">
          <template slot-scope="scope">
            <div class="sort-info">
              <span class="sortSpan">{{scope.row.orders}}</span>
              <svg-icon icon-class="edit-05" class="sortIcon" style="font-size:18px;color:#999999;"/>
              <!-- <svg-icon icon-class="edit-icon2" class="iconSecond"></svg-icon> -->
              <el-input style="width:100px;border-bottom-color: #ca303a;" v-model="scope.row.orders" class="sortIpt" @blur="sortList(scope.row.id,scope.row.orders)"></el-input>
              <div class="sortIconBox" @click="sortList(scope.row.id,scope.row.orders)">
                <svg-icon icon-class="check-05" class="sortIcon2" />
              </div>
            </div>
            <!-- <el-input v-model="scope.row.orders">
              <el-button slot="append" icon="el-icon-search" @click="sortList(scope.row.id,scope.row.orders)"></el-button>
            </el-input>
            {{scope.row.orders}} -->
          </template>
        </el-table-column>
        <el-table-column prop="btn-group" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button class="gridbutton" size="small" @click="handleSale(scope.$index, scope.row,false)">下架</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-panel" v-if="salePages.totalCount>1">
        <el-pagination @current-change="salePageChange" layout="prev, pager, next" :page-size="salePages.pageSize" :current-page="salePages.pageNum" :page-count="salePages.totalPages">
        </el-pagination>
      </div>
    </div>

    <div v-show="activeMenu=='2'" class="layer" style="padding:40px">
      <div class="handle-bar">
        <div class="title" style="font-size:20px;font-weight:bold">商品</div>
        <div class="btn-group">
          <router-link to="/product/bazaar">
            <el-button type="danger">发布商品</el-button>
          </router-link>
        </div>
      </div>
      <el-table class="productlist-panel secondProductList" :data="storeProductList" style="width: 100%" border v-loading="loading">      
        <el-table-column label="商品">
          <template slot-scope="scope">
            <div class="p-info">
              <img class="p-img" :src="scope.row.listImage" />
              <div class="p-describe">
                <div style="margin-left: 10px;margin-top:20px;">{{ scope.row.name }}</div>
                <div style="color:#999999;font-size:12px;margin-left: 10px" v-if="scope.row.sellingPoint">{{scope.row.sellingPoint}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="distributionPrice" label="售价" width="60"></el-table-column>
        <el-table-column prop="salesTotal" label="总销量" width="70"></el-table-column>
        <!-- <el-table-column prop="sellStatus" label="是否可卖" width="80"> </el-table-column> -->
        <el-table-column prop="btn-group" label="SKU" width="100" align="center">
          <template slot-scope="scope">
            <el-button class="checksku" type="text" @click="checkSKUData(scope.row.id)">点击查看</el-button>
          </template>
        </el-table-column>
        <el-table-column  label="商品状态" width="100">
          <template slot-scope="scope">
            <div :class="(scope.row.productStatus=='货源有效'?'goodsEffective':'goodsFish')">{{scope.row.productStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column label="分组" width="125" :render-header="foo">
          <template slot-scope="scope">
            <div class="group-info" @click="gsVisible=true;currentGroupIds=[{id:scope.row.productGroupDto.id}];currentProductId=scope.row.id">
              <!-- <svg-icon icon-class="edit" /> -->
              <div class="noGrop" v-if="scope.row.productGroupDto.name">{{scope.row.productGroupDto.name}}</div>
              <div class="noGrop noGroupColor" v-else>未分组</div>
              <svg-icon icon-class="edit-05" class="iconFirst" />
              <!-- <svg-icon icon-class="edit-icon2" class="iconSecond"></svg-icon> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="140" :render-header="fooSort">
          <template slot-scope="scope">
            <div class="sort-info">
              <span class="sortSpan">{{scope.row.orders}}</span>
              <svg-icon icon-class="edit-05" class="sortIcon" style="font-size: 18px;color:#999999;"/>
              <el-input style="width:100px;border-bottom-color: #ca303a;" v-model="scope.row.orders" class="sortIpt" @blur="sortList(scope.row.id,scope.row.orders)"></el-input>
              <div class="sortIconBox" @click="sortList(scope.row.id,scope.row.orders)">
                <svg-icon icon-class="check-05" class="sortIcon2" />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="btn-group" label="操作" width="190" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button class="gridbutton"  size="small" @click="handleSale(scope.$index, scope.row,true)">上架</el-button>
              <el-button class="gridbutton"  size="small" @click="checkSKUData(scope.row.id)">改价</el-button>
              <el-button class="gridbutton"  size="small" @click="removeSKUData(scope.row.id,scope.$index)">移除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-panel" v-if="storePages.totalCount>1">
        <el-pagination @current-change="storePageChange" layout="prev, pager, next" :page-size="storePages.pageSize" :current-page="storePages.pageNum" :page-count="storePages.totalPages">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="商品SKU" :visible.sync="dialogTableVisible" width="80%">
      <div class="help-tip">
        <el-tooltip content="只有已下架的商品（在仓库中的）才能改价哦" placement="top">
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <el-table :data="skuData" style="width: 100%">
        <el-table-column property="sn" label="商品编号" width="120"></el-table-column>
        <el-table-column property="productSpecificationStr" label="规格"></el-table-column>
        <el-table-column property="yjiaSupplyPrice" label="供货价"></el-table-column>
        <el-table-column property="recommendDistributionPrice" label="建议价"></el-table-column>        
        <el-table-column property="sales" label="销量"></el-table-column>
        <el-table-column property="stock" label="库存">
          <template slot-scope="scope">
            <div>{{scope.row.stock==null?'不限':scope.row.stock}}</div>
          </template>
        </el-table-column>
        <el-table-column property="profitPrice" label="利润"></el-table-column>
        <el-table-column label="销售价">
          <template slot-scope="scope">
            <el-input :class="distributionPriceInputStatus" v-model="scope.row.distributionPrice" placeholder="请输入内容" v-if="activeMenu=='2'"></el-input>
            <div v-else>{{scope.row.distributionPrice}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn-group">
        <!-- <el-button class="btn-check" @click="getExpressData(box.sn)">查看物流</el-button> -->
        <el-button class="btn-save" v-show="activeMenu=='2'" @click="updateDistributionPrice()">保存</el-button>
      </div>
    </el-dialog>

    <GroupsSelect :visible.sync="gsVisible" :checked="currentGroupIds" @select="addMenu"></GroupsSelect>
  </div>
</template>

<script>
import GroupsSelect from "@/components/Dialog/GroupsSelect";
import {
  getProductList,
  getSkuData,
  onSale,
  updateDistributionPrice,
  updateGroup,
  sortList
} from "@/api/goods";
import { getGroupList, removeData } from "@/api/category";

export default {
  data() {
    return {
      gsVisible: false,
      currentGroupIds: [],
      currentProductId: null,
      value: "",
      kolCategory: null,
      categorys: [
        { value: null, label: "全部" },
        { value: "1", label: "未分组" }
      ],
      saleProductList: [],
      storeProductList: [],
      skuData: [],
      distributionPriceInputStatus: "dis-price-normal", //dis-price-error
      salePages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 10
      },
      storePages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 10
      },
      dialogTableVisible: false,

      keyword: "",
      activeMenu: "1",
      firstQueryDate: null,
      loading: false
    };
  },
  components: { GroupsSelect },
  computed: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  created() {
    this.fetchData({
      isMarketable: true,
      pageNum: this.salePages.pageNum,
      pageSize: this.salePages.pageSize,
      productGroupId: this.kolCategory
    });

    getGroupList().then(res => {
      if (res.code === "0") {
        this.categorys.push(
          ...res.data.map(item => {
            return { value: item.id, label: item.name };
          })
        );
      }
    });
  },
  methods: {
    foo(h, { column }) {
      if (column) {
        return (
          <el-tooltip
            effect="dark"
            content="点击编辑下方图标,可设置分组"
            placement="top"
          >
            <span>
              分组<i class="el-icon-question" style="margin-left:4px" />
            </span>
          </el-tooltip>
        );
      }
    },
    fooSort(h, { column }) {
      if (column) {
        return (
          <el-tooltip effect="dark" content="序号越大排序越高" placement="top">
            <span>
              排序<i class="el-icon-question" style="margin-left:4px" />
            </span>
          </el-tooltip>
        );
      }
    },
    search(pages) {
      var isMarketable = this.activeMenu === "1";
      this.fetchData({
        isMarketable,
        word: this.keyword,
        pageNum: isMarketable
          ? this.salePages.pageNum
          : this.storePages.pageNum,
        pageSize: isMarketable
          ? this.salePages.pageSize
          : this.storePages.pageSize,
        productGroupId: this.kolCategory
      });
    },
    salePageChange(pageNum) {
      this.salePages.pageNum = pageNum;
      this.search();
    },
    storePageChange(pageNum) {
      this.storePages.pageNum = pageNum;
      this.search();
    },
    menuSelect(key, keyPath) {
      this.activeMenu = key;
      this.search();
    },
    fetchData(param) {
      console.log(param)
      this.loading = true;
      param = param || {};
      getProductList(param).then(res => {
        this.loading = false;
        if (res.code === "0") {
          // this.productList = res.data.data;
          this.firstQueryDate = res.data.firstQueryDate;

          if (param.isMarketable) {
            this.saleProductList = res.data.data;
            this.salePages.totalPages = res.data.totalPages;
            this.salePages.totalCount = res.data.total;
          } else {
            this.storeProductList = res.data.data;
            this.storePages.totalPages = res.data.totalPages;
            this.storePages.totalCount = res.data.total;
          }
        }
      });
    },
    checkSKUData(id) {
      getSkuData(id).then(res => {
        if (res.code === "0") {
          this.skuData = res.data;
          this.dialogTableVisible = true;
        }
      });
    },
    removeSKUData(id, index) {
      removeData(id).then(res => {
        if (res.code == "0") {
          this.search();
        }
      });
    },
    updateDistributionPrice() {
      var data = this.skuData.map(item => {
        this.storeProductList.forEach(product => {
          if (product.id == item.id) {
            product.distributionPrice = item.distributionPrice * 1;
          }
        });
        return {
          id: item.id,
          distributionPrice: item.distributionPrice * 1
        };
      });

      updateDistributionPrice(data).then(res => {
        if (res.code == "0") {
          this.dialogTableVisible = false;
          this.distributionPriceInputStatus = "dis-price-normal";
          this.search();
        } else {
          this.distributionPriceInputStatus = "dis-price-error";
        }
      });
    },
    handleSale(index, data, isMarketable) {
      onSale({
        id: data.id,
        isMarketable
      }).then(res => {
        if (res.code === "0") {
          this.search();
        }
      });
    },
    addMenu(data) {
      updateGroup({
        id: this.currentProductId,
        productGroupId: data.id
      }).then(res => {
        if (res.code == "0") {
          this.search();
          this.$message({
            type: "success",
            message: "更新成功!"
          });
        }
      });
    },
    sortList(id, orders) {
      sortList(id, orders).then(res => {
        // console.log(res);
        if (res.code == 0) {
          if(this.activeMenu === "1"){
            this.fetchData({
              isMarketable: true,
              pageNum: this.salePages.pageNum,
              pageSize: this.salePages.pageSize,
            });
          }else{
            this.fetchData({
              isMarketable: false,
              pageNum: this.salePages.pageNum,
              pageSize: this.salePages.pageSize,
            });
          }
          // location.reload();
        } else {
          this.$message({
            message: "请求出错，请稍后重试",
            type: "error"
          });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-container {
  .goodsEffective{
    background-color: #EAF9EB;
    color:#30CA3E;
    text-align: center;
    // padding: 10px;
  }
  .goodsFish{
    background-color: #F4F4F4;
    color:#999999;
    text-align: center;
  }
  .header {
    padding: 20px 0;
    border-top: 4px solid #f8e8e8;
    .tab-menu {
      display: flex;
      border-bottom: 1px solid #eee;
      font-size: 24px;
      color: #999;
      padding: 0 40px;
      background-color: #fcfcfc;
      .el-menu-item {
        margin-right: 40px;
        font-size: 24px;
        color: #999;
        &.is-active {
          border-color: #be1f1f;
          color: #be1f1f;
        }
      }
    }
    .filter-panel {
      padding: 40px;
    }
    .search-panel {
      padding: 0;
      text-align: right;
      .el-input {
        width: calc(100% - 120px);
        max-width: 360px;
      }
      .el-button {
        width: 68px;
      }
    }
  }
  .handle-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0px 35px 0px;
    .title {
      font-size: 18px;
      color: #666;
    }
    .btn-group {
      display: flex;
      align-items: center;
      .btn-batch {
        margin-right: 40px;
      }
    }
  }
  .productlist-panel {
    .group-info:hover {
      .iconFirst {
        // display: none;
        color: #ca303a;
      }
      .iconSecond {
        display: inline-block;
        margin-left: 35px;
        // color:#CA303A;
      }
      .noGrop {
        // background-color: #30CA3E;
        color:#B52B34;
      }
      .noGroupColor{
        color: #B52B34;
      }
    }
    .sort-info:hover {
      // background: #be1f1f!important;
      // color:red
      .sortSpan {
        display: none;
      }
      .sortIpt {
        display: block;
        width: 90px;
      }
      .sortIconBox {
        display: inline-block;
        width: 22px;
        height: 40px;
        text-align: center;
        // border: 1px solid #ccc;
        line-height: 40px;
        background-color: #e6e6e6;
        margin-left: -2px;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        // font-size: 12px;
      }
      .sortIconBox:active {
        background-color: #cccccc;
      }
      .sortIcon {
        display: none;
      }
      .sortIcon2 {
        display: inline-block;
        color: #666666;
      }
    }
    .p-info {
      display: flex;
      flex-direction: row;
      .p-img {
        max-width: 30%;
        max-height: 70px;
        object-fit: cover;
        display: inline-block;
      }
      .p-describe{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
    .group-info {
      cursor: pointer;
      display: flex;
      align-items: center;
      .noGrop {
        width: 80px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        // padding-right: 10px;
        color:#666;
        text-align: left;
        padding: 6px;
        border-radius: 3px;
      }
      .noGroupColor{
        width: 80px;
        text-align: left;
        // padding: 6px;
        // border-radius: 3px;
        color:#CA303A;
        // background-color: #CA303A;
      }
      .iconFirst {
        // margin-left: 35px;
        font-size: 18px;
        color: #999999;
      }
      .iconSecond {
        display: none;
      }
    }
    .sort-info {
      cursor: pointer;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .sortIpt {
        display: none;
      }
      .sortIconBox {
        display: none;
      }
    }
  }
  .secondProductList {
    .group-info:hover {
      .iconFirst {
        // display: none;
        color: #ca303a;
      }
      // .iconSecond {
      //   display: inline-block;
      //   margin-left: 35px;
      //   // color:#CA303A;
      // }
      .noGrop {
        color: #ca303a;
      }
    }
    .sort-info:hover {
      .sortIcon {
        display: none;
      }
      .sortIpt {
        display: block;
        width: 90px;
      }
      .sortIconBox {
        display: inline-block;
        width: 22px;
        height: 40px;
        text-align: center;
        // border: 1px solid #ccc;
        line-height: 40px;
        background: #e6e6e6;
        margin-left: -2px;
        border-radius: 2px;
        // font-size: 12px;
      }
      .sortIconBox:active {
        background-color: #cccccc;
      }
    }
  }
  .gridbutton {
    &:hover {
      color: #333;
      background-color: #eee;
      border: 1px solid #ccc;
    }
  }
  .gridbutton:nth-child(3) {
    &:hover {
      color: #ca303a;
      background-color: #f9eaeb;
      border: 1px solid #ca303a;
    }
  }
  .pagination-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    // position: absolute;
    // bottom: 0px;
    margin-top: 20px;
    width: 100%;
    .el-pagination {
      margin: 0 auto;
    }
  }
}
.btn-group {
  display: flex;
  justify-content: flex-end;
  font-size: 16px;
  color: #ca303a;
  margin-top: 20px;
}
.dis-price-normal {
  // border: 1px solid blue;
  // border-radius: 4px;
}
.dis-price-error {
  border: 1px solid #ca303a;
  border-radius: 4px;
}
.checksku {
  color: #30a1ca;
  padding: 10px;
  &:hover {
    background-color: #30a1ca;
    color: white;
  }
}
.help-tip {
  position: absolute;
  top: 13px;
  right: 40px;
  font-size: 16px;
}
</style>
