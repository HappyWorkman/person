import request from '@/utils/request';

export function getShopInfo(){
    return request.get('/shopProfile/shop_info');
}

export function getLatsetData() {
    return request.get('/shopProfile/latest_data');
}

export function getUntreatAffair() {
    return request.get('/shopProfile/untreat_affair');
}

export function getTrendMap(type) {
    return request.get('/shopProfile/trend_map?type=' + type);
}