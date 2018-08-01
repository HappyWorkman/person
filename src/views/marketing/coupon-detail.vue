<template>
  <div class="app-container">
    <div class="panel-title layer">
      <div class="crumbs-panel">
        <breadcrumb></breadcrumb>
      </div>
      <h1>{{this.editModel?'修改优惠券':'创建优惠券'}}</h1>
    </div>
    <el-form class="layer form-panel" ref="form" :model="form"  label-width="120px" label-position="right">
      <el-form-item>
        <template slot="label">
          <div class="form-field">优惠券名称</div>
        </template>
        <el-input class="form-input" :disabled="editModel" placeholder="例如:30元现金券" v-model="form.name" :maxlength=10>
          <i class="el-input__icon" slot="suffix"> {{form.name?form.name.length:0}}/10 </i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">承担者</div>
        </template>
        <el-radio-group v-model="form.underTaker" :disabled="editModel">
          <el-radio :label="0" style="margin-left:8px;">店铺主</el-radio>
        </el-radio-group>
        <div class="help-tip">
          <span>(优惠券金额补贴由商户承担)</span>
        </div>
      </el-form-item>
      <el-form-item v-if="form.type==0">
        <template slot="label">
          <div class="form-field">面额</div>
        </template>
        <el-input class="form-input" :disabled="editModel" placeholder="请输入金额" v-model="form.fullCutPrice"></el-input>
        <span style="margin-left:10px;">元</span>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field" style="margin-top:2px;">使用门槛</div>
        </template>
        <div>
          <span style="margin-left:8px;">满</span>
          <el-input style="width:180px;margin:0 10px;" :disabled="editModel" placeholder="请输入金额" v-model="form.thresholdPrice"></el-input>
          <span>元</span>
          <span style="font-size:14px;color:#cccccc;margin-left:10px;">(如果门槛为0元，则视为使用无限制)</span>
        </div>
        <!-- <el-radio-group v-model="hasThreshold" :disabled="editModel">
          <el-radio label="true">满
            <el-input style="width:180px;margin:0 10px;" :disabled="editModel" placeholder="请输入金额" v-model="form.thresholdPrice"></el-input>元
          </el-radio>
          <el-radio label="false">无限制</el-radio>
        </el-radio-group> -->
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">有效期</div>
        </template>
        <el-radio-group v-model="form.effectiveType" :disabled="editModel">
          <el-radio :label="0" style="margin-left:8px;">固定日期</el-radio>
          <el-radio :label="1"><span style="margin-right:20px;">领券当日开始</span><span v-if="form.effectiveType== 0">N</span>
            <el-input style="width:90px" v-model="form.effectiveDays" v-if="form.effectiveType==1" :disabled="editModel"></el-input><span style="margin-left:10px;">天内有效</span></el-radio>
        </el-radio-group>
        <el-date-picker v-if="form.effectiveType== 0" :disabled="editModel" class="pk-expiry" v-model="effectiveDate" type="daterange" range-separator="- " start-placeholder="开始日期 " end-placeholder="结束日期 " style="margin-left:8px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">领取资格</div>
        </template>
        <el-radio-group v-model="form.receiveType" :disabled="editModel">
          <el-radio :label="0" style="margin-left:8px;">通用</el-radio>
          <el-radio :label="1">新人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">原发行量</div>
        </template>
        <el-input class="form-input" placeholder="不超过10万张" v-model="form.couponNumber" :disabled="editModel"></el-input>
        <span style="margin-left:10px;">张</span>
        <span v-if="editModel">
          <span style="font-size:15px;margin-left:10px;">新增发行量</span>
          <el-input class="form-input" placeholder="不超过10万张" v-model="newCouponNumber"></el-input>
          <span style="margin-left:10px;">张</span>
        </span>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">每人限领</div>
        </template>
        <el-checkbox v-model="checked" @change="startShop" style="margin-left:8px;">开启限领</el-checkbox>
        <el-input class="form-input" style="width:100px;" :disabled="ipt" v-model="form.limitNumber"></el-input>
        <span style="margin-left:10px;">张</span>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">适用商品</div>
        </template>
        <el-radio-group v-model="form.limitProduct" :disabled="editModel">
          <el-radio :label="0" style="margin-left:8px;">全店商品</el-radio>
          <el-radio :label="1">指定商品</el-radio>
          <el-radio :label="2">指定商品不可用</el-radio>
        </el-radio-group>
        <div v-if="form.limitProduct==1">
          <div class="addProduct" :class="{unEdit:unAddProduct}" style="margin-right:20px;" type="text" @click="addGoods">
            <i class="el-icon-plus"></i>添加商品</div>
          <div class="addProduct" :class="{unEdit:unAddProduct}" type="text" @click="addGroupGoods">
            <i class="el-icon-plus"></i>按分组添加</div>
        </div>
        <div v-if="form.limitProduct==1">
          <h3 v-if="form.productList?form.productList.length>0:false">商品</h3>
          <ul class="product-list">
            <li v-for="pitem in form.productList" :key="pitem.id">
              <div class="product-item">
                <img :src="pitem.listImage" />
                <div class="p-name">{{pitem.name}}</div>
                <i class="btn-p-del el-icon-error" @click="delProduct(pitem)"></i>
              </div>
            </li>
          </ul>
          <h3 v-if="form.productGroupList?form.productGroupList.length>0:false">分组</h3>
          <ul class="menu-list" >
            <li v-for="pitem in form.productGroupList" :key="pitem.id">
              <div class="menu-item">
                <img :src="pitem.imageIcon" />
                <div class="p-name">{{pitem.name}}</div>
                <i class="btn-p-del el-icon-error" @click="deMenu(pitem)"></i>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="form.limitProduct==2">
          <div class="addProduct" :class="{unEdit:unAddProduct}" style="margin-right:20px;" type="text" @click="addGoods">
            <i class="el-icon-plus"></i>添加商品
          </div>
          <div class="addProduct" :class="{unEdit:unAddProduct}" type="text" @click="addGroupGoods">
            <i class="el-icon-plus"></i>按分组添加
          </div>
        </div>
        <div v-if="form.limitProduct==2">
          <h3 v-if="form.productList?form.productList.length>0:false">商品</h3>
          <ul class="product-list">
            <li v-for="pitem in form.productList" :key="pitem.id">
              <div class="product-item">
                <img :src="pitem.listImage" />
                <div class="p-name">{{pitem.name}}</div>
                <i class="btn-p-del el-icon-error" @click="delProduct(pitem)"></i>
              </div>
            </li>
          </ul>
          <h3 v-if="form.productGroupList?form.productGroupList.length>0:false">分组</h3>
          <ul class="menu-list">
            <li v-for="pitem in form.productGroupList" :key="pitem.id">
              <div class="menu-item">
                <img :src="pitem.imageIcon" />
                <div class="p-name">{{pitem.name}}</div>
                <i class="btn-p-del el-icon-error" @click="deMenu(pitem)"></i>
              </div>
            </li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom:40px;">
        <template slot="label">
          <div class="form-field" style="margin-top:-3px;">优惠使用说明</div>
        </template>
        <el-input type="textarea" :disabled="editModel" :rows=8 :autosize="{ minRows: 8, maxRows: 10}" :maxlength=100 placeholder="最多输入100个字(支持'Enter'换行)" v-model="form.introduction"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100px;height:44px;" @click="onSubmit">{{this.editModel?'更新':'确定'}}</el-button>
        <el-button class="gridbutton" style="width:100px;height:44px;" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <ProductsSelect pattern="check" limit=100 :visible.sync="psVisible" :checked="form.productList" @select="addProduct" @unSelect="delProduct"></ProductsSelect>
    <GroupsSelect  pattern="check" limit=100 :visible.sync="gsVisible " :checked="form.productGroupList " @select="addMenu " @unSelect="deMenu "></GroupsSelect>
  </div>
</template>

<script>
import GroupsSelect from "@/components/Dialog/GroupsSelect";
import ProductsSelect from "@/components/Dialog/ProductsSelect";
import Breadcrumb from "@/components/Breadcrumb";

import { getProductList } from "@/api/goods";
import { createCoupon, getCouponDetail, updateCoupon } from "@/api/coupon";

export default {
  data() {
    return {
      psVisible: false,
      gsVisible: false,
      editModel: false,
      checked: true,
      ipt:false,
      unAddProduct:false,
      newCouponNumber:'',
      // effectiveDate:'',
      form: {
        adminId:2,
        name: "", //优惠券名称
        underTaker: 0, //承担者 商户：self
        type: 0, //优惠券类型 现金券 fullCut,打折券 discount
        fullCutPrice: '', //面额 type为现金券时传递
        discountRate: null, //折扣 type为打折券时传递
        thresholdPrice: '', //使用门槛
        effectiveType: 0, //有效期类型 固定日期：0 ， 领取后几天内有效：1
        effectiveBeginDate: null, //开始时间 effectiveType为0时传递
        effectiveEndDate: null, //结束时间 effectiveType为0时传递
        effectiveDays: "", //领取后几天内有效 effectiveType为1时传递
        receiveType: 0, //领取资格 全部用户：0 新人用户：1
        couponNumber: '', //发行量
        limitNumber: 1, //限领
        introduction: "", //介绍
        limitProduct: 0, //使用范围 所有商品：0  指定商品：1 指定商品不可用：2
        productList: [], //允许参与商品 当使用范围为指定商品时传递
        productGroupList: [] //允许参与分组 当使用范围为指定商品时传递
      },
      rules:{
        name:[
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          { max: 5, message: '最多10个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    // hasThreshold: {
    //   get() {
    //     if (this.form.thresholdPrice != null) {
    //       return this.form.thresholdPrice != 0 ? "true" : "false";
    //     } else {
    //       return "false";
    //     }
    //   },
    //   set(value) {
    //     console.log(value);
    //     if (value == "true") {
    //       this.form.thresholdPrice = 1;
    //     } else {
    //       this.form.thresholdPrice = null;
    //     }
    //   }
    // },
    effectiveDate: {
      get() {
        if (
          this.form.effectiveBeginDate != null &&
          this.form.effectiveEndDate != null
        ) {
          return [this.form.effectiveBeginDate, this.form.effectiveEndDate];
        } else {
          return "";
        }
      },
      set(value) {

        if (value) {
          this.form.effectiveBeginDate = value[0].getTime();
          this.form.effectiveEndDate = value[1].getTime();
        } else {
          this.form.effectiveBeginDate = null;
          this.form.effectiveEndDate = null;
        }
      }
    }
  },
  components: { ProductsSelect, GroupsSelect, Breadcrumb },
  created() {},
  mounted() {
    this.editModel = this.$route.name == "coupon-edit" ? true : false;
    this.ipt = this.$route.name == "coupon-edit" ? true : false;
    this.unAddProduct = this.$route.name == "coupon-edit" ? true : false;
    if (this.$route.query.id) {
      getCouponDetail(this.$route.query.id).then(res => {
        console.log(res);
        if (res.code == "0") {
          this.form = res.data.coupon;
          this.form.productList = res.data.productInfos;
          this.form.productGroupList= res.data.productGroupInfos;
        }
      });
    }
  },
  methods: {
    // 获取关键指标
    // fetchData(id) {
    //   getCouponDetail();
    // },
    onSubmit() {
      // debugger;
      if(this.form.name == ''){
        this.$message({
          type:'warning',
          message:'请输入优惠券名称'
        })
        return;
      }
      if(this.form.fullCutPrice == ''){
        this.$message({
          type:'warning',
          message:'请输入优惠券金额'
        })
        return;
      }
      if(this.form.thresholdPrice == ''){
        this.$message({
          type:'warning',
          message:'请输入优惠券使用门槛'
        })
        return;
      }
      // if(this.form.effectiveType == 0 && this.form.effectiveBeginDate == null || this.form.effectiveEndDate == null){
      //   this.$message({
      //     type:'warning',
      //     message:'请输入优惠券使用日期'
      //   })
      //   return;
      // }
      if(this.form.effectiveType == 1 && this.form.effectiveDays == ''){
        this.$message({
          type:'warning',
          message:'请输入优惠券使用日期'
        })
        return;
      }
      if(this.form.couponNumber == ''){
        this.$message({
          type:'warning',
          message:'请输入优惠券发行量'
        })
        return;
      }
      if (this.editModel) {
        updateCoupon({
          id: this.form.id,
          couponNumber: this.form.couponNumber + parseInt(this.newCouponNumber) || this.form.couponNumber
        }).then(res => {
          if (res.code == "0") {
            this.$message({
              type: "success",
              message: "更新成功!"
            });
            window.history.back();
          }
        });
      }else{
        createCoupon(this.form).then(res => {
          // if(res.code =="100")
          if (res.code == "0") {
            // this.editModel = true;
            this.$router.push({
              name: "coupon",
              params: {
                needRefresh: true
              }
            });
            this.$message({
              type: "success",
              message: "保存成功!"
            });
          }
        });
      }
    },
    cancel(){
      window.history.back();
    },
    addGoods(){
      if(this.$route.name == "coupon-edit"){
        this.psVisible = false;
      }else{
        this.psVisible = true;
      }
    },
    addGroupGoods(){
      if(this.$route.name == "coupon-edit"){
        this.gsVisible = false;
      }else{
        this.gsVisible = true;
      }
    },
    addProduct(data) {
      // this.psVisible = true;
      this.form.productList.push(data);
    },
    delProduct(data) {
      for (var i = 0; i < this.form.productList.length; i++) {
        if (this.form.productList[i].id == data.id) {
          this.form.productList.splice(i, 1);
          break;
        }
      }
    },
    getMenuProductList(menu) {
      getProductList({
        isMarketable: true,
        pageNum: 1,
        pageSize: 8,
        productGroupId: menu.id
      }).then(res => {
        if (res.code === "0") {
          menu.plist = res.data.data;
        }
      });
    },
    addMenu(data) {
      this.form.productGroupList.push(data);
      // this.getMenuProductList(data);
    },
    deMenu(data) {
      for (var i = 0; i < this.form.productGroupList.length; i++) {
        if (this.form.productGroupList[i].id == data.id) {
          this.form.productGroupList.splice(i, 1);
          break;
        }
      }
    },
    startShop(value) {
      // console.log(value)
      if (value) {
        this.ipt = false;
      } else {
        this.ipt = true;
      }
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.gridbutton {
    &:hover {
      color: #333;
      background-color: #eee;
      border: 1px solid #ccc;
    }
  }
.el-form-item {
  margin-bottom: 30px;
}
.form-field{
  padding:0 10px 0 0;
}
.addProduct {
  cursor: pointer;
  // height: 30px;
  line-height: 30px;
  margin-right: 40px;
  display: inline-block;
  font-size: 14px;
  color: rgba(48, 161, 202, 1);
  border: 1px solid rgba(48, 161, 202, 1);
  padding: 3px 10px;
  margin-top: 10px;
  i {
    font-size: 14px;
    margin-right: 2px;
    font-weight: bold;
  }
  &:hover {
    background: rgba(48, 161, 202, 1);
    color: white;
    padding: 4px 11px;
    // color: rgba(37, 132, 192, 1);
    // background-color: transparent;
    border: none;
    outline: none;
  }
}
.unEdit{
  cursor: pointer;
  line-height: 30px;
  margin-right: 40px;
  display: inline-block;
  font-size: 14px;
  color: rgba(204,204,204,1);
  border: 1px solid rgba(204,204,204,1);
  padding: 3px 10px;
  margin-top: 10px;
  &:hover {
    background:white;
    color: rgba(204,204,204,1);
    padding: 4px 11px;
    // color: rgba(37, 132, 192, 1);
    // background-color: transparent;
    border: 1px solid rgba(204,204,204,1);
    outline: none;
  }
}
.crumbs-panel {
  padding: 22px 40px 20px 40px;
  border-bottom: 1px solid #eee;
}
.panel-title {
  background-color: white;
  h1 {
    padding: 40px;
    margin: 0;
    font-size: 30px;
    color: #333333;
    line-height: 30px;
  }
}
.form-panel {
  padding: 40px;
  background-color: white;
  .form-field {
    // font-weight: bold;
    font-size: 16px;
    color: #333333;
  }
  .form-input {
    width: 260px;
    margin-left: 8px;
  }
  .help-tip {
    display: inline-block;
    font-size: 16px;
    margin-left: 10px;
    span{
      font-size: 14px;
      color:#ccc;
    }
  }
  .pk-expiry {
    display: block;
    margin-top: 20px;
  }
  h3 {
    font-size: 14px;
    color: #333333;
    line-height: 14px;
    font-weight: initial;
    // margin: 8px 0;
    margin-top: 40px;
  }
  .menu-list,
  .product-list {
    list-style: none;
    padding: 0;
    margin: 14px 0 24px 0;
    li {
      display: inline-block;
      position: relative;
      width: 300px;
      height: 60px;
      // margin-right: 14px;
      .menu-item,
      .product-item {
        display: flex;
        justify-content: flex-start;
        align-items: top;
        background-color: #f5f5f5;
        width: 282px;
        height: 69px;
        margin-top: 8px;
        // border:1px solid red;
        .p-name {
          width: 168px;
          margin: 10px 0 0 10px;
          font-size: 14px;
          color: #333333;
          line-height: 14px;
        }
        .btn-p-del {
          color: #ca303a;
          position: absolute;
          top: 32px;
          right: 26px;
          &:hover{
            color:#B52B34;
            cursor: pointer;
          }
        }

        img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          margin: 5px;
        }
      }
      &:nth-child(2n + 1) {
      }
    }
  }
}
</style>
