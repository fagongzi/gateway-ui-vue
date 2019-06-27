<template>
  <div class="app-container">
    <div class="grid-content el-margin-bottom">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基础信息</span>
        </div>
        <el-form label-width="150px">
          <el-form-item label="名称">
            <span>{{ tempItem.name }}</span>
          </el-form-item>

          <el-form-item label="接口URL匹配模式">
            <span>{{ tempItem.urlPattern }}</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">Gateway使用该字段来匹配原始请求的URL。<br>该字段必须和Method配合使用，同时满足才算这个请求匹配了这个API。</div>
              <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
            </el-tooltip>
          </el-form-item>

          <el-form-item label="接口请求类型">
            <span>{{ tempItem.method }}</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">* 匹配所有的HTTP Method（GET,PUT,POST,DELETE）。<br>该字段必须和URLPattern配合使用，同时满足才算这个请求匹配了这个API。
              </div>
              <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
            </el-tooltip>
          </el-form-item>

          <el-form-item label="匹配优先级">
            <span v-if="tempItem.position">{{ tempItem.position }}</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">API匹配时按该值的升序匹配，即值越小优先级越高。默认值为0。</div>
              <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
            </el-tooltip>
          </el-form-item>

          <el-form-item label="匹配规则">
            <span>{{ tempItem.matchRule | matchRuleFilter }}</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">
                matchDefault 匹配规则 Domain || (URLPattern && Method) <br>
                matchAll 匹配规则 Domain && URLPattern && Method <br>
                matchAny 匹配规则 Domain || URLPattern || Method
              </div>
              <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="是否生效">
            <el-switch
              v-model="tempItem.status"
              :disabled="true"
              active-color="#13ce66"
              inactive-color="#f1f1f1"
            />
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">只有开关开着，API 才能生效。</div>
              <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
            </el-tooltip>
          </el-form-item>

          <el-form-item label="接口请求域名">
            <span>{{ tempItem.domain }}</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">当原始请求的host等于该值，则认为匹配了当前的API，同时忽略URLPattern和Method。</div>
              <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
            </el-tooltip>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="grid-content el-margin-bottom">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>接口信息</span>
        </div>
        <div v-for="(item,index) in tempItem.nodes">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>接口{{ index+1 }}</span>
            </div>
            <el-form label-width="150px">
              <el-form-item label="集群:" class="inline-item">
                <span>{{ item.clusterName }}</span>
              </el-form-item>
              <el-form-item label="节点标示名:" class="inline-item">
                <span>{{ item.attrName || '&nbsp;' }}</span>
              </el-form-item>
              <el-form-item label="url重写规则:" class="inline-item">
                <span>{{ item.urlRewrite || '&nbsp;' }}</span>
              </el-form-item>
              <el-form-item label="写超时:" class="inline-item">
                <span>{{ item.writeTimeout | toSecondFilter }}</span>
              </el-form-item>
              <el-form-item label="读超时:" class="inline-item">
                <span>{{ item.readTimeout | toSecondFilter }}</span>
              </el-form-item>
              <el-form-item label="匹配优先级:" class="inline-item">
                <span>{{ item.batchIndex }}</span>
              </el-form-item>
              <el-form-item label="http默认值:" class="form-item-block">
                <el-row :gutter="10">
                  <el-col :span="6">
                    <label for="">强制启用默认值：
                      <el-switch
                        v-model="item.useDefault"
                        :disabled="true"
                        active-color="#13ce66"
                        inactive-color="#f1f1f1"
                      />
                    </label>

                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">当该值为True且默认值存在时，直接使用默认值存作为返回值。</div>
                      <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="4">
                    <label for="">状态码：<span>{{ item.defaultValue && item.defaultValue.code }}</span>
                    </label>

                  </el-col>
                  <el-col :span="10">
                    <label for="">body
                      内容：<span>{{ (item.defaultValue && item.defaultValue.body) | decodeBase64 }}</span>
                    </label>
                  </el-col>
                </el-row>
                <el-row v-if="item.defaultValue && item.defaultValue.headers" class="el-margin-bottom">
                  <el-col :span="3" style="padding-right: 8px;text-align: right">
                    <label for="">head头部:</label>
                  </el-col>
                  <el-col :span="20">
                    <template v-for="(head,index) in item.defaultValue.headers">
                      <span v-if="head.name && head.value">{{ head.name }} : {{ head.value }}</span>
                    </template>
                  </el-col>
                </el-row>
                <el-row v-if="item.defaultValue && item.defaultValue.cookies" class="el-margin-bottom">
                  <el-col :span="3" style="padding-right: 8px;text-align: right"><label
                    for=""
                  >cookie内容:</label></el-col>
                  <el-col :span="20">
                    <template v-for="(cookie,index) in item.defaultValue.cookies">
                      <span v-if="cookie.name && cookie.value">{{ cookie.name }} : {{ cookie.value }}</span>
                    </template>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item v-if="item.retryStrategy" label="重试策略:" class="form-item-block">
                <el-row :gutter="10">
                  <el-col :span="6">
                    <label for="">重试间隔时间：<span>{{ item.retryStrategy.interval }}ms</span>
                    </label>
                  </el-col>
                  <el-col :span="8">
                    <label for="">最多重试次数：<span>{{ item.retryStrategy.maxTimes }}</span>
                    </label>
                  </el-col>
                  <el-col :span="8">
                    <label for="">处理的错误码：
                      <span v-for="(itemCode,index) in item.retryStrategy.codes">{{ itemCode }},</span>
                    </label>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item v-if="item.cache" label="数据缓存:" class="form-item-block">
                <el-row :gutter="10">
                  <el-col :span="3" style="text-align: right">
                    <label for="">过期时间:</label>
                  </el-col>
                  <el-col :span="6">
                    <span>{{ item.cache.deadline | toSecondFilter }}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px">
                  <el-col :span="3" style="text-align: right">
                    <label for="">关键词:</label>
                  </el-col>
                  <el-col :span="21">
                    <template v-for="(key,index) in item.cache.keys">
                      <el-row class="el-margin-bottom" :gutter="10">
                        <el-col :span="6">
                          <span>数据源：{{ key.source |sourceFilter }}</span>
                        </el-col>
                        <el-col v-if="key.source != 5" :span="6">
                          <span>关键词: {{ key.name }}</span>
                        </el-col>

                        <el-col v-else :span="6">
                          <span>路径index：{{ key.index }}</span>
                        </el-col>
                      </el-row>
                    </template>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px">
                  <el-col :span="3" style="text-align: right"><label for="">匹配条件:</label>
                  </el-col>
                  <el-col :span="21">
                    <template v-for="(condition,index) in item.cache.conditions">
                      <el-row class="el-margin-bottom" :gutter="10">
                        <el-col :span="4">
                          <span>数据源: {{ condition.parameter.source |sourceFilter }}</span>
                        </el-col>
                        <el-col v-if="condition.parameter.source != 5" :span="4">
                          <span>关键词: {{ condition.parameter.name }}</span>
                        </el-col>

                        <el-col v-else :span="4">
                          <span>路径index: {{ condition.parameter.index }}</span>
                        </el-col>
                        <el-col :span="4">
                          <span>操作符: {{ condition.cmp |cmpFilter }}</span>
                        </el-col>
                        <el-col :span="4">
                          <span>表达式: {{ condition.expect }}</span>
                        </el-col>
                      </el-row>
                    </template>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item v-if="item.validations" label="校验规则:" class="form-item-block">
                <div>
                  <template v-for="(validation,index) in item.validations">
                    <div style="overflow: hidden">
                      <el-row :gutter="10">
                        <el-col :span="4">
                          <span>数据源: {{ validation.parameter.source |sourceFilter }}</span>
                        </el-col>
                        <el-col v-if="validation.parameter.source != 5" :span="4">
                          <span>关键词: {{ validation.parameter.name }}</span>
                        </el-col>

                        <el-col v-else :span="4">
                          <span>路径index: {{ validation.parameter.index }}</span>
                        </el-col>
                        <el-col :span="4">
                          <span>表达式: {{ validation.rules[0].expression }}</span>
                        </el-col>
                        <el-col :span="4">
                          <el-checkbox-group
                            v-model="validation.required"
                            :disabled="true"
                            style="color: #666666;float: left"
                          >
                            <el-checkbox label="是否必须" name="type" />
                          </el-checkbox-group>
                        </el-col>
                      </el-row>
                    </div>
                  </template>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

      </el-card>
    </div>

    <div class="grid-content el-margin-bottom">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>服务保护</span>
        </div>
        <el-form label-width="150px">
          <el-form-item label="支持的最大QPS">
            <span v-if="tempItem.maxQPS">{{ tempItem.maxQPS }}</span>
          </el-form-item>
          <el-form-item label="熔断规则" style="width: 800px">
            <el-card
              v-if="tempItem.circuitBreaker && tempItem.circuitBreaker.closeTimeout"
              class="box-card"
            >
              <el-row>
                <el-col :span="8" style="text-align: right;padding-right: 8px;">关闭检查间隔时间:
                </el-col>
                <el-col :span="10">
                  <span>{{ tempItem.circuitBreaker.closeTimeout | toSecondFilter }}</span>
                </el-col>
              </el-row>
              <el-row class="el-margin-top">
                <el-col :span="8" style="text-align: right;padding-right: 8px;">熔断器检查周期:
                </el-col>
                <el-col :span="10">
                  <span>{{ tempItem.circuitBreaker.rateCheckPeriod | toSecondFilter }}</span>
                </el-col>
              </el-row>
              <el-row class="el-margin-top">
                <el-col :span="8" style="text-align: right;padding-right: 8px;">Half限流百分比:
                </el-col>
                <el-col :span="10">
                  <span>{{ tempItem.circuitBreaker.halfTrafficRate }}</span>
                </el-col>
              </el-row>
              <el-row class="el-margin-top">
                <el-col :span="8" style="text-align: right;padding-right: 8px;">Open -> Close的错误百分比:
                </el-col>
                <el-col :span="10">
                  <span>{{ tempItem.circuitBreaker.failureRateToClose }}</span>
                </el-col>
              </el-row>
              <el-row class="el-margin-top">
                <el-col :span="8" style="text-align: right;padding-right: 8px;">Half -> Open的成功百分比:
                </el-col>
                <el-col :span="10">
                  <span>{{ tempItem.circuitBreaker.succeedRateToOpen }}</span>
                </el-col>
              </el-row>
            </el-card>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="grid-content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>其他信息</span>
        </div>
        <el-form label-width="150px">
          <el-form-item label="默认返回值" style="width: 800px">
            <el-row v-if="tempItem.defaultValue && tempItem.defaultValue.code">
              <el-col>
                <el-card class="box-card">
                  <el-row>
                    <el-col :span="4" style="text-align: right;padding-right: 8px;">是否启动:</el-col>
                    <el-col :span="10">
                      <el-switch
                        v-model="tempItem.useDefault"
                        :disabled="true"
                        active-color="#13ce66"
                        inactive-color="#f1f1f1"
                      />
                      <el-tooltip class="item" effect="dark" placement="top-start">
                        <div slot="content">当该值为True且DefaultValue存在时，直接使用DefaultValue作为返回值。
                        </div>
                        <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4" style="text-align: right;padding-right: 8px;">状态码:</el-col>
                    <el-col :span="10">
                      <span>{{ tempItem.defaultValue && tempItem.defaultValue.code }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="el-margin-bottom">
                    <el-col :span="4" style="text-align: right;padding-right: 8px;">body 内容:
                    </el-col>
                    <el-col :span="14">
                      <span>{{ (tempItem.defaultValue && tempItem.defaultValue.body) | decodeBase64 }}</span>
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="tempItem.defaultValue && tempItem.defaultValue.headers"
                    class="el-margin-bottom"
                  >
                    <el-col :span="4" style="text-align: right;padding-right: 8px;">head 头部:
                    </el-col>
                    <el-col :span="20">
                      <template v-for="(head,index) in tempItem.defaultValue.headers">
                        <span v-if="head.name && head.value">{{ head.name }} : {{ head.value }}</span>
                      </template>
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="tempItem.defaultValue && tempItem.defaultValue.cookies"
                    class="el-margin-bottom"
                  >
                    <el-col :span="4" style="text-align: right;padding-right: 8px;">set Cookie:
                    </el-col>
                    <el-col :span="20">
                      <template v-for="(cookie,index) in tempItem.defaultValue.cookies">
                        <span v-if="cookie.name && cookie.value">{{ cookie.name }} : {{ cookie.value }}</span>
                      </template>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="Auth插件">
            <span>{{ tempItem.authFilter }}</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">指定该API所使用的Auth插件名称。Auth插件的实现可以借鉴JWT插件</div>
              <i style="margin-left: 10px;color: #909399;" class="el-icon-info" />
            </el-tooltip>
          </el-form-item>

          <el-form-item label="websocket参数">
            <span>{{ tempItem.webSocketOptions && tempItem.webSocketOptions.origin }}</span>
          </el-form-item>

          <el-form-item label="标签">
            <el-tag
              v-for="(item,index) in tempItem.tags"
              :key="index"
              style="margin-right: 8px"
              type="success"
            >{{ item.name }}({{ item.value }})
            </el-tag>
          </el-form-item>
          <el-form-item label="接口IP的访问控制" style="width: 800px">
            <el-row v-if="tempItem.ipAccessControl && tempItem.ipAccessControl.whitelist" :gutter="10">
              <el-col :span="11">
                <el-card class="box-card">
                  <div
                    v-for="(item,index) in tempItem.ipAccessControl.whitelist"
                    :key="index"
                    class="text item"
                  >{{ item }}
                  </div>
                </el-card>

              </el-col>
              <el-col v-if="tempItem.ipAccessControl && tempItem.ipAccessControl.blacklist" :span="11">

                <el-card class="box-card">
                  <div
                    v-for="(item,index) in tempItem.ipAccessControl.blacklist"
                    :key="index"
                    class="text item"
                  >{{ item }}
                  </div>
                </el-card>

              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="重定义接口返回">
            <el-row v-if="tempItem.renderTemplate && tempItem.renderTemplate.objects && tempItem.renderTemplate.objects.length > 0">
              <el-col>
                <div
                  v-for="(templateItem,index) in tempItem.renderTemplate.objects"
                  :key="index"
                  class="grid-content"
                >
                  <el-card class="box-card el-margin-bottom">
                    <div class="title_t">数据集 {{ index+1 }}
                    </div>
                    <el-row>
                      <el-col :span="4" style="text-align: right;padding-right: 8px;">字段名称:
                      </el-col>
                      <el-col :span="10">
                        <span>{{ templateItem.name }}</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4" style="text-align: right;padding-right: 8px;">flagAttrs:
                      </el-col>
                      <el-col :span="10">
                        <el-switch
                          v-model="templateItem.flatAttrs"
                          :disabled="true"
                          active-color="#13ce66"
                          inactive-color="#f1f1f1"
                        />
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4" style="text-align: right;padding-right: 8px;">属性:</el-col>
                      <el-col :span="20">
                        <template v-for="(attr,index) in templateItem.attrs">
                          <el-row class="el-margin-bottom" :gutter="10">
                            <el-col :span="8">
                              <span>name: {{ attr.name }}</span>
                            </el-col>
                            <el-col :span="8">
                              <span>value: {{ attr.extractExp }}</span>
                            </el-col>
                          </el-row>
                        </template>
                      </el-col>
                    </el-row>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div style="margin-left: 70px;margin-top: 20px">
      <el-button @click="goList">返回</el-button>
      <el-button type="primary" @click="goEdit()">编辑</el-button>

    </div>
  </div>
</template>

<script>
import * as apiApi from '~/api/api'
import * as clusterApi from '~/api/cluster'

const _name = 'apiShow'
export default {
  name: _name,
  data() {
    return {
      tempItem: {
        tlsEmbedCert: {}
      },
      loading: true
    }
  },
  watch: {
    '$route': function(to, from) {
      if (to.name != _name) {
        this.$destroy()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.id = this.$route.query.id
      const id = this.id
      if (!id) {
        return
      }
      apiApi.getItemById(id).then((item) => {
        item = item || {}
        item.status = item.status == 1
        this.tempItem = item
        this.updateCluster()
      })
    },

    //
    updateCluster() {
      if (typeof (this.tempItem.nodes) !== 'undefined') {
        this.tempItem.nodes.forEach((node, index) => {
          if (node.clusterID) {
            clusterApi.getItemById(node.clusterID).then((item) => {
              this.$set(this.tempItem.nodes[index], 'clusterName', item.name)
            })
          }
        })
      }
    },

    goList() {
      this.$router.replace({ path: '/api' })
      this.$destroy()
    },

    goEdit() {
      this.$router.push({ path: '/api/edit', query: { id: this.tempItem.id }})
    }
  }
}
</script>

<style scoped>
    .el-margin-top {
        margin-top: 10px;
    }

    .el-margin-bottom {
        margin-bottom: 10px;
    }

    .inline-item {
        display: inline-block;
    }
</style>
