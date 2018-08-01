<template>
  <div class="app-container">
    <div class="header layer">
      <!-- 提现申请 title -->
      <el-row class="header-box">
        <el-col :span="24" class="header-title">
          <h1>
            <svg-icon :icon-class="'withdraw-apply'"></svg-icon>&nbsp;提现申请</h1>
        </el-col>
        <el-col :span="24">
          <el-col :span="8" class="amount-box">
            <div class="amount-name">
              <span class="amount-type">已收入</span>
              <a href="#" class="amount-detail">查看明细</a>
            </div>
            <div class="amount-total">
              <span class="red">{{paidMoney|numberFormat}}</span>
            </div>
          </el-col>

          <el-col :span="8" class="amount-box">
            <div class="amount-name">
              <span class="amount-type">待入账</span>
              <!-- <a href="#" class="amount-detail">查看明细</a> -->
            </div>
            <div class="amount-total">
              <span>{{executable|numberFormat}}</span>
            </div>
          </el-col>

          <el-col :span="8" class="amount-box">
            <div class="amount-name">
              <span class="amount-type">可用余额</span>
              <a href="#" class="amount-detail">查看明细</a>
            </div>
            <div class="amount-total">
              <span class="red">{{balance|numberFormat}}</span>
            </div>
          </el-col>

        </el-col>
      </el-row>
    </div>
    <el-main class="body layer">
      <el-row class="body-title">
        <span class="table-title">提现金额</span>
        <router-link :to="{name:'withdraw'}" class="link">提现记录</router-link>
      </el-row>
      <el-form ref="form" :model="applyForm" class="body-form">
        <el-form-item el-row>
          <el-col :span="8">
            <el-input v-model="applyForm.amount" placeholder="请输入金额" :size="'medium'" @keyup.enter.enter.native="putBalance"></el-input>
          </el-col>
          <el-col :span="4" style="margin-left:20px;">
            <el-button type="primary" class="common-btn-width" @click="applyForm.amount=balance" :size="'medium'">全部提现</el-button>
          </el-col>
          <el-col :span="24" style="color:#999">*提现手续费: 当前费率为0</el-col>
          <el-col :span="24">实际到账金额:&nbsp;&nbsp;¥
            <span style="font-size:24px;">{{realAmount}}</span>
          </el-col>
          <el-col :span="24" class="bank-list">
            <label>提现账号:</label>
            <div class="bank-info">
              <a href="javascript:;" @click="selectedBank=bank.id" :class="{active:selectedBank==bank.id}" class="bank-link" v-for="bank in bankAccount" :key="bank.id">
                <img height="100" :src="bankImg[bank.bankCode]" />
                <span class="account">{{bank.account}}</span>
                <span class="name">姓名:{{bank.name}}</span>
              </a>
              <a href="javascript:;" @click="showAddCard" class="add"><img height="100" :src="add" /></a>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="common-btn-width" style="float:right;" @click="putBalance" :size="'medium'">立即提现</el-button>
        </el-form-item>
      </el-form>
      <div class="body-tip">
        <p>
          *提现申请提交后, 金额会在3个工作日内汇入您填写的银行卡账户, 请留意查收确认.<br/> *如果您填写的银行卡账户信息有误, 则会提现失败, 需要重新申请.
        </p>
      </div>
    </el-main>

    <el-dialog title="添加银行卡" :visible.sync="addCardVisible">
      <el-form :label-position="'right'" status-icon :rules="rules" ref="addBankForm" label-width="120px" :model="addBankForm">
        <el-form-item label="银行开户行" prop="bankCode">
          <el-select v-model="addBankForm.bankCode" placeholder="请选择银行" size="medium">
            <el-option :label="key" :value="bank" v-for="(bank,key) in allBanks" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户姓名" prop="name">
          <el-input v-model="addBankForm.name" :size="'medium'"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="account">
          <el-input v-model="addBankForm.account" :size="'medium'"></el-input>
        </el-form-item>
        <el-form-item label="是否默认">
          <el-checkbox v-model="addBankForm.isDef"></el-checkbox>
        </el-form-item>
        <el-form-item class="text-right submit-btns">
          <el-button :size="'medium'" @click="closeCard">取消</el-button>
          <el-button type="primary" @click="addCard('addBankForm')" :size="'medium'">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBankAccount,
  getProfitStatus,
  getBankAccountList,
  putBalance,
  getBankList
} from '@/api/finance';
import add from '@/assets/add.jpg';

import CODE_1002 from '@/assets/banks/CODE_1002.png';
import CODE_1003 from '@/assets/banks/CODE_1003.png';
import CODE_1004 from '@/assets/banks/CODE_1004.png';
import CODE_1005 from '@/assets/banks/CODE_1005.png';
import CODE_1006 from '@/assets/banks/CODE_1006.png';
import CODE_1009 from '@/assets/banks/CODE_1009.png';
import CODE_1010 from '@/assets/banks/CODE_1010.png';
import CODE_1020 from '@/assets/banks/CODE_1020.png';
import CODE_1021 from '@/assets/banks/CODE_1021.png';
import CODE_1022 from '@/assets/banks/CODE_1022.png';
import CODE_1025 from '@/assets/banks/CODE_1025.png';
import CODE_1026 from '@/assets/banks/CODE_1026.png';
import CODE_1027 from '@/assets/banks/CODE_1027.png';
import CODE_1032 from '@/assets/banks/CODE_1032.png';
import CODE_1056 from '@/assets/banks/CODE_1056.png';
import CODE_1066 from '@/assets/banks/CODE_1066.png';

export default {
  data() {
    return {
      applyForm: {
        amount: ''
      },
      loading: false,
      addBankForm: {
        bankCode: '', //开户银行
        name: '', //开户姓名
        account: '', //银行卡号
        isDef: false //是否默认
      },
      paidMoney: 0,
      balance: 0,
      executable: 0,
      addCardVisible: false,
      gridData: [],
      selectedBank: '', //选中银行(默认1)
      bankImg: {
        CODE_1002,
        CODE_1003,
        CODE_1004,
        CODE_1005,
        CODE_1006,
        CODE_1009,
        CODE_1010,
        CODE_1020,
        CODE_1021,
        CODE_1022,
        CODE_1025,
        CODE_1026,
        CODE_1027,
        CODE_1032,
        CODE_1056,
        CODE_1066
      },
      bankAccount: [],
      allBanks: null,
      add,
      rules: {
        bankCode: [{ required: true, message: '请选择一家银行' }],
        name: [{ required: true, message: '开户姓名不能为空' }],
        account: [
          { required: true, message: '银行卡号不能为空' },
          {
            validator: (rule, value, callback) => {
              if (!/^[0-9]{16,26}$/.test(value)) {
                callback(new Error('请正确输入银行卡号'));
              } else callback();
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    realAmount() {
      if (
        /^[0-9]+(\.[0-9]{1,2})?$/.test(this.applyForm.amount) &&
        this.applyForm.amount > 0
      )
        return this.applyForm.amount;
      else if (/^[0-9]+\.$/.test(this.applyForm.amount))
        return this.applyForm.amount.replace('.', '');
      return 0;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.applyForm.amount = '';
      this.getProfitStatus();
      this.getBankAccountList();
    },
    getProfitStatus() {
      //获取账户状态
      getProfitStatus().then(res => {
        if (res.code == 0) {
          this.paidMoney = res.paidMoney;
          this.balance = res.balance;
          this.executable = res.executable;
        }
      });
    },
    async getBankList() {
      const res = await getBankList();
      return res.data;
    },
    async showAddCard() {
      //添加银行卡
      this.allBanks = await this.getBankList();
      if (this.allBanks) this.addCardVisible = true;
      else this.$message.error('获取银行卡列表失败');
    },
    addCard(refForm) {
      //提交(添加银行卡)
      this.$refs[refForm].validate(valid => {
        if (!valid || this.loading) return;
        this.loading = true;
        addBankAccount(this.addBankForm)
          .then(res => {
            this.loading = false;
            if (res.code == 0) {
              this.$message.success('银行卡添加成功');
              this.closeCard();
              this.init();
            } else {
              throw res;
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message.error(err.msg || '银行卡添加失败');
          });
      });
    },
    closeCard() {
      //取消(添加银行卡)
      this.addCardVisible = false;
      this.addBankForm = {
        bankCode: '', //开户银行
        name: '', //开户姓名
        account: '', //银行卡号
        isDef: false //是否默认
      };
      this.$refs['addBankForm'].resetFields();
    },
    putBalance() {
      //立即提现
      if (
        !/^[0-9]+(\.[0-9]{1,2})?$/.test(this.applyForm.amount) ||
        this.applyForm.amount == 0
      )
        return this.$message.error('请输入合法的金额');
      if (this.loading) return this.$message.warning('正在处理中, 请稍候');
      this.loading = true;
      const params = {
        money: this.applyForm.amount,
        bankId: this.selectedBank
      };
      putBalance(params)
        .then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.$message.success('提现成功');
            this.init();
          } else throw res;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.msg || '提现失败, 请稍后再试!');
        });
    },
    showDetail(info) {
      this.gridData = info;
      this.dialogTableVisible = true;
    },

    //获得银行信息
    getBankAccountList() {
      getBankAccountList()
        .then(res => {
          if (res.code == 0) {
            this.bankAccount = res.data.data || [];
            if (this.bankAccount.length > 0) {
              const selectedBank =
                this.bankAccount.find(bank => bank.isDefault) ||
                this.bankAccount[0];
              this.selectedBank = selectedBank.id || '';
            }
          }
        })
        .catch(err => {
          //
        });
    },
    addBankAccount() {
      addBankAccount(this.addBankForm).then(res => {
        if (res.code == 0) {
          this.getBankInfo();
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.link {
  font-size: 14px;
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
      .amount-box {
        padding: 20px 30px;
        .amount-name {
          padding: 10px 0;
          .amount-type {
            font-size: 24px;
          }
          .amount-detail {
            color: #999;
            font-size: 12px;
            float: right;
            line-height: 20px;
          }
        }
        .amount-total {
          font-size: 50px;
          line-height: 70px;
          .withdraw-deposit {
            font-size: 12px;
            padding: 10px 20px;
            line-height: 12px;
            border: 1px solid;
            position: absolute;
            bottom: 30px;
            right: 30px;
          }
        }
        .red {
          color: #c20000;
        }
      }
    }
  }
  .body {
    padding: 30px;
    .body-title {
      padding-top: 20px;
      .table-title {
        float: left;
        font-size: 24px;
        font-weight: normal;
      }
    }
    .body-form {
      padding-bottom: 20px;
      .bank-list {
        .bank-info {
          display: -webkit-flex;
          display: flex;
          position: relative;
          .bank-link {
            padding: 6px;
            // float: left;
            border: 1px solid transparent;
            border-radius: 6px;
            margin-right: 20px;
            &:hover,
            &.active {
              border-color: #c20000;
            }
            img {
              display: block;
            }
          }
          .account {
            position: absolute;
            white-space: nowrap;
            width: 167px;
            top: 42px;
            text-align: center;
            font-size: 14px;
            color: #fff;
            font-weight: bold;
          }
          .name {
            position: absolute;
            white-space: nowrap;
            width: 167px;
            top: 70px;
            margin: 0 16px;
            font-size: 12px;
            color: #fff;
            font-weight: bold;
          }
        }
        .add {
          padding: 6px;
          float: left;
          img {
            display: block;
          }
        }
        span {
          float: left;
          width: 60px;
        }
      }
    }
    .body-tip {
      margin-left: -30px;
      margin-right: -30px;
      border-top: 1px solid #f0f0f0;
      padding: 15px 50px 0;
      color: #666;
      font-size: 14px;
      line-height: 24px;
    }
  }
  .submit-btns {
    margin-bottom: 0;
    button {
      width: 140px;
    }
  }
  .common-btn-width {
    width: 120px;
  }
}
</style>
