<template>
  <div class="app-container">
    <div class="header layer">
        <!-- 提现记录 title -->
        <el-row class="header-box">
            <el-col :span="24" class="header-title"><h1><svg-icon :icon-class="'withdraw-record'"></svg-icon>&nbsp;提现记录</h1></el-col>
            <el-col :span="24" class="header-subtitle">提现概况</el-col>
            <el-col :span="24">
                <el-col :span="7" class="amount-box">
                    <div class="amount-name">
                        <span class="amount-type">申请中</span>
                    </div>
                    <div class="amount-total">
                        <span class="red">{{subCount|numberFormat}}</span>
                    </div>
                </el-col>

                <el-col :span="7" class="amount-box">
                    <div class="amount-name">
                        <span class="amount-type">提现中</span>
                    </div>
                    <div class="amount-total">
                        <span class="red">{{withdCount|numberFormat}}</span>
                    </div>
                </el-col>

                <el-col :span="10" class="amount-box">
                    <div class="amount-name">
                        <span class="amount-type">已提现</span>
                    </div>
                    <div class="amount-total">
                        <span>{{sucCount|numberFormat}}</span>
                        <el-button type="primary" @click="gotoWithdraw" class="withdraw-deposit">提现</el-button>
                    </div>
                </el-col>

            </el-col>
        </el-row>
    </div>
    <el-main class="body layer">
        <el-row class="body-title">
            <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item label="交易号">
                    <el-input v-model="searchForm.sn" placeholder="提现账号单" size="small"></el-input>
                </el-form-item>
                <el-form-item label="提现状态" class="status">
                    <el-select v-model="searchForm.status" placeholder="全部" size="small">
                        <el-option label="全部" value="all"></el-option>
                        <el-option label="提交中" value="submit"></el-option>
                        <el-option label="提现中" value="withdraw"></el-option>
                        <el-option label="成功" value="success"></el-option>
                        <el-option label="失败" value="error"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结单时间" class="time">
                    <el-date-picker
                        size="small"
                        v-model="searchForm.withdrawCashDate"
                        value-format="yyyy-MM-dd"
                        format="yyyy 年 MM 月 dd 日"
                        type="datetime"
                        placeholder="订单完成时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="submit">
                    <el-button type="primary" @click="onSubmit">筛选</el-button>
                    <el-button type="reset" @click="onReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <withdraw-list :withdraw-records="tableData" v-loading="loading"></withdraw-list>
        <el-pagination
            style="text-align: right;margin-top: 30px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-main>
  </div>
</template>

<script>
import { getWithdrawRecords,getWithdrawStatus } from '@/api/finance';
import WithdrawList from '@/components/WithdrawList';

export default {
  data() {
    return {
      loading:false,
      searchForm: {
        sn: '',
        status:'all',
        withdrawCashDate: ''
      },
      tableData:null,
      gridData:[],
      currentPage:1,
      pageSize:10,
      total:0,
      subCount: 0.1,//提交中
      sucCount: 0,//已提现
      withdCount: 0//提现中
    };
  },
  components: { WithdrawList},
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
  created() {
      this.init();
  },
  methods: {
    init(){
        this.getWithdrawRecords();
        this.getWithdrawStatus();
    },
    gotoWithdraw(){
        this.$router.push({name:'withdrawApply'});
    },
    onSubmit(){
        this.handleCurrentChange(1);
    },
    onReset(){
        this.searchForm= {
            sn: '',
            status:'全部',
            withdrawCashDate: ''
        }
    },
    handleCurrentChange(v){
        this.currentPage=v;
        this.getWithdrawRecords();
    },
    handleSizeChange(v){
        this.pageSize=v;
        this.getWithdrawRecords();
    },
    getWithdrawRecords(){
        if(this.loading) return;
        let params = {};
        for(let key in this.searchForm){
            this.searchForm[key]!=='' && this.searchForm[key]!=null && this.searchForm[key]!=='all' && (params[key] = this.searchForm[key]);
        }
        this.loading=true;
        getWithdrawRecords(Object.assign({},params,{
            pageNum: this.currentPage,
            pageSize: this.pageSize
        })).then(res=>{
            this.loading=false;
            if(res.code==0){
                this.total = res.data.total;
                this.tableData = res.data.data;
            }
        }).catch(err=>{
            this.loading=false;
        })
    },
    getWithdrawStatus(){
        getWithdrawStatus().then(res=>{
            if(res.code==0){
                this.subCount = res.subCount;
                this.sucCount = res.sucCount;
                this.withdCount = res.withdCount;
            }
        })
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.link{
  font-size: 12px;
  float: right;
  line-height: 55px;
}
.app-container {
  // padding: 20px;
  height: 100%;
  .header{
      .header-box{
        .header-title{
            padding: 40px 30px 0;
        }
        .header-subtitle{
            padding: 20px 30px 50px;
            font-size:20px;
            border-bottom: 1px solid #f0f0f0;

        }
        .amount-box{
            padding: 20px 30px;
            .amount-name{
                padding: 10px 0;
                .amount-type{
                    font-size:24px;
                }
            }
            .amount-total{
                font-size: 50px;
                line-height: 70px;
                .withdraw-deposit{
                    width: 140px;
                    line-height: 24px;
                    font-size: 14px;
                    right: 30px;
                    bottom: 190px;
                    position: absolute;
                    padding: 10px 20px;
                }
            }
            .red{
                color:#C20000;
            }
        }
      }
  }
  .body{
    padding: 0 30px 30px;
    .body-title{
      margin: 30px 0 0;
      .table-title{
        float:left;
        font-size: 24px;
        font-weight: normal;
      }
      .search-form{
          .submit{
            float: right;
            margin-right: 0px;
          }
      }
    }
  }
}

</style>
<style rel="stylesheet/scss" lang="scss">
.status{
    .el-form-item__content{
        width:110px;
    }
}
.time{
    .el-date-editor--datetime{
        width:180px;
    }
}
</style>
