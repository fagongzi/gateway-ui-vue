/*
* author: wancheng
* date: 11/5/18
* desc: constant
*/


// form types
export const FORM_OBJECT = {
    update: 'update',
    create: 'create',
    show: 'show'
};

export const FORM_OBJECT_TIPS = {
    update: '修改',
    create: '新增',
    show: '查看'
};

export const RULE_TYPE_OBJECT = {
    ruleRegexp: 0
};

export const CMP_OBJECT = {
    'CMPEQ': 0,
    'CMPLT': 1,
    'CMPLE': 2,
    'CMPGT': 3,
    'CMPGE': 4,
    'CMPIn': 5,
    'CMPMatch': 6
}

export const CMP_ARRAY = [
    {
        value: 0, title: '=='
    },
    {
        value: 1, title: '<'
    },
    {
        value: 2, title: '<='
    },
    {
        value: 3, title: '>'
    },
    {
        value: 4, title: '>='
    },
    {
        value: 5, title: 'in'
    },
    {
        value: 6, title: '~'
    }
];


// methods
export const METHODS_ARRAY = [
    {
        value: '*', title: '*'
    },
    {
        value: 'GET', title: 'GET'
    },
    {
        value: 'POST', title: 'POST'
    },
    {
        value: 'PUT', title: 'PUT'
    },
    {
        value: 'DELETE', title: 'DELETE'
    }
];


// load balance
export const LOAD_BALANCE_OBJECT = {
    roundRobin: 0 // 轮询
    // ipHash: 1 // ip地址散列
};

export const LOAD_BALANCE_ARRAY = [
    {value: 0, title: 'roundRobin'}
    // {value: 1, title: 'ipHash'}
];


// circuit status
export const CIRCUIT_STATUS_OBJECT = {
    open: 0,
    half: 1,
    close: 2
};

export const CIRCUIT_STATUS_ARRAY = [
    {value: undefined, title: '请选择'},
    {value: 0, title: 'Open'},
    {value: 1, title: 'Half'},
    {value: 2, title: 'Close'}
];

// protocol
export const PROTOCOL_OBJECT = {
    http: 0,
    grpc: 1,
    dubbo: 2,
    springCloud: 3
};

export const PROTOCOL_ARRAY = [
    {value: 0, title: 'Http'},
    {value: 1, title: 'Grpc'},
    {value: 2, title: 'Dubbo'},
    {value: 3, title: 'SpringCloud'}
];


// status
export const STATUS_OBJECT = {
    down: 0,
    up: 1,
    // unknown: 2
};

// Strategy
export const STRATEGY_OBJECT = {
    copy: 0, // 复制
    split: 1 // 分流
};

export const STRATEGY_ARRAY = [
    {
        value: 1, title: 'Split'
    },
    {
        value: 0, title: 'Copy'
    }
];

// match rule
export const MATCH_RULE_OBJECT = {
    matchDefault: 0,
    matchAll: 1,
    matchAny: 2
};


export const MATCH_RULE_ARRAY = [
    {
        value: 0, title: 'matchDefault'
    },
    {
        value: 1, title: 'matchAll'
    },
    {
        value: 2, title: 'matchAny'
    }
];

export const MATCH_RULE_ARRAY2 = [
    {
        value: -1, title: '请选择'
    },
    ...MATCH_RULE_ARRAY
];

export const SOURCE_ARRAY = [
    {
        value: 0, title: 'QueryString'
    },
    {
        value: 1, title: 'FormData'
    },
    {
        value: 2, title: 'JSONBody'
    },
    {
        value: 3, title: 'Header'
    },
    {
        value: 4, title: 'Cookie'
    },
    {
        value: 5, title: 'PathValue'
    }
];


export const TIME_TYPE_OBJECT = {
    default: -1,
    second: 0,
    minute: 1,
    hour: 2,
    day: 3
};

export const TIME_TYPE_ARRAY = [
    {
        value: 0, title: '秒'
    },
    {
        value: 1, title: '分钟'
    },
    {
        value: 2, title: '小时'
    },
    {
        value: 3, title: '天'
    }
];
export const TIME_TYPE_DEFAULT_ARRAY = [
    {
        value: -1, title: '默认值'
    },
    ...TIME_TYPE_ARRAY
];


export const STEP_OBJECT = {
    'first': 0,
    'next': 1,
    'nextNext': 2,
    'last': 3
};

export const HOST_TYPE_ARRAY = [
    {value: 0, title: 'HostOrigin'},
    {value: 1, title: 'HostServerAddress'},
    {value: 2, title: 'HostCustom'}
];

//
export const HOST_TYPE_OBJECT = {
    hostOrigin: 0,
    hostServerAddress: 1,
    hostCustom: 2
};

export const LANGUAGE_TYPE = {
    zh: 'zh',
    en: 'en'
};


export const DATA_LIMIT = 1000;
