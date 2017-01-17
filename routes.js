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
//Create a question
router.post("/", function(req, res) {
	res.json({
		response: "You sent me a POST request",
		body: req.body
	});
});

//GET /questions/:id
//Return specific questions
router.get("/qId", function(req, res) {
	res.json({
		response: "You sent me a GET request for ID " + req.params.qId
	});
});

//POST /questions/:id/answers
//Create an answer
router.post("/:qId/answers", function(req, res) {
	res.json({
		response: "You sent me a POST request to /answers",
		questionId: req.params.qId,
		body: req.body
	});
});

//PUT /questions/:qId/answers/:aId
//Edit specific answer
router.put("/:qId/answers/:aId", function(req, res) {
	res.json({
		response: "You sent me a PUT request to /answers",
		questionId: req.params.qId,
		answerId: req.params.aId,
		body: req.body
	})
});

//DELETE /questions/:qId/answers/:aId
//Delete specific answer
router.delete("/:qId/answers/:aId", function(req, res) {
	res.json({
		response: "You sent me a DELETE request to /answers",
		questionId: req.params.qId,
		answerId: req.params.aId
	})
});

//POST /questions/:qId/answers/:aId/vote-up
//POST /questions/:qId/answers/:aId/vote-down
//Vote on specific answer
router.post("/:qId/answers/:aId/vote-:dir", function(req, res, next) {
		if(req.params.dir.search(/^(up|down)$/) === -1) {
			var err = new Error("Not found");
			err.status = 404;
			next(err);
		} else {
			next();
		}
	}, function(req, res) {
		res.json({
			response: "You sent me a POST request to /vote-" + req.params.dir,
			questionId: req.params.qId,
			answerId: req.params.aId,
			vote: req.params.dir
		})
});

module.exports = router;