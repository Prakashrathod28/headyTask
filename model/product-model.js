const mongoose=require('mongoose')

const productSchema={
    name:{
        type:String,
        required:true
    },
    categories:
        {
            type:Array
        },
    createdAt:{ type: Date, default: Date.now },
    price:{type:Number}
}


module.exports = mongoose.model('Products', new mongoose.Schema(productSchema));
