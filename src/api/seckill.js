import request from '@/utils/request';
import querystring from 'querystring';
export function querySeckillList(params) {
  return request.get(
    '/seckill/activity/search.jhtml',
    // param
    
      {params: params}
    
  );
}

export function createSeckill(data) {
  return request.post(
    '/seckill/activity/create.jhtml',
    data
  );
}

export function goodsList(kpId) {
  return request.get(
    `/seckill/activity/getGoodsByKpId.jhtml?kpId=${kpId}`
  );
}

export function closeSeckill(id) {
  return request.post(
    '/seckill/activity/close.jhtml',
    id,
  );
}

export function deleateSeckill(id) {
  return request.post(
    '/seckill/activity/delete.jhtml',
    id,
  );
}

export function getSeckillDetail(id) {
  return request.get(
    `/seckill/activity/get.jhtml?id=${id}&returnGoodsInfo=Y`
  );
}