var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId   (sacamos factor común con la carga de id's - DRY)
exports.load = function(req, res, next, quizId) {
   models.Quiz.findById(quizId).then(
      function(quiz) {
         if (quiz) {
            req.quiz = quiz;
            next();
         } else {
            next(new Error('No existe quizId=' + quizId)); }
      }
   ).catch(function(error) { next(error); });
};

// GET /quizes/new
exports.new = function(req, res) {
   var quiz = models.Quiz.build(    // crea objeto quiz
      { pregunta: "Pregunta", respuesta: "Respuesta" }
   );

   res.render('quizes/new', { quiz: quiz });
};

// GET /quizes
exports.index = function(req, res) {
   if (typeof(req.query.search) !== "undefined") {                // isDefined(req.query.search)
      search = '%' + req.query.search.replace(/ /g, '%') + '%';   // req.query.search format
      whereClause = { where: ["pregunta like ?", search ] };
   } else {
      whereClause = {};
   }
   models.Quiz.findAll(whereClause).then(
      function(quizes) {
         res.render('quizes/index.ejs', { quizes: quizes });
      }
   ).catch(function(error) { next(error); });
};

// GET /quizes/:id
exports.show = function(req, res) {
   res.render('quizes/show', { quiz: req.quiz });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
   var resultado = 'Incorrecto';
   if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
   }
   res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};

// POST /quizes/create
exports.create = function(req, res) {
   var quiz = models.Quiz.build(req.body.quiz);

   // guarda en la DB los campos pregunta y respuesta de quiz
   quiz.save({ fields: ["pregunta", "respuesta"]}).then(function() {
      res.redirect('/quizes');
   }) // Redirección HTTP (URL relativo) lista de preguntas
};

// GET /author
exports.author = function(req,res) { res.render('author')};
