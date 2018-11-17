/*
* author: wancheng
* date: 11/5/18
* desc:
*/

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
