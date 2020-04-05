<template>
    <div class="ebook-reader">
        <div id="read"></div>
        <div class="mask" ref="mask" @touchstart="touchStart" @touchend="touchEnd"></div>
    </div>
</template>

<script>
    import { ebookMixin } from '../../util/mixin'
    import Epub from 'epubjs'
    import {
        getFontFamily,
        saveFontFamily,
        getFontSize,
        saveFontSize,
        getTheme,
        saveTheme,
        getLocation
    } from "../../util/localStorage";
    import { flatten } from "../../util/book";

    global.ePub = Epub
    export default {
        name: "ebookReader",
        mixins:[ebookMixin],
        methods: {
            initEpub () {
                const url = process.env.VUE_APP_RES_URL + '/chinesekongfu/' + this.fileName + '.epub'
                this.book = new Epub(url)
                this.setCurrentBook(this.book)
                this.initRendition()
                this.parseBook()
                this.book.ready.then(() => {
                    const fontSize = parseInt(getFontSize(this.fileName) || this.defaultFontSize)
                    return this.book.locations.generate(750 * (window.innerWidth / 375) * ( fontSize/ 16))
                }).then(locations => {
                    this.setBookAvailable(true)
                    this.refreshLocation()
                })
            },
            initRendition () {
                this.rendition = this.book.renderTo('read', {
                    width: innerWidth,
                    height: innerHeight,
                    methods: 'default'
                })
                const location = getLocation(this.fileName)
                this.display(location, () => {
                    this.initTheme()
                    this.initFontSize()
                    this.initFontFamily()
                    this.initGlobalStyle()
                })
                this.rendition.hooks.content.register(contents => {
                    Promise.all([
                        contents.addStylesheet(process.env.VUE_APP_RES_URL + '/fonts/cabin.css'),
                        contents.addStylesheet(process.env.VUE_APP_RES_URL + '/fonts/daysOne.css'),
                        contents.addStylesheet(process.env.VUE_APP_RES_URL + '/fonts/montserrat.css'),
                        contents.addStylesheet(process.env.VUE_APP_RES_URL + '/fonts/Tangerine.css')
                    ]).then(() => {

                    })
                })
            },
            initTheme () {
                let defaultTheme = getTheme(this.fileName)
                if (!defaultTheme) {
                    defaultTheme = this.themeList[0].name
                    saveTheme(this.fileName, defaultTheme)
                }
                this.setDefaultTheme(defaultTheme)
                this.themeList.forEach(theme => {
                    this.rendition.themes.register(theme.name, theme.style)
                })
                this.rendition.themes.select(defaultTheme)
            },
            initFontSize () {
                let fontSize = getFontSize(this.fileName)
                if (!fontSize) {
                    saveFontSize(this.fileName, this.defaultFontSize)
                } else {
                    this.setDefaultFontSize(fontSize)
                    this.rendition.themes.fontSize(fontSize)
                }
            },
            initFontFamily () {
                let font = getFontFamily(this.fileName)
                if (!font) {
                    saveFontFamily(this.fileName, this.defaultFontFamily)
                } else {
                    this.setDefaultFontFamily(font)
                    this.rendition.themes.font(font)
                }
            },
            parseBook () {
                this.book.loaded.cover.then(cover => {
                    if (cover) {
                        this.book.archive.createUrl(cover).then(url => {
                            this.setCover(url)
                        })
                    }
                })
                this.book.loaded.metadata.then(metadata => {
                    this.setMetadata(metadata)
                })
                this.book.loaded.navigation.then(navigation => {
                    const navItem = flatten(navigation.toc)
                    function findLevel(item, level = 0) {
                        return item.parent ? findLevel(navItem.filter(parentItem => item.parent === parentItem.id)[0], level + 1) : level
                    }
                    navItem.forEach(item => {
                        item.level = findLevel(item)
                    })
                    this.setNavigation(navItem)
                })
            },
            touchStart (event) {
                this.touchStartX = event.changedTouches[0].clientX
                this.touchStartTime = event.timeStamp
            },
            touchEnd (event) {
                const offsetX = event.changedTouches[0].clientX - this.touchStartX
                const time = event.timeStamp - this.touchStartTime
                if (time < 500 && offsetX > 40) {
                    this.prevPage()
                } else if (time < 500 && offsetX < -40) {
                    this.nextPage()
                } else {
                    this.toggleTitleAndMenu()
                }
            },
            prevPage () {
                if (this.rendition) {
                    this.rendition.prev().then(() => {
                        this.refreshLocation()
                    })
                    this.hideTitleAndMenu()
                }
            },
            nextPage () {
                if (this.rendition) {
                    this.rendition.next().then(() => {
                        this.refreshLocation()
                    })
                    this.hideTitleAndMenu()

                }
            },
            toggleTitleAndMenu () {
                if (this.menuVisible) {
                    this.setSettingVisible(-1)
                    this.setFontFamilyVisible(false)
                }
                this.setMenuVisible(!this.menuVisible)
            }
        },
        mounted() {
            this.setFileName(this.$route.params.fileName ? this.$route.params.fileName : 'test_book').then(() => {
                this.initEpub()
            })
        }
    }
</script>

<style scoped lang="scss">
.mask {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    z-index: 100;
}
</style>
