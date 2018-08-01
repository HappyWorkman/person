<template>
  <div class="card-content">
    <div class="cfg-view" @click="edit" :class="{editing:id==decorate.currentCfg.id}">
      <slot name="cfg-view"></slot>
    </div>
    <div class="card-name-brand" v-show="id!=decorate.currentCfg.id || id==null">
      {{namebrand}}
    </div>
    <div class="btn-group" v-show="id==decorate.currentCfg.id && id!=null">
      <!-- <i class="el-icon-setting"></i> -->
      <div class="btn-item" @click="changeOrder('up')">
        <svg-icon iconClass="arrows-up"></svg-icon>
      </div>
      <div class="btn-item" @click="changeOrder('down')">
        <svg-icon iconClass="arrows-down"></svg-icon>
      </div>
      <div class="btn-item btn-delete" @click="delComponent">
        <svg-icon iconClass="delete"></svg-icon>
      </div>
    </div>
    <div class="form-view" v-show="id==decorate.currentCfg.id && id!=null" ref="cfgview">
      <div class="form-view-header">
        <div class="form-view-title">
          <slot name="form-view-title"></slot>
        </div>
        <div class="btn-close el-icon-close" @click="close"></div>
      </div>
      <slot class="form-view-content" name="form-view"></slot>
    </div>

    <slot name="cfg-view-fit"></slot>
    <slot name="cfg-view-remark"></slot>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  components: {},
  computed: {
    ...mapState(['decorate']),
    ...mapGetters(['currentDecorateId'])
  },
  props: {
    id: null,
    namebrand: ''
  },
  data: () => {
    return {
      cardHeight: 0
    };
  },
  mounted: function() {
    this.cardHeight = this.$refs.cfgview.clientHeight;
  },
  methods: {
    edit() {
      this.$store.commit('TOGGLE_EDIT', this.id);
      setTimeout(res => {
        this.$store.commit('SYNC_HEIGHT', this.$refs.cfgview.clientHeight);
      }, 200);
    },
    close() {
      this.$store.commit('TOGGLE_EDIT', null);
    },
    delComponent() {
      this.$confirm('将删除此模块, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('DelComponent', this.id);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    changeOrder(type) {
      var cfg = this.decorate.cfg;
      var index = null;
      for (var i = 0; i < cfg.length; i++) {
        if (cfg[i].id == this.id) {
          if (i == cfg.length - 1 && type == 'down') {
            break;
          }
          if (i == 0 && type == 'up') {
            break;
          }
          index = i;
          break;
        }
      }
      if (index != null) {
        this.$store
          .dispatch('UpdateOrder', { id: this.id, type, index })
          .then(res => {
            if (res.code == '0') {
              this.$message({
                message: '操作成功!'
              });
            }
          });
      }
      // this.$store.dispatch('UpdateOrder', this.id, type);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card-content {
  display: flex;
  position: relative;
  // min-width: 700px;
  margin: 0 auto;
  min-height: 50px;
  margin-bottom: 10px;
  .btn-group {
    position: absolute;
    left: 400px;
    z-index: 99;
    text-align: center;
    width: 0.3rem;
    max-width: 30px;
    margin: 0 5px;
    background-color: #ffffff;
    box-shadow: 0 0 10px 0 rgba(153, 153, 153, 0.25);
    // font-size: 0.16rem;
    .btn-item {
      margin: 5px 0;
      &:hover {
        svg {
          color: #666;
        }
      }
    }
    i,
    svg {
      margin: 5px 0;
      cursor: pointer;
      color: #8a8a8a;
      font-size: 15px;
    }
    .el-icon-setting {
      font-size: 15px;
      color: #ca303a;
    }
    .btn-delete {
      border-top: 2px solid #eee;
      padding: 8px 0 0 0;
    }
    .btn-delete:hover {
      svg {
        color: #ca303a;
      }
    }
  }
  .form-view {
    position: absolute;
    z-index: 99;
    left: 440px;
    width: calc(100% - 460px);
    max-width: 350px;
    min-width: 270px;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.25);
    padding-top: 20px;
    .form-view-header {
      margin: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 20px;
      .btn-close {
        cursor: pointer;
        color: #999;
      }
      .form-view-title {
        font-weight: bold;
      }
    }
    // .form-content-header {
    //   font-size: 14px;
    //   color: #666;
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    // }
    // .view-title,
    // h2 {
    //   font-weight: bold;
    //   font-size: 14px;
    //   color: #333333;
    //   letter-spacing: 0;
    //   line-height: 14px;
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   margin: 10px 0 0 0;
    // }
    // .progress {
    //   font-size: 14px;
    //   color: #666666;
    //   letter-spacing: 0;
    //   line-height: 14px;
    // }
    // .object-item {
    //   display: flex;
    //   justify-content: flex-start;
    //   align-items: center;
    //   font-size: 0.12rem;
    //   overflow: hidden;
    //   background-color: #eee;
    //   position: relative;
    //   margin-bottom: 10px;

    //   .thumbnail {
    //     width: 66px;
    //     height: 0.4rem;
    //     background-color: #cccccc;
    //     overflow: hidden;
    //     position: relative;
    //     img {
    //       height: 100%;
    //       width: 100%;
    //       object-fit: cover;
    //     }
    //     .img-upload-panel {
    //       position: absolute;
    //       color: white;
    //       text-align: center;
    //       bottom: 0;
    //       left: 0;
    //       width: 100%;
    //       height: 18px;
    //       line-height: 18px;
    //       font-size: 12px;
    //       background-color: #515151;
    //     }
    //   }

    //   .object-detail-info {
    //     width: 1.4rem;
    //     font-size: 12px;
    //     height: 100%;
    //     display: flex;
    //     justify-content: flex-start;
    //     align-items: center;
    //     i {
    //       display: block;
    //     }
    //     .text-tip {
    //       min-width: 3em;
    //       margin-left: 0.04rem;
    //       margin-right: 20px;
    //     }
    //     .img-target {
    //       margin-left: 5px;
    //       overflow: hidden;
    //       text-overflow: ellipsis;
    //       white-space: nowrap;
    //     }
    //     .text-close {
    //       cursor: pointer;
    //       font-size: 12px;
    //       min-width: 2em;
    //       margin: 0 7px;
    //       color: #ca303a;
    //       letter-spacing: 0;
    //       line-height: 12px;
    //     }
    //     .option-tip {
    //       margin-left: 5%;
    //       min-width: 2em;
    //       cursor: pointer;
    //       color: #ca303a;
    //       &:hover {
    //         text-decoration: underline;
    //       }
    //     }
    //   }
    // }

    // .menu-list {
    //   list-style: none;
    //   padding: 0;
    //   margin: 0;
    //   .menu-item {
    //     display: flex;
    //     justify-content: flex-start;
    //     align-items: center;
    //     font-size: 12px;
    //     overflow: hidden;
    //     background-color: #eee;
    //     position: relative;
    //     margin-bottom: 10px;
    //     // .btn-delete-panel {
    //     //   position: absolute;
    //     //   right: 0px;
    //     //   display: flex;
    //     //   justify-content: center;
    //     //   align-items: center;
    //     //   border-left: 1px solid #ccc;
    //     //   height: 100%;
    //     //   background-color: #eee;
    //     // }
    //     .btn-delete {
    //       padding: 0.04rem;
    //     }
    //     // .order-tool {
    //     //   .btn-up,
    //     //   .btn-down {
    //     //     padding: 4px;
    //     //     display: block;
    //     //   }
    //     // }

    //     .menu-detail-info {
    //       margin-left: 10px;
    //       margin-right: 30px;
    //       overflow: hidden;
    //       text-overflow: ellipsis;
    //       white-space: nowrap;
    //       width: 100%;
    //       height: 100%;
    //     }
    //     .thumbnail {
    //       min-width: 66px;
    //       max-width: 66px;
    //       height: 66px * 360/750;
    //       background-color: #cccccc;
    //       overflow: hidden;
    //       position: relative;
    //       img {
    //         height: 100%;
    //         width: 100%;
    //         object-fit: cover;
    //       }
    //     }
    //   }
    // }
    // .object-list {
    //   li:nth-child(1) {
    //     .order-tool {
    //       .btn-up {
    //         color: #ccc;
    //         cursor: not-allowed;
    //       }
    //     }
    //   }
    //   li:nth-last-child(1) {
    //     .order-tool {
    //       .btn-down {
    //         color: #ccc;
    //         cursor: not-allowed;
    //       }
    //     }
    //   }

    //   .order-tool {
    //     color: #8a8a8a;
    //     .btn-up,
    //     .btn-down {
    //       cursor: pointer;
    //       display: block;
    //       padding: 4px;
    //       .svg-icon {
    //         font-size: 15px;
    //       }
    //     }
    //   }
    // }
  }
  .btn-save {
    // cursor: pointer;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #ca303a;
    color: white;
    text-align: center;
    padding: 0;
    border-radius: 0;
    border: none;
    &:hover {
      background-color: #b52b34;
    }
    &.is-disabled {
      background-color: #999;
    }
  }
  .cfg-view {
    background-color: #ffffff;
    // background-color: rgb(184, 158, 226);
    // width: calc(50% - 50px);
    width: 400px;
    &.editing {
      // border: 2px solid #f8e8e8;
      box-shadow: 0 0 10px 0 rgba(153, 153, 153, 0.25),
        0 0 0 3px rgba(202, 48, 58, 0.5);
    }
  }
  .card-name-brand {
    font-size: 14px;
    color: #333333;
    padding: 10px 7px;
    border-radius: 18px;
    background-color: white;
    position: absolute;
    z-index: 90;
    left: 405px;
    width: 30px;
    word-wrap: break-word;
    margin: 0 auto;
    font-weight: bold;
    text-align: center;
  }
}

.btn-delete-panel {
  position: absolute;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #ccc;
  height: 100%;
  background-color: #eee;
  &:hover {
    background-color: #ca303a;
    color: white;
  }
  .btn-delete {
    padding: 0.04rem;
  }
}
.model-tip-text {
  text-align: center;
  font-size: 14px;
  color: #666666;
  margin: 10px 0;
}
</style>

