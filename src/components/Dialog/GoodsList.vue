<template>
  <el-dialog title="商品信息" :visible.sync="isShow">
    <el-table :data="gridData" border>
        <el-table-column property="name" label="名称"></el-table-column>
        <el-table-column property="productSpecificationStr" label="规格" width="100"></el-table-column>
        <el-table-column label="单价" width="100">
            <template slot-scope="scope">{{'￥'+scope.row.price}}</template>
        </el-table-column>
        <el-table-column property="number" label="数量" width="100"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  computed:{
    isShow:{
      get() {
        return this.dialogTableVisible;
      },
      set (v){
        this.$emit('closeDialog',v);
      }
    }
  },
  props: {
    dialogTableVisible:false,
    gridData:{
      type:Array,
      default:()=>[]
    }
  }
};
</script>
