<template>
  <div>
    <el-table :data="withdrawRecords" border>
        <el-table-column prop="sn" label="交易号" :minWidth="120"></el-table-column>
        <el-table-column prop="bankName" label="帐户类型"></el-table-column>
        <el-table-column prop="account" label="提现账户" :minWidth="120"></el-table-column>
        <el-table-column prop="withdrawUserName" label="开户姓名"> </el-table-column>
        <el-table-column prop="withdrawCash" label="提现金额"> </el-table-column>
        <el-table-column prop="actualWithdrawAmount" label="实际金额"> </el-table-column>
        <el-table-column prop="withdrawFee" label="手续费"> </el-table-column>
        <el-table-column prop="withdrawFeeRate" label="手续费比例"> </el-table-column>
        <el-table-column prop="withdrawCashDate" label="提现日期" :minWidth="140"></el-table-column>
        <el-table-column prop="status" label="提现状态"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import GoodsList from '@/components/Dialog/GoodsList';
export default {
  props: {
    withdrawRecords:{
      type:Array,
      default:()=>[]
    }
  }
}
</script>

