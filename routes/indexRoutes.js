var express 			= require("express"),
	router 				= express.Router(),
	User 				= require("../models/user"),
	passport			= require("passport");

// Home Route
router.get("/", function(req, res){
	res.render("home");
});

//=========================AUTH ROUTE ===========================

router.get("/kaydol", function(req, res){
	res.render("kaydol");
});

router.post("/kaydol", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			console.log(err);
			return res.render("kaydol",{"error": err.message});
		} 
		passport.authenticate("local")(req, res, function(){
			req.flash("success","Bizim Restaurant'a Hosgeldin " + user.username);
			res.redirect("yemekler");
		});
	});
});

router.get("/girisyap", function(req, res){
	res.render("giris");
});

router.post("/girisyap", passport.authenticate("local",
	{
		successRedirect:"/yemekler",
		failureRedirect:"/girisyap"
	}), function(req, res){
});

router.get("/cikisyap", function(req, res){
	req.logout();
	req.flash("success","Basarili bir sekilde cikis yaptiniz.");
	res.redirect("/yemekler");
});

function isLoggedIn(req, res ,next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect("/girisyap")
}

module.exports = router;