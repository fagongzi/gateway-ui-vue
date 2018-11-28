/*
* author: wancheng
* date: 11/27/18
* desc:
*/

import request from "../utils/request";

const PREFIX = '/system';

//
export function backup(data) {
    return request({
        url: PREFIX + '/backup',
        method: "POST",
        data
    })
}


export function getAllData() {
    return request({
        url: PREFIX,
        method: "GET"
    })
}
