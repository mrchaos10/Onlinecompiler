var express = require('express');
var app = express();
var path = require('path');
const crypto=require('crypto');
const multer=require('multer');
const gridFsStorage=require('multer-gridfs-storage');
const grid=require('gridfs-stream');
const methodOverride=require('method-override');
var port = 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var fs = require('fs');
//var spawn = require('child_process').spawn;
const {c, cpp, node, python, java} = require('compile-run');
var shell = require('shelljs');
var request = require('sync-request');
const threads = require('threads');
const config  = threads.config;
const spawn   = threads.spawn;
//connect to MongoDB
mongoose.connect('mongodb://localhost/mongotest');

var db = mongoose.connection;

//let gfs;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // console.log('we are connected!');
  //Init stream
   //gfs=grid(db.db,mongoose.mongo);
   //gfs.collection('testcases');
});
/*
//storage engine
var storage = new gridFsStorage({
    url: 'mongodb://localhost/filesstorage',
    file: (req, file) =>{
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf => {
          if(err) {
             return reject(err);
          }
          const filname = buf.toString('hex') + path.extname(file.originalname);
          const fileinfo = {
            filename : filename,
            bucketName : 'testcases'
          };
          resolve(fileinfo);
        }));
      });

    }
});
 const upload = multer({ storage });
*/
 //use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


// serve static files from template
app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);
var nameSchema = new mongoose.Schema({
  title: String,
  description: String,

});
var questionSchema = new mongoose.Schema({
  questionid: String,
  description: String,
  testcase: String,
  
});
/*
  testcase : String,
  extendedtestcases : String,
*/
var User = mongoose.model("welcome", nameSchema); 

app.post("/addname", (req, res) => {
  //res.json({ file : req.file });
         
  var myData = new User(req.body);
  myData.save()
      .then(item => {
          res.send("Details saved to the server");
      })
      .catch(err => {
          res.status(400).send("Unable to save to database");
      });
});

app.get("/execution", (req, res) => { 
console.log("------------------------EXECUTION USER REQUEST-----------------");
console.log(req.query);
console.log("------------------------ CONTENT-----------------");

req.query.code=unescape(req.query.code);
console.log(req.query.code);
console.log(req.cookies.username);
console.log(req.cookies.email);
let resultPromise1=[];
//asynchronus requests but that is a gamble :P
/*request('http://localhost:5000/files/'+req.query.testcase, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred and handle it
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log(body);

});*/
//synchronus request
var request = require('sync-request');
var responer = request('GET', 'http://localhost:5000/files/'+req.query.testcase);

var bodyer=responer.getBody('utf8').toString().split("\n");
var kingbodyer=[];
k=0;
for(i in bodyer) {
  kingbodyer[k]=bodyer[i].split(" ");
  //console.log(kingbodyer[k]);
  k=k+1;

}
var bodyermax=[];
var inputbody=[];
var outputbody=[];
var counterr=[];
var newcounter=[];
for(i in kingbodyer)
{
  bodyermax[i]='';
  inputbody[i]='';
  outputbody[i]='';
  counterr[i]=0;
  newcounter[i]=0;
  
}
for(i in kingbodyer)
{
  for(j in kingbodyer[i])
  {
    bodyermax[i]+=kingbodyer[i][j]+"\n";
    //console.log(kingbodyer[i][j]);
  }
  //console.log(bodyermax[i]);
}

for (var i=0;i<bodyermax.length;i++)
{
  for (var g=0;g<bodyermax[i].length;g++)
  {
   if(bodyermax[i][g]=='\n')
   {
     counterr[i]++;
   }
  }
}
for (var i=0;i<bodyermax.length;i++)
{
  for (var g=0;g<bodyermax[i].length&&newcounter[i]<counterr[i]-1;g++)
  {
    //console.log(bodyermax[i][g]);
    inputbody[i]+=bodyermax[i][g];
    if(bodyermax[i][g]=='\n')
    {newcounter[i]++;}
  }
}
for(i in bodyermax)
{
  newcounter[i]=0;
}
for (var i=0;i<bodyermax.length;i++)
{
  for (var g=0;g<bodyermax[i].length;g++)
  {
    //console.log(bodyermax[i][g]);
    if(newcounter[i]==counterr[i]-1&&bodyermax[i][g]!='\n')
    {
    outputbody[i]+=bodyermax[i][g];
    }
    if(bodyermax[i][g]=='\n')
    {newcounter[i]++;}
  }
}

/*
for(i in bodyermax)
{
  console.log(bodyermax[i]);
  
}*/
console.log(inputbody);
console.log(counterr);
console.log(outputbody);
//console.log(bodyermax);
shell.mkdir('-p','/home/mrchaos10/Desktop/OnlineCompiler/OnlineParallelizedCompiler/'+req.cookies.email+'/'+req.cookies.username+'/'+req.query.quesid );
let rester;  

//create a file named mynewfile3.txt:
if(req.query.language=='java')
{
  //fs.promises.mkdir(req.cookies.email+'/'+req.cookies.username+'/'+req.query.quesid, { recursive: true }).catch(console.error);
  fs.writeFile(req.cookies.email+'/'+req.cookies.username+'/'+req.query.quesid+'/'+'ABCD'+'.'+req.query.language, req.query.code, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}
fs.writeFile(req.cookies.email+req.cookies.username+req.query.quesid+'.'+req.query.language, req.query.code, function (err) {
  if (err) throw err;
  console.log('Saved!');
});

if(req.query.language=='c')
{
  for(i in bodyermax)
  {
  resultPromise1.push(c.runFile(req.cookies.email+req.cookies.username+req.query.quesid+'.c', { stdin:inputbody[i]}));
  }
  Promise.all(resultPromise1)
  .then((result) =>
   {
      //res.send("success");
   var exitCode=[];
   var stdout=[];
   var stderr=[];
   var memoryUsage=[];
   var cpuUsage=[];
   var checkerz=[];
   for(i in result)
   {
     exitCode.push(result[i].exitCode);
     memoryUsage.push(result[i].memoryUsage);
     cpuUsage.push(result[i].cpuUsage);
     stdout.push(result[i].stdout);
     stderr.push(result[i].stderr);
   }
   for(i in stdout)
   {
       if(stdout[i]==outputbody[i])
       {
         checkerz[i]=1;
       }
       else
       {
         checkerz[i]=0;
       }
   }
   console.log(stdout);
   console.log(outputbody);
   console.log(checkerz);
   var resute="<html><head><title>"+req.query.question+"</title>";
   resute+="<style>"+"\n#container{background:#800080;} #container .myUL{"+"\npadding:0px;background:#ADD8E6;"+"\n}"+"\n#container .myUL .myList {"+"\nlist-style-type: none;"+"\nborder:1px solid grey;"+"\npadding:5%;"+"\nborder-radius:5px;"+ "\nmargin:4px;"+"\n}"+"\n.click{"+"\nwidth:80px;"+"\nheight:30px;"+"\nborder-radius:5px;"+ "\ncolor:#fff;"+"\nbackground:#323232;"+ "\nfont-size:15px;"+"\n}";
   resute+="\n</style>";
   resute+="\n</head>";
   resute+="<body >"+"<div id=\"container\">";
   resute+="<ul classname=\"myUL\">";
   resute+="<ul class=\"myUL\">";
  
   for(i in stdout)
  {
   resute+="\n<li class=\"myList\"><h2>Testcase"+i+"</h2>";
   resute+="\n <br/> <b>Stdout</b><p>"+stdout[i]+"</p>";
   resute+="\n <br/> <b>Stderr</b><p>"+stderr[i]+"</p>";
   resute+="\n <br/> <b>Cpu Usage</b><p>"+cpuUsage[i]+"</p>";
   resute+="\n <br/> <b>Memory Usage</b><p>"+memoryUsage[i]+"</p>";
   resute+="\n<br/> <b>ExitCode</b><p>"+exitCode[i]+"</p>";
   if(checkerz[i]==1)
   {
   resute+="\n<br/> <b>Expected Output: </b><p>"+outputbody[i]+"</p>";
   resute+="\n<br/> <b>Actual Output : </b><p>"+stdout[i]+"</p>";
   resute+="\n<br/> <b>Answer is : Right </b><p>"+"</p>";
   
   }
   else if(checkerz[i]==0)
   {
    resute+="\n<br/> <b>Expected Output: </b><p>"+outputbody[i]+"</p>";
    resute+="\n<br/> <b>Actual Output : </b><p>"+stdout[i]+"</p>";
    resute+="\n<br/> <b>Answer is : Wrong </b><p>"+"</p>";
      
   }
   resute+="</li>";
  }
  resute+="</ul>"; 
  
  resute+="\n</div>"+"\n</body>\n</html>";

   res.send(resute);
   //console.log("hi");
   
})
  .catch((err) => res.send(err));
}
if(req.query.language=='cpp')
{
 for(i in bodyermax)
 {
resultPromise1.push(cpp.runFile(req.cookies.email+req.cookies.username+req.query.quesid+'.cpp', { stdin:inputbody[i]}));
 }
 Promise.all(resultPromise1)
 .then((result) => {
  //res.send("success");
   var exitCode=[];
   var stdout=[];
   var stderr=[];
   var memoryUsage=[];
   var cpuUsage=[];
   var checkerz=[];
   for(i in result)
   {
     exitCode.push(result[i].exitCode);
     memoryUsage.push(result[i].memoryUsage);
     cpuUsage.push(result[i].cpuUsage);
     stdout.push(result[i].stdout);
     stderr.push(result[i].stderr);
   }
   for(i in stdout)
   {
       if(stdout[i]==outputbody[i])
       {
         checkerz[i]=1;
       }
       else
       {
         checkerz[i]=0;
       }
   }
   console.log(stdout);
   console.log(outputbody);
   console.log(checkerz);
   var resute="<html><head><title>"+req.query.question+"</title>";
   resute+="<style>"+"\n#container{background:#800080;} #container .myUL{"+"\npadding:0px;background:#ADD8E6;"+"\n}"+"\n#container .myUL .myList {"+"\nlist-style-type: none;"+"\nborder:1px solid grey;"+"\npadding:5%;"+"\nborder-radius:5px;"+ "\nmargin:4px;"+"\n}"+"\n.click{"+"\nwidth:80px;"+"\nheight:30px;"+"\nborder-radius:5px;"+ "\ncolor:#fff;"+"\nbackground:#323232;"+ "\nfont-size:15px;"+"\n}";
   resute+="\n</style>";
   resute+="\n</head>";
   resute+="<body >"+"<div id=\"container\">";
   resute+="<ul classname=\"myUL\">";
   resute+="<ul class=\"myUL\">";
  
   for(i in stdout)
  {
   resute+="\n<li class=\"myList\"><h2>Testcase"+i+"</h2>";
   resute+="\n <br/> <b>Stdout</b><p>"+stdout[i]+"</p>";
   resute+="\n <br/> <b>Stderr</b><p>"+stderr[i]+"</p>";
   resute+="\n <br/> <b>Cpu Usage</b><p>"+cpuUsage[i]+"</p>";
   resute+="\n <br/> <b>Memory Usage</b><p>"+memoryUsage[i]+"</p>";
   resute+="\n<br/> <b>ExitCode</b><p>"+exitCode[i]+"</p>";
   if(checkerz[i]==1)
   {
   resute+="\n<br/> <b>Expected Output: </b><p>"+outputbody[i]+"</p>";
   resute+="\n<br/> <b>Actual Output : </b><p>"+stdout[i]+"</p>";
   resute+="\n<br/> <b>Answer is : Right </b><p>"+"</p>";
   
   }
   else if(checkerz[i]==0)
   {
    resute+="\n<br/> <b>Expected Output: </b><p>"+outputbody[i]+"</p>";
    resute+="\n<br/> <b>Actual Output : </b><p>"+stdout[i]+"</p>";
    resute+="\n<br/> <b>Answer is : Wrong </b><p>"+"</p>";
      
   }
   resute+="</li>";
  }
  resute+="</ul>"; 
  
  resute+="\n</div>"+"\n</body>\n</html>";

   res.send(resute);
   //console.log("hi");
   
  })
 .catch((err) => res.send(err));
}
javresponse=[];
executer=0;
if(req.query.language=='java')
{
  for(i in bodyermax)
  {  
  const thread = spawn(function ([a,b,c,d]) {
    const {cpp, node, python, java} = require('compile-run');

      resultPromise = java.runFile(a+'/'+b+'/'+c+'/ABCD.java', { stdin:d});
      return resultPromise
         .then(result => {
           //console.log(result);//result object
           return result;
         })
         .catch(err => {
           //console.log(err);
           return err;
        });
        
      }); 
   
   
  thread
    .send([ req.cookies.email,req.cookies.username,req.query.quesid,inputbody[i] ])
    .on('message', function(response) {
      console.log(response);
      resultPromise1.push(response);
      thread.kill();
      executer++;
      if(executer==5)
      {
      Promise.all(resultPromise1)
          .then((result) => 
          {
              //res.send("success");
   var exitCode=[];
   var stdout=[];
   var stderr=[];
   var memoryUsage=[];
   var cpuUsage=[];
   var checkerz=[];
   for(i in result)
   {
     exitCode.push(result[i].exitCode);
     memoryUsage.push(result[i].memoryUsage);
     cpuUsage.push(result[i].cpuUsage);
     stdout.push(result[i].stdout);
     stderr.push(result[i].stderr);
   }
   for(i in stdout)
   {
       if(stdout[i]==outputbody[i])
       {
         checkerz[i]=1;
       }
       else
       {
         checkerz[i]=0;
       }
   }
   console.log(stdout);
   console.log(outputbody);
   console.log(checkerz);
   var resute="<html><head><title>"+req.query.question+"</title>";
   resute+="<style>"+"\n#container{background:#800080;} #container .myUL{"+"\npadding:0px;background:#ADD8E6;"+"\n}"+"\n#container .myUL .myList {"+"\nlist-style-type: none;"+"\nborder:1px solid grey;"+"\npadding:5%;"+"\nborder-radius:5px;"+ "\nmargin:4px;"+"\n}"+"\n.click{"+"\nwidth:80px;"+"\nheight:30px;"+"\nborder-radius:5px;"+ "\ncolor:#fff;"+"\nbackground:#323232;"+ "\nfont-size:15px;"+"\n}";
   resute+="\n</style>";
   resute+="\n</head>";
   resute+="<body >"+"<div id=\"container\">";
   resute+="<ul classname=\"myUL\">";
   resute+="<ul class=\"myUL\">";
  
   for(i in stdout)
  {
   resute+="\n<li class=\"myList\"><h2>Testcase"+i+"</h2>";
   resute+="\n <br/> <b>Stdout</b><p>"+stdout[i]+"</p>";
   resute+="\n <br/> <b>Stderr</b><p>"+stderr[i]+"</p>";
   resute+="\n <br/> <b>Cpu Usage</b><p>"+cpuUsage[i]+"</p>";
   resute+="\n <br/> <b>Memory Usage</b><p>"+memoryUsage[i]+"</p>";
   resute+="\n<br/> <b>ExitCode</b><p>"+exitCode[i]+"</p>";
   if(checkerz[i]==1)
   {
   resute+="\n<br/> <b>Expected Output: </b><p>"+outputbody[i]+"</p>";
   resute+="\n<br/> <b>Actual Output : </b><p>"+stdout[i]+"</p>";
   resute+="\n<br/> <b>Answer is : Right </b><p>"+"</p>";
   
   }
   else if(checkerz[i]==0)
   {
    resute+="\n<br/> <b>Expected Output: </b><p>"+outputbody[i]+"</p>";
    resute+="\n<br/> <b>Actual Output : </b><p>"+stdout[i]+"</p>";
    resute+="\n<br/> <b>Answer is : Wrong </b><p>"+"</p>";
      
   }
   resute+="</li>";
  }
  resute+="</ul>"; 
  
  resute+="\n</div>"+"\n</body>\n</html>";

   res.send(resute);
   //console.log("hi");
   

          })
          .catch((err) => res.send(err));
    }   

    }); 
       
}
} 
if(req.query.language=='py')
{
 for(i in bodyermax)
 {
 resultPromise1.push(python.runFile(req.cookies.email+req.cookies.username+req.query.quesid+'.py', { stdin:inputbody[i]}));
 }
 Promise.all(resultPromise1)
 .then((result) => 
 {
  //res.send("success");
  var exitCode=[];
  var stdout=[];
  var stderr=[];
  var memoryUsage=[];
  var cpuUsage=[];
  var checkerz=[];
  for(i in result)
  {
    exitCode.push(result[i].exitCode);
    memoryUsage.push(result[i].memoryUsage);
    cpuUsage.push(result[i].cpuUsage);
    stdout.push(result[i].stdout);
    stderr.push(result[i].stderr);
  }
  for(i in stdout)
  {
      if(stdout[i]==outputbody[i])
      {
        checkerz[i]=1;
      }
      else
      {
        checkerz[i]=0;
      }
  }
  console.log(stdout);
  console.log(outputbody);
  console.log(checkerz);
  var resute="<html><head><title>"+req.query.question+"</title>";
  resute+="<style>"+"\n#container{background:#800080;} #container .myUL{"+"\npadding:0px;background:#ADD8E6;"+"\n}"+"\n#container .myUL .myList {"+"\nlist-style-type: none;"+"\nborder:1px solid grey;"+"\npadding:5%;"+"\nborder-radius:5px;"+ "\nmargin:4px;"+"\n}"+"\n.click{"+"\nwidth:80px;"+"\nheight:30px;"+"\nborder-radius:5px;"+ "\ncolor:#fff;"+"\nbackground:#323232;"+ "\nfont-size:15px;"+"\n}";
  resute+="\n</style>";
  resute+="\n</head>";
  resute+="<body >"+"<div id=\"container\">";
  resute+="<ul classname=\"myUL\">";
  resute+="<ul class=\"myUL\">";
 
  for(i in stdout)
 {
  resute+="\n<li class=\"myList\"><h2>Testcase"+i+"</h2>";
  resute+="\n <br/> <b>Stdout</b><p>"+stdout[i]+"</p>";
  resute+="\n <br/> <b>Stderr</b><p>"+stderr[i]+"</p>";
  resute+="\n <br/> <b>Cpu Usage</b><p>"+cpuUsage[i]+"</p>";
  resute+="\n <br/> <b>Memory Usage</b><p>"+memoryUsage[i]+"</p>";
  resute+="\n<br/> <b>ExitCode</b><p>"+exitCode[i]+"</p>";
  if(checkerz[i]==1)
  {
  resute+="\n<br/> <b>Expected Output: </b><p>"+outputbody[i]+"</p>";
  resute+="\n<br/> <b>Actual Output : </b><p>"+stdout[i]+"</p>";
  resute+="\n<br/> <b>Answer is : Right </b><p>"+"</p>";
  
  }
  else if(checkerz[i]==0)
  {
   resute+="\n<br/> <b>Expected Output: </b><p>"+outputbody[i]+"</p>";
   resute+="\n<br/> <b>Actual Output : </b><p>"+stdout[i]+"</p>";
   resute+="\n<br/> <b>Answer is : Wrong </b><p>"+"</p>";
     
  }
  resute+="</li>";
 }
 resute+="</ul>"; 
 
 resute+="\n</div>"+"\n</body>\n</html>";

  res.send(resute);
  //console.log("hi");
  
})
 .catch((err) => res.send(err));
}

});


app.get("/programs", (req, res) => { 
  var myData = req.body;
  var keyc=0;
  var keycp=0;
  var keyj=0;
  var keyp=0;
  
   
  var cdata,cpdata,jdata,pydata;
try {
  cdata = fs.readFileSync(req.cookies.email+req.cookies.username+req.query.quesid+'.c','utf8');
  cpdata = fs.readFileSync(req.cookies.email+req.cookies.username+req.query.quesid+'.cpp','utf8');
  jdata = fs.readFileSync(req.cookies.email+req.cookies.username+req.query.quesid+'.java','utf8');
  pydata = fs.readFileSync(req.cookies.email+req.cookies.username+req.query.quesid+'.py','utf8');

} catch (err) {
 }
  
  //console.log(item);
console.log("------------------------PROGRAMS USER REQUEST-----------------");
console.log(req.query.des);
//console.log(req.body.questionid);
//console.log(req.body.description);
//console.log(req.body.testcase);

if(cdata==null)
{
  cdata=' ';
  //console.log('yes c');
}
if(cpdata==null)
{
  cpdata=' ';
  //console.log('yes cpp');
}
if(jdata==null)
{
  jdata=' ';
  //console.log('yes jav');
}
if(pydata==null )
{
  pydata=' ';
  //console.log('yes py');
}
console.log(cdata);
console.log(cpdata);
console.log(jdata);
console.log(pydata);

res.send("<html><head><title>"+req.query.question+"</title>"+
"<script src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js\"></script>"+
"<script src=\"jquery-linedtextarea.js\"></script>"+
"<link href=\"jquery-linedtextarea.css\" type=\"text/css\" rel=\"stylesheet\" />"+
"</head> \n" +

"<body>\n"+
"<section id=\"Questions\">"+
"<h1> Question </h1> <br/> <b>"+req.query.question+"</b><br/>"+
"<input type=\"text\" id=\"questionid\" value=\""+
req.query.quesid+"\" hidden/>"+
"<br/><br/><h1> Question Description </h1> <br/> <b>"+
req.query.des+"</b><br/>"+
"<input type=\"text\" id=\"testcaseid\" value=\""+
req.query.testcase+"\" hidden/>"+
"</section>"+
"<section id=\"answer\">"+
"<form action=\"\"+ method=\"post\"  >"+
"<br/>"+
"<br/>"+
"<h3>Select your language</h3>"+
"<br/>"+
"<br/>"+
"<select name=\"language\" id=\"language\" onchange=\"changeFunc()\">\n"+
"  <option value=\"c\">C</option>\n"+
"  <option value=\"cpp\">C++</option>\n"+
"  <option value=\"java\">Java</option>\n"+
"  <option value=\"py\">Python</option>\n"+
"</select>"+
"<br/>"+
"<br/>"+
"<br/>"+
"<h3>NOTE:Please save and run the file otherwise it wont get compiled</h3>"+
"<br/>"+
"<br/>"+
"<br/>"+
"<textarea class=\"lined\" rows=\"10\" cols=\"60\" id=\"code\">"+
"</textarea>"+
"</form>"+
"<button onclick=\"myFunction()\">Save</button>"+
"<a id=\"myAnchor\" href=\"/execution?question="+req.query.question+"&quesid="+req.query.quesid+"&des="+req.query.des+"&testcase="+req.query.testcase+" "+
"\" style=\"display: block;width: 115px;height: 25px;background: #4E9CAF;padding: 10px;text-align: center;"+
"border-radius: 5px;color: white;font-weight: bold;\">"+"Run</a>"+
"<input type=\"text\" id=\"secret\" /hidden>"+
"</section>"+
"<script>"+
"$(function() { \n"+
"	$(\".lined\").linedtextarea( \n"+
"		{selectedLine: 1}\n"+
"	);\n"+
"});"+
"function changeFunc() {\n"+
"  var x = document.getElementById(\"language\").value;\n"+
"  //alert(x);\n"+
"if(x==='c'){var know=\""+escape(cdata)+"\";document.getElementById(\"code\").value=unescape(know);}"+
"if(x==='cpp'){var know=\""+escape(cpdata)+"\";document.getElementById(\"code\").value=unescape(know);}"+
"if(x==='java'){var know=\""+escape(jdata)+"\";document.getElementById(\"code\").value=unescape(know);}"+
"if(x==='py'){var know=\""+escape(pydata)+"\";document.getElementById(\"code\").value=unescape(know);}"+
"}\n"+
"function myFunction() {\n"+
"  var x = document.getElementById(\"language\").value;\n"+
"  alert(x);\n"+

"alert(document.getElementById(\"code\").value);\n"+
"document.getElementById(\"myAnchor\").href=\"/execution?question="+req.query.question+"&quesid="+req.query.quesid+"&des="+req.query.des+"&testcase="+req.query.testcase+"\";"+
"document.getElementById(\"myAnchor\").href+=\"&language=\";"+
"document.getElementById(\"myAnchor\").href+=x;"+
"document.getElementById(\"myAnchor\").href+=\"&code=\";"+
"document.getElementById(\"myAnchor\").href+=escape(document.getElementById(\"code\").value).replace(/\\+/g,\"%2B\");\n"+
"String.prototype.replaceAt=function(index, replacement) {"+
"\n  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);"+
"\n}"+
"\n l=document.getElementById(\"myAnchor\").href;\nfor(var y=0;y<l.length;y++)\n{\nconsole.log(l[y]);\nif (l.charAt(y)=='+'){console.log(\"hi\");\ns = l.substr(0, y) + '%2B' + l.substr(y+1);y+=2;}}\n document.getElementById(\"code\").href=l;"+

"\n alert(document.getElementById(\"myAnchor\").href)"+

"}\n"+
"</script>"+

"</body>"+
"</html>");

});



app.get("/list", (req, res) => { 
  User.find({})
     .then(item => {

console.log(item);
        
res.send(item);
     })

     .catch(err => {
         res.status(400).send("Unable to save to database");
     });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
