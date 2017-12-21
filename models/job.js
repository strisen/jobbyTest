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
    },
    created_at :{
      type: Date,
      default : Date.now
    },
    created_by :{
      type : Schema.Types.ObjectId
    }
})

const Job = mongoose.model('Job', jobSchema)
module.exports = Job
