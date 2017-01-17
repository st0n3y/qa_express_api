'use strict';

var express = require('express');
var router = express.Router();

//GET /questions
//Return all questions
router.get("/", function(req, res) {
	res.json({
		response: "You sent me a GET request"
	});
});

//POST /questions
//Create questions
router.post("/", function(req, res) {
	res.json({
		response: "You sent me a POST request",
		body: req.body
	});
});

//GET /questions/:id
//Return specific questions
router.get("/:id", function(req, res) {
	res.json({
		response: "You sent me a GET request for ID " + req.params.id
	});
});

module.exports = router;