var express=require('express');
var bodyParser=require('body-parser');
var path = require('path');
var expressValidator= require('express-validator');
var mongojs = require('mongojs');

var db = mongojs('custom',['user']);

var app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,'public')));

app.use(function(req,res,next){
	res.locals.errors = null;
	next();
});

app.use(expressValidator({
	errorFormatter: function(param,msg,value){
		var namespace = param.split('.')
		, root  =namespace.shift()
		, formParam = root;
		while (namespace.length){
			formParam +='['+ namespace.shift() +']';

		}
		return {
			param:formParam,
			msg: msg,
			value:value
		};
	}
}));



app.get('/',function(req,res){

db.user.find(function (err, docs) {
	// docs is an array of all the documents in mycollection
	res.render('index',{
		users: docs
		
	});
})


});

app.post('/users/add',function(req,res){
	req.checkBody('fname','First_name Field is required').notEmpty();
	req.checkBody('lname','Last_name Field is required').notEmpty();

	var errors=req.validationErrors();

	var docs = db.user.find()
	console.log(docs)
	console.log(db.user.find())
	db.user.find(function (err, docs) {
		users = docs
	});



	if(errors)
	{
		
	res.render('index',{
				
				errors: errors,
				users: docs
		
	});
	}
	else
	{
		var newuser= {
		fname: req.body.fname,
		lname:req.body.lname
			}
			
db.user.insert(newuser,function(err,result){

	if(errors)
	{
		console.log('error');
	}
	
        res.redirect('/');

});
		}
	

});


app.listen(3000,function(){
	console.log(" Hello World ");
	
});
