var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');
var config={
    user:'ashucse2016',
    database:'ashucse2016',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD    
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie:{maxAge:1000*60*60*24*30}
}));

function createTemplate (data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
     var content=data.content;
  var htmlTemplate=`
   <html>
    <head>
    <title>
        ${title} 
    </title>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <link href="/ui/style.css" rel="stylesheet" />
        
    </head>
    <body>
        <div class="container">
        <div>
            
        <a href="/">Home</a>
        </div>
        <hr/>
        <h3>
            ${heading}
        </h3>
        <div>
            ${date.toDateString()}
        </div>
        <div>
           ${content} 
        
        </div>
        </div>
        
    </body>

</html>`
;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
function hash(input,salt)
{//how do we create the hash 
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
//algorithm:md5
//'password"->adnj4jekejrlkjkjcewjrkljrktjkjkfjdk45j5jk
    //"password-is-some-random-string"->rjjdkdsjdfkdskfjiufjdhczdjkhjhdsjficjdjchkjckidjcjh 
    //"password" ->"password-this-is-some-random-string"-><hash>-><hash>*10k times
}

app.get('/hash/:input',function(req,res)
{
   var hashedString=hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
   
});
app.post('/create-user',function(req,res)
{
 //username,password
 //{"username": "tanmai","password":"password"}
 
 //JSON request
 var username=req.body.username;
 var password=req.body.password;
 var salt=crypto.randomBytes(128).toString('hex');
 var dbString= hash(password,salt);
    pool.query('INSERT into "user" (username,password) VALUES($1,$2)',[username,dbString],function(err,result)
{if(err){
        res.status(500).send(err.toString());
    }
    else
    {
        
        res.send('user successfully created: '+username);
    }
    
});

});

app.post('/login',function(req,res)
{
     var username=req.body.username;
 var password=req.body.password;
    pool.query('SELECT * FROM "user" WHERE username=$1',[username],function(err,result)
{if(err){
    res.status(500).send(err.toString());
}
    else
{
    if(result,rows.length===0)
    {
        res.send(403).send('username/password is invalid');
    }
    else
    {
        
    //match the password
    var dbString=result.rows[0].password;
    dbString.split('$')[2];
    var hashedPassword=hash(password,salt); //creating a hash based on the password submitted and the original salt
    if(hashedPassword === dbString){

//set the session
req.session.auth={userId: result.row[0].id};
//set cookie with a session id
// internally,on the server side ,it maps the session id to an object
//{auth:{userid}}

res.send('credentials correct!');

}
else
{
    res.send(403).send('username/password is invalid');
}
    }
}
});
});

app.get('/check-login',function(req,res)
{
   if(req.session && req.ssession.oath && req.session.auth.userId)
   {
       res.send('you are logged in:'+req.session.outh.userId.toString());
   }
   else
   {res.send('you are logged in');
       
   }
});

app.get('/logout',function(req,res)
{delete req.session.auth;
res.send('logged out');
    
});

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    //make a select request
    //return a response with the results
    pool.query('SELECT * FROM test',function (err,result)
    {if(err){
        res.status(500).send(err.toString());
    }
    else
    {
        res.send(JSON.stringify(result.rows));
    }
        
    });
});
var counter=0;
app.get('/counter',function(req,res){
    counter++;
    res.send(counter.toString());
});

var names=[];
//app.get('/submit-name/:name',function(req,res)
app.get('/submit-name',function(req,res)//URL: /submit-name?name=xxxxx
{
    //get the name from request object
    //var name=req.params.name;//TODO 
    var name=req.query.name;
    names.push(name);//here name is string,how can we convert array of object into string.
//JSON:javascript object notation-way of converting javascript object into string
    res.send(JSON.stringify(names));
    
});
app.get('/articles/:articleName',function(req,res){
//    res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
  //articleNmae==article-one
  //res.send(createTemplate(articleOne));
  //articles[articleName]=={} content object for article one 
  //SELECT * FROM article WHERE
 // var articleName=req.params.articleName;
// SELECT * FROM article WHERE title='article-one';DELETE WHERE a='asdf'
 pool.query("SELECT * from article WHERE title=$1",[req.params.articleName],function(err,result){
     
    if(err)
    {res.status(500).send(err.toString());
        
    }
    else
 {if(result.rows.length===0)
 {res.status(404).send('Article not found');
 }
 else
 {var articledata=result.rows[0];
res.send(createTemplate(articleData));
 }
     
 }
 });
  
});
/*
app.get('/article-two',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
    
});

app.get('/article-three',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
    
});
*/

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
