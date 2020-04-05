<template>
    <div class="ebook-loading">
        <div class="ebook-loading-wrapper">
            <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
                <div class="ebook-loading-line-wrapper" v-for="(xubItem, subIndex) in item" :key="subIndex">
                    <div class="ebook-loading-line" ref="line"></div>
                    <div class="ebook-loading-mask" ref="mask"></div>
                </div>
            </div>
            <div class="ebook-loading-center"></div>
        </div>
    </div>
</template>

<script>
    import { px2rem } from "../../util/utils";

    export default {
        name: "ebookLoading",
        data () {
            return {
                data: [
                    [{}, {}, {}],
                    [{}, {}, {}],
                ],
                maskWidth: [
                    { value: 0 },
                    { value: 0 },
                    { value: 0 },
                    { value: 0 },
                    { value: 0 },
                    { value: 0 },
                ],
                add: true,
                end: false
            }
        },
        mounted() {
            this.task = setInterval(() => {
                this.$refs.mask.forEach((item, index) => {
                    const mask = item
                    let maskWidth = this.maskWidth[index]
                    if (index === 0) {
                        if (this.add && maskWidth.value < 16) {
                            maskWidth.value ++
                        } else if (!this.add && maskWidth.value >= 0) {
                            maskWidth.value --
                        }
                    } else {
                        if (this.add) {
                            const preMaskWidth = this.maskWidth[index - 1]
                            if (preMaskWidth.value >= 8 && maskWidth.value < 16) {
                                maskWidth.value ++
                            }
                        } else {
                            const preMaskWidth = this.maskWidth[index - 1]
                            if (preMaskWidth.value <= 8 && maskWidth.value > 0) {
                                maskWidth.value --
                            }
                        }
                    }
                    mask.style.width = `${px2rem(maskWidth.value)}rem`
                    if (index === this.maskWidth.length - 1) {
                        if (this.add) {
                            if (maskWidth.value === 16) {
                                this.end = true
                            }
                        } else {
                            if (maskWidth.value === 0) {
                                this.end = true
                            }
                        }
                    }
                    if (this.end) {
                        this.add = !this.add
                        this.end = false
                    }
                })
            }, 20)
        }
    }
</script>

<style scoped lang="scss">
.ebook-loading {
    position: relative;
    z-index: 400;
    width: px2rem(63);
    height: px2rem(40);
    border: px2rem(1.5) solid #d7d7d7;
    background: transparent;
    -webkit-border-radius: px2rem(3);
    -moz-border-radius: px2rem(3);
    border-radius: px2rem(3);
    .ebook-loading-wrapper {
        display: flex;
        width: 100%;
        height: 100%;
        .ebook-loading-item {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: px2rem(7) 0;
            box-sizing: border-box;
            .ebook-loading-line-wrapper {
                flex: 1;
                padding: 0 px2rem(7);
                box-sizing: border-box;
                @include left;
                .ebook-loading-line {
                    flex: 1;
                    height: px2rem(2);
                    background: #d7d7d7;
                }
                .ebook-loading-mask {
                    width: px2rem(10);
                    height: px2rem(2);
                }
            }
        }
        .ebook-loading-center {

        }
    }
}
</style>
