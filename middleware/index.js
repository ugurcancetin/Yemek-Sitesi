var Yemek = require("../models/yemek");
var Yorum = require('../models/yorum');

var middlewareObj = {};

middlewareObj.sahiplikKontrolYemek = function(req, res, next){
	if(req.isAuthenticated()){
		Yemek.findById(req.params.id, function(err, bulunanYemek){
			if (err) {
				res.redirect("back");
			} else{
				//bu arkadas yemegin sahibi mi ?
				if (bulunanYemek.yazar.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	}
	 else{
	 	res.redirect("back");
	 }
}

middlewareObj.sahiplikKontrolYorum = function(req, res, next){
	if(req.isAuthenticated()){
		Yorum.findById(req.params.yorum_id, function(err, bulunanYorum){
			if (err) {
				res.redirect("back");
			} else{
				//bu arkadas yemegin sahibi mi ?
				if (bulunanYorum.yazar.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	}
	 else{
	 	res.redirect("back");
	 }
}

middlewareObj.isLoggedIn = function(req, res ,next){
	if(req.isAuthenticated()){
		return next();
	} 
	req.flash("error", "Lutfen Once Giris Yapiniz...");
	res.redirect("/girisyap")
}

module.exports= middlewareObj;