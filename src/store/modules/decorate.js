import {
  getGroupList,
  getUserTemplate,
  saveTemplate,
  deleteTemplate,
  updateOrder,
  setTemplate,
  release
} from '@/api/decorate';
// import Cookies from 'js-cookie';
import img_Empty from '@/assets/decorate/img-empty.png';
import c1_Empty from '@/assets/decorate/commodity_1.png';
import c2_Empty from '@/assets/decorate/commodity_2.png';
import g1_Empty from '@/assets/decorate/g1.png';

import i1_Empty from '@/assets/decorate/i1.png';
import i3_Empty from '@/assets/decorate/i3.png';
// import g1_Empty from '@/assets/decorate/g1.png';
import s1_Empty from '@/assets/decorate/s1.png';
import coupon_Empty from '@/assets/decorate/coupon1.png';
import seckill_Empty from '@/assets/decorate/seckill.png';
const workbench = {
  state: {
    isChanged: false,
    cfg: [],
    lastReleasedDate: null,
    released: false,
    currentCfg: {
      id: null
    },
    components: {
      best_product: {
        key: 'best_product',
        name: '推荐商品',
        title: '推荐商品',
        img: c1_Empty,
        remark: '适合主推、爆款等商品的展示',
        temp: {
          name: '推荐商品',
          title: '推荐商品',
          subhead: 'EXPLOSION',
          icon: 'like',
          align: 'center',
          style: 'list',
          plist: []
        },
        number: 0,
        disabled: true
      },
      group_product: {
        key: 'group_product',
        name: '分组商品',
        title: '分组商品',
        img: c2_Empty,
        remark: '适合日常双列分组商品展示',
        temp: {
          name: '分组商品',
          title: '分组商品',
          style: 'list',
          menus: []
        },
        number: 0,
        disabled: true
      },
      image_single: {
        key: 'image_single',
        name: '单列图',
        title: '单列图片',
        img: i1_Empty,
        remark: '适合单张宣传图、广告大图的展示',
        temp: {
          name: '单列图片',
          imageList: [
            // {
            //   url: null,
            //   targetType: null,
            //   target: null
            // }
          ]
        },
        number: 0,
        disabled: false
      },
      image_carousel: {
        key: 'image_carousel',
        name: '轮播图',
        title: '轮播图片',
        img: i3_Empty,
        remark: '适合多张宣传图、广告图的展示',
        temp: {
          name: '轮播图片',
          imageList: [
            // {
            //   url: null,
            //   targetType: null,
            //   target: null
            // }
          ]
        },
        number: 0,
        disabled: true
      },
      group_navigation: {
        key: 'group_navigation',
        name: '分组导航',
        title: '分组导航',
        img: g1_Empty,
        remark: '适合多类商品分组导航展示',
        temp: {
          name: '分组导航',
          style: 'quarter', //third half
          menus: []
        },
        number: 0,
        disabled: true
      },
      product_search: {
        key: 'product_search',
        name: '搜索',
        title: '商品搜索',
        img: s1_Empty,
        remark: '',
        temp: {
          name: '商品搜索',
          style: 'style1'
        },
        number: 0,
        disabled: true
      },
      coupon: {
        key: 'coupon',
        name: '优惠券',
        title: '优惠券',
        img: coupon_Empty,
        remark: '',
        temp: {
          name: '优惠券',
          coupons: [],
          style: 'style1'
        },
        number: 0,
        disabled: true
      },
      seckill: {
        key: 'seckill',
        name: '秒杀活动',
        title: '秒杀活动',
        img: seckill_Empty,
        remark: '',
        temp: {
          name: '惊喜秒杀',
          title: '惊喜秒杀',
          subhead: 'EXPLOSION',
          icon: 'like',
          align: 'center',
          style: 'list',
          seckill: []
        },
        number: 0,
        disabled: true
      }
    },
    viewfit: 100
  },
  mutations: {
    SYNC_HEIGHT: (state, height) => {
      state.viewfit = height;
    },
    TOGGLE_EDIT: (state, id) => {
      if (id) {
        state.currentCfg = state.cfg.find(res => res.id === id);
      } else {
        state.currentCfg = { id: null };
      }
    },
    ADD_UPLOAD_IMG: (state, { id, data }) => {
      var cfg = state.cfg.find(item => {
        return item.id == id;
      });
      if (cfg) {
        cfg.data.value.imageList.push(data);
      }
    },
    DEL_UPLOAD_IMG: (state, { id, data }) => {
      var cfg = state.cfg.find(item => {
        return item.id == id;
      });
      if (cfg) {
        for (var i = 0; i < cfg.data.value.imageList.length; i++) {
          if (cfg.data.value.imageList[i].id == data.id) {
            cfg.data.value.imageList.splice(i, 1);
            break;
          }
        }
      }
    },
    ADD_COMPONENT: (state, data) => {
      state.cfg.push(JSON.parse(JSON.stringify(data)));
      state.currentId = data.id;
      state.currentCfg = state.cfg.find(res => res.id === data.id);
      // state.components[data.key].number += 1;
      state.isChanged = true;
    },
    DEL_COMPONENT: (state, id) => {
      var tempData = {};
      for (var i = 0; i < state.cfg.length; i++) {
        if (state.cfg[i].id == id) {
          tempData = state.cfg.splice(i, 1);
          break;
        }
      }
      state.currentId = null;
      state.currentCfg = { id: null };
      state.isChanged = true;
    },
    SAVE_COMPONENT: (state, data) => {
      if (this.currentCfg) {
        this.currentCfg.data = data;
      }
      state.isChanged = true;
    },
    GET_USER_TEMPLATE: (state, data) => {
      var _t_components = [];
      data.indexTemplateDataDtoList.forEach(cfgItem => {
        _t_components.push({
          id: cfgItem.id,
          tid: cfgItem.mobileIndexTemplateId,
          key: cfgItem.mobileIndexTemplateKey,
          data: JSON.parse(cfgItem.templateDataJson)
        });
      });
      state.lastReleasedDate = data.lastReleasedDate;
      state.released = data.released;

      state.cfg = _t_components;
    },
    UPDATE_ORDER: (state, data) => {
      var cfg = state.cfg;
      state.isChanged = true;
      if (data.type == 'up') {
        cfg[data.index - 1] = cfg.splice(data.index, 1, cfg[data.index - 1])[0];
      } else if (data.type == 'down') {
        cfg[data.index + 1] = cfg.splice(data.index, 1, cfg[data.index + 1])[0];
      }
    },
    RELEASE: (state, data) => {
      state.isChanged = false;
    },
    CHANGE_TEMPLATE: (state, data) => {
      state.cfg = data;
    }
  },
  actions: {
    GetUserTemplate: ({ commit }) => {
      return getUserTemplate().then(res => {
        if (res.code == '0') {
          commit('GET_USER_TEMPLATE', res.data);
        }
        return res;
      });
    },
    AddComponent: ({ commit }, component) => {
      // console.log(component)
      var data = {
        key: component.key,
        data: component.temp
      };
      return saveTemplate({
        dataJson: JSON.stringify(data),
        indexTemplateId: component.id
      }).then(res => {
        if (res.code == '0') {
          commit('ADD_COMPONENT', {
            id: res.data,
            key: component.key,
            tid: component.id,
            data
          });
        }
        return res;
      });
    },
    DelComponent: ({ commit }, id) => {
      deleteTemplate(id).then(res => {
        if (res.code == '0') {
          commit('DEL_COMPONENT', id);
        }
        return res;
      });
    },
    SaveComponent: ({ commit }, data) => {
      return saveTemplate({
        dataJson: JSON.stringify(data.data),
        indexTemplateId: data.tid,
        id: data.id
      }).then(res => {
        if (res.code == '0') {
          commit('SAVE_COMPONENT', data.data);
        }
        return res;
      });
    },
    UpdateOrder: ({ commit }, data) => {
      return updateOrder(data).then(res => {
        if (res.code == '0') {
          commit('UPDATE_ORDER', {
            index: data.index,
            type: data.type
          });
        }
        return res;
      });
    },
    Release: ({ commit }) => {
      return release().then(res => {
        if (res.code == '0') {
          commit('RELEASE');
        }
        return res;
      });
    },
    ChangeTemplate: ({ commit }, id) => {
      return setTemplate(id).then(res => {
        if (res.code == '0') {
          commit(
            'CHANGE_TEMPLATE',
            res.data.map(item => {
              return {
                data: JSON.parse(item.templateDataJson),
                id: item.id,
                key: item.mobileIndexTemplateKey,
                tid: item.mobileIndexTemplateId
              };
            })
          );
        }
      });
    }
  }
};

export default workbench;
