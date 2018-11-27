/*
* author: wancheng
* date: 11/5/18
* desc:
*    rpc PutRouting        (PutRoutingReq)        returns (PutRoutingRsp)         {}
*    rpc RemoveRouting     (RemoveRoutingReq)     returns (RemoveRoutingRsp)      {}
*    rpc GetRouting        (GetRoutingReq)        returns (GetRoutingRsp)         {}
*    rpc GetRoutingList    (GetRoutingListReq)    returns (stream metapb.Routing) {}
*/

import request from "../utils/request";

const PREFIX = '/routings';


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
