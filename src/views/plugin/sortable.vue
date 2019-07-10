<template>
  <div class="app-container">
    <div style="margin-bottom: 18px">
      <el-alert type="warning" :closable="false" title="通过'所有插件'通过拖拽的方式，移动到'已使用插件'来使用该插件 可以通过拖拽的方式，在'已使用插件'进行插件的使用排序。">
      </el-alert>
    </div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>所有插件</span>
          </div>
          <draggable class="list-group"
                     :list="sortLeftList"
                     group="sortable"
                     :move="handleMoveLeftItem"
                     @end="handleLeftEnd"
                     :sort="false">
            <div class="list-group-item" v-for="(item,index) in sortLeftList" :key="item.id">
              <span>{{item.name}}(v{{item.version}})</span>
            </div>
          </draggable>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>已使用插件</span>
          </div>
          <draggable class="list-group"
                     :list="sortRightList"
                     v-bind="dragConfig"
                     @change="handleRightChange"
                     group="sortable">
            <transition-group type="transition" :name="'flip-list'">
              <div class="list-group-item" v-for="(item,index) in sortRightList" :key="item.id">
                <span>{{item.name}}(v{{item.version}})</span>
                <span title="移除插件" class="el-icon-error" style="float: right;cursor: pointer"
                      @click="handleRemoveRightItem(item,index)"></span>
              </div>
              <div class="list-group-empty" v-if="sortRightList.length ===0 && !sortLeftItemMoving" key="-1">
                拖拽到此
              </div>
            </transition-group>
          </draggable>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>插件执行顺序（洋葱模型）</span>
          </div>
          <div>
            <div class="list-group-show">
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in sortRightList"
                  :key="index"
                  icon="el-icon-caret-bottom"
                  color="#0bbd87"
                  timestamp="pre method"
                  placement="top"
                >
                  <el-card class="box-card">
                    <div>
                      {{item.name}} (v{{item.version}})
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
            <div class="list-group-show">
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in sortRightList"
                  :key="index"
                  icon="el-icon-caret-top"
                  color="#0bbd87"
                  timestamp="post method"
                  placement="top"
                >
                  <el-card class="box-card">
                    <div>
                      {{item.name}} (v{{item.version}})
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>

            <div class="list-bottom-tips" v-show="sortRightList.length > 0">
              <span class="el-icon-caret-bottom"></span>
              <span class="el-icon-caret-top"></span>
              API 逻辑处理
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="footer">
      <div class="btn-group1">
        <el-button @click="goList" size="mini">返回</el-button>
        <el-button type="primary" :loading="submitting" icon="el-icon-check" size="mini"
                   @click="updateItem">提交
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from '~/components/Draggable';
  import * as pluginApi from '~/api/plugin';

  function _formatSortItem(options) {
    return {
      id: options.id,
      name: options.name,
      version: options.version
    };
  }

  const _name = 'pluginSortable';
  export default {
    name: _name,
    data() {
      return {
        loading: true,
        submitting: false,
        dataList: [], //
        sortLeftList: [],
        sortLeftItemMoving: false,
        sortRightList: [], // 排序列表
        tempSortable: {},
        dragConfig: {
          animation: 0,
          group: "description",
          disabled: false,
          ghostClass: "sortable-ghost" // 拖拽时候 class 样式
        }
      };
    },
    created() {
      this.init();
    },
    mounted() {

    },
    watch: {
      '$route': function (to, from) {
        if (to.name != _name) {
          this.$destroy();
        }
      }
    },
    components: {draggable},
    methods: {
      init() {
        this.loading = true;
        //
        this.getPluginList();
      },

      //
      getPluginList() {
        var that = this;
        pluginApi.getAllData().then(function (data) {
          that.dataList = data || [];
          that.loading = false;
          that.getSortable();
        }).catch(function () {
          that.loading = false;
        });
      },

      getSortable() {
        var that = this;

        pluginApi.getApply().then(function (data) {
          that.tempSortable = data || {};
          that.updateSortList();
        }).catch(function () {

        });
      },

      updateSortList() {
        var appliedIDs = this.tempSortable.appliedIDs;

        if (appliedIDs && appliedIDs.length > 0) {
          var tempLeftList = [];
          var tempRightList = [];
          //Z`
          this.dataList.forEach((item) => {
            var tempItem = {
              id: item.id,
              name: item.name,
              version: item.version
            };
            //
            if (!appliedIDs.includes(item.id)) {
              tempLeftList.push(tempItem);
            }
          });

          appliedIDs.forEach((id) => {

            var appliedItem = this._getPluginById(id);
            if (appliedItem) {

              var tempItem = {
                id: id,
                name: appliedItem.name,
                version: appliedItem.version
              };
              tempRightList.push(tempItem);
            }
          });


          if (tempLeftList.length > 0) {
            this.sortLeftList = tempLeftList;
          }

          if (tempRightList.length > 0) {
            this.sortRightList = tempRightList;
          }

        } else {
          this.sortLeftList = this.dataList.map((item) => {
            return {
              id: item.id,
              name: item.name,
              version: item.version
            };
          });
        }
      },

      updateItem() {
        if (this.submitting) {
          return;
        }

        this.submitting = true;

        var appliedIDs = [];
        if (this.sortRightList.length > 0) {
          appliedIDs = this.sortRightList.map((item) => {
            return item.id;
          });
        }
        var options = {
          id: this.tempSortable.id,
          appliedIDs: appliedIDs
        };

        pluginApi.updateApply(options).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          setTimeout(() => {
            this.goList();
          }, 2000);
        }).catch(() => {
          this.submitting = false;
        });

      },

      handleRemoveRightItem(item, index) {
        this.sortLeftList.unshift(item);
        this.sortRightList.splice(index, 1);
      },

      handleRightChange() {
        this.sortLeftItemMoving = false;
      },

      handleMoveLeftItem(evt, originalEvent) {
        this.sortLeftItemMoving = true;
      },

      handleLeftEnd() {
        this.sortLeftItemMoving = false;
      },

      goList() {
        this.$router.replace({path: '/plugin'});
        this.$destroy();
      },

      _getPluginById(id) {
        var ret;
        for (var i = 0, len = this.dataList.length; i < len; i++) {
          var tempItem = this.dataList[i];

          if (tempItem.id === id) {
            ret = tempItem;
            break;
          }
        }

        return ret;
      },
    }

  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .sortable-wrap {
    width: 810px;
  }

  .sortable-left, .sortable-right {
    width: 400px;
    display: inline-block;
  }

  .list-group {
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
    /*min-height: 40px;*/
  }

  .list-group-item {
    position: relative;
    display: block;
    padding: .75rem 1.25rem;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, .125);
    cursor: move;

    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &:hover {
      .el-icon-error {
        display: block;
      }
    }


    .el-icon-error {
      display: none;
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }

  .list-group-show {
    display: inline-block;
    width: 49%;
  }

  .list-bottom-tips {
    position: relative;
    text-align: center;
    height: 30px;
    line-height: 30px;
    width: 100%;
    border: 1px solid #EBEEF5;
    border-radius: 4px;

    span {
      color: #fff;
      width: 12px;
      height: 12px;
      background-color: rgb(11, 189, 135);
      position: absolute;
      border-radius: 50%;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }

    .el-icon-caret-bottom {
      left: 38px;
      top: -14px;
    }


    .el-icon-caret-top {
      top: -14px;
      right: 208px;
    }
  }

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


  .sortable-ghost {
    opacity: .8;
    color: #fff;
    background: #42b983;
  }

  .list-group-empty {
    height: 50px;
    line-height: 50px;
    margin: 5px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    text-align: center;
  }

</style>
