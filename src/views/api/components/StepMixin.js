/*
* author: wancheng
* date: 2019-01-02
* desc:
*/

export default {

    watch: {
        'doValidate': function (newValue, oldValue) {
            if (newValue) {
                this.submitForm();
            }
        }
    },

    methods: {
        _showMessage(msg) {
            this.$message({
                type: 'warning',
                message: msg
            });
        }
    }
}
