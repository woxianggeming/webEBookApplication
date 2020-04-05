<template>
    <div class="ebook">
        <ebook-title></ebook-title>
        <ebookReader></ebookReader>
        <ebook-menu></ebook-menu>
    </div>
</template>

<script>
    import ebookReader from "../../components/ebook/ebookReader";
    import ebookTitle from '../../components/ebook/ebookTitle'
    import EbookMenu from "../../components/ebook/ebookMenu";
    import {getReadTime, saveReadTime} from "../../util/localStorage";
    import { ebookMixin } from '../../util/mixin'
    export default {
        name: "index",
        components: {EbookMenu, ebookReader,ebookTitle},
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
        width: 100%;
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>
