const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new Schema({
    title :{
      type: String,
      required : [ true, 'Job Title cannot be empty' ]
    },
    description :{
        type : String,
        required : [ true, 'Job Description Cannot be empty']
    }
})
