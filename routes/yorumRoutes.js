var express 			= require("express"),
	router 				= express.Router({mergeParams: true}),
	Yorum 				= require('../models/yorum'),
	Yemek 				= require('../models/yemek'),
	middlewareObj		= require("../middleware/index");



// ======================== YORUM ROUTE ========================

router.get("/yemekler/:id/yorumlar/yeni", middlewareObj.isLoggedIn ,function(req, res){
	Yemek.findById(req.params.id, function(err, bulunanYemek){
		if (err) {
			console.log(err);
		} else{
			res.render("yorumlar/yeni", {yemek : bulunanYemek});
		}
	});
});

router.post("/yemekler/:id/yorumlar", middlewareObj.isLoggedIn, function(req, res){
		Yemek.findById(req.params.id, function(err, bulunanYemek){
		if (err) {
			console.log(err);
			res.redirect("/yemekler");
		} else{
			Yorum.create(req.body.yorum, function(err, yorum){
				if (err) {
					console.log(err);
				} 
				//kullanici adini yakala
				yorum.yazar.id = req.user._id;
				yorum.yazar.username = req.user.username;

				//yorum kaydet
				yorum.save();

				bulunanYemek.yorumlar.push(yorum);
				bulunanYemek.save();
				res.redirect('/yemekler/' + bulunanYemek._id);
			});
		}
	});
});

//Yorum Edit Formunu Dondur
router.get("/yemekler/:id/yorumlar/:yorum_id/edit",middlewareObj.sahiplikKontrolYorum, function(req, res){
	Yorum.findById(req.params.yorum_id, function(err, bulunanYorum){
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.render("yorumlar/edit", { yemek_id : req.params.id, yorum: bulunanYorum});
		}
	});
});

//Yorum Edit Istegini Gerceklestir
router.put("/yemekler/:id/yorumlar/:yorum_id", middlewareObj.sahiplikKontrolYorum, function(req, res){
	Yorum.findByIdAndUpdate(req.params.yorum_id, req.body.yorum, function(err, guncellenmisYorum){
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/yemekler/"+req.params.id);
		}
	});
});

//Yorum Silme
router.delete("/yemekler/:id/yorumlar/:yorum_id", middlewareObj.sahiplikKontrolYorum, function(req, res){
	Yorum.findByIdAndRemove(req.params.yorum_id, function(err){
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/yemekler/"+req.params.id);
		}
	});
});

module.exports = router;
