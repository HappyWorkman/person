import request from '@/utils/request';
import { getToken } from '@/utils/auth';
import Cookies from 'js-cookie'

export function getOrderList({
  startTime,
  endTime,
  status,
  word,
  firstQueryDate,
  pageNum,
  pageSize
}) {
  return request.post('/order/list.jhtml', {
    startTime,
    endTime,
    status,
    word,
    firstQueryDate,
    pageNum,
    pageSize
  });
}
export function getOrderDetail(sn) {
  return request.get('/order/detail.jhtml', {
    params: { sn: sn }
  });
}

export function getOrderExpress(sn) {
  return request.get('/order/express.jhtml', {
    params: { sn: sn }
  });
}

export function getExportOrderList(token,status,word,beginTime,endTime) {
  var token = getToken();
  // console.log(token);
  return process.env.BASE_API+`/order/export.jhtml?kol-token=${token}&status=${status}&word=${word}&beginTime=${beginTime}&endTime=${endTime}`
  // return request.get(
  //   '/order/export.jhtml',
  //     {params: params}
  // );
}
