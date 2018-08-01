<template>
  <div class="app-container layer">
    <div class="query-panel" style="margin-top:-6px;">
      <el-select v-model="queryData.status" placeholder="状态" style="width:120px;" @change="search">
        <el-option label="所有状态" value="null">
        </el-option>
        <el-option label="发送中" value="0">
        </el-option>
        <el-option label="已领完" value="1">
        </el-option>
        <el-option label="已结束" value="2">
        </el-option>
      </el-select>
      <el-select v-model="queryData.receiveType" placeholder="领取资格" style="width:120px;margin-left:-4px;" @change="search">
        <el-option label="所有资格" value="null">
        </el-option>
        <el-option label="通用" value="0">
        </el-option>
        <el-option label="新人" value="1">
        </el-option>
      </el-select>
      <el-input class="cname-input" v-model="queryData.keyWord" placeholder="请输入优惠券名称"></el-input>
      <el-button class="gridbutton" style="margin-left:6px;" plain @click="search">搜索</el-button>
      <el-button class="btn-add">
        <router-link :to="{name:'coupon-add'}">
          <i class="el-icon-plus"></i>创建优惠券
        </router-link>
      </el-button>
    </div>
    <!-- <div class="query-panel" style="margin-top:-4px;">
      <el-select v-model="queryData.status" placeholder="状态" style="width:120px;">
        <el-option label="所有" value="null">
        </el-option>
        <el-option label="发送中" value="0">
        </el-option>
        <el-option label="已领完" value="1">
        </el-option>
        <el-option label="已结束" value="2">
        </el-option>
      </el-select>
      <el-select v-model="queryData.receiveType" placeholder="领取资格" style="width:120px;margin-left:-4px;">
        <el-option label="所有" value="null">
        </el-option>
        <el-option label="通用" value="0">
        </el-option>
        <el-option label="新人" value="1">
        </el-option>
      </el-select>
    </div> -->

    <el-table class="productlist-panel" :data="couponData" style="width: 100%" stripe fit v-loading="loading">
      <el-table-column prop="name" label="优惠券名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="面额&门槛"  align="center">
        <template slot-scope="scope">
          <div class="price-info">
            <div class="reduced-text">￥{{scope.row.fullCutPrice }}</div>
            <!-- <div class="reduced-text" v-else>{{scope.row.discountRate }}现金</div> -->
            <div>&</div>
            <div>￥{{ scope.row.thresholdPrice }}</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型" width="80">
        <template slot-scope="scope">
          {{gettypeName(scope.row.type)}}
        </template>
      </el-table-column> -->
      <el-table-column label="有效时间" align="center">
        <template slot-scope="scope">
          <div class="time-info" v-if="scope.row.effectiveType=='0'">
            <div>{{ scope.row.effectiveBeginDate }}</div>
            <div>&</div>
            <div>{{ scope.row.effectiveEndDate }}</div>
          </div>
          <div v-else>领取当日开始{{scope.row.effectiveDays}}天内有效</div>
        </template>
      </el-table-column>
      <el-table-column prop="limitNumber" label="限领/人" align="center"></el-table-column>

      <el-table-column label="使用／领取／发行" align="center">
        <template slot-scope="scope">
          {{ scope.row.usedCouponNumber}}/{{ scope.row.receiveCouponNumber}}/{{ scope.row.couponNumber}}
        </template>
      </el-table-column>
      <el-table-column label="领取资格" align="center">
        <template slot-scope="scope">
          {{getreceiveQualificationName(scope.row.receiveType)}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div :class="[scope.row.status ==1?'statusDefult':(scope.row.status ==0?'beginning':'finish')]">
            {{getStatus(scope.row.status)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="btn-group" label="操作" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button class="gridbutton" plain size="small" @click="editCoupon(scope.row)" :disabled="scope.row.status =='2' || scope.row.status =='3'">编辑</el-button>
            <el-button class="gridbutton" plain size="small" @click="closeCoupon(scope.row.id)" :disabled="scope.row.status =='3'" v-if="scope.row.status !='2'">结束</el-button>
            <el-button class="gridbutton" plain size="small" @click="deleteCoupon(scope.row.id)" v-if="scope.row.status =='2'">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>

    </el-table>
    <div class="pagination-panel" v-if="couponData.length>0">
      <el-pagination @current-change="couponPageChange" layout="prev, pager, next" :page-size="couponPages.pageSize" :current-page="couponPages.pageNum" :total="couponPages.totalPages">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { queryCouponList, outageCoupon, delCoupon } from '@/api/coupon';
export default {
  data() {
    return {
      loading: false,
      isActive: true,
      couponData: [],
      queryData: {
        name: '',
        date: '',
        type: '',
        receiveType: 'null',
        status: 'null',
        keyWord: ''
      },
      couponPages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 10
        // name:'',
        // receiveType:0,
        // status:0
      },
      pages: {
        pageNum: 1
      },
      input: '',
      changeStatus: true
    };
  },
  computed: {},

  created() {},
  mounted() {
    this.fetchData({
      pageNum: this.couponPages.pageNum,
      pageSize: this.couponPages.pageSize,
      status: this.queryData.status,
      receiveType: this.queryData.receiveType
    });
  },
  methods: {
    gettypeName(type) {
      if (type == '0') {
        return '现金券';
      } else {
        return '打折券';
      }
      // return { fullCut: '现金券', discount: '打折券' }[type];
    },
    getreceiveQualificationName(type) {
      if (type == '0') {
        return '通用';
      } else {
        return '新人';
      }
      // return { allMember: '全部用户', newMember: '新人用户' }[type];
    },
    getStatus(type) {
      if (type == '0') {
        return '发送中';
      } else if (type == '1') {
        return '已领完';
      } else if (type == '2') {
        return '已结束';
      } else if (type == '3') {
        return '已删除';
      }
    },
    fetchData(param) {
      this.loading = true;
      queryCouponList(param).then(res => {
        this.loading = false;
        if (res.code == 0) {
          this.couponData = res.data.content;
          this.couponPages.totalPages = res.data.total;
        }
      });
    },
    search() {
      var self = this;
      console.log(self);
      // 用户类型
      if (self.queryData.receiveType == 0) {
        self.receiveType = 0;
      } else if (self.queryData.receiveType == 1) {
        self.receiveType = 1;
      } else {
        self.receiveType = null;
      }
      // 状态
      if (self.queryData.status == 'null') {
        self.status = null;
      } else if (self.queryData.status == 0) {
        self.status = 0;
      } else if (self.queryData.status == 1) {
        self.status = 1;
      } else if (self.queryData.status == 2) {
        self.status = 2;
      }

      let options = {
        name: self.queryData.keyWord,
        receiveType: self.receiveType,
        status: self.status
      };
      self.fetchData(options);
    },
    couponPageChange(pageNum) {
      // console.log(pageNum)
      this.couponPages.pageNum = pageNum;
      this.fetchData({
        pageNum: this.couponPages.pageNum,
        pageSize: this.couponPages.pageSize
      });
    },
    editCoupon(data) {
      console.log(data);
      this.$router.push({
        name: 'coupon-edit',
        query: {
          id: data.id
        }
      });
    },
    // closeCoupon(id){
    //   outageCoupon(id).then(res=>{
    //     this.fetchData();
    //   })
    // },
    closeCoupon(id) {
      this.$confirm('将停止发放此优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          outageCoupon(id).then(res => {
            console.log(res);
            if (res.code == '0') {
              this.$message({
                type: 'success',
                message: '关闭成功!'
              });
            }
            this.fetchData({
              pageNum: this.couponPages.pageNum,
              pageSize: this.couponPages.pageSize
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          });
        });
    },
    deleteCoupon(id) {
      // console.log(id)
      this.$confirm('将删除此优惠券记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delCoupon(id).then(res => {
            if (res.code == '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
            this.couponData.splice(id, 1);
            this.fetchData(param);
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.gridbutton {
  &:hover {
    color: #333;
    background-color: #eee;
    border: 1px solid #ccc;
  }
}
.app-container {
  padding: 60px 40px 0 40px;
}
.query-panel {
  margin-bottom: 20px;
  position: relative;
  .btn-add {
    position: absolute;
    right: 0;
    background-color: #ca303a;
    width: 130px;
    color: white;
    i {
      margin-right: 5px;
      font-weight: bold;
    }
  }
  .btn-query {
    font-size: 14px;
    // color: #ca303a;
    line-height: 14px;
    // border: 1px solid #ca303a;
    margin-left: 10px;
  }
  .el-date-editor,
  .el-select {
    margin-right: 18px;
  }
}
.productlist-panel {
  .time-info,
  .price-info {
    text-align: center;
    .reduced-text {
      color: #ca303a;
    }
  }
}
.cname-input {
  width: 260px;
}
.table-btn {
  margin: 0;
  width: 80px;
}
.gridbutton {
  &:hover {
    color: #333;
    background-color: #eee;
    border: 1px solid #ccc;
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
.statusDefult {
  color: #30ca3e;
}
.finish {
  color: #999999;
}
.beginning {
  color: #30a1ca;
}
</style>
