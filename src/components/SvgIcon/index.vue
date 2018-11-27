<template>
    <svg :class="svgClass" aria-hidden="true" v-if="isSvg">
        <use :xlink:href="iconName"></use>
    </svg>
    <span class="svg-icon" v-else :class="iconName"></span>
</template>

<script>

    // svg icon
    export default {
        name: 'svg-icon',
        props: {
            iconClass: {
                type: String,
                required: true
            },
            className: {
                type: String
            }
        },
        computed: {
            isSvg() {
                return this.iconClass && this.iconClass.indexOf('-icon-') === -1;
            },

            iconName() {
                if (this.iconClass && this.iconClass.indexOf('-icon-') !== -1) {
                    return `${this.iconClass}`
                }
                else {
                    return `#icon-${this.iconClass}`
                }

            },
            svgClass() {
                if (this.className) {
                    return 'svg-icon ' + this.className
                } else {
                    return 'svg-icon'
                }
            }
        }
    }
</script>

<style scoped>
    .svg-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
