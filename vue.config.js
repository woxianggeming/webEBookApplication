module.exports = {
    devServer:{
        host: "0.0.0.0",
        port: 8081,
        https: false,
        open: true,
        hotOnly: true,
        proxy: {
            "/XX/*": {
                target: "http://172.16.68.134:8089",
                changeOrigin: true,
                // ws: true,//websocket支持
                secure: false
            },
            "/XX2/*": {
                target: "http://172.16.68.134:8089",
                changeOrigin: true,
                //ws: true,//websocket支持
                secure: false
            }
        }
    },
    lintOnSave: false,
    productionSourceMap: false,
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/styles/global.scss";`
            }
        }
    }
}
