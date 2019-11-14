export default {
  nav: {
    home: 'Home',
    api: 'API',
    cluster: 'Cluster',
    server: 'Server',
    routing: 'Routing',
    plugin: 'Plugin',
    system: 'System',
    appliedPlugin: 'AppliedPlugin'
  },
  home: {
    count: '数量'
  },
  api: {
    name: '接口名称',
    urlPattern: 'URL匹配规则',
    tag: '标签(name/value)',
    matchRule: '匹配规则',
    domain: '接口请求域名',
    method: '请求方法',
    status: '状态',
    enableApi: '启用API',
    disableApi: '禁用API',
    step1: '基础信息',
    step2: '转发接口',
    step3: '服务保护',
    step4: '其他信息',
    form: {
      name: '名称(Name)',
      matchRule: '匹配规则(MatchRule)',
      domain: '域名(Domain)',
      urlPattern: 'URL匹配规则(urlPattern)',
      method: '接口请求类型(Method)',
      position: '匹配优先级(Position)',
      status: '是否生效(Status)'
    }
  },

  cluster: {},
  server: {
    searchTips: '请选择Cluster进行查询',
    addTips: '请先添加Cluster',
    address: '地址',
    protocol: '接口协议',
    maxQPS: '支持的最大QPS'
  },

  routing: {},
  plugin: {
    name: '名称',
    author: '作者',
    email: '邮箱',
    updateTime: '更新时间',
    version: '版本',
    isUsed: '是否被使用',
    type: '类型',
    content: '内容',
    config: '配置信息'

  },
  system: {
    tips: '备份环境：目标的环境数据会被清理',
    backupAddress: '目标的环境：',
    confirmTips: '目标的环境数据会被清理，是否确定备份？'
  },

  btn: {
    refresh: '刷新',
    add: '添加',
    show: '查看',
    edit: '编辑',
    delete: '删除',
    operator: '操作',
    copy:'拷贝',
    return: '返回',
    submit: '提交',
    prev: '上一步',
    next: '下一步',
    backup: '备份',
    confirm: '确定',
    cancel: '取消',
    manage: '使用管理',
    importCode: '导入JS文件',
    formatCode: '格式化代码'

  },

  tips: {
    loading: '加载中...',
    tip: '提示',
    yes: '是',
    no: '否'
  },

  status: {
    enable: '启用',
    disable: '禁用'
  }

}
