<template>
  <div class="app-container">
    <server-form show-type="create" :editItem.sync="item"></server-form>
  </div>
</template>

<script>
  import ServerForm from './components/ServerForm';
  import * as serverApi from '~/api/server';

  const _name = 'serverCopy';
  export default {
    name: _name,
    data() {
      return {
        id: '',
        clusterId: '',
        item: {}
      };
    },
    components: {ServerForm},
    created() {
      this.init();
    },
    watch: {
      '$route': function (to, from) {
        if (to.name != _name) {
          this.$destroy();
        }
      }
    },

    methods: {
      init() {
        this.id = this.$route.query.id;
        this.clusterId = this.$route.query.clusterId;
        let id = this.id;
        if (!id) {
          return;
        }

        serverApi.getItemById(id).then((item) => {
          item = item || {};
          if (this.clusterId) {
            item.bindClusterId = parseInt(this.clusterId, 10);
          }
          // 删除 id 变成新增操作
          item.id = '';
          this.item = item;
        });
      }
    }
  };
</script>

<style scoped>

</style>
