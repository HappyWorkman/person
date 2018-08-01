<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <a href="/">
        <svg-icon :icon-class="'logo'"></svg-icon>
      </a>
      <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
      <!-- <breadcrumb></breadcrumb> -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src='user.logo'>
          <div class="shop-name">{{user.name}}</div>
          <!-- <i class="el-icon-caret-bottom"></i> -->
          <svg-icon icon-class="arrow" />
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="shopInfoVisible=true" style="display:block;">店铺信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="showPwdWindow('ruleForm')" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
    <el-dialog title="修改登录密码" width="600px" :visible.sync="psdWindowVisible">
      <el-form :model="ruleForm" ref="ruleForm" status-icon style="width: 500px;" :rules="rules">
        <el-form-item label="原密码" prop="oldPwd" :label-width="formLabelWidth">
          <el-input type="password" v-model="ruleForm.oldPwd" auto-complete="off" placeholder="输入原始登录密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd" :label-width="formLabelWidth">
          <el-input type="password" v-model="ruleForm.newPwd" auto-complete="off" placeholder="输入新设登录密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd" :label-width="formLabelWidth">
          <el-input type="password" v-model="ruleForm.confirmPwd" auto-complete="off" placeholder="输入新设登录密码"></el-input>
        </el-form-item>
        <el-form-item label="绑定手机号" :label-width="formLabelWidth" v-if="mobile">
          <el-input :disabled="true" :placeholder="mobile"></el-input>
        </el-form-item>
        <el-form-item label="手机验证码" prop="code" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.code" auto-complete="off" placeholder="验证码" class="code-input"></el-input>
          <el-button v-show="auth_time==0" type="primary" @click="getAuthCode" class="code-btn">获取验证码</el-button>
          <el-button type="plain" v-show="auth_time!=0" class="code-btn">{{auth_time}}秒</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePwdWindow('ruleForm')">取 消</el-button>
        <el-button :loading="sendLoading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="店铺信息" :visible.sync="shopInfoVisible">
      <el-row class="shop-info-wrap">
        <el-col :span="24" class="shop-logo">
          <span class="title">店铺LOGO：</span>
          <img :src="shopInfo.logo" alt="">
        </el-col>
        <el-col :span="24" class="shop-item">
          <div class="info-item">
            <div class="item-box">
              <span class="title">店铺名称：</span>
              <span>{{shopInfo.name}}</span>
            </div>
            <div class="item-box">
              <span class="title">开店时间：</span>
              <span>{{shopInfo.createDate || '无'}}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="item-box">
              <span class="title">绑定手机号：</span>
              <span>{{shopInfo.mobile || '无'}}</span>
            </div>
            <div class="item-box">
              <span class="title">店铺状态：</span>
              <span>{{shopInfo.status || '无'}}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="title">认证类型：</span>
            <span>个人</span>
          </div>
        </el-col>
        <el-col :span="24" class="shop-introduction">
          <span class="title">店铺简介：</span>
          <span>{{shopInfo.shopIntroduction || '无'}}</span>
        </el-col>
        <el-col :span="24" class="code-wrap">
          <el-col :span="12" class="code-item" v-if="shopInfo.wxMiniCodeImg">
            <div class="shop-code code">
              <img :src="shopInfo.wxMiniCodeImg" alt="">
              <span>查看店铺</span>
            </div>
          </el-col>
          <el-col :span="12" class="code-item" v-if="shopInfo.onlineServiceImg">
            <div class="service-code code">
              <img :src="shopInfo.onlineServiceImg" alt="">
              <span>咨询客服</span>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="店铺信息" :visible.sync="shopInfoVisible">
      <el-row class="shop-info-wrap">
        <el-col :span="24" class="shop-logo">
          <span class="title">店铺LOGO：</span>
          <img :src="shopInfo.logo" alt="">
        </el-col>
        <el-col :span="24" class="shop-item">
          <div class="info-item">
            <div class="item-box">
              <span class="title">店铺名称：</span>
              <span>{{shopInfo.name}}</span>
            </div>
            <div class="item-box">
              <span class="title">开店时间：</span>
              <span>{{shopInfo.createDate || '无'}}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="item-box">
              <span class="title">绑定手机号：</span>
              <span>{{shopInfo.mobile || '无'}}</span>
            </div>
            <div class="item-box">
              <span class="title">店铺状态：</span>
              <span>{{shopInfo.status || '无'}}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="title">认证类型：</span>
            <span>个人</span>
          </div>
        </el-col>
        <el-col :span="24" class="shop-introduction">
          <span class="title">店铺简介：</span>
          <span>{{shopInfo.shopIntroduction || '无'}}</span>
        </el-col>
        <el-col :span="24" class="code-wrap">
          <el-col :span="12" class="code-item" v-if="shopInfo.wxMiniCodeImg">
            <div class="shop-code code">
              <img :src="shopInfo.wxMiniCodeImg" alt="">
              <span>查看店铺</span>
            </div>
          </el-col>
          <el-col :span="12" class="code-item" v-if="shopInfo.onlineServiceImg">
            <div class="service-code code">
              <img :src="shopInfo.onlineServiceImg" alt="">
              <span>咨询客服</span>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import { getMsg, updatedPsd } from '../../../api/sys.js';
import { getShopInfo } from '../../../api/overview.js';

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原始密码'));
      } else if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    var validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('confirmPwd');
        }
        callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else {
        callback();
      }
    };
    return {
      mobile: '',
      psdWindowVisible: false,

      //查看店铺 临时方案
      shopInfo: {},
      shopInfoVisible: false,

      formLabelWidth: '30%',
      auth_time: 0,
      sendLoading: false,
      ruleForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
        code: ''
      },
      rules: {
        oldPwd: [{ validator: validateOldPass, trigger: 'blur' }],
        newPwd: [{ validator: validateNewPass, trigger: 'blur' }],
        confirmPwd: [{ validator: validateCheckPass, trigger: 'blur' }],
        code: [{ validator: validateCode, trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['sidebar', 'avatar'])
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getShopInfo();
    },
    getShopInfo() {
      getShopInfo().then(res => {
        if (res.code == 0) {
          this.mobile = res.data.mobile;
        }
      });
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    showPwdWindow(Form) {
      this.psdWindowVisible = true;
      this.ruleForm = {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
        code: ''
      };
    },
    closePwdWindow(Form) {
      this.psdWindowVisible = false;
      this.ruleForm = {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
        code: ''
      };
      this.$refs[Form].resetFields();
    },
    // closeDialog(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //       this.$refs['ruleForm'].resetFields();
    //     })
    //     .catch(_ => {});
    // },
    getAuthCode() {
      this.sendAuthCode = false;
      this.auth_time = 60;
      var auth_timetimer = setInterval(() => {
        this.auth_time--;
        if (this.auth_time <= 0) {
          this.sendAuthCode = true;
          clearInterval(auth_timetimer);
        }
      }, 1000);
      getMsg(this.mobile, 'change_password').then(res => {
        console.log(res);
      });
    },
    submitForm(formName) {
      // debugger;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.sendLoading = true;
          updatedPsd(this.ruleForm).then(res => {
            console.log(res)
            this.sendLoading = false;
            if (res.code = 0) {
              this.$message({
                message:'修改密码成功',
                type:'success'
              })
              this.psdWindowVisible = false;
            }else{
              this.closePwdWindow('ruleForm');
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
  background-color: #fcfcfc;
}

.navbar {
  height: 85px;
  line-height: 50px;
  border-radius: 0px !important;
  display: flex;
  align-items: center; // justify-content: space-between;
  padding: 0 40px;
  // position: relative;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1002;
  .svg-icon {
    width: 47px;
    height: 49px;
  } // .hamburger-container {
  //   line-height: 58px;
  //   height: 50px;
  //   float: left;
  //   padding: 0 10px;
  // }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 40px;
    .avatar-wrapper {
      cursor: pointer; // margin-top: 5px;
      // position: relative;
      display: flex;
      align-items: center;
      .user-avatar {
        // width: 40px;
        height: 54px;
        border-radius: 10px;
        margin-right: 24px;
      }
      .shop-name {
        font-size: 16px;
        color: #333;
      }
      .svg-icon {
        height: 32px;
      }
    }
  }
}
.el-input.code-input {
  width: 220px;
}
.code-btn {
  margin-left: 10px;
}
.dialog-footer {
  padding-right: 40px;
  .el-button {
    padding: 12px 40px;
  }
}

@media screen and(min-width: 1280px) {
  .shop-info-wrap {
    padding-left: 40px;
    padding-right: 40px;
  }
}
.shop-info-wrap {
  .shop-logo {
    margin-bottom: 30px;
  }
  .title {
    display: inline-block;
    vertical-align: top;
    color: #333;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .shop-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .shop-introduction {
    display: flex;
    flex-direction: row;
    .title {
      min-width: 75px;
    }
  }
  .code-wrap {
    padding-top: 40px;
    .code-item {
      display: flex;
      justify-content: center;
      .code {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 240px;
        height: 287px;
        span {
          margin-top: 10px;
          font-size: 16px;
          color: #333;
        }
      }
    }
  }
}
</style>

