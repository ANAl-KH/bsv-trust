const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target:'https://api.metasv.com/v1/address/',
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                "^/api": "/"
               },
        })
    );
};