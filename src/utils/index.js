/*
* author: wancheng
* date: 11/5/18
* desc:
*/
import {Base64} from 'js-base64';
import {TIME_TYPE_OBJECT} from '~/constant/constant';
export {generateTitle as i18n} from "./i18n";


export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000;
        time = +time; // 转成int 型
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}


export function clone(obj) {
    var result = '';
    //
    if (typeof  obj === 'object') {
        try {
            result = JSON.stringify(obj);
            result = JSON.parse(result);
        }
        catch (e) {
            result = obj;
        }
    }
    else {
        result = obj;
    }

    return result;
}

export function extend(target) {
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0, len = args.length; i < len; i++) {
        var source = args[i];
        for (var key in source) {
            if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
    }
    return target;
}


export function getItemById(list, id, idTips) {
    list = list || [];
    let result = undefined;

    for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i];
        if (item[idTips || 'id'] == id) {
            result = item;
            break;
        }
    }


    return result;
}

export function extendByTarget(target) {
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0, len = args.length; i < len; i++) {
        var source = args[i];
        for (var key in target) {
            if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
    }
    return target;
}


export function encodeBase64(str) {
    return Base64.encode(str || '');
}

export function decodeBase64(str) {
    return Base64.decode(str || '');
}


// 转换为 ns（纳秒）
export function toNs(time, type) {
    var result = time;
    if (type === TIME_TYPE_OBJECT.second) {
        result = result * 1000000000;
    }
    else if (type === TIME_TYPE_OBJECT.minute) {
        result = result * 1000000000 * 60;
    }
    else if (type === TIME_TYPE_OBJECT.hour) {
        result = result * 1000000000 * 60 * 60;
    }
    else if (type === TIME_TYPE_OBJECT.day) {
        result = result * 1000000000 * 60 * 60 * 24;
    }

    return result;
}

export function toSecond(time) {
    time = time || 0;
    return time / 1000000000;
}

export function searchInclude(a, b) {
    a = ('' + a);
    b = ('' + b);
    return a.toLowerCase().includes(b.toLowerCase());
}
