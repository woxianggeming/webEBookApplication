import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: () => import('./views/ebook/index.vue'),
            children: [
                {
                    path: ':fileName',
                    component: () => import('./components/ebook/ebookReader.vue')
                }
            ]
        }
    ]
})
