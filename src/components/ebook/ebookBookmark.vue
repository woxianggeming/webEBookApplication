<template>
    <div class="ebook-bookmark" ref="bookmark">
        <div class="ebook-bookmark-text-wrapper">
            <div class="ebook-bookmark-down-wrapper" ref="iconDown">
                <span class="icon-down"></span>
            </div>
            <div class="ebook-bookmark-text">{{text}}</div>
        </div>
        <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
            <bookmark :color="color" :height="35" :width="15"></bookmark>
        </div>
    </div>
</template>

<script>
    import { realPx } from "../../util/utils";
    import Bookmark from "../common/bookmark";
    import { ebookMixin } from '../../util/mixin'
    import { getBookmark,saveBookmark } from "../../util/localStorage";

    const BLUE = '#346cbc'
    const WHITE = '#fff'
    export default {
        name: "ebookBookmark",
        mixins: [ebookMixin],
        components: {Bookmark},
        data () {
            return {
                text: '',
                color: WHITE,
                isFixed: false
            }
        },
        computed: {
            height () {
                return realPx(35)
            },
            threshold () {
                return realPx(55)
            },
            fixedStyle () {
                return {
                    position: 'fixed',
                    top: 0
                }
            }
        },
        watch: {
            offsetY(v) {
                if (this.bookAvailable && !this.menuVisible) {
                    if (v >= this.height && v < this.threshold) {
                        this.beforeThreshold(v)
                    } else if (v >= this.threshold) {
                        this.afterThreshold(v)
                    } else if (v > 0 && v < this.height) {
                        this.beforeHeight()
                    } else if (v === 0) {
                        this.restore()
                    }
                }
            },
            isBookmark(v) {
                this.isFixed = v
                if (v) {
                    this.color = BLUE
                } else {
                    this.color = WHITE
                }
            }
        },
        methods: {
            // 状态1：未到达书签高度
            beforeHeight () {
                if (this.isBookmark) {
                    this.text = this.$t('book.pulldownDeleteMark')
                    this.color = BLUE
                    this.isFixed = true
                } else {
                    this.text = this.$t('book.pulldownAddMark')
                    this.color = WHITE
                    this.isFixed = false
                }
            },
            // 状态2：未到达临界状态
            beforeThreshold (v) {
                // this.$refs.bookmark.style.position = 'fixed'
                // this.$refs.bookmark.style.top = 0
                this.beforeHeight()
                this.$refs.bookmark.style.top = `${-v}px`
                if (this.$refs.iconDown.style.transform === 'rotate(180deg)') {
                    this.$refs.iconDown.style.transform = 'rotate(0deg)'
                }
            },
            // 状态3：超过临界状态
            afterThreshold (v) {
                if (this.isBookmark) {
                    this.text = this.$t('book.releaseDeleteMark')
                    this.color = WHITE
                    this.isFixed = false
                } else {
                    this.text = this.$t('book.releaseAddMark')
                    this.color = BLUE
                    this.isFixed = true
                }
                this.$refs.bookmark.style.top = `${-v}px`
                if (this.$refs.iconDown.style.transform === '' || this.$refs.iconDown.style.transform === 'rotate(0deg)') {
                    this.$refs.iconDown.style.transform = 'rotate(180deg)'
                }
            },
            // 状态4: 归位
            restore () {
                setTimeout(() => {
                    this.$refs.bookmark.style.top = `${-this.height}px`
                    this.$refs.iconDown.style.transform = 'rotate(0deg)'
                }, 200)
                if (this.isFixed) {
                    this.setIsBookmark(true)
                    this.addBookmark()
                } else {
                    this.setIsBookmark(false)
                    this.removeBookmark()
                }
            },
            addBookmark () {
                let bookmarkList = getBookmark(this.fileName)
                if (!bookmarkList) {
                    bookmarkList = []
                }
                const currentLocation = this.currentBook.rendition.currentLocation()
                const cfiBase = currentLocation.start.cfi.replace(/!.*/, '')
                const cfiStart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
                const cfiEnd = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
                const cfiRange = `${cfiBase}!,${cfiStart},${cfiEnd})`
                this.currentBook.getRange(cfiRange).then(range => {
                    const text = range.toString().replace(/\s\s/g, '')
                    bookmarkList.push({
                        cfi: currentLocation.start.cfi,
                        text: text
                    })
                    saveBookmark(this.fileName, bookmarkList)
                })
            },
            removeBookmark () {
                const currentLocation = this.currentBook.rendition.currentLocation()
                const cfi = currentLocation.start.cfi
                let bookmarkList = getBookmark(this.fileName)
                if (bookmarkList) {
                    bookmarkList = bookmarkList.filter(item => item.cfi !== cfi)
                    saveBookmark(this.fileName, bookmarkList)
                }
            }
        }
    }
</script>

<style scoped lang="scss">
.ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
        position: absolute;
        right: px2rem(45);
        bottom: 0;
        display: flex;
        font-size: px2rem(14);
        color: white;
        .ebook-bookmark-down-wrapper {
            transition: all .2s linear;
            @include center;
        }
    }
    .ebook-bookmark-icon-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;
        margin-right: px2rem(15);
    }
}
</style>
