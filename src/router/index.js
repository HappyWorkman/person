import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import Layout from '../views/layout/Layout';

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  { path: '/brower', component: _import('brower'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/shop/overview',
    name: 'Dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index')
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    name: 'Shop-Center',
    meta: { title: '店铺中心' },
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: _import('overview/index'),
        meta: { title: '店铺概况', icon: 'home' }
      },
      {
        path: 'decorate',
        name: 'decorate',
        component: _import('decorate/index'),
        meta: { title: '店铺装修', icon: 'finish' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: { title: '选品中心', icon: '' },
    children: [
      {
        path: 'bazaar',
        name: 'Bazaar',
        component: _import('bazaar/index'),
        meta: { title: '热门商品', icon: 'hot' }
      }
      // {
      //   path: 'subject',
      //   name: 'Subject',
      //   component: _import('testing/index'),
      //   meta: { title: '主题选品', icon: 'subject' }
      // }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    name: 'Goods-Center',
    meta: { title: '商品中心', icon: '' },
    children: [
      {
        path: 'index',
        name: 'Goods',
        component: _import('goodsMa/index'),
        meta: { title: '商品管理', icon: 'shoppingbag' }
      },
      {
        path: 'category',
        name: 'Category',
        component: _import('category/index'),
        meta: { title: '分组管理', icon: 'classify' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: { title: '订单中心', icon: '' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: _import('order/index'),
        meta: { title: '订单管理', icon: 'order'}
      },
      {
        path: 'detail',
        name: 'OrderDetail',
        component: _import('order/detail'),
        hidden: true,
        meta: { title: '订单详情', icon: 'order'}
      }
      // {
      //   path: 'unrealized7',
      //   name: 'unrealized7',
      //   component: _import('testing/index'),
      //   meta: { title: '售后订单', icon: 'aftersale' }
      // }
    ]
  },
  {
    path: '/marketing',
    component: Layout,
    name: 'marketing',

    meta: { title: '营销中心', icon: '' },
    children: [
      {
        path: '',
        name: 'index',
        redirect: '/marketing/coupon',
        component: _import('marketing/index'),
        meta: {
          title: '营销中心',
          icon: 'withdraw-apply',
          redirect: '/marketing/coupon'
        },
        children: [
          {
            path: 'coupon',
            name: 'coupon',
            hidden: true,
            component: _import('marketing/coupon'),
            meta: {
              title: '优惠券列表',
              icon: 'withdraw-apply',
              listview: true
            },
            children: []
          },
          {
            path: 'seckill',
            name: 'seckill',
            hidden: true,
            component: _import('marketing/seckill'),
            meta: {
              title: '优惠券列表',
              icon: 'withdraw-apply',
              listview: true
            },
            children: []
          },
          {
            path: 'seckill/add',
            name: 'seckill-add',
            hidden: true,
            component: _import('marketing/seckill-detail'),
            meta: { title: '创建秒杀' }
          },
          {
            path: 'seckill/edit',
            name: 'seckill-edit',
            hidden: true,
            component: _import('marketing/seckill-detail'),
            meta: { title: '秒杀明细' }
          },
          {
            path: 'coupon/add',
            name: 'coupon-add',
            hidden: true,
            component: _import('marketing/coupon-detail'),
            meta: { title: '创建优惠券' }
          },
          {
            path: 'coupon/edit',
            name: 'coupon-edit',
            hidden: true,
            component: _import('marketing/coupon-detail'),
            meta: { title: '优惠券明细' }
          }
        ]
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    name: 'finance',
    meta: { title: '财务中心', icon: '' },
    children: [
      {
        path: 'earnings',
        name: 'earnings',
        component: _import('earnings/index'),
        meta: { title: '我的收益', icon: 'earnings' }
      },
      {
        path: 'trade',
        name: 'trade',
        component: _import('trade/index'),
        meta: { title: '交易记录', icon: 'trade-record-menu' }
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        component: _import('withdraw/index'),
        meta: { title: '提现记录', icon: 'withdraw' }
      },
      {
        path: 'earnings/withdrawApply',
        name: 'withdrawApply',
        component: _import('withdrawApply/index'),
        meta: { title: '提现申请', icon: 'withdraw' }
      }
    ]
  },
  {
    path: '/records',
    component: Layout,
    name: 'records',
    meta: { title: '数据中心', icon: '' },
    children: [
      {
        path: 'collection',
        name: 'collection',
        component: _import('collection/index'),
        meta: { title: '数据概况', icon: 'order' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
