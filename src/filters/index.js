/*
* author: wancheng
* date: 11/5/18
* desc:
*/

import {CMP_ARRAY, MATCH_RULE_ARRAY, PROTOCOL_ARRAY, SOURCE_ARRAY, STRATEGY_ARRAY} from "~/constant/constant";
import {toSecond} from "~/utils";

export function protocolFilter(protocol) {
    return _constantFilter(PROTOCOL_ARRAY, protocol);
}

//
export function sourceFilter(source) {
    return _constantFilter(SOURCE_ARRAY, source);
}


export function strategyFilter(strategy) {
    return _constantFilter(STRATEGY_ARRAY, strategy);
}

export function cmpFilter(cmp) {
    return _constantFilter(CMP_ARRAY, cmp);
}

export function matchRuleFilter(match) {
    return _constantFilter(MATCH_RULE_ARRAY, match);
}

//
function _constantFilter(constant, temp) {
    var result = '';
    for (var i = 0, len = constant.length; i < len; i++) {
        var item = constant[i];
        if (item.value == temp) {
            result = item.title;
            break;
        }
    }

    return result;
}

function formatTimeFilter(time) {

}

export function toSecondFilter(time) {
    time = time || 0;
    return toSecond(time) + 's';
}
