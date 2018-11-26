/*
* author: wancheng
* date: 11/5/18
* desc:
*    rpc PutCluster        (PutClusterReq)        returns (PutClusterRsp)         {}
*    rpc RemoveCluster     (RemoveClusterReq)     returns (RemoveClusterRsp)      {}
*    rpc GetCluster        (GetClusterReq)        returns (GetClusterRsp)         {}
*    rpc GetClusterList    (GetClusterListReq)    returns (stream metapb.Cluster) {}
*
*/

import request from "../utils/request";

const PREFIX = '/clusters';

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

export function deleteBindItem(id) {
    return request({
        url: PREFIX + '/' + id + '/binds',
        method: "DELETE"
    })
}


//
export function getBindItem(id) {
    return request({
        url: PREFIX + '/' + id + '/binds',
        method: 'GET'
    })
}
