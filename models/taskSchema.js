const mongoose = require('mongoose');
let taskSchema = mongoose.Schema({
    taskID: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    assigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'devCol'
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        validate: {
            validator: function (statusChk) {
                return statusChk === 'InProgress' || statusChk === 'Completed'
            },
            message: 'Status entered is invalid'
        }
    },
    desc: String
});

let taskModel = mongoose.model('taskCol', taskSchema);
module.exports=taskModel;