// proxy.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'https://backapan.zeabur.app',
  changeOrigin: true,
  secure: false,
  pathRewrite: {'^/api': '/v1'},
  onError(err, req, res) {
    console.error('Proxy error', err);
    res.status(500).send('Proxy error');
  }
}));

const PORT = 5050;
app.listen(PORT, () => console.log(`Proxy rodando em http://localhost:${PORT}/api -> https://backapan.zeabur.app/v1`));
