'use strict';

var express = require('express');
var router = express.Router();
var Question = require('./models').Question;

router.param("qId", function(req, res, next, id) {
	Question.findById(id, function(err, doc) {
		if(err) return next(err);
		if(!doc) {
			err = new Error("Not found");
			err.status = 404;
			return next(err);
		}
		req.question = doc;
		return next();
	});
});

router.param("aId", function(req, res, next, id) {
	req.answer = req.question,answers.id(id);
	if(!req.answer) {
		err = new Error("Not found");
		err.status = 404;
		return next(err);
	}
	next();
});

//GET /questions
//Return all questions
router.get("/", function(req, res, next) {
	// Question.find({}, null, {sort: {createdAt: -1}}, function(err, questions) {
	// 	if(err) return next(err);
	// 	res.json(questions);
	// });
	Question.find({})
				.sort({createdAt: -1})
				.exec(function(err, question) {
					if(err) return next(err);
					res.json(questions);
				});

});

//POST /questions
//Create a question
router.post("/", function(req, res, next) {
	var question = new Question(req.body);
	question.save(function(err, question) {
		if(err) return next(err);
		res.status(201);
		res.json(question);
	});
});

//GET /questions/:id
//Return specific questions
router.get("/:qId", function(req, res, next) {
		res.json(req.question);
});

//POST /questions/:id/answers
//Create an answer
router.post("/:qId/answers", function(req, res, next) {
	req.question.answers.push(req.body);
	req.question.save(function(err, question) {
		if(err) return next(err);
		res.status(201);
		res.json(question);
	});
});

//PUT /questions/:qId/answers/:aId
//Edit specific answer
router.put("/:qId/answers/:aId", function(req, res) {
	req.answer.update(req.body, function(err, result) {
		if(err) return next(err);
		res.json(result);
	});
});

//DELETE /questions/:qId/answers/:aId
//Delete specific answer
router.delete("/:qId/answers/:aId", function(req, res) {
	req.answer.remove(function(err) {
		req.question.save(function(err, question) {
			if(err) return next(err);
			res.json(question);
		});
	});
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
			req.vote = req.params.dir;
			next();
		}
	}, 
	function(req, res, next) {
		req.answer.vote(req.vote, function(err, question) {
			if(err) return next(err);
			res.json(question);
		});
});

module.exports = router;