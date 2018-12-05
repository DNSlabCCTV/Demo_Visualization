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


var tmp = 0;
var sql_first = "select * from DATA_JNU where OBOX=\"JNU\" and CCTV=\"vid1\" and DATE=\"2018-11-28\"";
var sql_second = "select * from DATA_SKKU where OBOX=\"JNU\" and CCTV=\"jnu_camera1\"";

io.on('connection',function(socket){
  socket.on("init",function(){

    conn.query(sql_first, function(err,fir_vid){
      if(err){ console.log(err)}
      else{ socket.emit('showList',fir_vid)}
    })

    conn.query(sql_second, function(err,fir_vid){
      if(err){ console.log(err)}
      else{ socket.emit('aiList',fir_vid)}
    })


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
	console.log(vid);
          socket.emit('showList',vid);
       }
     })
   })

   socket.on('ai',function(data){
     var obox = data[0];
     var cctv_num = parseInt(data[1]);
     var cctv = obox.toLowerCase()+"_camera" + cctv_num;
     console.log(obox + " "+ cctv);
     var sql = 'select * from DATA_SKKU where OBOX=? and CCTV=?';
     conn.query(sql, [obox,cctv], function(err, vid){
	if(err){ console.log(err);}
	else{
	  console.log(vid);
	  socket.emit('aiList',vid);
	}
      })
    })

    setInterval(function(){
      var sql = 'select count(*) as cnt from DATA_SKKU';
      conn.query(sql,function(cnt_err, cnt){
	if(cnt_err) console.log(cnt_err);
	else{
	  if(cnt[0].cnt > tmp){
	    tmp = cnt[0].cnt;
		console.log(tmp);
	    var sql_q = 'select * from DATA_SKKU limit '+(tmp-1)+",1" ;
	    conn.query(sql_q, function(err, data){
	      if(err) console.log(err);
	      else
		console.log(data);
	        socket.emit('check',data);
	    })
	  }
	  else{
	  tmp = cnt[0].cnt;  
	}
	}
      })
    },10000);
  })
})

server.listen(5000, function() {
  console.log("Express server has started on port 5000")
});
