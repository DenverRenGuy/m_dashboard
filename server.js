// ToDo
// GET '/' Displays all of the mongooses.  DONE
// GET '/mongooses/:id' Displays information about one mongoose. DONE
// GET '/mongooses/new' Displays a form for making a new mongoose.  DONE
// POST '/mongooses' Should be the action attribute for the form in the above route (GET '/mongooses/new').  DONE
// GET '/mongooses/edit/:id' Should show a form to edit an existing mongoose.  DONE
// POST '/mongooses/:id' Should be the action attribute for the form in the above route (GET '/mongooses/edit/:id').  DONE
// POST '/mongooses/destroy/:id' Should delete the mongoose from the database by ID.




//Modules required

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

//Create the general app
var app = express();

//App settings
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//Database Connections
mongoose.connect('mongodb://localhost/m_dasboardDB');
mongoose.Promise = global.Promise;

//DB Schemas
var duckSchema = new mongoose.Schema({
    name: {type: String},
    duckType: {type: String},
    age: {type: Number}
}, {timestamps: true})

//Initialize Schemas and vars
mongoose.model('Duck', duckSchema);
var Duck = mongoose.model('Duck');

//Routes
//Root Route
app.get('/', function(req, res){
    console.log('Responding with Index View');
    Duck.find({}, function(err, ducks){
        console.log(ducks);
        res.render('index', {ducks:ducks});
    });
})

//Support Routes for duck management

app.get('/ducks/:id', function(req, res){
    console.log('Serving a single object view');
    Duck.find({_id:req.params.id}, function(err, data){
        console.log(data);
        res.render('duck', {duck:data[0]});
    })
})

app.get('/ducks/:id/edit', function(req, res){
    console.log('Serving a single duck edit page');
    Duck.find({_id:req.params.id}, function(err, data){
        console.log(data);
        res.render('duckEdit', {duck:data[0]});
    })
})

app.get('/new', function(req, res){
    console.log('Serving New Duck Form')
    res.render('newDuck');
})

//Add a new duck
app.post('/ducks', function(req, res){
    console.log("POST DATA", req.body);

    //Add User to DB
    var duck = new Duck({name: req.body.name, duckType: req.body.duckType, age: req.body.age});

    duck.save(function(err){
        if(err){
            console.log('Error saving to Database: ' + err);
            res.redirect('/');
        }
        else{
            console.log('Adding User to Database');
            res.redirect('/');
        }
    })
})

//Update a duck
app.post('/ducks/:id/edit', function (req, res){
    console.log("Updating Duck with ID: " + req.params.id);

    Duck.findOne({_id:req.params.id}, function(err, duck){
        console.log("Entered Update Function with id: " + duck.id + ", " + duck.name);
        duck.name = req.body.name;
        duck.duckType = req.body.duckType;
        duck.age = req.body.age;
        duck.save(function(err){
            if(err){
                console.log('Error!' + err);
            }
            else{
                console.log('Duck Type was saved!');
                res.redirect('/');
            }

        })
    })
})

//Duck Destruction

app.post('/ducks/:id/destroy', function(req, res){
    console.log('Preparing Duck ' + req.params.id + ' for destruction');

    Duck.remove({_id:req.params.id}, function(err){
        if(err){
            console.log('Pesky Duck still alive, must be an error somewhere: ' + err);
        }
        else{
            res.redirect('/');
        }
    })
})





//Initiate the server listening
app.listen(8000, function(){
    console.log('Listening on Port 8000');
})
