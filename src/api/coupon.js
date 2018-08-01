import request from '@/utils/request';
import querystring from 'querystring';
export function queryCouponList(param) {
  return request.post(
    '/kolCoupon/list.jhtml',
    param,
  );
}

export function outageCoupon(id) {
  return request.post(
    '/kolCoupon/close.jhtml',
    querystring.stringify({id}) , {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
}

export function delCoupon(id) {

  return request.post(
    '/kolCoupon/delete.jhtml',
    querystring.stringify({id}),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
}

export function updateCoupon(data) {
  console.log(data)
  return request.post(
    '/kolCoupon/updateCouponNumber.jhtml',
    querystring.stringify({
      id: data.id,
      couponNumber: data.couponNumber
    }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
}

export function createCoupon(data) {
  return request.post(
    '/kolCoupon/couponCreate.jhtml',
    data
  );
}

export function getCouponDetail(data) {
  return request.post(
    '/kolCoupon/couponView.jhtml',
    querystring.stringify({
      id: data
    }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
}
