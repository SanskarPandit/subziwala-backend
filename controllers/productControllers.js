import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js'


const getProducts = asyncHandler(async(req,res)=>{
    const products = await Product.find({});
    res.cookie("Test", "test")
    res.json(products);
});

const getProductById = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(product){
    res.json(product);
    }else{
        res.status(404);
        throw new Error("Resource not found")
    }
});

const createProduct = asyncHandler(async(req,res)=>{
    const product = new Product({
        name:"Sample Name",
        price:0,
        user:req.user._id,
        image:'/images/sample.png',
        countInStock:0,
        category:"Sample"
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct)
});

const updateProduct = asyncHandler(async(req,res)=>{
    const {name,price,image,countInStock,category} = req.body;
    const product = await Product.findById(req.params.id);

    if(product){
        product.name =name;
        product.price= price;
        product.image=image;
        product.countInStock= countInStock;
        product.category = category
        const updatedProduct = await product.save();
        res.json(updatedProduct)
    }else{
        res.status(404);
        throw new Error("Resources not found");
    }
});
export {getProducts,getProductById,createProduct,updateProduct}