let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongodb = require('mongodb');

let app = express()

app.use(morgan('common'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'views', __dirname);
app.use(express.static('images'));
app.use(express.static('htmlfiles'));
app.use(express.static('css'));

app.use(bodyParser.urlencoded({
    extended: false
}));

let MongoClient = mongodb.MongoClient;
let url = 'mongodb://localhost:27017/';
let viewsPath = __dirname + "/views/";
let taskdb = null;
let col;


MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            taskdb = client.db("fit2095db");
            col = taskdb.collection('todoapp');
        }
    });


console.log(col);

app.get('/', function (req, res) {
    res.render('index.html', {});

});

app.get('/index.html', function (req, res) {
    res.render('index.html', {});
});

app.get('/newtask.html', function (req, res) {
    res.render('newtask.html', {});

});

app.get('/listtasks.html', function (req, res) {
    col.find({}).toArray(function (err, result) {
        res.render('listtasks', {
            db: result
        })
    });
});

app.get('/taskdelete.html', function (req, res) {
    res.render('taskdelete.html', {});

});

app.get('/completetaskdel.html', function (req, res) {
    res.render('completetaskdel.html', {});

});

app.get('/taskupdate.html', function (req, res) {
    res.render('taskupdate.html', {});

});

app.post('/data', function (req, res) {
    console.log('I got a post request');
    let taskDetails = req.body;
    console.log(taskDetails);
    col.insertOne({
        task: taskDetails.taskName,
        name: taskDetails.nameAssigned,
        date: taskDetails.dueDate,
        status: taskDetails.taskStatus,
        desc: taskDetails.taskDesc
    })
    res.redirect('/listtasks.html');
})

app.post('/remove', function (req, res) {
    let idDel = req.body.taskID;
    console.log(idDel)
    let query = {
        _id: new mongodb.ObjectID(idDel)
    };
    col.deleteOne(query, function(err, obj){});
    res.redirect('/listtasks.html')
})

app.post('/removecomp', function (req, res) {
    let query = {status: {$eq: "Completed"}};
    col.deleteMany(query, function (err, obj) {});
    res.redirect('listtasks.html')
});

app.post('/noremovecomp', function (req, res) {
    res.redirect('listtasks.html')
});

app.post('/update', function (req, res) {
    let idUpdate = req.body.taskID;
    let newStatus = req.body.taskStatus;
    let query = {
        _id: new mongodb.ObjectID(idUpdate)
    }
    let theUpdate = {
        $set: {
            status: newStatus
        }
    };
    col.updateOne(query, theUpdate);
    res.redirect('/listtasks.html')
})

app.listen(8080);