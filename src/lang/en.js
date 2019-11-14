export default {
  nav: {
    home: 'Home',
    api: 'API',
    cluster: 'Cluster',
    server: 'Server',
    routing: 'Routing',
    plugin: 'Plugin',
    system: 'System',
    appliedPlugin: 'Applied Plugin'
  },
  home: {
    count: 'Count'
  },
  api: {
    name: 'API Name',
    urlPattern: 'URL Match Rule',
    tag: 'Tag (name/value)',
    matchRule: 'Match Rule',
    domain: 'API Request Host',
    method: 'Request Method',
    status: 'Status',
    enableApi: 'Enable API',
    disableApi: 'Disable API',
    step1: 'Basics',
    step2: 'Cluster',
    step3: 'Service Protection',
    step4: 'Additional',
    form: {
      name: 'Name',
      matchRule: 'Match Rule',
      domain: 'Domain',
      urlPattern: 'URL Match Rule/urlPattern',
      method: 'API HTTP Request Method',
      position: 'Match Priority/Position',
      status: 'Enabled'
    }
  },

  cluster: {},
  server: {
    searchTips: 'Please select a cluster',
    addTips: 'Please add a cluster first',
    address: 'Address',
    protocol: 'API Protocol',
    maxQPS: 'Maximum QPS Supported'
  },

  routing: {},
  plugin: {
    name: 'Name',
    author: 'Author',
    email: 'Email',
    updateTime: 'Update Time',
    version: 'Version',
    isUsed: 'isUsed',
    type: 'Type',
    content: 'Content',
    config: 'Configuration'

  },
  system: {
    tips: 'Backup (Purged if data in destination exists)',
    backupAddress: 'Backup Address：',
    confirmTips: 'Data in destination will be purged. Do you want to proceed?'
  },

  btn: {
    refresh: 'Refresh',
    add: 'Add',
    show: 'View',
    edit: 'Edit',
    delete: 'Delete',
    operator: 'Operation',
    copy:'Copy',
    return: 'Return',
    submit: 'Submit',
    prev: 'Previous',
    next: 'Next',
    backup: 'Backup',
    confirm: 'Confirm',
    cancel: 'Cancel',
    manage: 'Manage',
    importCode: 'Import JavaScript File',
    formatCode: 'Format Code'

  },

  tips: {
    loading: 'Loading...',
    tip: 'Tips',
    yes: 'Yes',
    no: 'No'
  },

  status: {
    enable: 'Enable',
    disable: 'Disable'
  }

}
