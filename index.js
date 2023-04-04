const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId,  } = require('mongodb');

require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y2sfurg.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async()=>{
try{
  const productCollection = client.db('bdTech').collection('products')
  app.get('/products', async(req, res)=>{
   const product = await productCollection.find({}).toArray()
   res.send(product)
   
  })
  app.post('/products', async(req, res)=>{
    const addProduct = req.body
    const result = await productCollection.insertOne(addProduct)
    res.send(result)
  })
  app.delete('/products/:id', async(req, res)=>{
    const id =req.params.id
    const quary = {_id: new ObjectId(id) }
    const result = await productCollection.deleteOne(quary)
    // console.log(quary)
    res.send(result)
  })

  app.put('/products/:id', async (req, res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const product = req.body
    const option = {upsert: true}
    const updateProduct = {
      $set: {
        date: product.date,
        model: product.model,
        image: product.image,
        brand : product.brand,
        price: product.price,
        rating: product.rating,
        status: product.status,
        keyFeature: product.keyFeature
      }
    }
    const result = await productCollection.updateOne(query, updateProduct, option)
    res.send(result)
  })
  app.get('/product/:id', async (req, res)=>{
    const id =req.params.id
    const query = {_id:new ObjectId(id)}
    const result = await productCollection.findOne(query)
    res.send(result)
  })
}
finally{

}
}
run().catch((err)=>console.log(err))

app.get('/', (req, res)=>{
 res.send('Connect BD Server')
})
app.listen(port, ()=>console.log(`BD Server Running ${port}`))