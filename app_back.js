var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs")
var docker = require(__dirname + "/private/script/docker_script");
var json = require(__dirname + "/private/script/data_script");
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const cors = require('cors');
const path = require('path');
const
  ioClient= require("socket.io-client"), //sockect io library
  client = ioClient.connect("http://210.114.90.86:3000"), //connect to controll server
  shell = require("shelljs"); //shell library


/*
  Controll Server에 컨테이너가 추가 되었을때
  건국대에서 제공하는 shell 스크립트가 실행된다.
*/
client.on("addCamera", function(data) {
  oboxName = data.oboxName;
  cameraArray = data.cameraArray;

  for (i = 0; i < cameraArray.length; i++) {
    cameraName = cameraArray[i].name;
console.log(cameraName);
    cameraUrl = cameraArray[i].url;
    shell.exec("bash /home/ubuntu/demo_visualization/shell/crontab.sh " + oboxName + " " + cameraName + " " + cameraUrl);
  }

});

/*
  Controll Server에 카메라가 제거 되었을때
  건국대에서 제공하는 shell 스크립트가 실행된다.
*/
client.on("deleteCamera", function(data) {
  oboxName = data.oboxName;
  cameraName = data.cameraName;
  shell.exec("bash /home/ubuntu/demo_visualization/shell/stop.sh " + oboxName + " " + cameraName);
});

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'cclab1217',
  database : 'KOREN'
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join('/home/ubuntu')));
app.use('/img',express.static('public/img'));
//app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true
}));

app.get('/',function(req,res){
  res.render('index');
})

io.on('connection',function(socket){
  socket.on("init",function(){
    socket.on('data',function(data){
      var date = data[0];
      var obox = data[1];
      var cctv_num = parseInt(data[2]);
      var cctv = "vid" + cctv_num;
      var sql ='select * from DATA_JNU where OBOX=? and CCTV=? and DATE=?';
      conn.query(sql, [obox, cctv, date],function(err, vid){
       if(err){
         console.log(err);
       }else{
          socket.emit('showList',vid);
       }
     })
   })

    socket.on('ai',function(data){
      var obox = data[0];
      var cctv_num = parseInt(data[2]);
      var cctv = "vid" + cctv_num;
      var sql = 'select * from DATA_SKKU where OBOX=? and CCTV=?';
      conn.query(sql, [obox,cctv], function(err, vid){
	if(err){ console.log(err);}
	else{
	  console.log(vid);
	  socket.emit('aiList',vid);
	}
      })
    })
  })
})

server.listen(5000, function() {
  console.log("Express server has started on port 5000")
});
