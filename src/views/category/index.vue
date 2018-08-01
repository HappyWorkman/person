<template>
  <div class="app-container">
    <div class="layer" style="padding:40px">
      <div class="handle-bar">
        <div class="title" style="font-size:20px;font-weight:bold">商品分组</div>
        <div class="btn-group">
          <el-button type="danger" icon="el-icon-plus" @click="addNewCategory" class="btn-add">新增分组</el-button>
        </div>
      </div>
      <el-table class="productlist-panel" :data="categorys" style="width: 100%" border>
        <el-table-column label="分组名称">
          <template slot-scope="scope">
            <div class="p-info">
              <img class="p-img" v-lazy="scope.row.imageIcon" />
              <div style="margin-left: 10px">{{ scope.row.name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productCount" label="商品数" width="70"></el-table-column>
        <!-- <el-table-column prop="salesTotal" label="优先级" width="80">
          <template slot-scope="scope">
            <div class="sort-panel">
              <i v-show="scope.$index!=0" class="el-icon-caret-top" @click="setOrder(scope,true)"></i>
              <i v-show="scope.$index!=categorys.length-1" class="el-icon-caret-bottom" @click="setOrder(scope,false)"></i>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="isActived" label="分组状态" width="80" align="center">
          <template slot-scope="scope">
            <span :class="(scope.row.isActived==true?'beginning':'finish')">{{getStatus(scope.row.isActived)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="btn-group" label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button class="gridbutton" @click="updateCategoryStatus(scope.row.id,scope.$index,!scope.row.isActived)">{{scope.row.isActived?'关闭':'激活'}}</el-button>
              <el-button class="gridbutton" @click="editCategory(scope.row)">编辑</el-button>
              <el-button class="gridbutton" @click="deleteCategory(scope.row)">删除</el-button>
              <el-button class="gridbutton" @click="editGropuProduct(scope.row)">管理商品</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-panel" v-if="categorys.length>0">
        <el-pagination @current-change="storePageChange" layout="prev, pager, next" :page-size="couponPages.pageSize" :current-page="couponPages.pageNum" :total="couponPages.totalPages">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="categoryForm.id==null?'新增店铺商品分组':'修改店铺商品分组'" :visible.sync="editDialogVisible" width="700px" ref="editDialog">
      <el-form label-position="right" :model="categoryForm" label-width="100px" ref="categoryForm" :rules="rules">
        <el-form-item label="基础信息" prop="name">
          <el-input v-model="categoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分组简介">
          <el-input v-model="categoryForm.description"></el-input>
        </el-form-item>
        <el-form-item label="分组图标" prop="imageIcon">
          <div class="upload-panel">
            <el-upload class="el-upload-icon" :action='actionUrl' :show-file-list="false" :data="{adminId:user.id}" :on-success="imageIconSuccess" :before-upload="beforeImageUpload">
              <img v-if="categoryForm.imageIcon" :src="categoryForm.imageIcon">
              <div v-else>
                <i class="el-icon-upload"></i>
                <div class="tip">上传图片</div>
              </div>
            </el-upload>
            <div class="upload-remark">
              <div class="">*建议格式：PNG或JPG</div>
              <div class="">*建议尺寸：168*168</div>
              <div class="">*图片大小：500k内</div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="分组入口图">
          <div class="upload-panel">
            <el-upload class="el-upload-enter" :action='actionUrl' :show-file-list="false" :data="{adminId:user.id}" :on-success="imageSuccess" :before-upload="beforeImageUpload">
              <img v-if="categoryForm.image" :src="categoryForm.image">
              <div v-else>
                <i class="el-icon-upload"></i>
                <div class="tip">上传图片</div>
              </div>
            </el-upload>
            <div class="upload-remark">
              <div class="">*建议格式：PNG或JPG</div>
              <div class="">*建议尺寸：750*400</div>
              <div class="">*图片大小：500k内</div>
            </div>
          </div>
        </el-form-item> -->
      </el-form>
      <div class="dialog-footer">
        <el-button type="danger" v-if="categoryForm.id==null" @click="addNewCategorysubmitForm">提交</el-button>
        <el-button type="danger" v-if="categoryForm.id!=null" @click="saveCategorysubmitForm">保存</el-button>
        <el-button plain @click="editDialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <ProductsSelect pattern="submit" :completeQuery="true" :visible.sync="groupDialogVisible" :checked="currentGroupPData" @submit="saveProductGroup">
    </ProductsSelect>
  </div>
</template>

<script>
import ProductsSelect from '@/components/Dialog/ProductsSelect';
import {
  getGroupList,
  getGroupListPage,
  addGroup,
  updateGroup,
  deleteGroup,
  changeOrder,
  updateStatus,
  updateProductsGroup
} from '@/api/category';
import { getProductList } from '@/api/goods';
import { getUpload } from '@/api/decorate';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      categorys: [],
      categoryForm: {
        id: null,
        name: '',
        description: '',
        imageIcon: null,
        image: null
      },
      rules: {
        name: { required: true, message: '请输入分组名称', trigger: 'blur' },
        imageIcon: {
          required: true,
          message: '请上传分组图片',
          trigger: 'change'
        }
      },
      editDialogVisible: false,
      groupDialogVisible: false,

      actionUrl: '',
      firstQueryDate: '',

      currentGroupPData: [],

      productGroupList: [],
      currentGroupId: null,
      couponPages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 8
      }
    };
  },
  components: { ProductsSelect },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  created() {
    // this.actionUrl = 'http://beta.s.yjiayun.com/api/fileupload';

    this.search();
  },
  mounted: function() {
    this.getUpload();
  },
  methods: {
    getUpload() {
      // console.log(getUpload())
      this.actionUrl = getUpload();
    },
    storePageChange(pageNum) {
      this.couponPages.pageNum = pageNum;
      this.fetchData({
        pageNum: this.couponPages.pageNum,
        pageSize: this.couponPages.pageSize
      });
    },
    getStatus(type) {
      if (type == true) {
        return '使用中';
      } else {
        return '已关闭';
      }
    },
    search() {
      getGroupListPage(
        this.couponPages.pageNum,
        this.couponPages.pageSize
      ).then(res => {
        if (res.code === '0') {
          this.categorys = res.data.data.map(item => {
            item.status = item.isActived ? '使用中' : '已关闭';
            return item;
          });
          this.couponPages.totalPages = res.data.total;
        }
      });
    },
    updateCategoryStatus(id, index, isActived) {
      updateStatus({ id, isActived }).then(res => {
        if (res.code === '0') {
          var temp = this.categorys[index];
          temp.isActived = isActived;
          temp.status = isActived ? '使用中' : '已关闭';
          this.$set(this.categorys, index, temp);
        }
      });
    },
    editCategory(category) {
      this.categoryForm = JSON.parse(JSON.stringify(category));
      this.editDialogVisible = true;
    },
    deleteCategory(category) {
      this.$confirm('此操作将删除此分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteGroup(category.id).then(res => {
            if (res.code === '0') {
              for (var i = 0; i < this.categorys.length; i++) {
                if (this.categorys[i].id == category.id) {
                  this.categorys.splice(i, 1);
                  break;
                }
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    setOrder(category, rise) {
      changeOrder({
        id: category.row.id,
        upOrDown: rise
      }).then(res => {
        if (res.code === '0') {
          var index = category.$index;
          var target = rise ? index - 1 : index + 1;
          this.categorys.splice(
            index,
            1,
            ...this.categorys.splice(target, 1, this.categorys[index])
          );
        }
      });
    },
    editGropuProduct(category, keyword) {
      this.loading = true;
      this.currentGroupPData = [];
      getProductList({ productGroupId: category.id }).then(res => {
        this.loading = false;
        if (res.code === '0') {
          this.currentGroupPData = res.data.data;
          this.currentGroupId = category.id;
          this.groupDialogVisible = true;
        }
      });
    },
    addProduct(data) {
      this.currentGroupPData.push(data);
    },
    delProduct(data) {
      for (var i = 0; i < this.currentGroupPData.length; i++) {
        if (this.currentGroupPData[i].id == data.id) {
          this.currentGroupPData.splice(i, 1);
          break;
        }
      }
    },

    addNewCategorysubmitForm() {
      this.$refs['categoryForm'].validate(valid => {
        if (valid) {
          addGroup({
            name: this.categoryForm.name,
            imageIcon: this.categoryForm.imageIcon,
            image: this.categoryForm.image,
            description: this.categoryForm.description
          }).then(res => {
            if (res.code === '0') {
              this.editDialogVisible = false;
              this.search();
            }
          });
        } else {
          return false;
        }
      });
    },
    saveCategorysubmitForm() {
      updateGroup({
        id: this.categoryForm.id,
        name: this.categoryForm.name,
        imageIcon: this.categoryForm.imageIcon,
        image: this.categoryForm.image,
        description: this.categoryForm.description
      }).then(res => {
        if (res.code === '0') {
          this.editDialogVisible = false;
          this.search();
        }
      });
    },
    addNewCategory() {
      this.categoryForm = {
        id: null,
        name: null,
        description: null,
        imageIcon: null,
        image: null
      };
      this.editDialogVisible = true;
    },
    imageIconSuccess(res, file) {
      if (res.url != null) {
        this.categoryForm.imageIcon = res.url;
      } else {
        this.categoryForm.imageIcon = URL.createObjectURL(file.raw);
        this.$message.error('上传失败.');
      }
    },
    imageSuccess(res, file) {
      if (res.url != null) {
        this.categoryForm.image = res.url;
      } else {
        this.categoryForm.image = URL.createObjectURL(file.raw);
        this.$message.error('上传失败.');
      }
    },
    beforeImageUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 0.5;

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 500KB!');
      }
      return isLt2M;
    },
    saveProductGroup(data) {
      if (data) {
        updateProductsGroup({
          productGroupId: this.currentGroupId,
          ids: data.map(item => item.id)
        }).then(res => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.groupDialogVisible = false;
            this.search();
          }
        });
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/variables.scss';
@import '../../styles/mixin.scss';
.pagination-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  // position: absolute;
  // bottom: 0px;
  margin-top: 20px;
  width: 100%;
  .el-pagination {
    margin: 0 auto;
  }
}
.el-dialog__footer {
  text-align: left;
}
.beginning {
  color: #30a1ca;
}
.finish {
  color: #999999;
}
.gridbutton {
  &:hover {
    color: #333;
    background-color: #eee;
    border: 1px solid #ccc;
  }
}
.gridbutton:nth-child(3) {
  &:hover {
    border: 1px solid #ca303a;
    color: #ca303a;
    background-color: #f9eaeb;
  }
}
.app-container {
  .handle-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0px 35px 0px;
  }
  .productlist-panel {
    .p-info {
      display: flex;
      align-items: center;
      img {
        min-width: 70px;
        height: 70px;
        object-fit: cover;
      }
    }
  }
  .sort-panel {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    i {
      display: block;
      width: 20px;
      height: 20px;
      font-size: 20px;
      border-radius: 100%;
      background-color: #999;
      color: white;
      margin: 5px 0;
    }
  }
  .upload-panel {
    display: flex;
    align-items: flex-end;
    .upload-remark {
      margin-left: 10px;
    }
  }
  .dialog-footer {
    margin-left: 100px;
    .el-button {
      width: 100px;
      height: 44px;
    }
  }
  .el-upload-icon,
  .el-upload-enter {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    border: solid 1px #eee;
    .tip {
      font-size: 14px;
      color: #999999;
    }
  }

  .el-upload-icon {
    height: 169px;
    width: 169px;
    img {
      height: 169 * 0.9px;
      width: 169 * 0.9px;
      object-fit: contain;
    }
  }
  .el-upload-enter {
    width: 361px;
    height: 193px;
    img {
      width: 361 * 0.9px;
      height: 193 * 0.9px;
      object-fit: contain;
    }
  }
  .transfer-footer {
    margin: 20px;
    &.btn-addToGroup {
      border-color: #ca303a;
      color: #ca303a;
    }
    &.btn-removeFromGroup {
      border: solid 1px #919a6f;
      color: #919a6f;
    }
  }
  .edit-group-product-dialog {
    .btn-group {
      width: 100%;
      margin-top: 40px;
      display: flex;
      justify-content: flex-end;
      .btn-save {
        background-color: #ca303a;
        color: white;
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.product-group-transfer {
  display: flex;
  justify-content: center;
  align-items: center;

  .el-transfer-panel {
    width: 500px;
    min-height: 560px;
    .el-transfer__button {
      background-color: #ca303a;
    }
    .checkbox-group {
      .el-checkbox:nth-child(1) {
        background-color: red;
      }
      .el-checkbox:last-child {
        background-color: red;
      }
    }
    .el-checkbox__input.is-indeterminate,
    .el-checkbox.is-checked {
      .el-checkbox__inner {
        background-color: #ca303a;
        border-color: #ca303a;
      }
    }

    .el-checkbox {
      .el-checkbox__inner:hover {
        border-color: #ca303a;
      }
    }
    .el-checkbox:nth-child(-1) {
      background-color: red;
    }
    .el-transfer-panel__header {
      background-color: #eee;
      .el-checkbox__label {
        color: #666;
      }
    }

    .el-transfer-panel__footer {
      height: 80px;
    }
    .el-transfer-panel__body.is-with-footer {
      height: auto;
      padding-bottom: 80px;
    }
    .el-transfer-panel__list {
      min-height: 376px;
    }
    .el-transfer-panel__item {
      height: auto;
      &:nth-child(-1) {
        background-color: red;
      }
      .el-checkbox__label {
        word-wrap: break-word;
        .load-more {
          display: none;
          margin-left: 90px;
        }
      }
      .el-checkbox__label:hover {
        border-color: #ca303a;
      }
    }
  }
  .group-transfer-content {
    display: flex;
    .group-transfer-item {
      white-space: initial;
      font-size: 14px;
      color: #999999;
      padding-right: 10px;
    }
  }
  // .el-transfer__buttons {
  //   .el-button {
  //     background-color: #ca303a;
  //     border-color: #ca303a;
  //   }
  // }
}
</style>
