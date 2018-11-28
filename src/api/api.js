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
import {DATA_LIMIT} from "~/constant/constant";

const PREFIX = '/apis';

export function getList(options) {
    return request({
        url: PREFIX,
        method: "GET",
        params: options
    })
}

// get all data
export function getAllData() {
    return new Promise(function (resolve, reject) {
        var resultList = [];
        var lastItem = '';
        var limit = DATA_LIMIT;

        function _getList(opt) {
            getList(opt).then((data) => {
                data = data || [];
                var dataLength = data.length;

                if (dataLength > 0) {
                    resultList = resultList.concat(data);
                    lastItem = data[dataLength - 1] || {};
                    if (lastItem.id) {
                        var options = {
                            after: lastItem.id,
                            limit: limit,
                        };
                        //
                        _getList(options);
                    }
                }
                else {
                    resolve(resultList);
                }
            }).catch(() => {
                reject();
            });
        }

        var _options = {
            after: '',
            limit: limit,
        };

        _getList(_options);
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
