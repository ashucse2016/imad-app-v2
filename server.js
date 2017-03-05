    var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var config={
    user:'ashucse2016',
    database:'ashucse2016',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password: process.env.DB_PASSWORD    
};

var app = express();
app.use(morgan('combined'));

var article={
 'article-one':{
    title:'Article one| Tomcat Gopal',
    heading:'article one',
    date:'sep 5,2016',
    content: `<p>
                if you are beginner and you want to learn programming.you must have some right approach to start learning.
                first step,always try to learn from offical docs which is provided ,when you downloaded IDE,if you have any problem regarding setup and programming.you can search on google.<strong>stackoverflow</strong> is good resource to clear your all kind of doubts.you can also watch videos from youtube.But,i recommend you to follow only one resource.otherwise ,you will get confuse and irritate while learning.golden rule:whatever you learn,try to implement i.e do practical.programming is all about practice practice and practice.so more u do practice,more u learn.
            </p>
            <p>
                c language:it is procedural based language in which whole program is divided in form of function,local variable ,global variable and so on.for making of large program,it is become more complicated and take lot of space .
                therefore,c++ language(superset of c language)is created to remove all this problem by implementing OOPs concept.
            </p>`
},
'article-two':{title:'Article two| Ashutosh Kumar',
    heading:'article Two',
    date:'sep 6,2016',
    content: `<p>
                if you are beginner and you want to learn programming.you must have some right approach to start learning.
                first step,always try to learn from offical docs which is provided ,when you downloaded IDE,if you have any problem regarding setup and programming.you can search on google.<strong>stackoverflow</strong> is good resource to clear your all kind of doubts.you can also watch videos from youtube.But,i recommend you to follow only one resource.otherwise ,you will get confuse and irritate while learning.golden rule:whatever you learn,try to implement i.e do practical.programming is all about practice practice and practice.so more u do practice,more u learn.
            </p>
            <p>
                c language:it is procedural based language in which whole program is divided in form of function,local variable ,global variable and so on.for making of large program,it is become more complicated and take lot of space .
                therefore,c++ language(superset of c language)is created to remove all this problem by implementing OOPs concept.
            </p>`},
'article-three':{title:'Article Three| Ashutosh kumar',
    heading:'article one',
    date:'sep 7,2016',
    content: `<p>
                if you are beginner and you want to learn programming.you must have some right approach to start learning.
                first step,always try to learn from offical docs which is provided ,when you downloaded IDE,if you have any problem regarding setup and programming.you can search on google.<strong>stackoverflow</strong> is good resource to clear your all kind of doubts.you can also watch videos from youtube.But,i recommend you to follow only one resource.otherwise ,you will get confuse and irritate while learning.golden rule:whatever you learn,try to implement i.e do practical.programming is all about practice practice and practice.so more u do practice,more u learn.
            </p>
            <p>
                c language:it is procedural based language in which whole program is divided in form of function,local variable ,global variable and so on.for making of large program,it is become more complicated and take lot of space .
                therefore,c++ language(superset of c language)is created to remove all this problem by implementing OOPs concept.
            </p>`}
};

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
            ${date}
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
        res.send(JSON.stringify(result));
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
app.get('/:articleName',function(req,res){
//    res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
  //articleNmae==article-one
  //res.send(createTemplate(articleOne));
  //articles[articleName]=={} content object for article one 
  var articleName=req.params.articleName;
  res.send(createTemplate(article[articleName]));
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
