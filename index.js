

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));


const connectLivereload = require("connect-livereload");


app.use(express.static('public'));
app.use(connectLivereload());


app.get('/Proto1', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/Proto1-YouTube.html'));
});

app.get('/Proto2', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/Proto2-Vimeo.html'));
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
