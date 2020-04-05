import {getReadTime} from "./localStorage";

export const FONT_SIZE_LIST = [
    { fontSize: '12px' },
    { fontSize: '14px' },
    { fontSize: '16px' },
    { fontSize: '18px' },
    { fontSize: '20px' },
    { fontSize: '22px' },
    { fontSize: '24px' },
]

export const FONT_FAMILY = [
    { font: 'Default' },
    { font: 'STXinwei Regular' },
    { font: '微软雅黑' },
    { font: 'STCaiyun Regular' },
    { font: 'STXingkai Regular' },
]

export function themeList(vue) {
    return [
        {
            alias: vue.$t('book.themeDefault'),
            name: 'Default',
            style: {
                body: {
                    'color': '#4c5059',
                    'background': '#cecece'
                }
            }
        },
        {
            alias: vue.$t('book.themeGold'),
            name: 'Gold',
            style: {
                body: {
                    'color': '#5c5b56',
                    'background': '#c6c2b6'
                }
            }
        },
        {
            alias: vue.$t('book.themeEye'),
            name: 'Eye',
            style: {
                body: {
                    'color': '#404c42',
                    'background': '#a9c1a9'
                }
            }
        },
        {
            alias: vue.$t('book.themeNight'),
            name: 'Night',
            style: {
                body: {
                    'color': '#cecece',
                    'background': '#000000'
                }
            }
        }
    ]
}

export function addCss(href) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', href)
    document.getElementsByTagName('head')[0].appendChild(link)
}

export function removeCss(href) {
    href = href instanceof Array ? href : [href]
    const links = document.getElementsByTagName('link')
    for (let i = links.length - 1; i >= 0; i--) {
        const link = links[i]
        if (link && link.getAttribute('href') && href.includes(link.getAttribute('href'))) {
            link.parentNode.removeChild(link)
        }
    }
}

export function removeAllCss() {
    removeCss([
        process.env.VUE_APP_RES_URL + '/theme/theme_default.css',
        process.env.VUE_APP_RES_URL + '/theme/theme_eye.css',
        process.env.VUE_APP_RES_URL + '/theme/theme_gold.css',
        process.env.VUE_APP_RES_URL + '/theme/theme_night.css'
    ])
}

export function getReadTimeByMinute(fileName) {
    const readTime = getReadTime(fileName)
    if (!readTime) {
        return 0
    } else {
        return Math.ceil(readTime / 60)
    }
}

export function flatten(arr) {
    return [].concat(...arr.map(item => [].concat(item, ...flatten(item.subitems))))
}
