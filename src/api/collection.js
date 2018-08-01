import request from '@/utils/request';
// let keyIndex = require('../mock/keyIndex.json'),
// goodsList = require('../mock/goodsList.json'),
// echartPie = require('../mock/echartPie.json'),
// echartLine = require('../mock/echartLine');
const host = "";
const parseParams=(data={})=>{
  let params = [];
  for(let key in data){
    params.push(`${key}=${data[key]}`);
  }
  if (params.length>0)
    return `?${params.join('')}`;
  else return '';
}
export function latestData(data = {}) { //关键指标
  return request.get(`${host}/shopProfile/latest_data${parseParams(data)}`);
}
export function trendMap(data = {}) { //趋势图
  return request.get(`${host}/shopProfile/trend_map${parseParams(data)}`);
}
export function transaction_customer(data = {}) { //成交客户
  return request.get(`${host}/shopProfile/transaction_customer${parseParams({
    ...data,type:'week'
  })}`);
}
export function sellProduct(data = {}) { //售出商品
  return request.get(`${host}/shopProfile/sell_Product${parseParams(data)}`);
}

// export function getTop10Visiting(data = {}) {
//   return request.get(`${host}/shopProfile/product_payment_top${parseParams(data)}`);
// }
export function productPaymentTop(data = {}) {
  return request.get(`${host}/shopProfile/product_payment_top${parseParams(data)}`);
}

// export function getaEchartPieClient(data = {}) {
//   return Promise.resolve(echartPie);
// }


