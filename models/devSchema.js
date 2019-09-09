const mongoose = require('mongoose');
let devSchema = mongoose.Schema({
    devID: {
        type: Number,
        required: true
    },
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        required: true,
        validate: {
            validator: function (levelCheck) {
                return levelCheck === 'BEGINNER' || levelCheck ==='EXPERT'
            },
            message: 'Level entered not valid'
        }   
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: Number
        }

});
let devModel = mongoose.model('devCol', devSchema);
module.exports = devModel;