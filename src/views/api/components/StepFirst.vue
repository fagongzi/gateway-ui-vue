<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="tempItem" label-width="180px">
      <el-form-item label="名称(Name)" prop="name">
        <el-input v-model.trim="tempItem.name" style="width: 200px" />
      </el-form-item>

      <el-form-item label="匹配规则(MatchRule)">
        <el-select v-model="tempItem.matchRule" placeholder="匹配规则" style="width: 200px">
          <el-option
            v-for="item in matchRuleConstant"
            :key="item.value"
            :value="item.value"
            :label="item.title"
          />
        </el-select>
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">
            matchDefault 匹配规则 Domain || (URLPattern && Method) <br>
            matchAll 匹配规则 Domain && URLPattern && Method <br>
            matchAny 匹配规则 Domain || URLPattern || Method
          </div>
          <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="域名(Domain)">
        <el-input
          v-model.trim="tempItem.domain"
          placeholder="当原始请求的host等于该值，则认为匹配了当前的API"
          style="width: 450px"
        />
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">当原始请求的host等于该值，则认为匹配了当前的API，同时忽略URLPattern和Method。</div>
          <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="URL匹配模式(urlPattern)">
        <el-input
          v-model.trim="tempItem.urlPattern"
          auto-complete="off"
          placeholder="请输入接口URL匹配模式，正则表达式，如：^/api/users/(\\d+)$"
          style="width: 450px"
        />
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">Gateway使用该字段来匹配原始请求的URL。<br>该字段必须和Method配合使用，同时满足才算这个请求匹配了这个API。</div>
          <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="接口请求类型(Method)">
        <el-select v-model="tempItem.method" placeholder="接口请求类型" style="width: 200px">
          <el-option
            v-for="item in methodsConstant"
            :key="item.value"
            :value="item.value"
            :label="item.title"
          />
        </el-select>
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">匹配请求的HTTP Method字段 <br> * 匹配所有的HTTP Method（GET,PUT,POST,DELETE）。<br>该字段必须和URLPattern配合使用，同时满足才算这个请求匹配了这个API。
          </div>
          <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="匹配优先级(Position)">
        <el-input-number
          v-model="tempItem.position"
          :min="0"
          :max="100"
          label="匹配优先级"
        />

        <el-button type="primary" size="mini" @click="dialogVisible = true">查看优先级排序</el-button>
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">API匹配时按该值的升序匹配，即值越小优先级越高。默认值为0。</div>
          <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="是否生效(Status)">
        <el-switch
          v-model="tempItem.status"
          active-color="#13ce66"
          inactive-color="#f1f1f1"
        />
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">只有开关开着，API 才能生效。</div>
          <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <el-table style="width: 100%" border fit :data="apiList" height="400">
        <el-table-column align="center" label="序号" width="65">
          <template slot-scope="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="匹配规则">
          <template slot-scope="scope">
            <span>{{ scope.row.matchRule | matchRuleFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="域名(Domain)">
          <template slot-scope="scope">
            <span>{{ scope.row.domain }}</span>
          </template>
        </el-table-column>
        <el-table-column label="URL匹配模式">
          <template slot-scope="scope">
            <span>{{ scope.row.urlPattern }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接口请求类型">
          <template slot-scope="scope">
            <span>{{ scope.row.method }}</span>
          </template>
        </el-table-column>

        <el-table-column label="优先级">
          <template slot-scope="scope">
            <span>{{ scope.row.position }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  MATCH_RULE_OBJECT,
  METHODS_ARRAY,
  MATCH_RULE_ARRAY
} from '~/constant/constant'
import { extend, clone } from '~/utils'
import * as apiApi from '~/api/api'
import sortBy from 'lodash.sortby'
import StepMixin from './StepMixin'

export default {
  name: 'StepFirst',
  mixins: [StepMixin],
  props: {
    editItem: {
      type: Object
    },
    doValidate: {
      type: Boolean
    }
  },

  data() {
    return {
      tempItem: {
        name: undefined, // 必填
        urlPattern: undefined, // 必填
        method: '*',
        domain: '', // 必填
        status: true,
        position: 0,
        matchRule: MATCH_RULE_OBJECT.matchDefault
      },

      methodsConstant: METHODS_ARRAY,

      matchRuleConstant: MATCH_RULE_ARRAY,

      rules: {
        name: [{ required: true, message: '请填写接口名称', trigger: 'change' }]
      },
      apiList: [],
      dialogVisible: false,
      apiListLoading: true
    }
  },
  watch: {
    //
    'editItem': function(newValue, oldValue) {
      this.tempItem = extend(this.tempItem, clone(newValue))
      this.loading = false
    }
  },
  created() {
    this.init()
  },

  methods: {
    init() {
      this.apiListLoading = true
      apiApi.getAllData().then((data) => {
        data = data || []
        this.apiListLoading = false
        this.apiList = sortBy(data, 'position')
      }).catch(() => {
        this.apiListLoading = false
      })
    },

    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        var validResult = valid
        if (validResult) {
          validResult = this._validateForm()
        }

        this.$emit('submitFormStep', !validResult, this.tempItem)
      })
    },

    clearValidate() {
      this.$refs['dataForm'].clearValidate()
    },

    _validateForm() {
      var result = true

      if (this.tempItem.matchRule === MATCH_RULE_OBJECT.matchDefault) {
        if (!(this.tempItem.domain || this.tempItem.urlPattern)) {
          result = false
          this._showMessage('matchDefault 匹配规则 Domain || (URLPattern && Method)')
        }
      } else if (this.tempItem.matchRule === MATCH_RULE_OBJECT.matchAll) {
        if (!(this.tempItem.domain && this.tempItem.urlPattern)) {
          result = false
          this._showMessage('matchAll 匹配规则 Domain && URLPattern && Method')
        }
      }

      return result
    }
  }
}
</script>

<style scoped>

</style>
