import request from '@/utils/request';
// import Cookies from 'js-cookie'

export function getGroupList() {
  return request.get('/shop_design/get_templates.jhtml');
}

export function getUserTemplate() {
  return request.get('/shop_design/get_use_template.jhtml');
}

export function saveTemplate(data) {
  // {
  //   "dataJson": "",
  //   "indexTemplateId": "",
  //   "id": ""
  // }
  return request.post('/shop_design/save_template.jhtml', data);
}

export function deleteTemplate(id) {
  return request.post('/shop_design/delete_template.jhtml', { id });
}

export function updateOrder(param) {
  // type 排序类型 向上：up 向下：down 置顶：top 置底：Bottom
  // id 模块id
  return request.post('/shop_design/update_template_order.jhtml', {
    id: param.id,
    type: param.type
  });
}
export function getSystemTemplate() {
  return request.post('/shop_design/get_system_template_list.jhtml');
}
export function setTemplate(indexTemplateId) {
  return request.post('/shop_design/set_use_template.jhtml', {
    indexTemplateId
  });
}
export function release() {
  return request.post('/shop_design/release.jhtml');
}

export function getUpload() {
  return process.env.UPLOAD_URL
  
}
