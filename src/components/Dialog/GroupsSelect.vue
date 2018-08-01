<template>
  <el-dialog title="分组挑选" :visible.sync="visible" width="700px" :before-close="handleClose">

    <el-container>
      <el-main>
        <el-table class="grouplist-panel" :data="grouplist" style="width:100%" border max-height=600>
          <el-table-column label="分组信息" width="180">
            <template slot-scope="scope">
              <div class="p-info">
                <img class="p-img" v-lazy="scope.row.imageIcon||scope.row.image" :key="scope.row.imageIcon||scope.row.image"/>
                <div style="margin-left: 10px">{{ scope.row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="分组简介" min-width="320"></el-table-column>
          <!-- <el-table-column prop="salesTotal" label="总销量" width="80"></el-table-column> -->

          <el-table-column prop="btn-group" label="操作" width="100">
            <template slot-scope="scope">
              <el-button class="btn-Bdel" type="text" v-if="isChecked(scope.row.id)" @click="unSelect(scope.row)">{{pattern=='radio'?'已选择':'已添加'}}</el-button>
              <el-button class="btn-Badd" type="text" v-else @click="select(scope.row)">{{pattern=='radio'?'选择':'添加'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-panel" v-if="grouplist.length>0">
          <el-pagination @current-change="storePageChange" layout="prev, pager, next" :page-size="couponPages.pageSize" :current-page="couponPages.pageNum" :total="couponPages.totalPages">
          </el-pagination>
        </div>
      </el-main>
    </el-container>

    <el-button-group>
      <router-link class="link" to="/goods/category">
        <el-button class="btn-add" icon="el-icon-add">编辑分组</el-button>
      </router-link>
    </el-button-group>
  </el-dialog>
</template>

<script>
import { getGroupList,getGroupListPage } from '@/api/category';

export default {
  created() {},
  data() {
    return {
      grouplist: [],
      selected: [],
      loading: false,
      couponPages: {
        totalPages: 0,
        totalCount: 0,
        pageNum: 1,
        pageSize: 8
      },
    };
  },
  props: {
    visible: false,
    checked: {
      type: Array,
      defalut: []
    },
    limit: null,
    // multiple: false,
    pattern: {
      type: String,
      default: 'radio'
    } // check radio submit
  },
  watch: {
    visible: function(newValue, oldValue) {
      if (newValue) {
        this.fetchData();
        if (this.pattern == 'submit') {
          this.checked = this.checked;
        }
      }
    }
  },
  mounted() {},
  methods: {
    storePageChange(pageNum) {
      this.couponPages.pageNum = pageNum;
      this.fetchData({
        pageNum: this.couponPages.pageNum,
        pageSize: this.couponPages.pageSize
      });
    },
    fetchData() {
      getGroupListPage(
        this.couponPages.pageNum,
        this.couponPages.pageSize
      ).then(res => {
        if (res.code === '0') {
          this.loading = false;
          this.grouplist = res.data.data;
          this.couponPages.totalPages = res.data.total;
        }
      });
    },
    isChecked(id) {
      if (this.checked) {
        return (
          this.checked.find(res => {
            if (res.id == id) {
              return true;
            } else {
              return false;
            }
          }) != null
        );
      } else {
        return false;
      }
    },
    handleClose(done) {
      this.$emit('update:visible', false);
    },
    select(group) {
      if (this.pattern == 'radio' || this.checked.length + 1 >= this.limit) {
        this.$emit('update:visible', false);
      }
      if (this.pattern != 'submit') {
        this.$emit('select', {
          name: group.name,
          imageIcon: group.imageIcon,
          id: group.id
        });
      } else {
        this.checked.push({
          name: product.name,
          listImage: product.listImage,
          distributionPrice: product.distributionPrice,
          id: product.id,
          sn: product.sn
        });
      }
    },
    unSelect(group) {
      if (this.pattern != 'submit') {
        this.$emit('unSelect', {
          id: group.id
        });
      } else {
        for (var i = 0; i < this.checked.length; i++) {
          if (this.checked[i].id == product.id) {
            this.checked.splice(i, 1);
            break;
          }
        }
      }
    },
    submit() {
      this.$emit('submit', this.checked);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.p-info {
  display: flex;
  align-items: center;
  .p-img {
    max-width: 30%;
    max-height: 70px;
    object-fit: cover;
  }
}
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
.el-button-group {
  display: flex;
  justify-content: flex-start;
  .btn-add {
    border-radius: 0;
    border: 1px solid #ca303a;
    color: #ca303a;
  }
}
.el-main {
  padding: 0 0 20px 0;
}
</style>
