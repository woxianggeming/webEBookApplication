import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import {getBookmark, saveLocation} from './localStorage'

export const ebookMixin = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'defaultFontFamily',
            'fontFamilyVisible',
            'defaultTheme',
            'bookAvailable',
            'progress',
            'section',
            'isPaginating',
            'currentBook',
            'navigation',
            'cover',
            'metadata',
            'paginate',
            'pagelist',
            'offsetY',
            'isBookmark'
        ]),
        themeList() {
            return themeList(this);
        }
    },
    methods: {
        ...mapActions([
            'setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setDefaultFontSize',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
            'setDefaultTheme',
            'setBookAvailable',
            'setProgress',
            'setSection',
            'setIsPaginating',
            'setCurrentBook',
            'setNavigation',
            'setCover',
            'setMetadata',
            'setPaginate',
            'setPagelist',
            'setOffsetY',
            'setIsBookmark'
        ]),
        initGlobalStyle () {
            removeAllCss()
            switch (this.defaultTheme) {
                case 'Default':
                    addCss(process.env.VUE_APP_RES_URL + '/theme/theme_default.css')
                    break
                case 'Eye':
                    addCss(process.env.VUE_APP_RES_URL + '/theme/theme_eye.css')
                    break
                case 'Gold':
                    addCss(process.env.VUE_APP_RES_URL + '/theme/theme_gold.css')
                    break
                case 'Night':
                    addCss(process.env.VUE_APP_RES_URL + '/theme/theme_night.css')
                    break
                default:
                    addCss(process.env.VUE_APP_RES_URL + '/theme/theme_default.css')
                    break
            }
        },
        refreshLocation (hasSet) {
            const currentLocation = this.currentBook.rendition.currentLocation()
            //epubcfi(/6/22[A468350_1_En_7_Chapter]!/4/12/18[Bib1]/4/8/4[CR4]/1:104)
            // A468350_1_En_7_Chapter: 对应的文件
            // ! : 打开文件操作
            // /4/12/18[Bib1]/4/8/4[CR4]/1:104 : 双数代表dom节点，表示从上至下第 n/2 个dom， [Bib1]辅助定位，表示dom id，单数表示第 n 条文本，:104 表示第104个字符
            if (currentLocation && currentLocation.start) {
                const startCFI = currentLocation.start.cfi
                if (!hasSet) {
                    const progress = this.currentBook.locations.percentageFromCfi(startCFI)
                    this.setProgress(Math.floor(progress * 100))
                }
                this.setSection(currentLocation.start.index)
                saveLocation(this.fileName, startCFI)

                const bookmarkList = getBookmark(this.fileName)
                if (bookmarkList) {
                    if (bookmarkList.some(item => item.cfi === startCFI)) {
                        this.setIsBookmark(true)
                    } else {
                        this.setIsBookmark(false)
                    }
                } else {
                    this.setIsBookmark(false)
                }
            }
        },
        display (target, cb) {
            this.currentBook.rendition.display(target ? target : undefined).then(() => {
                this.refreshLocation()
                cb && cb()
            })
        },
        hideTitleAndMenu () {
            this.setMenuVisible(false)
            this.setSettingVisible(-1)
            this.setFontFamilyVisible(false)
        },
        getReadTimeText() {
            return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
        },
    }
}
