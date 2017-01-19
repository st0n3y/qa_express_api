'use strict';

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/sandpit");

var db = mongoose.connection;

db.on("error", function(err) {
	console.error("Connection error:", err);
});

db.once("open", function() {
	console.log("db connection successful");
	//All db communication goes here

	var Schema = mongoose.Schema;
	var AnimalSchema = new Schema({
		type: {type: String, default: "goldfish"},
		size: String,
		colour: {type: String, default: "golden"},
		mass: {type: Number, default: "0.007"},
		name: {type: String, default: "Wanda"}
	});

	AnimalSchema.pre("save", function(next) {
		if(this.mass >= 100) {
			this.size = "muckle";
		} else if(this.mass >= 5 && this.mass < 100) {
			this.size = "medium";
		} else {
			this.size = "tottie";
		}
		next();
	});

	AnimalSchema.statics.findSize = function(size, callback) {
		//this == Animal
		return this.find({size: size}, callback);
	};

	AnimalSchema.methods.findSameColour = function(callback) {
		//this == document
		return this.model("Animal").find({colour: this.colour}, callback);
	};

	var Animal = mongoose.model("Animal", AnimalSchema);

	var elephant = new Animal({
		type: "elephant",
		colour: "grey",
		mass: 4000,
		name: "Murdo"
	});

	var animal = new Animal({}); //goldfish

	var whale = new Animal({
		type: "whale",
		mass: 190500,
		name: "Jeff"
	});

	var animalData = [
		{
			type: "mouse",
			colour: "grey",
			mass: 0.035,
			name: "Jerry"
		},
		{
			type: "pangolin",
			colour: "olive",
			mass: 4.5,
			name: "Greer"
		},
		{
			type: "wolf",
			colour: "white",
			mass: 0.035,
			name: "Whitefang"
		},
		elephant,
		animal,
		whale
	];

	Animal.remove({}, function(err) {
		if(err) console.error(err);
		Animal.create(animalData, function(err, animals) {
			if(err) console.error("Save failed", err);
			Animal.findOne({type: "elephant"}, function(err, animals) {
				elephant.findSameColour(function(err, animals) {
					if(err) console.error(err);	
					animals.forEach(function(animal) {
						console.log(animal.name + " the " + animal.colour + 
							" " + animal.type + " is a " + animal.size + " animal.");
					});
					db.close(function() {
						console.log("db connection closed")
					});
				});
			});
		});
	});
});