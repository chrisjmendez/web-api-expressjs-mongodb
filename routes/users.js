var express = require('express');
var router = express.Router();

var async       = require("async");
var mongojs     = require("mongojs");
var collections = ["users"]
var db          = mongojs("myDatabase", collections);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create', function(req, res, next) {
	res.json({ message: "Please submit a POST request." })
});

/*
	Create New user
*/
router.post('/create', function(req, res, next) {	
	var user = req.body;
	async.waterfall([
	    function(callback) {
			db.users.insert( user, function(err, docs){
				if(err){
					//throw err
					callback(err)
				} else {
					callback(null, docs);
				}
			});
	    },
	    function(docs, callback) {
			var data = docs;
			res.json(data);
			callback(null);
	    }
	], function(err) {
		if(err){
			res.json({error: 500, message: err})
		} else {
			console.log("Insert Complete");
		}
	});	
});

/*
	Find user
*/
router.get('/:id?', function(req, res, next) {
	var id = req.params.id;
	async.waterfall([
		function(callback) {
			if( id ){
				var query = { _id: mongojs.ObjectId( id ) }
				callback(null, user_id)
			} else {
				callback("No ID Found")
			}
		},
		function(user_id, callback) {
			db.users.findOne( query, function(err, doc) {
				if(err){
					//throw err
					callback(err)
				} else {
					callback(null, doc);
				}
			});
		},
		function(doc, callback) {
			var data = doc
			callback(null, data);
		}
	], function (err, result) {
		if(err){
			res.json(err)
		}
		else{
			res.json(result)
		}
	});	
});


/*
	Find user by name
*/
router.post('/find/name', function(req, res, next) {	
	var fname = (req.body.first_name) ? req.body.first_name : "";
	var lname = (req.body.last_name)  ? req.body.last_name : "";
	var name  = { first_name: fname, last_name: lname }

	async.waterfall([
		function(callback){
			var query = "";
			if(fname != "" && lname != ""){
				query = { 
					"cachedUserProfile.first_name": fname,
					"cachedUserProfile.last_name": lname
			 	}
				callback(null, query)
			}
			else if(fname != "" || lname != "") {
				query = { $or: [
					{ "cachedUserProfile.first_name": fname },
					{ "cachedUserProfile.last_name": lname }	
				]};
				callback(null, query);
			}
			else {
				callback("Please provide a first_name or a last_name.")
			}
		},
		function(query, callback) {
			db.users.find( query, function (err, docs){
				console.log(docs);
				if(err){
					//throw err
					callback(err)
				} else {
					callback(null, docs);
				}
			})
		},
		function(docs, callback) {
			var data = docs
			callback(null, data);
		}
	], function (err, result) {
		if(err){
			res.json(err)
		}
		else{
			res.json(result)
		}
	});	
});

/*
	Update user
*/

router.put('/update/:id?', function(req, res, next) {
	var id = req.params.id;
	var display_name = req.body.display_name;
	var description = req.body.description;
	
	async.waterfall([
	    function(callback) {
			if(id){
				var query = { _id: mongojs.ObjectId( id ) }
				callback(null, query);			
			} else {
				callback("User ID Missing")
			}
		},
	    function(query, callback) {
			var update = { $set: {
				displayName: display_name,
				description: description
			}};
			console.log(query, update);
			//New true means If it doesn't find this product, add it
			db.users.findAndModify({
				query: query,
				update: update,
				new: true 
			}, 
			function(err, doc, lastErrorObject){
				if(err){
					callback(err)
				} else {
					callback(null, doc);
				}
			});
	    },
	    function(docs, callback) {
			callback(null);
	    }
	], function(err, results) {
		if(err){
			res.json({ error: 500, message: err })
		} else {
			res.json({ message: "User Info updated.", results: results })
		}
	});
});

/*
	Delete User
*/
router.delete('/delete/:id?', function(req, res, next) {
	var id = req.params.id;
	
	async.waterfall([
	    function(callback) {
			if(id){
				var query = { _id: mongojs.ObjectId( id ) }
				callback(null, query);			
			} else {
				callback("User ID Missing")
			}
		},
	    function(query, callback) {
			db.users.remove({
				query
			}, 
			function(err, doc){
				if(err){
					callback(err)
				} else {
					callback(null, doc);
				}
			});
	    },
	    function(docs, callback) {
			callback(null);
	    }
	], function(err, results) {
		if(err){
			res.json({ error: 500, message: err })
		} else {
			res.json({ message: "User has been deleted." })
		}
	});
});

module.exports = router;
