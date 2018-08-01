<template>
  <div>
    <Card :id="id" class="card-carousel" :namebrand="decorate.components['image_carousel'].name">
      <template slot="cfg-view">
        <el-carousel class="cfg-content" height="192px" @change="_carouse_change" indicator-position="none" v-if="cfg.imageList && cfg.imageList.length>0">
          <el-carousel-item v-for="item in cfg.imageList" :key="item.name">
            <img class="img_pro" :src="item.url" ref="cfgviewimg" />

          </el-carousel-item>
        </el-carousel>
        <div class="cfg-content" v-else>
          <img class="img_empty" :src="img_Empty" />
          <div class="text">请点击该区域并在右侧配置框内添加图片</div>
        </div>
        <div class="img_indicator">
          <div class="ind_item" :class="{current:currentImgIndex==index}" v-for="(item,index) in cfg.imageList" :key="item.name"></div>
        </div>
      </template>
      <template slot="form-view-title">{{cfg.name}}</template>
      <template slot="form-view">
        <div class="form-view-content">
          <div class="view-title">
            <h2>添加图片</h2>
            <div class="progress">{{cfg.imageList.length}}/6</div>
          </div>
          <div class="img-upload-tip">建议图片宽度750px、高度360px。支持png、jpeg、jpg</div>
          <ul class="object-list img-list">
            <li class="img-item object-item" v-for="(img,index) in cfg.imageList" :key="img.id">
              <div class="order-tool">
                <div class="btn-up btn-item" @click="changeImgOrder(index,'up')">
                  <svg-icon iconClass="arrows-up"></svg-icon>
                </div>
                <div class="btn-down btn-item" @click="changeImgOrder(index,'down')">
                  <svg-icon iconClass="arrows-down"></svg-icon>
                </div>
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
          <el-upload v-if="cfg.imageList.length<6" :show-file-list="false" :data="{adminId:user.id}" class="upload-panel" :action="uploadServerUrl" :file-list="cfg.imageList " :on-success="handleSuccess " :on-remove="handleRemove ">
            <div class="btn-upload">
              <i class="el-icon-plus "></i>
              <span>点击上传</span>
            </div>
          </el-upload>
        </div>
        <!-- <div class="btn-save" @click="saveData">保存</div> -->
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
import img_Empty from '@/assets/decorate/img-empty2.png';
import { mapGetters, mapState } from 'vuex';
import {getUpload} from '@/api/decorate';
export default {
  components: { Card, ProductsSelect, GroupsSelect },
  computed: {},
  data() {
    return {
      currentImgIndex: 0,
      data: {},
      uploadServerUrl: '',
      dialogVisible: false,
      psVisible: false,
      gsVisible: false,
      currentDialogData: {
        target: {
          name: null
        }
      },
      loading: false,
      autoHeight: '2rem',
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
  mounted: function(el) {
    var cpage = this;
    this.data = this.$store.state.decorate.cfg.find(item => {
      if (item != null) {
        return item.id == cpage.id;
      } else {
        return false;
      }
    });

    // var page = this;
    // window.onresize = () => {
    //   if (page.$refs.cfgviewimg) {
    //     page.autoHeight = 360 / 750 * page.$refs.cfgviewimg.width + 'px';
    //   }
    // };
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
    _carouse_change(index) {
      this.currentImgIndex = index;
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
.card-carousel {
  // width: 4rem;
}
.cfg-view {
  position: relative;
  .img_indicator {
    position: absolute;
    bottom: 10px;
    // border: 1px solid red;
    left: 00%;
    width: 400px;
    height: 20px;
    // margin-left: -150px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
    .ind_item {
      width: 8px;
      height: 8px;
      border-radius: 10em;
      background-color: white;
      border: 1px solid rgba(51, 51, 51, 1);
      margin-right: 5px;
      &.current {
        border-color: white;
        width: 6px;
        height: 6px;
        background-color: rgba(51, 51, 51, 1);
      }
    }
  }
}
.cfg-content {
  background-color: #eeeeee;

  text-align: center;

  .img_empty {
    margin-top: 50px;
  }
  .img_pro {
    width: 100%;
    // height: 1.92rem;
    object-fit: contain;
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
      // padding: 0 30px;
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
    .img-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 0.12rem;
      overflow: hidden;
      background-color: #eee;
      position: relative;
      margin-bottom: 10px;
      .btn-up {
        padding: 4px;
      }
      .btn-down {
        padding: 4px;
      }

      // .img-detail-info {
      //   width: 1.4rem;
      //   height: 100%;
      //   display: flex;
      //   justify-content: space-between;
      //   align-items: center;
      //   i {
      //     display: block;
      //   }
      //   .text-tip {
      //     min-width: 3em;
      //     margin-left: 0.04rem;
      //     margin-right: 20px;
      //   }
      //   .img-target {
      //     width: 1.2rem;
      //     overflow: hidden;
      //     text-overflow: ellipsis;
      //     white-space: nowrap;
      //   }
      //   .text-close {
      //     cursor: pointer;
      //     font-size: 12px;
      //     min-width: 2em;
      //     margin: 0 7px;
      //     color: #ca303a;
      //     letter-spacing: 0;
      //     line-height: 12px;
      //   }
      // }
      // .option-tip {
      //   margin-left: 5%;
      //   min-width: 2em;
      //   cursor: pointer;
      // }
      // .thumbnail {
      //   width: 66px;
      //   height: 66px*360/750;
      //   background-color: #cccccc;
      //   overflow: hidden;
      //   position: relative;
      //   img {
      //     height: 100%;
      //     width: 100%;
      //     object-fit: cover;
      //   }
      //   .img-upload-panel {
      //     position: absolute;
      //     color: white;
      //     text-align: center;
      //     bottom: 0;
      //     left: 0;
      //     width: 100%;
      //     height: 18px;
      //     line-height: 18px;
      //     font-size: 12px;
      //     background-color: #515151;
      //   }
      // }
    }
  }
}
</style>

