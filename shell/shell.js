var express = require("express");
var http = require("http");
var path = require("path");

var app = express();
var bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended : false }));

app.post("/shell", function(req, res){

	console.log("user login");

	var OBOX = req.param("OBOX");
	var CCTV = req.param("CCTV");
	var url = req.param("url");

	res.writeHead("200", {"Content-Type":"text/html;charset=utf8"});

/*
	res.write("user OBOX : " + OBOX);
	res.write("<br>");

	res.write("user CCTV : " + CCTV);
	res.write("<br>");

	res.write("user url : " + url);
	res.write("<br>");
	res.end();
*/

	const shell = require("shelljs");

	if("stop"==url)
	{
		console.log("STOP "+OBOX+"-"+CCTV);
		shell.exec("bash /home/ubuntu/demo_visualization/shell/stop.sh "+OBOX+" "+CCTV);
	}
	else
	{
		console.log("START "+OBOX+"-"+CCTV);
		shell.exec("bash /home/ubuntu/demo_visualization/shell/crontab.sh "+OBOX+" "+CCTV+" "+url);
	}

});

http.createServer(app).listen(3000, function() {
	console.log("server start post!!!");
});
