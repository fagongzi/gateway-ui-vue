/*
* author: wancheng
* date: 11/5/18
* desc:
*    rpc AddBind           (AddBindReq)           returns (AddBindRsp)            {}
*    rpc RemoveBind        (RemoveBindReq)        returns (RemoveBindRsp)         {}
*    rpc RemoveClusterBind (RemoveClusterBindReq) returns (RemoveClusterBindRsp)  {}
*    rpc GetBindServers    (GetBindServersReq)    returns (GetBindServersRsp)     {}
*/


import request from "../utils/request";

const PREFIX = '/binds';

export function updateItem(data) {
    return request({
        url: PREFIX,
        method: "PUT",
        data
    })
}


export function deleteItem(data) {
    return request({
        url: PREFIX,
        method: "DELETE",
        data
    })
}
