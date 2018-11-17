/*
* author: wancheng
* date: 11/5/18
* desc:
*    rpc PutServer         (PutServerReq)         returns (PutServerRsp)          {}
*    rpc RemoveServer      (RemoveServerReq)      returns (RemoveServerRsp)       {}
*    rpc GetServer         (GetServerReq)         returns (GetServerRsp)          {}
*    rpc GetServerList     (GetServerListReq)     returns (stream metapb.Server)  {}
*/

import request from "../utils/request";

const PREFIX = '/servers';

export function getList() {
    return request({
        url: PREFIX,
        method: "GET"
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
