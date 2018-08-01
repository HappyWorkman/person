import request from '@/utils/request'

export function login(username, password, captcha, captchaId) {
  return request.post('/login.jhtml', {
    username,
    password,
    captcha,
    captchaId
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout.jhtml',
    method: 'get'
  })
}
