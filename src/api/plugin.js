import request from "../utils/request";
import {DATA_LIMIT} from "~/constant/constant";

const PREFIX = '/plugins';


export function getList(options) {
    return request({
        url: PREFIX,
        method: "GET",
        params: options
    })
}

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

export function getApply() {
    return request({
        url: PREFIX + '/' + 'apply',
        method: "GET"
    })
}

export function updateApply(data) {
    return request({
        url: PREFIX + '/' + 'apply',
        method: "PUT",
        data
    })
}
