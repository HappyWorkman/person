import request from '@/utils/request';
import querystring from 'querystring';
import Cookies from 'js-cookie';

export function getBazaarProductList({
  token,
  pageNum,
  pageSize,
  firstQueryDate,
  orderType,
  orderProfit,
  startPrice,
  endPrice,
  word,
  isStoraged,
  shippingPlace
}) {
  return request.post('/bazaar_center/product/list.jhtml', {
    pageNum,
    pageSize,
    firstQueryDate,
    orderType,
    orderProfit,
    startPrice,
    endPrice,
    word,
    isStoraged,
    shippingPlace
  });
}

export function addBazaarProduct({ token, productId, isMarketable }) {
  return request.post('/bazaar_center/product/add_kol_product.jhtml', {
    productId,
    isMarketable
  });
}

export function getProductList({
  token,
  pageSize,
  pageNum,
  firstQueryDate,
  startTime,
  endTime,
  productGroupId,
  isMarketable,
  startDistributionPrice,
  endDistributionPrice,
  word
}) {
  return request.post('/product/list.jhtml', {
    pageSize,
    pageNum,
    firstQueryDate,
    startTime,
    endTime,
    productGroupId,
    isMarketable,
    startDistributionPrice,
    endDistributionPrice,
    word
  });
}
export function getSkuData(id) {
  return request.get(`/product/view_sku.jhtml?id=${id}`);
}
export function updateDistributionPrice(data) {
  return request.post(`/product/update_distributionPrice.jhtml`, data);
}

export function onSale({ token, id, isMarketable }) {
  return request.post('/product/update_market_stat.jhtml', {
    id,
    isMarketable
  });
}

export function updateGroup({ id, productGroupId }) {
  return request.post('/product/update_group.jhtml', {
    id,
    productGroupId
  });
}

export function sortList(id, orders) {
  return request.post('/product/update_orders.jhtml', {
    id: id,
    orders: orders
  });
}
