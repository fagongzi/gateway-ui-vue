<template>
  <div class="app-container">
    <el-steps :active="step" finish-status="success">
      <el-step>
        <div slot="title" class="step-item" @click="handleToStep(0)">基础信息</div>
      </el-step>
      <el-step>
        <div slot="title" class="step-item" @click="handleToStep(1)">转发接口</div>
      </el-step>
      <el-step>
        <div slot="title" class="step-item" @click="handleToStep(2)">服务保护</div>
      </el-step>
      <el-step>
        <div slot="title" class="step-item" @click="handleToStep(3)">其他信息</div>
      </el-step>
    </el-steps>

    <div v-loading="loading">
      <step-first
        v-show="isFirstStep"
        :edit-item.sync="stepFirstData"
        :do-validate.sync="validateStepFirst"
        @submitFormStep="handleSubmitFormStepFirst"
      />
      <step-next
        v-show="isNextStep"
        :edit-item.sync="stepNextData"
        :do-validate.sync="validateStepNext"
        @submitFormStep="handleSubmitFormStepNext"
      />
      <step-next-next
        v-show="isNextNextStep"
        :edit-item.sync="stepNextNextData"
        :do-validate.sync="validateStepNextNext"
        @submitFormStep="handleSubmitFormStepNextNext"
      />
      <step-last
        v-show="isLastStep"
        :edit-item.sync="stepLastData"
        :do-validate.sync="validateStepLast"
        @submitFormStep="handleSubmitFormStepLast"
      />
    </div>

    <div class="footer">
      <div class="btn-group1">
        <el-button size="mini" @click="goList">返回</el-button>
      </div>
      <div class="btn-group">
        <el-button
          class="btn"
          :disabled="isFirstStep"
          style="margin-left: 180px"
          type="primary"
          icon="el-icon-arrow-left"
          size="mini"
          @click="preStep"
        >
          上一步
        </el-button>
        <template v-if="isLastStep">
          <el-button
            v-if="isCreate"
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="createItem('dataForm')"
          >提交
          </el-button>
          <el-button
            v-else-if="isUpdate"
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="updateItem('dataForm')"
          >提交
          </el-button>
        </template>
        <template v-else>
          <el-button class="btn" type="primary" icon="el-icon-arrow-right" size="mini" @click="nextStep">下一步
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>

import {
  FORM_OBJECT,
  MATCH_RULE_OBJECT,
  STEP_OBJECT,
  TIME_TYPE_OBJECT
} from '~/constant/constant'
import { clone, extend, extendByTarget } from '~/utils'
import * as apiApi from '~/api/api'
import StepFirst from './StepFirst'
import StepNext from './StepNext'
import StepNextNext from './StepNextNext'
import StepLast from './StepLast'

function _getTempItem() {
  const _tempItem = {
    id: undefined,
    name: undefined, // 必填
    urlPattern: undefined, // 必填
    method: '*',
    domain: '', // 必填
    status: true,
    // ip 的访问控制。ip 匹配。
    ipAccessControl: {
      whitelist: [],
      blacklist: []
    },
    // 默认返回值
    // 当后端Cluster无可用Server的时候，Gateway将返回这个默认值
    // 可以用来做Mock或者后端服务故障时候的默认返回。
    defaultValue: {
      code: '', // 必填
      body: '',
      headers: [],
      cookies: []
    },

    // 请求被转发到的后端Cluster。至少设置一个转发Cluster，一个请求可以被同时转发到多个后端Cluster（目前仅支持GET请求设置多个转发）。
    nodes: [],
    //  设置访问这个API需要的权限，需要用户自己开发权限检查插件。
    perms: [],

    // 指定该API所使用的Auth插件名称
    authFilter: undefined, // 必填

    // 从新定义返回的数据。
    renderTemplate: {
      objects: []
    },
    // 当该值为True且DefaultValue存在时，直接使用DefaultValue作为返回值。
    useDefault: true,
    //
    matchRule: MATCH_RULE_OBJECT.matchAny,
    //
    position: 0,
    // tag 标签，编译维护和检索。
    tags: [],
    // websocket选项，设置该API为websocket
    webSocketOptions: {
      origin: ''
    },
    // 熔断策略
    circuitBreaker: {
      closeTimeout: 0,
      closeTimeoutType: TIME_TYPE_OBJECT.second,
      rateCheckPeriod: 0,
      rateCheckPeriodType: TIME_TYPE_OBJECT.second,
      halfTrafficRate: '',
      failureRateToClose: '',
      succeedRateToOpen: ''
    },

    maxQPS: undefined
  }
  return _tempItem
}

function _getStepFirstData() {
  return {
    name: undefined, // 必填
    urlPattern: undefined, // 必填
    method: '*',
    domain: '', // 必填
    status: true,
    position: 0,
    matchRule: MATCH_RULE_OBJECT.matchAny
  }
}

function _getStepNextData() {
  return {
    nodes: []
  }
}

function _getStepNextNextData() {
  return {
    maxQPS: undefined,
    // 熔断策略
    circuitBreaker: {
      closeTimeout: 0,
      closeTimeoutType: TIME_TYPE_OBJECT.second,
      rateCheckPeriod: 0,
      rateCheckPeriodType: TIME_TYPE_OBJECT.second,
      halfTrafficRate: '',
      failureRateToClose: '',
      succeedRateToOpen: ''
    }
  }
}

function _getStepLastData() {
  return {
    // ip 的访问控制。ip 匹配。
    ipAccessControl: {
      whitelist: [],
      blacklist: []
    },
    // 默认返回值
    // 当后端Cluster无可用Server的时候，Gateway将返回这个默认值
    // 可以用来做Mock或者后端服务故障时候的默认返回。
    defaultValue: {
      code: '', // 必填
      body: '',
      headers: [
        { name: '', value: '' }
      ],
      cookies: [
        { name: '', value: '' }
      ]
    }, //  设置访问这个API需要的权限，需要用户自己开发权限检查插件。
    useDefault: true,
    perms: [],
    // tag 标签，编译维护和检索。
    tags: [],
    // websocket选项，设置该API为websocket
    webSocketOptions: {
      origin: ''
    },
    authFilter: '',
    renderTemplate: {
      objects: []
    }
  }
}

export default {
  name: 'ApiForm',

  components: { StepFirst, StepNext, StepLast, StepNextNext },
  props: {
    showType: {
      type: String,
      default: FORM_OBJECT.create
    },
    editItem: {
      type: Object
    }
  },
  data() {
    return {
      step: STEP_OBJECT.first,
      loading: true,
      submitting: false,
      tempItem: _getTempItem(),
      stepFirstData: {},
      stepNextData: {},
      stepNextNextData: {},
      stepLastData: {},
      validateStepFirst: false,
      validateStepNext: false,
      validateStepNextNext: false,
      validateStepLast: false,
      toStep: -1 //
    }
  },

  computed: {
    isShow() {
      return this._isShow()
    },

    isCreate() {
      return this._isCreate()
    },
    isUpdate() {
      return this._isUpdate()
    },

    isFirstStep() {
      return this._isFirstStep()
    },

    isNextStep() {
      return this._isNextStep()
    },

    isNextNextStep() {
      return this._isNextNextStep()
    },

    isLastStep() {
      return this._isLastStep()
    }
  },

  watch: {
    //
    'editItem': function(newValue, oldValue) {
      var _newValue = clone(newValue)
      this.tempItem = extendByTarget(this.tempItem, _newValue)
      this.stepFirstData = extendByTarget(_getStepFirstData(), _newValue)
      this.stepNextData = extendByTarget(_getStepNextData(), _newValue)
      this.stepNextNextData = extendByTarget(_getStepNextNextData(), _newValue)
      this.stepLastData = extendByTarget(_getStepLastData(), _newValue)
      this.loading = false
      this.submitting = false
      this.updateData()
    }
  },

  created() {
    this.init()
  },

  methods: {

    init() {
      if (this._isCreate()) {
        this.loading = false
      }
    },

    updateData() {
      this.stepFirstData = extendByTarget(this.stepFirstData, this.tempItem)
      this.stepNextData = extendByTarget(this.stepNextData, this.tempItem)
      this.stepNextNextData = extendByTarget(this.stepNextNextData, this.tempItem)
      this.stepLastData = extendByTarget(this.stepLastData, this.tempItem)
    },

    // 创建
    createItem() {
      if (this._isLastStep()) {
        this.validateStepLast = true
      }
    },

    _doCreateItem() {
      var item = this._formatFormData()
      this.submitting = true

      apiApi.updateItem(item).then(() => {
        this.$message({
          type: 'success',
          message: '创建成功!'
        })
        setTimeout(() => {
          this.goList()
        }, 2000)
      }).catch(() => {
        this.validateStepLast = false
        this.submitting = false
      })
    },

    // 修改
    updateItem() {
      if (this._isLastStep()) {
        this.validateStepLast = true
      }
    },

    _doUpdateItem() {
      var item = this._formatFormData()
      this.submitting = true

      apiApi.updateItem(item).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        setTimeout(() => {
          this.goList()
        }, 2000)
      }).catch(() => {
        this.validateStepLast = false
        this.submitting = false
      })
    },

    _formatFormData() {
      var temp = clone(this.tempItem)

      // status
      temp.status = temp.status ? 1 : 0

      // 默认值
      if (!temp.defaultValue.cookies || temp.defaultValue.cookies.length === 0) {
        delete temp.defaultValue.cookies
      }

      // 默认值
      if (!temp.defaultValue.headers || temp.defaultValue.headers.length === 0) {
        delete temp.defaultValue.headers
      }

      if (!temp.defaultValue.body) {
        delete temp.defaultValue.body
      }

      if (!temp.defaultValue.code) {
        delete temp.defaultValue
      }

      // 黑名单 和 白名单的 校验
      if (!temp.ipAccessControl.whitelist || temp.ipAccessControl.whitelist.length === 0) {
        delete temp.ipAccessControl.whitelist
      }

      if (!temp.ipAccessControl.blacklist || temp.ipAccessControl.blacklist.length === 0) {
        delete temp.ipAccessControl.blacklist
      }

      if (!temp.ipAccessControl.blacklist && !temp.ipAccessControl.whitelist) {
        delete temp.ipAccessControl
      }

      if (temp.perms.length === 0) {
        delete temp.perms
      }

      if (temp.tags.length === 0) {
        delete temp.tags
      }

      if (temp.nodes.length === 0) {
        delete temp.nodes
      }

      if (temp.renderTemplate.objects && temp.renderTemplate.objects.length === 0) {
        delete temp.renderTemplate
      }

      if (temp.webSocketOptions && !temp.webSocketOptions.origin) {
        delete temp.webSocketOptions
      }

      //
      if (temp.circuitBreaker && !temp.circuitBreaker.closeTimeout) {
        delete temp.circuitBreaker
      }

      //
      if (!temp.maxQPS) {
        delete temp.maxQPS
      }

      return temp
    },

    goList() {
      this.$router.replace({ path: '/api' })
      this.$destroy()
    },

    handleSubmitFormStepFirst(error, data) {
      this.validateStepFirst = false

      if (error) {
        this.toStep = -1
        return false
      }
      var _tempData = clone(data)
      this.increaseStep()
      // 更新 data 对象。
      this.tempItem = extendByTarget(this.tempItem, _tempData)
    },

    //
    handleSubmitFormStepNext(error, data) {
      this.validateStepNext = false

      if (error) {
        this.toStep = -1
        return false
      }

      var _tempData = clone(data)
      this.increaseStep()
      // 更新 data 对象。
      this.tempItem = extendByTarget(this.tempItem, _tempData)
    },

    //
    handleSubmitFormStepNextNext(error, data) {
      this.validateStepNextNext = false
      if (error) {
        this.toStep = -1
        return false
      }
      var _tempData = clone(data)
      this.increaseStep()
      //
      this.tempItem = extendByTarget(this.tempItem, _tempData)
    },

    handleSubmitFormStepLast(error, data) {
      this.validateStepLast = false

      if (error) {
        this.toStep = -1
        return false
      }

      if (this.submitting) {
        return
      }

      const _tempData = clone(data)
      this.tempItem = extendByTarget(this.tempItem, _tempData)

      if (this._isUpdate()) {
        this._doUpdateItem()
      } else if (this._isCreate()) {
        this._doCreateItem()
      }
    },

    nextStep(flag) {
      if (!flag) {
        this.toStep = -1
      }

      if (this._isFirstStep()) {
        this.validateStepFirst = true
      } else if (this._isNextStep()) {
        this.validateStepNext = true
      } else if (this._isNextNextStep()) {
        this.validateStepNextNext = true
      }
    },

    preStep() {
      this.decreaseStep()
      this.toStep = -1
    },

    increaseStep() {
      if (this.step > 3) {
        return
      }
      this.step = this.step + 1

      if (this.step === this.toStep) {
        this.toStep = -1
      }

      //
      if (this.toStep > this.step) {
        this.$nextTick(() => {
          this.nextStep(true)
        })
      }
    },

    //
    decreaseStep() {
      if (this.step < 1) {
        return
      }
      this.step = this.step - 1
    },

    handleToStep(step) {
      var currentStep = this.step
      var toStep = step

      if (step === currentStep) {
        return
      }

      if (toStep > currentStep) {
        this.toStep = toStep
        this.nextStep(true)
      } else {
        // 前进直接前进去看。
        this.step = toStep
        this.toStep = -1
      }
    },

    _isUpdate() {
      return this.showType === FORM_OBJECT.update
    },

    _isShow() {
      return this.showType === FORM_OBJECT.show
    },

    _isCreate() {
      return this.showType === FORM_OBJECT.create
    },

    _isFirstStep() {
      return this.step === STEP_OBJECT.first
    },

    _isNextStep() {
      return this.step === STEP_OBJECT.next
    },

    _isNextNextStep() {
      return this.step === STEP_OBJECT.nextNext
    },

    _isLastStep() {
      return this.step === STEP_OBJECT.last
    }

  }
}
</script>

<style>
    .app-container {
        position: relative;
    }
</style>

<style scoped>
    .footer {
        position: fixed;
        width: 100%;
        height: 40px;
        background: #fff;
        bottom: 0;
        left: 0;
        border-top: 1px solid #eee;
        z-index: 100;
    }

    .btn-group1 {
        float: left;
        margin-left: 300px;
        line-height: 40px;
    }

    .btn-group {
        width: 400px;
        line-height: 40px;
        margin: 0 auto;
    }

    .btn-group .btn {
        display: inline-block;
    }

    .mobile .btn-group1 {
        margin-left: 100px;
    }

    .step-item {
        cursor: pointer;
    }

</style>
