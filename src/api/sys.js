import request from '@/utils/request'
import { generateUUID } from '@/utils/uuid';

export function getCaptcha() {
  var id = generateUUID();
  return {
    url: request.defaults.baseURL + '/common/captcha.jhtml?captchaId=' + id,
    id
  }
}

export function getMsg(mobile, type) {
  return request.get('/send-msg?mobile=' + mobile + '&msgType=' + type);
}

export function updatedPsd(param) {
  return request.post('/updatePassword', param);
}