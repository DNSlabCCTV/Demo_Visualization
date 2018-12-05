
    var nodes, edges, network;
    var data;
    var popupMenu = undefined;
    var parsedData;
    var parsedData2;
    var parsedData3;
    var parsedData4;
    var rawFile = new XMLHttpRequest();
    var cameraObjJson;
    var temp;
    var DIR = '/img/';

    var jnu_pointx = [300,500,500,350,300];
    var jnu_pointy = [-125,-100,75,125,-125];

    var uci_pointx = [-450,-450,550,450,300];
    var uci_pointy = [-125,-70,0,-90,-125];

    var chula_pointx = [-450,-450,550,450,300];
    var chula_pointy = [50,90,0,-90,-125];

    var insx = [-300,-300,350];
    var insy = [-125,50,0]

    var cnt_tmp = 0;

    var socket = io.connect('http://210.114.90.86:3000',{
	reconnection: true,
	reconnectionAttempts: Infinity
    });
    var socket_local = io.connect('http://210.114.90.87:5000',{
	reconnecton: true,
	reconnectionAttempts: Infinity
    });

    socket_local.emit("init",{
      connect: 'on'
    });

    socket.emit("connect",{
      connect: 'on'
    });

    socket.on('addCamera',function(data){
      setTimeout("location.reload()", 15000)
    })
    socket.on('deleteCamera',function(data){
      setTimeout("location.reload()", 5000)
    })

    function toJSON(obj) {
      return JSON.stringify(obj, null, 4);
    }

    function obj(){
        obj=new Object();
        this.add=function(key,value){
            obj[""+key+""]=value;
        }
        this.obj=obj
    }

    function drawTopology() {

      var SERVER_IP = "http://210.114.90.86:3000";
      var GETDATA_PATH = "/Data";

      nodes = new vis.DataSet(); //vis.js Î°úÎ???Í∞ùÏ≤¥Î•??ùÏÑ±?úÎã§.

      nodes.add([
        {
          id: 'KOREN',
          label: 'KOREN',
          image: DIR+'cloud.PNG',
          size : 50,
          shape: 'image',
          x: 100,
          y: -50
        },
        {
          id: 'APAN&TEIN',
          label: 'APAN&TEIN',
          image: DIR+'APAN&TEIN.png',
          size : 40,
          shape: 'image',
          x: -150,
          y: 50
        },
        {
          id: 'INTERNET2',
          label: 'INTERNET2',
          image: DIR+'Internet2.png',
          size : 40,
          shape: 'image',
          x: -150,
          y: -125
        },
        {
          id: 'CONTROLROOM',
          label: 'CONTROL ROOM',
          image: DIR+'control room.PNG',
          size : 40,
          shape: 'image',
          x: 200,
          y: 125
        },
        {
          id: 'DATALAKE',
          label: 'DATALAKE',
          image: DIR+'datalake.png',
          size : 40,
          shape: 'image',
          x: 0,
          y: 125
        },
      ]);

      //container?∞Ïù¥?∞Ï? Ïπ¥Î©î???∞Ïù¥?∞Î? API ?úÎ≤ÑÎ°úÎ???GET

      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", SERVER_IP + GETDATA_PATH, true);

      rawFile.onreadystatechange = function() {

        if (rawFile.readyState === 4 && rawFile.status == "200") {
          if (rawFile.responseText) {
            parsedData = JSON.parse(rawFile.responseText);

            function draw() {
              document.getElementById('big_vid').src = parsedData.result[0].container[0].camera[0].url
              // Ïπ¥Î©î???ºÏ™Ω ?¥Î¶≠ ???ÅÏÉÅ Ï∂úÎ†•
              var selectedlabel = function(ctx, values, id) {
                  ctx.color = "red";
                  ctx.mod = "bold";
              }

	      var selectednode = function (values, id, selected, hovering){
		document.getElementById('big_vid').src = nodes.get(id).src;
	      }

              var selectededge = function (values, id, selected, hovering){
                values.color = "black";
              }

	      var selected_jnu1 = function (values, id, selected, hovering){
		values.color = "red";
	      }



              // ?òÏù¥ÏßÄ onload ???ºÏ™Ω ?ÅÎã®??miniÏ∞ΩÏùÑ ?¨Íµ¨?±Ìïú??
              var num_cam = 0;
              var length = Object.keys(parsedData.result).length;
              for(var i = 0; i < length; i++){
                var num_con = Object.keys(parsedData.result[i].container).length;
                  for(var j = 0; j < num_con; j++){
                    var num_camera = Object.keys(parsedData.result[i].container[j].camera).length;
                      for(var k = 0; k < num_camera; k++){

                        var $div = $('<div id="'+parsedData.result[i].container[j].camera[k].name+'"></div>');
                        var $img = $('<img height="100%" width="100%" onclick="click_img(this)" src="'+parsedData.result[i].container[j].camera[k].url+'">')
                        $($div).append($img);
                        $('#img_box').append($div);

                        num_cam++;
                      }
                  }
              }
              for(var i = 0; i < 8 - num_cam; i++){
                var $div = $('<div id="blank"><img height="100%" onclick="click_img(this)" width="100%" src="../img/black.png"></div>');
                $('#img_box').append($div);
              }

              cameraObjJson = new obj(); // ?¨Í∏∞???∞Î°ú Ïπ¥Î©î???¥Î¶Ñ???Ä?•Ìï¥???¥Î≥¥??

              var jnu_camera = 1;
              var chula_camera = 1;
              var uci_camera = 1;
              for (var j = 0; j < Object.keys(parsedData.result).length; j++) {
                if (Object.keys(parsedData.result).length != 0) { //Ïπ¥Î©î???¥Î¶Ñ Í∑úÏπô??                  for (var i = 0; i < Object.keys(parsedData.result[j].container).length; i++) {
                    for (var k = 0; k < Object.keys(parsedData.result[j].container[i].camera).length; k++) {
                      if(parsedData.result[j].name == "JNU"){
                        cameraObjJson.add(parsedData.result[j].name + jnu_camera, parsedData.result[j].container[i].camera[k].name);
                        parsedData.result[j].container[i].camera[k].name = parsedData.result[j].name + jnu_camera;
                        jnu_camera++;
                      }
                      else if(parsedData.result[j].name == "CHULA"){
                        cameraObjJson.add(parsedData.result[j].name + chula_camera, parsedData.result[j].container[i].camera[k].name);
                        parsedData.result[j].container[i].camera[k].name = parsedData.result[j].name + chula_camera;
                        chula_camera++;
                      }
                      else{
                        cameraObjJson.add(parsedData.result[j].name + uci_camera, parsedData.result[j].container[i].camera[k].name);
                        parsedData.result[j].container[i].camera[k].name = parsedData.result[j].name + uci_camera;
                        uci_camera++;
                      }
                    }
                  }
                }
              }

              var cnt_ins = 0;
              for (var j = 0; j < Object.keys(parsedData.result).length; j++) {
                if (Object.keys(parsedData.result).length != 0) {
                  nodes.add([{
                    id: parsedData.result[j].name,
                    label: parsedData.result[j].name,
                    x: insx[cnt_ins],
                    y: insy[cnt_ins],
                    size: 40,
                    image: DIR + parsedData.result[j].name + '.png',
                    shape: 'image'
                  }]);
                }
                cnt_ins++;
              }

              var jnu_cam = 1;
              var chula_cam = 1;
              var uci_cam = 1;

              for (var j = 0; j < Object.keys(parsedData.result).length; j++) { //?∏Îìú ?òÎßå??                for (var i = 0; i < Object.keys(parsedData.result[j].container).length; i++) { //Ïπ¥Î©î???òÎßå??                  for (var k = 0; k < Object.keys(parsedData.result[j].container[i].camera).length; k++) {
                    if (parsedData.result[j].container.length != 0) {
                      if(parsedData.result[j].container[i].type == 'kerberos'){
                        if(parsedData.result[j].name == "JNU"){
                          nodes.add([{
                            id: parsedData.result[j].container[i].camera[k].name,
                            label: parsedData.result[j].name + jnu_cam,
                            x: jnu_pointx[jnu_cam-1],
                            y: jnu_pointy[jnu_cam-1],
                            size: 40,
                            image: DIR + 'kerbercam.png',
                            shape: 'image',
                            src: parsedData.result[j].container[i].camera[k].url,
                            chosen: { node: selectednode }
                          }]); // Ïπ¥Î©î??Í∞úÏàòÎßåÌÅº add
                          jnu_cam++;
                        }
                        else if(parsedData.result[j].name == "UCI"){
                          nodes.add([{
                            id: parsedData.result[j].container[i].camera[k].name,
                            label: parsedData.result[j].name + uci_cam,
                            x: uci_pointx[uci_cam-1],
                            y: uci_pointy[uci_cam-1],
                            size: 40,
                            image: DIR + 'kerbercam.png',
                            shape: 'image',
                            src: parsedData.result[j].container[i].camera[k].url,
                            chosen: { node: selectednode }
                          }]); // Ïπ¥Î©î??Í∞úÏàòÎßåÌÅº add
                          uci_cam++;
                        }
                        else{
                          nodes.add([{
                            id: parsedData.result[j].container[i].camera[k].name,
                            label: parsedData.result[j].name + chula_cam,
                            x: chula_pointx[chula_cam-1],
                            y: chula_pointy[chula_cam-1],
                            size: 40,
                            image: DIR + 'kerbercam.png',
                            shape: 'image',
                            src: parsedData.result[j].container[i].camera[k].url,
                            chosen: { node: selectednode }
                          }]); // Ïπ¥Î©î??Í∞úÏàòÎßåÌÅº add
                          chula_cam++;
                        }
                      }
                      else if(parsedData.result[j].container[i].type == 'zoneminder'){
                        if(parsedData.result[j].name == "JNU"){
                          nodes.add([{
                            id: parsedData.result[j].container[i].camera[k].name,
                            label: parsedData.result[j].name + jnu_cam,
                            x: jnu_pointx[jnu_cam-1],
                            y: jnu_pointy[jnu_cam-1],
                            size: 40,
                            image: DIR + 'zonemindercam.png',
                            shape: 'image',
                            src: parsedData.result[j].container[i].camera[k].url,
                            chosen: { node: selectednode }
                          }]); // Ïπ¥Î©î??Í∞úÏàòÎßåÌÅº add
                          jnu_cam++;
                        }
                        else if(parsedData.result[j].name == "UCI"){
                          nodes.add([{
                            id: parsedData.result[j].container[i].camera[k].name,
                            label: parsedData.result[j].name + uci_cam,
                            x: uci_pointx[uci_cam-1],
                            y: uci_pointy[uci_cam-1],
                            size: 40,
                            image: DIR + 'zonemindercam.png',
                            shape: 'image',
                            src: parsedData.result[j].container[i].camera[k].url,
                            chosen: { node: selectednode }
                          }]); // Ïπ¥Î©î??Í∞úÏàòÎßåÌÅº add
                          uci_cam++;
                        }
                        else{
                          nodes.add([{
                            id: parsedData.result[j].container[i].camera[k].name,
                            label: parsedData.result[j].name + chula_cam,
                            x: chula_pointx[chula_cam-1],
                            y: chula_pointy[chula_cam-1],
                            size: 40,
                            image: DIR + 'zonemindercam.png',
                            shape: 'image',
                            src: parsedData.result[j].container[i].camera[k].url,
                            chosen: { node: selectednode }
                          }]); // Ïπ¥Î©î??Í∞úÏàòÎßåÌÅº add
                          chula_cam++;
                        }
                      }
                    }
                  }
                }
              }

              edges = new vis.DataSet();

              var edges_id = new Array("KORENtoJNU","APAN&TEINtoCHULA","KORENtoAPAN&TEIN","KORENtoINTERNET2","INTERNET2toUCI","DATALAKEtoKOREN","CONTROLROOMEtoKOREN","CONTROLROOMtoDATALAKE");

              edges.add([{
                  id: 'KORENtoJNU',
                  to: 'KOREN',
                  from: 'JNU',
                },
                {
                  id: 'APAN&TEINtoCHULA',
                  to: 'APAN&TEIN',
                  from: 'CHULA',
                },
                {
                  id: 'KORENtoAPAN&TEIN',
                  to: 'KOREN',
                  from: 'APAN&TEIN',
                },
                {
                  id: 'KORENtoINTERNET2',
                  to: 'KOREN',
                  from: 'INTERNET2',
                },
                {
                  id: 'INTERNET2toUCI',
                  to: 'INTERNET2',
                  from: 'UCI',
                },
                {
                  id: 'DATALAKEtoKOREN',
                  to: 'DATALAKE',
                  from: 'KOREN',
                },
                {
                  id: 'CONTROLROOMEtoKOREN',
                  to: 'CONTROLROOM',
                  from: 'KOREN',
                },
                {
                  id: 'CONTROLROOMtoDATALAKE',
                  to: 'CONTROLROOM',
                  from: 'DATALAKE',
                }
              ]); //?ºÎã® ?òÌîå???ÑÌï¥ ?®Í≤®??Ï∂îÌõÑ???Ä?ôÍµê Î≥ÑÎ°ú ?∏Îìú ?¥Ïñ¥Ï£ºÎäî Î°úÏßÅ ÎßåÎì§Í∏?

              for (var j = 0; j < Object.keys(parsedData.result).length; j++) { //?∏Îìú ?òÎßå??                for (var i = 0; i < parsedData.result[j].container.length; i++) { //Ïπ¥Î©î???òÎßå??                  for (var k = 0; k < Object.keys(parsedData.result[j].container[i].camera).length; k++) {
                    var name = parsedData.result[j].container[i].camera[0].name;
                      if (name.substring(0,name.length-1) == parsedData.result[j].name){ //Í∞?Ïπ¥Î©î???¥Î¶Ñ?êÏÑú ?∏Îìú ?¥Î¶Ñ??Ï∂îÏ∂ú ??ÎπÑÍµê
                        var id = parsedData.result[j].name + "to" + parsedData.result[j].container[i].camera[k].name;
                        edges.add([{
                          id: id,
                          to: parsedData.result[j].name,
                          from: parsedData.result[j].container[i].camera[k].name,
//				chosen: {edge: selected_jnu1}
                        }]);
                        edges_id.push(id);
                      }
                    }
                  }
                }

              var container = document.getElementById('network');

              var data = {
                nodes: nodes,
                edges: edges
              };

              var options = {
                nodes: {
                  shape: 'dot',
                  chosen:{label:selectedlabel}
                },
                edges: {
                  smooth: true,
                  color: {
                    color: 'black'
                  },
                  width: 2,
                  chosen: { edge: selectededge },
                  arrows: {
                    to:     {enabled: true, scaleFactor:1, type:'arrow'},
                    middle: {enabled: false, scaleFactor:1, type:'arrow'},
                    from:   {enabled: false, scaleFactor:1, type:'arrow'}
                  },
                  arrowStrikethrough: false
                },
                physics: false,
                interaction: {
                  zoomView: false, // do not allow zooming
                  dragView: false  // do not allow dragging
                },
                layout: {randomSeed:0}
              };
              network = new vis.Network(container, data, options);


              network.animateTraffic([
                {edge:edges_id[0], trafficSize:10},
                {edge:edges_id[1], trafficSize:10},
                {edge:edges_id[2], trafficSize:10},
                {edge:edges_id[3], trafficSize:10},
                {edge:edges_id[4], trafficSize:10},
                {edge:edges_id[5], trafficSize:10},
                {edge:edges_id[6], trafficSize:10},
                {edge:edges_id[7], trafficSize:10},
                {edge:edges_id[8], trafficSize:10},
                {edge:edges_id[9], trafficSize:10},
                {edge:edges_id[10], trafficSize:10},
                {edge:edges_id[11], trafficSize:10},
                {edge:edges_id[12], trafficSize:10},
                {edge:edges_id[13], trafficSize:10},
//                {edge:edges_id[14], trafficSize:10},
//                {edge:edges_id[15], trafficSize:10},
              ])
              setInterval(function(){network.animateTraffic([
                {edge:edges_id[0], trafficSize:10},
                {edge:edges_id[1], trafficSize:10},
                {edge:edges_id[2], trafficSize:10},
                {edge:edges_id[3], trafficSize:10},
                {edge:edges_id[4], trafficSize:10},
                {edge:edges_id[5], trafficSize:10},
                {edge:edges_id[6], trafficSize:10},
                {edge:edges_id[7], trafficSize:10},
                {edge:edges_id[8], trafficSize:10},
                {edge:edges_id[9], trafficSize:10},
                {edge:edges_id[10], trafficSize:10},
                {edge:edges_id[11], trafficSize:10},
                {edge:edges_id[12], trafficSize:10},
                {edge:edges_id[13], trafficSize:10},
//                {edge:edges_id[14], trafficSize:10},
//                {edge:edges_id[15], trafficSize:10},
              ])},3000)

              network.on('click', function(properties) { //properties??Object.
                var ids = properties.nodes; //?¥Î¶≠???∏Îìú??id Í∞?                var clickedNodes = nodes.get(ids); //JSON ?ïÌÉú???∞Ïù¥?∞Í? Ï∂îÏ∂ú??
                if (popupMenu !== undefined) {
                  popupMenu.parentNode.removeChild(popupMenu);
                  popupMenu = undefined;
                }
              });

              container.addEventListener('contextmenu', function (e) { //?∞ÌÅ¥Î¶???Ïª®ÌÖç?§Ìä∏ Î©îÎâ¥ Î∞úÏÉù?òÎäî ?¥Î≤§??
            if (popupMenu !== undefined) {
              popupMenu.parentNode.removeChild(popupMenu);
              popupMenu = undefined;
            }

            if (network.getSelection().nodes.length > 0) {
              var offsetLeft = container.offsetLeft;
              var offsetTop = container.offsetTop;

              popupMenu = document.createElement("div");
              popupMenu.setAttribute('style','opacity:0;')
              popupMenu.setAttribute('id',"popup")

              popupButton1 = document.createElement('input');
              popupButton1.setAttribute('type', 'submit');
              popupButton1.setAttribute('value', 'ƒ´∏ﬁ∂Û√ﬂ∞°');
              popupButton1.setAttribute('class', 'btn btn-info btn-lg');
              //                  popupButton1.setAttribute('data-toggle', 'modal');
              popupButton1.setAttribute('data-target', '#myModal');
              popupButton1.setAttribute('onclick', 'sendID()');
              popupButton1.setAttribute('style', 'text-align:center');

              popupButton2 = document.createElement('input');
              popupButton2.setAttribute('type', 'submit');
              popupButton2.setAttribute('value', 'ƒ´∏ﬁ∂Û¡¶∞≈');
              popupButton2.setAttribute('class', 'btn btn-info btn-lg');
              popupButton2.setAttribute('onclick', 'removeNode()');
              popupButton2.setAttribute('style', 'width:150px; text-align:center');

              popupButton3 = document.createElement('input');
              popupButton3.setAttribute('type', 'submit');
              popupButton3.setAttribute('value', '¿˙¿ÂøµªÛ');
              popupButton3.setAttribute('class', 'btn btn-info btn-lg');
              popupButton3.setAttribute('onclick', 'saved_video()');
              popupButton3.setAttribute('style', 'width:150px; text-align:center');

              popupButton4 = document.createElement('input');
              popupButton4.setAttribute('type', 'submit');
              popupButton4.setAttribute('value', 'AI∫–ºÆøµªÛ');
              popupButton4.setAttribute('class', 'btn btn-info btn-lg');
              popupButton4.setAttribute('onclick', 'analysis_video()');
              popupButton4.setAttribute('style', 'width:150px; text-align:center');

              popupButton5 = document.createElement('input');
              popupButton5.setAttribute('type', 'submit');
              popupButton5.setAttribute('value', 'DashBoard');
              popupButton5.setAttribute('class', 'btn btn-info btn-lg');
              popupButton5.setAttribute('onclick', 'analysis_page()');
              popupButton5.setAttribute('style', 'width:150px; text-align:center');

              popupMenu.className = 'popupMenu';

              container.appendChild(popupMenu);

              var name = network.getSelection().nodes[0];
              if (name == "JNU" || name == "UCI" || name == "CHULA") {
                popupMenu.appendChild(popupButton1);
                popupMenu.setAttribute('style','opacity:1')
                popupMenu.style.left = e.pageX;
                popupMenu.style.top = e.pageY;
              }
              else if(name == "KOREN" || name == "INTERNET2" || name == "APAN&TEIN" || name =="DATALAKE" || name == "CONTROLROOM"){}
              else{
                popupMenu.appendChild(popupButton2);
                popupMenu.appendChild(popupButton3);
                popupMenu.appendChild(popupButton4);
                popupMenu.appendChild(popupButton5);
                popupMenu.setAttribute('style','opacity:1')
                popupMenu.style.left = e.pageX;
                popupMenu.style.top = e.pageY;
              }
            }
            e.preventDefault()

          }, false);
            }
            draw();
          }
        }
      }
      rawFile.send(null);
    }

    function saved_video(){
      var child = document.getElementById('db_list').children;
      var name = '#'+network.getSelection().nodes[0];
      $(name).css("display","");

      var cam_name = network.getSelection().nodes[0];
      var ob_name = cam_name.substring(0,cam_name.length-1);
      var cam_num = cam_name.substring(cam_name.length-1,cam_name.length);
      var obx_name = document.getElementById('obox_name');
      obx_name.value = ob_name;
      var cam_number = document.getElementById('camera_num');
      cam_number.value = cam_num;
      var popupmenu = document.getElementById("popup")
      popupmenu.style.display ="none";
    }

    function analysis_page(){
      var cameraName = network.getSelection().nodes[0];
      var url = "http://210.114.90.86:3000/openCCTVWeb/"+cameraName.substring(0,cameraName.length-1)+"/"+cameraObjJson.obj[cameraName];
      var popupmenu = document.getElementById("popup")
      popupmenu.style.display ="none";
      window.open(url);
    }

    function analysis_video(){
      var child = document.getElementById('db_list').children;
      for(var i = 0; i < child.length; i++){
        child[i].style.display = "none";
      }
      var name = '#'+network.getSelection().nodes[0];
      $(name).css("display","");
      var popupmenu = document.getElementById("popup")
      popupmenu.style.display ="none";
    }

    function removeNode() { //Ïπ¥Î©î???úÍ±∞ Î≤ÑÌäº???ÑÎ•¥Î©??∏Îìú ??†ú?òÍ≤å?? ?ÑÎ°ú?†Ì??ÖÏúºÎ°??úÏûë??
      var cameraName = network.getSelection().nodes[0];
      var popupmenu = document.getElementById("popup")
      popupmenu.style.display ="none";
      loadingwindow();
      nodePath2 = "http://210.114.90.86:3000/deleteCamera/"+ cameraName.substring(0,cameraName.length-1) + "/" + cameraObjJson.obj[cameraName];  //?§Ìä∏Îß?Í∞íÏùÑ ?§Î°ú ?¨Ïö©?òÎ†§Î©??¥Î†áÍ≤?
      xhr = new XMLHttpRequest();
      xhr.overrideMimeType("application/json");
      xhr.open("DELETE", nodePath2, true);
      xhr.onreadystatechange = function() { //Ïπ¥Î©î???¥Î¶Ñ Î∞õÏïÑ?§Îäî Í≤?
        if (xhr.readyState === 4 && xhr.status == "200") {
          if (rawFile.response) {
            console.log("delete º∫∞¯")
          }
        }
      }
      xhr.send(null);
    }

    function addEdge() {
      try {
        edges.add({
          id: document.getElementById('edge-id').value,
          from: document.getElementById('edge-from').value,
          to: document.getElementById('edge-to').value
        });
      } catch (err) {
        alert(err);
      }
    }

    function destroy() { // Í∑∏Î¶º ?ÜÏï†??Í≤ÉÏù∏?? ?¨Ïö©???ºÏù¥ ?àÏúºÎ©??¨Ïö©??Í≤?
      if (network !== null) {
        network.destroy();
        network = null;
      }
    }

    function sendID() {
      var ids = network.getSelection().nodes[0]; //?∞ÌÅ¥Î¶????¥Îãπ ?∏Îìú??Ïπ¥Î©î?ºÏ∂îÍ∞Ä?? ?¥Îãπ idÍ∞íÏù¥ ?ÑÎã¨??
      var idVal = document.getElementById("selected-node-id");
      idVal.innerHTML = "node id : " + ids;
      var modal_id = document.getElementById("myModal");
      modal_id.style.display = "block";
      var popupmenu = document.getElementById("popup")
      popupmenu.style.display ="none";
    }

    function saveChange() { //?òÏ†ï?¥Ïïº ???§Î•ò : ?îÏ≤≠??2Î≤?Î≥¥ÎÉÑ. (?ïÏù∏?¥Î¥ê????)
      var modal_id = document.getElementById("myModal");
      modal_id.style.display = "none";
      loadingwindow();
      var inputContainerName = document.getElementById('cam_name').value;
      var image_ = $(":input:radio[name=image]:checked").val();
      var inputRequest = { //Ï∂îÍ??òÎ†§??Ïπ¥Î©î??JSON Í∞ùÏ≤¥
        "image": image_,
        "cameras": [document.getElementById('cam_name').value],
        "rtsp": [document.getElementById('cam_rtsp').value],
        "obox": network.getSelection().nodes[0]
      };
      var nodePath = "http://210.114.90.86:3000/getCameraByObox/" + network.getSelection().nodes[0];
      xhr = new XMLHttpRequest();
      xhr.overrideMimeType("application/json");
      xhr.open("GET", nodePath, true);
      xhr.onreadystatechange = function() { //Ïπ¥Î©î???¥Î¶Ñ Î∞õÏïÑ?§Îäî Í≤?
        if (xhr.readyState === 4 && xhr.status == "200") {
          if (rawFile.responseText) {

            parsedData3 = JSON.parse(xhr.responseText);
            var count = 0;
            for (var i = 0; i < parsedData3.result.length; i++) {
              if (parsedData3.result[i].name == inputContainerName) { //Ïπ¥Î©î??Ï§ëÎ≥µ ?¨Î? Î°úÏßÅ ?òÏ†ï?¥Ïïº ??
                alert("?¥Î? Ï°¥Ïû¨?©Îãà??")
                break;
              } else {
                var url = "http://210.114.90.86:3000/createContainer"; //?îÏ≤≠ URL
                const headers_ = {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                };
                fetch(url, { //?îÏ≤≠ API
                  method: "POST",
                  body: JSON.stringify(inputRequest), //inputRequest??Ïπ¥Î©î??Ï∂îÍ? JSONÍ∞ùÏ≤¥
                  headers: headers_
                }).then(
                  response => response.text()
                ).then(
                  html => console.log(html)
                );
                break;
              }
            }
          }
        }
      }
      xhr.send(null);
    }
    var del_img = function(){
        var con_name = document.getElementById('del_container_name').value;
        $('#'+con_name+'').remove();
        delmodal.style.display = "none";
    }
    function click_img(img){
        document.getElementById('big_vid').src = img.src;
    }

    var select_vid = function(img) {
      document.getElementById('a_vid').src = img.id;
      console.log(img.id);
    }

    function close_modal(){
      var modal_id = document.getElementById("myModal");
      var cam_name_id = document.getElementById("cam_name");
      var rtsp_id = document.getElementById("cam_rtsp");
      cam_name_id.value = "";
      rtsp_id.value = "";
      modal_id.style.display = "none";
    }

    function select_date(btn){
      var name = btn.id.split('-')[0];
      var parent_name = '#'+name;
      var child = $(parent_name).children();
      for(var i = 0; i < child.length; i++){
        child[i].style.display = "none";
      }

      document.getElementById('camera_date').style.display = "";
      document.getElementById('camera-btn').style.display = "";

      var camera_date = document.getElementById('camera_date');
      var obx_name = document.getElementById('obox_name');
      var camera_num = document.getElementById('camera_num');

      var data = new Array(camera_date.value, obx_name.value, camera_num.value);
      socket_local.emit('data',data);
    }

    function loadingwindow(){
/*
      var width = $(window).width();
      var height = $(window).height();

      $(".backLayer").width(width);
      $(".backLayer").height(height);

      $(".backLayer").fadeTo(15000, 0.3);
*/
      var progbar = $(".progress");
      progbar.css("display","");
    }

    function deletelist(){
      var cell = document.getElementById("vid_list");
      while ( cell.hasChildNodes() ){
         cell.removeChild( cell.firstChild );
      }
    }

    socket_local.on("showList",function(data){

      var divname = "#"+data[0].OBOX+"_"+data[0].CCTV;

      var $div=$('<div id="'+data[0].OBOX+"_"+data[0].CCTV+'"></div>"')
      $('#store_vid').append($div);

      $(divname).empty();
      var $ul = $('<ul id="'+data[0].OBOX+'"style="wdith:100%; height:90%; list-style:none; padding-left:0px; overflow:auto;"></ul>')
      $(divname).append($ul);
      for(var i=0 ; i< data.length ; i++){  //?åÏùºÎ™?        var vid_name = data[i].PATH.split("/");
	    var path_name = "";
	    for(var j = 3; j < vid_name.length; j++){
	      path_name += "/" + vid_name[j]
    	}
        var $li = $('<li id="'+path_name+'" onclick="select_vid(this)"" style="font-size:30px; text-align:center; border: 1px solid black;">'+vid_name[vid_name.length - 1]+'</li>') //?åÏùºÎ™? ?§ÌÜ†Î¶¨Ï?
        $($ul).append($li);
      }
    })

    function openTab(evt, tabName) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        $(document).ready(function(){
          $("#camera_date").datepicker({
            dateFormat:'yy-mm-dd'
            ,showOn: 'button'
            ,buttonImage:'/img/cal_btn.png'
            ,buttonImageOnly: true
          });
          
          $("#camera_date").datepicker("setDate",new Date());
        });

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tabName).style.display = "block";
//        document.getElementById('camera_date').valueAsDate = new Date();
        evt.currentTarget.className += " active";

    }
