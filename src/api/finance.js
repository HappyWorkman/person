import request from '@/utils/request';
// let tradeRecords = require('../mock/tradeRecords.json'),
//   withdrawRecords = require('../mock/withdrawRecords.json');
// const host='//localhost:9528';
const host="";

export function getTradeRecords(data = {}) {//交易记录
  return request.post(`${host}/shopProfile/query_order_list`, data);
}
export function getWithdrawRecords(data = {}) {//提现记录
  return request.post(`${host}/shopProfile/withdraw_log_list`, data);
}
export function getProfitStatus(data = {}) { //收益状况
  return request.get(`${host}/shopProfile/profit_status`, data);
}
export function getWithdrawStatus(data = {}) {//提现概况
  return request.get(`${host}/shopProfile/withdraw_status`, data);
}
export function addBankAccount(data = {}) {//新增银行卡
  return request.post(`${host}/shopProfile/add_bank_account`, data);
}
export function getBankAccountList(data = {}) { //已绑定的银行卡列表
  return request.get(`${host}/shopProfile/get_bank_account_list`, data);
}
export function getBankList(data = {}) { //获得银行卡列表
  return request.get(`${host}/shopProfile/get_bank_list`, data);
}
export function putBalance(data = {}) { //去提现
  return request.post(`${host}/shopProfile/put_balance`, data);
}
