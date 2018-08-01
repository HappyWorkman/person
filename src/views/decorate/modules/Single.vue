<template>
  <div>
    <Card :id="id" class="card-single" :namebrand="decorate.components['image_single'].name">
      <template slot="cfg-view">
        <div class="cfg-content" v-if="cfg.imageList && cfg.imageList.length>0">
          <img class="img_pro" :src="item.url" v-for="item in cfg.imageList" :key="item.name" />
        </div>
        <div class="cfg-content" v-else>
          <img class="img_empty" :src="img_Empty" />
          <div class="text">请点击该区域并在右侧配置框内添加图片</div>
        </div>
      </template>
      <template slot="form-view-title">{{cfg.name}}</template>
      <template slot="form-view">
        <div class="form-view-content">
          <div class="view-title">
            <h2>添加图片</h2>
            <div class="progress">{{cfg.imageList.length}}/6</div>
          </div>
          <div class="img-upload-tip">建设图片尺寸750*360，支持png、jpeg、jpg</div>
          <ul class="object-list img-list">
            <li class="object-item" v-for="(img,index) in cfg.imageList" :key="img.id">
              <div class="order-tool">
                <div class="btn-up btn-item" @click="changeImgOrder(index,'up')">
                  <svg-icon iconClass="arrows-up"></svg-icon>
                </div>
                <div class="btn-down btn-item" @click="changeImgOrder(index,'down')">
                  <svg-icon iconClass="arrows-down"></svg-icon>
                </div>
                <!-- <div class="btn-up el-icon-arrow-up" @click="changeImgOrder(index,'up')"></div>
                <div class="btn-down el-icon-arrow-down" @click="changeImgOrder(index,'down')"></div> -->
              </div>
              <div class="thumbnail">
                <img :src="img.url" />
                <el-upload :show-file-list="false" :data="{adminId:user.id}" class="img-upload-panel" :action="uploadServerUrl" :file-list="cfg.imageList " :on-success="file=>{changeSuccess(file,img)}" :on-remove="handleRemove ">
                  更换图片
                </el-upload>
              </div>

              <div class="object-detail-info" v-if="img.type==null">
                <div class="text-tip">跳转至</div>
                <div class="option-tip" @click="currentDialogData=img;psVisible = true">单品</div>
                <div class="option-tip" @click="currentDialogData=img;gsVisible = true">分组</div>
                <div class="option-tip" @click="currentDialogData=img;dialogVisible = true">网址</div>
              </div>
              <div class="object-detail-info" v-else>
                <div class="text-close" @click="cleanType(img)">移除</div>
                <el-tooltip :content="img.type=='url'?img.target:img.target.name" placement="top-start">
                  <div class="img-target">{{img.type=='url'?img.target:img.target.name}}</div>
                </el-tooltip>
              </div>
              <div class="btn-delete-panel">
                <div class="btn-delete el-icon-delete" @click="delImg(img)"></div>
              </div>
            </li>
          </ul>
          <el-upload v-show="cfg.imageList.length<6" :show-file-list="false" :data="{adminId:user.id}" multiple class="upload-panel" :action="uploadServerUrl" :file-list="cfg.imageList " list-type="text " :on-success="handleSuccess " :on-remove="handleRemove ">
            <div class="btn-upload ">
              <i class="el-icon-plus "></i>
              <span>点击上传</span>
            </div>
          </el-upload>
        </div>
        <el-button class="btn-save" @click="saveData" :disabled="!needSave" :loading="loading">{{loading?'加载中':'保 存'}}</el-button>
      </template>
    </Card>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <el-input placeholder="请输入内容" v-model="currentDialogData.target">
        <template slot="prepend">Http://</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="dialogVisible = false;setTarget('url',currentDialogData.target)">{{loading?'加载中':'确 定'}}</el-button>
      </span>
    </el-dialog>
    <ProductsSelect :visible.sync="psVisible" @select="data=>{setTarget('good',data)}"></ProductsSelect>
    <GroupsSelect :visible.sync="gsVisible" @select="data=>{setTarget('group',data)}"></GroupsSelect>
  </div>

</template>

<script>
import Card from './frame/card';
import ProductsSelect from '@/components/Dialog/ProductsSelect';
import GroupsSelect from '@/components/Dialog/GroupsSelect';
import img_Empty from '@/assets/decorate/img-empty.png';
import { mapGetters, mapState } from 'vuex';
import {getUpload} from '@/api/decorate';
export default {
  components: { Card, ProductsSelect, GroupsSelect },
  computed: {},
  data() {
    return {
      data: {},
      uploadServerUrl: '',
      psVisible: false,
      gsVisible: false,
      dialogVisible: false,
      currentDialogData: {},
      loading: false,
      needSave: false,
      img_Empty
    };
  },
  watch: {
    cfg: {
      handler(newValue, oldValue) {
        if (newValue == oldValue) {
          this.needSave = true;
        } else {
          // console.log(newValue);
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['user', 'decorate']),
    cfg: function() {
      if (this.data.data) {
        return this.data.data.data;
      } else {
        return {
          imageList: []
        };
      }
    }
  },
  props: {
    id: null
  },
  mounted: function() {
    var cpage = this;
    this.data = this.$store.state.decorate.cfg.find(item => {
      if (item != null) {
        return item.id == cpage.id;
      } else {
        return false;
      }
    })
    this.getUpload();
  },
  methods: {
    // 接口方法
    saveData() {
      this.loading = true;
      this.$store.dispatch('SaveComponent', this.data).then(res => {
        if (res.code == '0') {
          this.needSave = false;
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
        this.loading = false;
      });
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSuccess(file) {
      this.data.data.data.imageList.push({
        url: file.url,
        target: null,
        type: null
      });
    },
    changeSuccess(file, data) {
      data.url = file.url;
    },
    setTarget(type, data) {
      var imgData = this.data.data.data.imageList.find(
        res => res.url == this.currentDialogData.url
      );
      if (imgData) {
        imgData.target = data;
        imgData.type = type;
      } else {
        console.log('没有指定图片记录');
      }
    },
    cleanType(imgData) {
      // var imgData = this.data.data.data.imageList.find(
      //   res => res.url == this.currentDialogData.url
      // );
      if (imgData) {
        imgData.target = null;
        imgData.type = null;
      } else {
        console.log('没有指定图片记录');
      }
    },
    delImg(imgData) {
      for (var i = 0; i < this.cfg.imageList.length; i++) {
        if (this.cfg.imageList[i].url == imgData.url) {
          this.cfg.imageList.splice(i, 1);
          break;
        }
      }
    },
    changeImgOrder(index, type) {
      var cfg = this.data.data.data.imageList;
      if (index == cfg.length - 1 && type == 'down') {
        return;
      }
      if (index == 0 && type == 'up') {
        return;
      }
      if (type == 'up') {
        cfg[index - 1] = cfg.splice(index, 1, cfg[index - 1])[0];
      } else if (type == 'down') {
        cfg[index + 1] = cfg.splice(index, 1, cfg[index + 1])[0];
      }
    },
    getUpload(){
      // console.log(getUpload())
      this.uploadServerUrl = getUpload();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import './frame/card.scss';
.cfg-content {
  .img_empty {
    margin-top: 50px;
  }
  .img_pro {
    width: 100%;
    object-fit: contain;
    font-size: 0px;
    display: block;
    vertical-align: bottom;
  }
  .text {
    font-size: 14px;
    line-height: 45px;
    letter-spacing: 0px;
    color: #666666;
  }
}
.form-view-content {
  .view-title {
    height: 45px;
  }
  .img-upload-tip {
    font-size: 12px;
    color: #999999;
    line-height: 18px;
  }
  .upload-panel {
    background-color: #eeeeee;
    text-align: center;
    margin: 10px 0;
    .btn-upload {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      font-size: 14px;
      height: 40px;
      color: #666;
      &:hover {
        background: #e1e1e1;
      }
    }
  }

  .img-list {
    list-style: none;
    padding: 0;
  }
}
</style>

