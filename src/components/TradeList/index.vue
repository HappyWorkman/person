<template>
  <div>
    <el-table :data="tradeRecords" border>

      <el-table-column prop="sn" label="订单编号" :minWidth="120"> </el-table-column>
      <el-table-column prop="member" label="买家"> </el-table-column>
      <el-table-column label="商品信息">
        <template slot-scope="scope">
          <a href="javascript:;" type="text" size="small" @click="showDetail(scope.row.productDtoList)">点击查看</a>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="订单金额"> </el-table-column>
      <el-table-column prop="incomeTotal" label="收益"> </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">{{scope.row.status}}</template>
      </el-table-column>
      <el-table-column label="结单时间" :minWidth="140">
        <template slot-scope="scope">
          {{scope.row.endDate|parseTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="{name:'OrderDetail',query: {oid:scope.row.sn}}">点击查看</router-link>
          <!-- <a href="javascript:;" type="text" size="small" @click="showDetail(scope.row.productDtoList)">点击查看</a> -->
        </template>
      </el-table-column>
    </el-table>
    <goods-list @closeDialog="closeDialog" :dialog-table-visible="dialogTableVisible" :grid-data="gridData"></goods-list>
  </div>
</template>

<script>
import GoodsList from '@/components/Dialog/GoodsList';
export default {
  components: { GoodsList },
  data() {
    return {
      gridData: [],
      dialogTableVisible: false
    };
  },
  props: {
    tradeRecords: {
      type: Array,
      default: () => []
      // required:true
    }
  },
  methods: {
    showDetail(info) {
      this.gridData = info;
      this.dialogTableVisible = true;
    },
    closeDialog(v) {
      this.dialogTableVisible = v;
    }
  }
};
</script>
