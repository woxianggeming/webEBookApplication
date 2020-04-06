<template>
    <div class="ebook" ref="ebook">
        <ebook-title></ebook-title>
        <ebookReader></ebookReader>
        <ebook-menu></ebook-menu>
        <ebook-bookmark></ebook-bookmark>
    </div>
</template>

<script>
    import ebookReader from "../../components/ebook/ebookReader";
    import ebookTitle from '../../components/ebook/ebookTitle'
    import EbookMenu from "../../components/ebook/ebookMenu";
    import {getReadTime, saveReadTime} from "../../util/localStorage";
    import { ebookMixin } from '../../util/mixin'
    import EbookBookmark from "../../components/ebook/ebookBookmark";
    export default {
        name: "index",
        components: {EbookBookmark, EbookMenu, ebookReader,ebookTitle},
        mixins: [ebookMixin],
        methods: {
            startLoopReadTime () {
                let readTime = getReadTime(this.fileName)
                if (!readTime) {
                    readTime = 0
                }
                this.task = setInterval(() => {
                    readTime ++
                    if (readTime % 30 === 0) {
                        saveReadTime(this.fileName, readTime)
                    }
                }, 1000)
            },
            move(v) {
                this.$refs.ebook.style.top = v + 'px'
            },
            restore () {
                this.$refs.ebook.style.top = 0
                this.$refs.ebook.style.transition = 'all .2s linear'
                setTimeout(() => {
                    this.$refs.ebook.style.transition = ''
                }, 200)
            }
        },
        watch: {
            offsetY(v) {
                if (this.bookAvailable && !this.menuVisible) {
                    if (v > 0) {
                        this.move(v)
                    } else if (v === 0) {
                        this.restore()
                    }
                }
            }
        },
        mounted() {
            this.startLoopReadTime()
        },
        beforeDestroy() {
            if (this.task) {
                clearInterval(this.task)
            }
        }
    }

</script>

<style scoped lang="scss">
    .ebook {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
