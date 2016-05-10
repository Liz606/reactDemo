var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();//帮助解析请求地址
var COMMENTS_FILE = path.join(__dirname, 'src/comments.json');
console.log(COMMENTS_FILE);/******************************************************************/
app.set('port', (process.env.PORT || 3002));
app.use('/', express.static(path.join(__dirname, '/src')));//指定静态资源的root目录,index.html根目录
console.log(path.join(__dirname, '/src'));/******************************************************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
//页面从服务器获取数据，'/api/comments'对应页面url
app.get('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
     console.log('get');
  });
});

app.post('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
     console.log('post');
    var newComment = {
      id: Date.now(),
      author: req.body.author,
      text: req.body.text,
    };
    comments.push(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
