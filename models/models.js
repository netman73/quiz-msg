var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definición de la tabla Quiz
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz; // exportar definición de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
   // then(..) ejecuta el manejador una vez creada la tabla
   Quiz.count().then(function (count) {
      if (count == 0) { // la tabla se inicializa sólo si está vacía
         Quiz.bulkCreate( 
           [ { pregunta: 'Capital de Italia',   respuesta: 'Roma',   tema: 'humanidades' },
             { pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema: 'humanidades' },
             { pregunta: 'Fórmula del agua', respuesta: 'H2O', tema: 'ciencia' },
             { pregunta: 'Inventor de la Apertura Española', respuesta: 'Ruy López', tema: 'ocio' },
             { pregunta: 'Frase que empieza como acaba', respuesta: 'palíndromo', tema: 'otro' },
             { pregunta: 'Diseñador del primer ordenador', respuesta: 'Charles Babbage', tema: 'tecnologia' },
           ]
         ).then(function(){console.log('Base de datos inicializada')});
      };
   });
});
