var express 			= require("express"),
	router 				= express.Router(),
	Yemek 				= require("../models/yemek")
	middlewareObj		= require("../middleware/index");


router.get("/yemekler", function(req, res){

	//yemekleri database'den al
	Yemek.find({}, function(err, yemeklerDB){
		if(err){
			console.log(err);
		} else{
			console.log("*******************YEMEKLER********************");
			console.log(yemeklerDB);
			res.render("yemekler/yemekler", {yemekler:yemeklerDB});
		}
	});
	/*res.render("yemekler", {yemekler:yemekler})*/
});

router.post("/yemekler",middlewareObj.isLoggedIn, function(req, res){
	/*res.send("test");*/
	var adi = req.body.adi;
	var resim = req.body.resim;
	var aciklama = req.body.aciklama;

	var yazar = {
		id: req.user._id,
		username: req.user.username
	}

	var yeniYemek = {adi:adi, resim:resim, aciklama:aciklama, yazar: yazar};
	/*yemekler.push(yeniYemek);*/

	//yeni yemek olustur ve db'ye kaydet
	Yemek.create(yeniYemek, function(err , yeniOlusturulmusYemek){
		if(err){
			console.log(err);
		} else{
			res.redirect("/yemekler");
		}
	});
	
});

router.get("/yemekler/yeni", middlewareObj.isLoggedIn, function(req, res){
	res.render("yemekler/yeni");
});

router.get("/yemekler/:id", function(req, res){
	Yemek.findById(req.params.id).populate("yorumlar").exec(function(err, bulunanYemek){
		if(err){
			console.log(err);
		} else{
			res.render("yemekler/goster",{yemek : bulunanYemek});
		}
	});
	
});

//Guncelleme Route - Formu dondurur
router.get("/yemekler/:id/edit", middlewareObj.sahiplikKontrolYemek, function(req, res){
	Yemek.findById(req.params.id, function(err, bulunanYemek){
		res.render("yemekler/guncelle", {yemek: bulunanYemek});
	})
	
});

//Guncelleme Route - Put istegi ile gunceller
router.put("/yemekler/:id", middlewareObj.sahiplikKontrolYemek, function(req, res){
	Yemek.findByIdAndUpdate(req.params.id, req.body.yemek, function(err, guncellemisYemek){
		if (err) {
			console.log(err);
			res.redirect("/yemekler");
		} else{
			res.redirect("/yemekler/" + req.params.id);
		}
	});
});


//Destroy - Silme- Yoketme Route
router.delete("/yemekler/:id", middlewareObj.sahiplikKontrolYemek, function(req, res){
	Yemek.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			console.log(err);
			res.redirect("/yemekler");
		} else{
			res.redirect("/yemekler");
		}
	});
});


module.exports = router;

