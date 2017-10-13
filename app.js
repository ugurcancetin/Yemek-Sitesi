var express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	passport			= require("passport"),
	flash				= require("connect-flash"),
	methodOverride 		= require("method-override"),
	LocalStrategy 		= require("passport-local"),
	User 				= require("./models/user"),
	Yemek 				= require("./models/yemek"),
	Yorum 				= require('./models/yorum'),
	cerezData			= require("./cerez");

//Routes Requiring
var yemeklerRoutes = require("./routes/yemeklerRoutes"),
	indexRoutes	   = require("./routes/indexRoutes"),
	yorumRoutes	   = require("./routes/yorumRoutes");

mongoose.connect("mongodb://localhost/yemekSitesi",{useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
	
/*cerezData();*/


// Passport Config
app.use(require("express-session")({
	secret:"bu bizim guvenlik cumlemizdir.",
	resave:false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//currentUser bilgisini butun routeler ile paylas
app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

//Routes
app.use(indexRoutes);
app.use(yorumRoutes);
app.use(yemeklerRoutes);

//===============================================================
var server = app.listen(3000, function(){
	console.log("Sunucu Portu : %d", server.address().port);
});