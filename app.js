let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');



let app = express()

let Developer = require('./models/devSchema');
let Task = require('./models/taskSchema');


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'views', __dirname);
app.use(express.static('images'));
app.use(express.static('htmlfiles'));
app.use(express.static('css'));

app.use(bodyParser.urlencoded({
    extended: false
}));

let url = 'mongodb://localhost:27017/fit2095db';
mongoose.connect(url, {
    useNewUrlParser: true
}, function (err) {
    if (err) console.log(err);
})

app.get('/', function (req, res) {
    res.render('index.html', {});

});

app.get('/index.html', function (req, res) {
    res.render('index.html', {});
});

app.get('/newtask.html', function (req, res) {
    res.render('newtask.html', {});

});

app.get('/adddev.html', function (req, res) {
    res.render('adddev.html', {});

});

app.get('/getdevs', function (req, res) {
    Developer.find().exec(function (err, data) {
        res.send(data)
    })
});

app.get('/listtasks.html', function (req, res) {
    Task.find().exec(function (err, data) {
        res.render('listtasks.html', {
            db: data
        })
    });
});

app.get('/listdev.html', function (req, res) {
    Developer.find().exec(function (err, data) {
        res.render('listdev.html', {
            db: data
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

app.get('/insertmany.html', function (req, res) {
    res.render('insertmany.html', {});

});

app.post('/data', function (req, res) {
    let taskDetails = req.body;
    let ID = Math.round(Math.random() * 10000000);
    let task = new Task({
        taskID: ID,
        name: taskDetails.taskName,
        assigned: taskDetails.devID,
        dueDate: taskDetails.dueDate,
        status: taskDetails.taskStatus,
        desc: taskDetails.taskDesc
    });
    task.save(function (err) {
        if (err) throw err;
    });
    res.redirect('/listtasks.html');
});

app.post('/devdata', function (req, res) {
    let devDetails = req.body;
    let ID = Math.round(Math.random() * 1000);
    let dev = new Developer({
        devID: ID,
        name: {
            firstName: devDetails.firstName,
            lastName: devDetails.lastName
        },
        level: devDetails.level,
        address: {
            state: devDetails.state,
            suburb: devDetails.suburb,
            street: devDetails.street,
            unit: devDetails.unit
        }
    });
    dev.save(function (err) {
        if (err) throw err;
    });

    res.redirect('/listdev.html');
});

app.post('/manydata', function (req, res) {
    console.log('I got a post request');
    let taskDetails = req.body;
    let count = parseInt(req.body.taskCount);
    let doc_1 = ({
        task: taskDetails.taskName,
        name: taskDetails.nameAssigned,
        date: taskDetails.dueDate,
        status: taskDetails.taskStatus,
        desc: taskDetails.taskDesc
    })
    console.log(doc_1);
    let taskAdd = count * doc_1;
    console.log(taskAdd);
    col.insertMany(taskAdd);
    res.redirect('/listtasks.html');
})

app.post('/remove', function (req, res) {
    let idDel = req.body.ID;
    let query = {
        taskID: idDel
    };
    Task.deleteOne(query, function (err, obj) {});
    res.redirect('/listtasks.html')
})


app.post('/removecomp', function (req, res) {
    let query = {
        status: {
            $eq: "Completed"
        }
    };
    Task.deleteMany(query, function (err, obj) {});
    res.redirect('listtasks.html')
});

app.post('/removedev', function (req, res) {
    let query = {
        level: {
            $eq: "BEGINNER"
        }
    };
    let query2 = {
        level: {
            $eq: "EXPERT"
        }
    };   
    Task.deleteMany(query, function (err, obj) {});
    Task.deleteMany(query2, function (err, obj) {});
    res.redirect('listdev.html')
});

app.post('/noremovecomp', function (req, res) {
    res.redirect('listdev.html')
});

app.post('/update', function (req, res) {
    let idUpdate = req.body.ID;
    let newStatus = req.body.taskStatus;
    let query = {
        taskID: idUpdate
    };
    let statusUpdate = {
        $set: {
            status: newStatus
        }
    };
    Task.updateOne(query, statusUpdate, function(err, obj){});
    res.redirect('listtasks.html')
});

app.listen(8080);