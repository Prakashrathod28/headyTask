const mongoose=require('mongoose')

const categorySchema = {
    name:{
        type:String,
        required:true,
        unique:true
    },

    child:[{
        name:{
            type:String
        },
        sub_child:[{
            name:{
                type:String,
                required:true
            }
        }]

    }],

    createdAt:{ type: Date, default: Date.now }
}

module.exports = mongoose.model('Categories', new mongoose.Schema(categorySchema));
