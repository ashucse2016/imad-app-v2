//counter code
var button=document.getElementById('counter'); 

button.onclick=function()
{//create a request object
var request=new XMLHttpRequest();

//capture the response and store in a variable
request.onreadystatechange=function()
{if(request.readyState === XMLHttpRequest.DONE)
{//take some action
if(request.status===200)
{
    var counter=request.responseText;//take response store in counter variable
    var span=document.getElementById('count');
span.innerHTML=counter.toString();    //take counter variable and put into spam.
}
}
//Not done yet

    
};
//make the request
request.open('GET','http://ashucse2016.imad.hasura-app.io/counter',true);
request.send(null);
    
};