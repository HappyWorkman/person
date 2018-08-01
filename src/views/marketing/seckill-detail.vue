<template>
  <div class="app-container">

    <div class="panel-title layer">
      <div class="crumbs-panel">
        <breadcrumb></breadcrumb>
        <!-- <router-link to="./coupon">优惠券列表</router-link>
        <i class="el-icon-arrow-right"></i>
        <span>创建优惠券</span> -->
      </div>
      <h1>{{this.editModel?'修改秒杀活动':'创建秒杀活动'}}</h1>
    </div>
    <el-form class="layer form-panel" ref="form" :model="form" label-width="120px" label-position="right">
      <el-form-item>
        <div class="seckillTile">选择商品</div>
        <!-- <template slot-scope="scope"></template> -->
        <div class="avatar-uploader" v-if="!isShow" @click="psVisible=true">
          <svg-icon :icon-class="'add2'" style="color: #999; font-size: 36px;margin-top:55px;"></svg-icon>
          <div class="add-text" style="font-size:16px;margin-top:-8px;">添加商品</div>
          <div style="font-size:12px;color:#CA303A;margin-top:-20px;">只能添加一个商品</div>
        </div>
        <div class="seckillGoods" v-if="isShow">
          <!-- <i class="el-icon-close iconClose" v-if="isShow" @click="deletedGodds"></i> -->
          <i class="btn-p-del el-icon-error" v-if="isShow" @click="deletedGodds"></i>
          <img :src="imageUrl" class="show-image" alt="" @click="dbChooseImg">
          <div class="goodsDesc">{{imageDescribe}}</div>
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom:57px;margin-top:-22px;">
        <!-- <div class="seckillTile">秒杀规则</div> -->
        <span style="margin-left:-100px;">设置秒杀价&秒杀库存</span>
        <el-table :data="seckillRuleList " @selection-change="selectCheck($event)" :header-row-style="getRowClass" style="margin-left:-100px;">
          <el-table-column type="selection" width="55" :selectable="selectable">
          </el-table-column>
          <el-table-column label="规格SKU">
            <template slot-scope="scope">{{ scope.row.goodsSpec }}</template>
          </el-table-column>
          <el-table-column label="供货价">
            <template slot-scope="scope">{{ scope.row.goodsSupplyPrice }}</template>
          </el-table-column>
          <el-table-column label="日常售价">
            <template slot-scope="scope">{{ scope.row.goodsOrigPrice }}</template>
          </el-table-column>
          <el-table-column label="库存">
            <template slot-scope="scope">{{ scope.row.goodsStock=='-1'?'不限':scope.row.goodsStock}}</template>
          </el-table-column>
          <el-table-column label="秒杀价">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price" :disabled="editModel"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="秒杀库存">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" :disabled="editModel"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="秒杀销量">
            <template slot-scope="scope">{{ scope.row.sales }}</template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <div class="seckillTile">设置活动</div>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">秒杀名称</div>
        </template>
        <el-input class="form-input" :disabled="editModel" placeholder="请输入活动名称" v-model="form.name" :maxlength=15>
          <i class="el-input__icon" slot="suffix"> {{form.name?form.name.length:0}}/15 </i>
        </el-input>

      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">活动标签</div>
        </template>
        <el-input class="form-input" :disabled="editModel" placeholder="秒杀" v-model="form.tags" :maxlength=5>
          <i class="el-input__icon" slot="suffix">5字 </i>
        </el-input>
        <div class="tip">标签文字将展示于商品详情的秒杀信息处，2至5字</div>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">每人限购</div>
        </template>
        <el-checkbox v-model="checked" @change="startShop" style="margin-left:-20px;" :disabled="editModel">开启限购</el-checkbox>
        <el-input v-model="form.perLimit" style="width:100px; margin-left:10px;" :disabled="ipt"></el-input>&nbsp;&nbsp;&nbsp;件
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="form-field">秒杀模式</div>
        </template>
        <el-radio-group v-model="form.mode" @change="seckillChange">
          <el-radio :label="0" style="margin-left:-20px;" :disabled="editModel">普通秒杀&nbsp;&nbsp;
            <el-tooltip content="总库存" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-radio>
          <el-radio :label="1" :disabled="editModel">周期秒杀&nbsp;&nbsp;
            <el-tooltip content="每日库存" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.mode=='0'">
        <template slot="label">
          <div class="form-field">活动时间</div>
        </template>
        <el-date-picker :disabled="editModel" class="pk-expiry" v-model="effectiveDate" type="datetimerange" range-separator="- " start-placeholder="开始日期 " end-placeholder="结束日期 " style="margin-left:-22px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-if="form.mode=='1'">
        <template slot="label">
          <div class="form-field">活动周期</div>
        </template>
        <el-date-picker style="margin-left:-20px;" v-model="effectiveDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-if="form.mode=='1'">
        <template slot="label">
          <div class="form-field">每日秒杀时间</div>
        </template>
        <!-- <el-time-picker v-model="form.beginTime"  format="HH:mm:ss" placeholder="开始时间">
        </el-time-picker>
        <el-time-picker v-model="form.endTime" format="HH:mm:ss" placeholder="结束时间">
        </el-time-picker> -->
        <el-time-picker style="margin-left:-20px;" is-range range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" v-model="effectiveTime" placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item style="margin-left:-21px;">
        <el-button type="primary" style="width:100px;height:44px;" @click="onSubmit">提交</el-button>
        <el-button class="gridbutton" style="width:100px;height:44px;" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <ProductsSelect :visible.sync="psVisible" :checked="form.productIds" @select="addProduct" @unSelect="delProduct"></ProductsSelect>
  </div>
</template>

<script>
import GroupsSelect from '@/components/Dialog/GroupsSelect';
import ProductsSelect from '@/components/Dialog/ProductsSelect';
import Breadcrumb from '@/components/Breadcrumb';

import { getProductList } from '@/api/goods';
import { createSeckill, goodsList, getSeckillDetail } from '@/api/seckill';
// import { formatTime } from '@/utils/index';

export default {
  data() {
    return {
      imageUrl: '',
      imageDescribe: '',
      psVisible: false,
      gsVisible: false,
      editModel: false,
      checked: true,
      isShow: false,
      // isActiveShow: true,
      ipt: false,
      goodsId: '',
      seckillRuleList: [],
      createSeckillId: '',
      isShowSeckillRule: true,
      // test11: [new Date(), new Date()],
      effectiveTime: '',
      effectiveDateTest1:[new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      form: {
        spuId: '', //货品ID
        name: '', //秒杀名称
        goodsName: '', //货品名称
        perLimit: 0, //每人限购数量：0不限购，其他限购数量
        tags: '',
        mode: 0, //秒杀模式：普通秒杀：0 ，周期秒杀：1
        beginDateTime: '', //秒杀活动开始时间
        endDateTime: '', //秒杀活动结束时间
        beginTime: null, //秒杀活动每日开始时间
        endTime: null, //秒杀活动每日结束时间
        status: 0, // 开始：0，结束：1
        deleted: 0, //未删除：0， 已删除：1
        goodsPic: '', //商品图片
        adminId: '', //商户id
        sales: '', //秒杀销量
        detailList: []
      }
    };
  },
  computed: {
    effectiveDate: {
      get() {
        if (this.form.beginDateTime != null && this.form.endDateTime != null) {
          return [this.form.beginDateTime, this.form.endDateTime];
        } else {
          return '';
        }
      },
      set(value) {
        if (value) {
          // console.log(value);
          this.form.beginDateTime = value[0].getTime();
          this.form.endDateTime = value[1].getTime();
        } else {
          this.form.beginDateTime = null;
          this.form.endDateTime = null;
        }
      }
    }
  },
  components: { ProductsSelect, GroupsSelect, Breadcrumb },
  watch: {
    effectiveTime: function() {
      if (!this.effectiveTime) {
        this.form.beginTime = this.form.endTime = '';
        return;
      }
      this.form.beginTime =
        this.effectiveTime[0].getHours() +
        ':' +
        ('0' + this.effectiveTime[0].getMinutes()).slice(-2) +
        ':' +
        ('0' + this.effectiveTime[0].getSeconds()).slice(-2);
      this.form.endTime =
        this.effectiveTime[1].getHours() +
        ':' +
        ('0' + this.effectiveTime[1].getMinutes()).slice(-2) +
        ':' +
        ('0' + this.effectiveTime[1].getSeconds()).slice(-2);
    }
  },
  created() {},
  mounted() {
    this.editModel = this.$route.name == 'seckill-edit' ? true : false;
    this.checked = this.$route.name == 'seckill-edit' ? false : true;
    this.ipt = this.$route.name == 'seckill-edit' ? true : false;
    if (this.$route.query.id) {
      getSeckillDetail(this.$route.query.id).then(res => {
        // console.log(res);
        if (res.code == '0') {
          this.form = res.data;
          this.imageUrl = res.data.goodsPic;
          this.seckillRuleList = res.data.detailList;
          this.imageDescribe = res.data.goodsName;
          this.isShow = true;
        }
      });
    }
    // this.selectable();
  },
  methods: {
    selectable(row){
      // console.log(row.goodsStock)
      // if(this.$route.name == 'seckill-edit' || row.goodsStock == 0)
      if(this.$route.name == 'seckill-edit'){
        return false;
      }else{
        return true;
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background: #f8f8f8';
      } else {
        return '';
      }
    },
    dbChooseImg() {
      if(this.$route.name == 'seckill-edit'){
        this.psVisible = false;
      }else{
        this.psVisible = true;
      }
    },
    seckillChange(value) {
      // console.log(value);
      if (value == '0') {
      } else {
      }
    },
    startShop(value) {
      if (value) {
        this.ipt = false;
      } else {
        this.ipt = true;
      }
    },
    // 获取关键指标
    // fetchData(id) {
    //   getCouponDetail();
    // },
    addProduct(data) {
      // debugger;
      this.isShow = true;
      this.imageUrl = data.listImage;
      this.imageDescribe = data.name;
      this.goodsId = data.id;
      goodsList(this.goodsId).then(res => {
        if (res.code == '0') {
          this.seckillRuleList = res.data.skuList;
          this.form.spuId = res.data.spuId;
          this.seckillRuleList.map(item => {
            item.price = '';
            item.stock = '';
            if(item.goodsStock !=-1){
              item.stock = item.goodsStock;
            }else{
              item.stock = '';
            }
          });
        }
      });
    },
    selectCheck(select) {
      // debugger;
      let options = {
        price: '',
        stock: '',
        skuId: ''
      };
      this.form.detailList = select;
      this.form.detailList.map(item => {
        // console.log(item);
        options.price = item.price;
        options.stock = item.stock;
        options.skuId = item.skuId
      })
    },
    onSubmit() {
      if (this.editModel) {
        updateCoupon({
          id: this.form.id,
          circulation: this.form.circulation
        }).then(res => {
          if (res.code == '0') {
            this.$message({
              type: 'success',
              message: '更新成功!'
            });
          }
        });
      }
      if (this.form.name == '') {
        this.$message({
          type: 'warning',
          message: '请输入秒杀名称'
        });
        return;
      }
      if (
        this.form.mode == '0' &&
        this.form.beginDateTime == '' &&
        this.form.endDateTime == ''
      ) {
        this.$message({
          type: 'warning',
          message: '请输入秒杀活动时间'
        });
        return;
      }
      if (
        this.form.mode == '1' &&
        this.form.beginDateTime == '' &&
        this.form.endDateTime == ''
      ) {
        this.$message({
          type: 'warning',
          message: '请输入秒杀日期'
        });
        return;
      }
      if (
        this.form.mode == '1' &&
        this.form.beginTime == null &&
        this.form.endTime == null
      ) {
        this.$message({
          type: 'warning',
          message: '请输入秒杀活动时间'
        });
        return;
      } else {
        createSeckill(this.form).then(res => {
          if (res.code == '0') {
            // this.editModel = true;
            this.$router.push({
              name: 'seckill',
              params: {
                needRefresh: true
              }
            });
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          }
        });
      }
    },
    cancel() {
      window.history.back();
    },
    delProduct(data) {
      for (var i = 0; i < this.form.productIds.length; i++) {
        if (this.form.productIds[i].id == data.id) {
          this.form.productIds.splice(i, 1);
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
        if (res.code === '0') {
          menu.plist = res.data.data;
        }
      });
    },
    addMenu(data) {
      this.form.productGroupIds.push(data);
      this.getMenuProductList(data);
    },
    deMenu(data) {
      for (var i = 0; i < this.form.productGroupIds.length; i++) {
        if (this.form.productGroupIds[i].id == data.id) {
          this.form.productGroupIds.splice(i, 1);
          break;
        }
      }
    },
    deletedGodds() {
      if(this.$route.name == 'seckill-edit'){
        this.isShow = true;
      }else{
        this.isShow = false;
        this.seckillRuleList  = '';
      }
      
      
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.btn-p-del {
    font-size: 22px;
    color: #ca303a;
    position: absolute;
    top: 10px;
    right: 10px;
    &:hover{
      color:#B52B34;
      cursor: pointer;
    }
}
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
.form-field {
  // padding:0 24px 0 0;
  .form-input {
    margin-left: -20px;
  }
}
thead tr {
  background-color: #f8f8f8;
}
.seckillTile {
  margin-left: -120px;
  font-size: 24px;
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
  .avatar-uploader {
    width: 200px;
    height: 200px;
    // margin: 30px 0 0 20px;
    text-align: center;
    // margin-left: 50px;
    border: 1px solid #d9d9d9;
    cursor: pointer;
    margin-left: -101px;
    margin-top: 30px;
  }
  .avatar-uploader:hover {
    border: 1px solid #666666;
  }
  .seckillGoods {
    width: 474px;
    height: 210px;
    // border:1px solid red;
    position: relative;
    background-color: #f5f5f5;
    margin-left: -100px;
    margin-top: 23px;
    margin-bottom: 10px;
    .iconClose {
      position: absolute;
      right: 15px;
      top: 10px;
      font-size: 16px;
      cursor: pointer;
      // width: 24px;
      // height: 24px;
      // color:red
    }
    .goodsDesc {
      // display: inline;
      position: absolute;
      left: 212px;
      top: 10px;
      width: 224px;
      // line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333333;
      font-size: 16px;
    }
  }
  .iconClose:hover {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: #ca303a;
    color: #fff;
    text-align: center;
    line-height: 22px;
  }
  .show-image {
    width: 180px;
    height: 180px;
    // border: 1px dashed #d9d9d9;
    // border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    object-fit: cover;
    object-position: center;
    background-color: #f8f8f8;
    top: 15px;
    left: 17px;
  }
  .el-upload {
    width: 100%;
    height: 100%;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 200px;
    text-align: center;
  }
  .form-field {
    // font-weight: bold;
    font-size: 16px;
    color: #333333;
    width: 120px;
    margin-left: -40px;
  }
  .tip {
    font-size: 12px;
    color: #999999;
  }
  .form-input {
    width: 260px;
    margin-left: -20px;
  }
  .help-tip {
    display: inline-block;
    font-size: 16px;
  }
  .pk-expiry {
    display: block;
  }
  h3 {
    font-size: 14px;
    color: #333333;
    line-height: 14px;
    font-weight: initial;
  }
  .menu-list,
  .product-list {
    list-style: none;
    padding: 0;
    li {
      display: inline-block;
      position: relative;
      width: 300px;
      height: 60px;
      margin-right: 14px;
      .menu-item,
      .product-item {
        display: flex;
        justify-content: flex-start;
        align-items: top;
        .p-name {
          width: 168px;
          margin: 0 20px;
          font-size: 14px;
          color: #333333;
          line-height: 14px;
        }
        .btn-p-del {
          color: #ca303a;
          position: absolute;
          top: 23px;
          right: 0;
        }

        img {
          width: 60px;
          height: 60px;
          object-fit: cover;
        }
      }
      &:nth-child(2n + 1) {
      }
    }
  }
}
</style>
