
const express=require('express')
const app=express()
const port=process.env.PORT || 3000
app.use(express.json());


require('./db/mongoose')

const CategoryModel = require('./model/category-model')
const ProductsModel = require("./model/product-model")



//Category apis

app.post('/addCategory', async(req, res)=>{

    try{

        const category = new CategoryModel({name:req.body.name.toLowerCase(), child:req.body.child})

        await category.save()

        res.status(200).send({'message':'Category added successfully..!!'})
    }catch(e){
        console.log(e)
        res.status(500).send({'message':'Technical error occured, Unable to add category'})

    }
})


app.get("/fetchCategories", async(req, res)=>{

    const categories = await CategoryModel.find({})

    res.status(200).send(categories)
})






//Product apis

app.post('/addProduct', async (req, res)=>{

    try{

        if(req.body.categories.length > 0){
            const categories = await req.body.categories.map(a => a.toLowerCase());
    
            const a=await CategoryModel.find( { name: { $in: categories } });

            if(a.length<=0){
                res.status(400).send("Please provide valid category")
                return
            }

            const products = new ProductsModel({name:req.body.name.toLowerCase(), categories:categories})

            await products.save();
            res.status(200).send("Product added successfully")
        }else{
            res.status(200).send("Please provide at least one category")
        }
     }catch(e){
         console.log('Error occured: ',e)
         res.status(200).send("Unable to add product")
     } 
})


app.get('/fetchProductByCategory/:categoryName', async (req, res)=>{

    try{
        if(!req.params.categoryName)
            res.status(200).send(JSON.stringify(products))

        const category = req.params.categoryName
        const products = await ProductsModel.find({categories:{$in:category}})

        if(products.length>0)
            res.status(200).send(products)
        else
            res.status(400).send({'message':'No product found'})
        

    }catch(e){
            console.log('Error occured: ',e)
            res.status(200).send(e)
        } 
})


app.patch("/updateProduct/:id", async (req, res)=>{
    
    try{

        const product_id=req.params.id
        const product=await ProductsModel.findById(product_id)
        
        if(!product){
            res.status(400).send("Product not found")
        }

        if(req.body.name)
            product.name = req.body.name
        
        if(req.body.price)
            product.price = req.body.price

            
        if(req.body.categories>0)
            product.categories = req.body.categories

        await product.save()

        res.status(200).send("Product updated successfully")

    }catch(e){
        res.status(400).send("Unable to update product")
    }

})



app.listen(port,()=> console.log('App is running on port '+port) )