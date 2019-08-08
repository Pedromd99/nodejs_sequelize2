var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
var serveStatic = require('serve-static')
var cookieParser = require('cookie-parser');
var localStorage = require('localStorage')
/* GET home page. */

var sequelize = new Sequelize("nodemysql", 'root', '123456', {
  host: "localhost",
  dialect: "mariadb",
  port: 3306,
  database: 'nodemysql'
});

sequelize.authenticate()
  .then(() => {
    console.log('Conectado');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const productos = sequelize.define('productos', {
  id: {
    type: Sequelize.SMALLINT,
    primaryKey: true
  },
  nombre: Sequelize.STRING
})
router.use(cookieParser());

//get all
router.get('/', function (req, res, next) {
  productos.findAll({
      attributes: ['id', 'nombre']
    })
    .then(productos => {
      for (var i = 0; i < productos.length; i++)
        console.log(productos[i].nombre);
      res.render('index', {
        title: 'List of products',
        nome: productos,
      });
    })
    .catch(err => {
      console.log(err);
    })
});

//create
router.post('/new', function (req, res, next) {
  console.log(req);

  const {
    nuevop
  } = req.body;
  productos.create({
      nombre: nuevop

    })
    .then(productos => {
      res.redirect('/');
    });
})

//get 1

router.get("/:id/:nombre", function (req, res, next) {
  const id = req.params.id
  productos.findAll({
      limit: 1,
      where: {
        id: id
      },
    })
    .then(function (productos) {
      res.cookie('nombre', productos[0].nombre)
      res.render('id', {
        title: 'Product',
        nome: req.cookies.nombre,
        url: '/' + req.params.id + '/' + req.params.nombre + '/delete',
        url2: '/' + req.params.id + '/' + req.params.nombre + '/edit'
      })
    });
});


//delete

router.get('/:id/:nombre/delete', function (req, res, next) {
  const id = req.params.id;
  productos.destroy({
      limit: 1,
      where: {
        id: id
      },
    })
    .then((producto) => {
      //return producto.destroy( { force: true } );
    })
    .then(() => {
      res.redirect('/')
    })
});


//editar

router.get('/:id/:nombre/edit', function (req, res, next) {
  const id = req.params.id;
  const editar = req.query.editar;
  productos.update({
      nombre: editar
    }, {
      where: {
        id: id,
      }
    })

    .then((product) => {
      res.redirect('/' + req.params.id + '/' + req.params.nombre);
    })
})


module.exports = router;