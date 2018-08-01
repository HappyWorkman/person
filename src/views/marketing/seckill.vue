<template>
  <div class="app-container layer">
    <div class="query-panel" style="margin-top:-6px;">
      <el-date-picker v-model="effectiveDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-select v-model="queryData.timeStatus" placeholder="状态" style="width:120px;margin-left:-6px;" @change="search">
        <el-option label="所有状态" value="">
        </el-option>
        <el-option label="待开始" value="0">
        </el-option>
        <el-option label="进行中" value="1">
        </el-option>
        <el-option label="已结束" value="2">
        </el-option>
      </el-select>
      <el-input class="cname-input" v-model="input" placeholder="请输入活动名称" style="margin-left:-6px;"></el-input>
      <el-button class="gridbutton" style="margin-left:6px;" @click="search">搜索</el-button>
      <el-button class="btn-add">
        <router-link :to="{name:'seckill-add'}">
          <i class="el-icon-plus" style="margin-left:-8px;"></i>创建秒杀活动
        </router-link>
      </el-button>
    </div>
    <!-- <div class="query-panel">
      <el-date-picker v-model="effectiveDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-select v-model="queryData.timeStatus" placeholder="状态" style="width:120px;">
        <el-option label="所有状态" value="">
        </el-option>
        <el-option label="待开始" value="0">
        </el-option>
        <el-option label="进行中" value="1">
        </el-option>
        <el-option label="已结束" value="2">
        </el-option>
      </el-select>
    </div> -->

    <el-table class="productlist-panel" :data="seckillData" style="width: 100%" stripe fit v-loading="loading">
      <el-table-column prop="name" label="秒杀商品">
        <template slot-scope="scope">
          <div class="p-info">
            <img class="p-img" v-lazy="scope.row.goodsPic" :key="scope.row.goodsPic"/>
            <div style="margin-left: 10px">{{scope.row.goodsName}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="秒杀价&销售价" align="center">
        <template slot-scope="scope">
          <div class="price-info">
            <div class="reduced-text">￥{{scope.row.minSkPrice }}</div>
            <!-- <div class="reduced-text" v-else>{{scope.row.discountRate }}折</div> -->
            <div>&</div>
            <div>￥{{ scope.row.minOrigPrice }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" align="center">
        <template slot-scope="scope">
          <div class="time-info" v-if="scope.row.beginTime==null">
            <div>{{ scope.row.beginDateTime|parseTime }}</div>
            <div>&</div>
            <div>{{ scope.row.endDateTime |parseTime}}</div>
          </div>
          <div class="time-info" v-else>
            <div>{{ scope.row.beginDateTime|parseDate }} <span>{{scope.row.beginTime}}</span></div>
            <div>&</div>
            <div>{{ scope.row.endDateTime |parseDate}} <span>{{scope.row.endTime}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="秒杀销量" align="center">
        <template slot-scope="scope">{{scope.row.sales}}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div :class="[scope.row.timeStatus ==0?'statusDefult':(scope.row.timeStatus ==1?'beginning':'finish')]">{{getStatus(scope.row.timeStatus)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="btn-group" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button class="gridbutton" plain size="small" @click="editCoupon(scope.row)">查看</el-button>
            <el-button class="gridbutton" plain size="small" @click="closeSeckill(scope.row.id)" v-if="scope.row.timeStatus!=2">结束</el-button>
            <el-button class="gridbutton gridbtnBack" plain size="small" @click="deleateSeckill(scope.row.id)" v-if="scope.row.timeStatus ==2">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-panel" v-if="seckillData.length>0">
      <el-pagination @current-change="salePageChange" layout="prev, pager, next" :page-size="couponPages.pageSize" :current-page="couponPages.pageNum" :total="couponPages.totalPages">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { querySeckillList, closeSeckill, deleateSeckill } from '@/api/seckill';
export default {
  data() {
    return {
      loading:false,
      seckillData: [],
      queryData: {
        name: '',
        date: '',
        type: '',
        receiveQualification: 'allMember',
        timeStatus: ''
      },
      couponPages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 10
      },
      input: '',
      imgUrl: '',
      effectiveBeginDate: '',
      effectiveEndDate: ''
    };
  },
  computed: {
    effectiveDate: {
      get() {
        if (this.effectiveBeginDate != null && this.effectiveEndDate != null) {
          return [this.effectiveBeginDate, this.effectiveEndDate];
        } else {
          return '';
        }
      },
      set(value) {
        if (value) {
          this.effectiveBeginDate = value[0].getTime();
          this.effectiveEndDate = value[1].getTime();
        } else {
          this.effectiveBeginDate = null;
          this.effectiveEndDate = null;
        }
      }
    }
  },

  created() {},
  mounted() {
    this.fetchData({
      keyword: this.input,
      timeStatus: this.queryData.timeStatus,
      beginDateTimeStart: this.effectiveBeginDate,
      beginDateTimeEnd: this.effectiveEndDate,
      pageNo: this.couponPages.pageNum,
      pageSize: this.couponPages.pageSize
    });
  },
  methods: {
    getStatus(type) {
      if (type == '0') {
        return '待开始';
      } else if (type == '1') {
        return '进行中';
      } else if (type == '2') {
        return '已结束';
      }
    },
    fetchData(params) {
      this.loading = true;
      querySeckillList(params).then(res => {
        if (res.code == 0) {
          this.loading = false;
          this.seckillData = res.data.data;
          this.couponPages.totalPages = res.data.total;
        }
      });
    },
    salePageChange(pageNum) {
      this.couponPages.pageNum = pageNum;
      this.fetchData({
        pageNo: this.couponPages.pageNum,
        pageSize: this.couponPages.pageSize
      });
    },
    search() {
      var self = this;
      // 状态查找
      if (self.queryData.timeStatus == '') {
        self.timeStatus = '';
      } else if (self.queryData.timeStatus == 0) {
        self.timeStatus = 0;
      } else if (self.queryData.timeStatus == 1) {
        self.timeStatus = 1;
      } else if (self.queryData.timeStatus == 2) {
        self.timeStatus = 2;
      }

      self.option = {
        timeStatus: self.timeStatus,
        keyword: self.input,
        beginDateTimeStart: self.effectiveBeginDate,
        beginDateTimeEnd: self.effectiveEndDate
      };

      self.fetchData({
        timeStatus: self.timeStatus,
        keyword: self.input,
        beginDateTimeStart: self.effectiveBeginDate,
        beginDateTimeEnd: self.effectiveEndDate
      });
    },
    editCoupon(data) {
      this.$router.push({
        name: 'seckill-edit',
        query: {
          id: data.id
        }
      });
    },
    closeSeckill(id) {
      closeSeckill(id).then(res => {
        this.fetchData();
      });
    },
    // closeCoupon(id) {
    //   this.$confirm('将彻底停用此优惠券, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       outageCoupon(id).then(res => {
    //         if (res.code == '0') {
    //           this.$message({
    //             type: 'success',
    //             message: '删除成功!'
    //           });
    //         }
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       });
    //     });
    // },
    deleateSeckill(id) {
      deleateSeckill(id).then(res => {
        console.log(res);
        this.fetchData();
      });
    }
    // deleteCoupon(id) {
    //   this.$confirm('将删除此优惠券记录, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       delCoupon(id).then(res => {
    //         if (res.code == '0') {
    //           this.$message({
    //             type: 'success',
    //             message: '删除成功!'
    //           });
    //         }
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       });
    //     });
    // }
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
  .el-button-group .gridbtnBack{
    &:hover{
      color: #ca303a;
      background-color: #f9eaeb;
      border: 1px solid #ca303a;
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
    // border-radius: 0;
    color: white;
    width: 130px;
    text-align: center;
    i {
      // margin-right: -3px;
    }
  }
  .btn-query {
    font-size: 14px;
    margin-left: 10px;
  }
  .el-date-editor,
  .el-select {
    margin-right: 20px;
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
  .p-info {
    display: flex;
    align-items: center;

    .p-img {
      max-width: 30%;
      max-height: 70px;
      object-fit: cover;
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
  color: #CA303A;
}
.finish {
  color: #999999;
}
.beginning {
  color: #30a1ca;
}
</style>
