/*
* author: wancheng
* date: 11/5/18
* desc:
*    rpc PutAPI            (PutAPIReq)            returns (PutAPIRsp)             {}
*    rpc RemoveAPI         (RemoveAPIReq)         returns (RemoveAPIRsp)          {}
*    rpc GetAPI            (GetAPIReq)            returns (GetAPIRsp)             {}
*    rpc GetAPIList        (GetAPIListReq)        returns (stream metapb.API)     {}
*/


import request from "../utils/request";

const PREFIX = '/apis';

export function getList(options) {
    return request({
        url: PREFIX,
        method: "GET",
        params: options
    })
}

export function getItemById(id) {
    return request({
        url: PREFIX + '/' + id,
        method: "GET"
    })
}

export function updateItem(data) {
    return request({
        url: PREFIX,
        method: "PUT",
        data
    })
}

export function deleteItem(id) {
    return request({
        url: PREFIX + '/' + id,
        method: "DELETE"
    })
}
