
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express= require('express');
const cors= require('cors');
require('dotenv').config();

const port =3000;
const app=express();
app.use(cors());
app.use(express.json());



const uri = process.env.DB_URI;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const database=client.db('homeNest');
    const homeNest=database.collection('properties');
    const ratingsCollection = database.collection("ratings");


    //Post service to DB

    app.post('/properties',async(req,res)=>{
      const data=req.body;
      console.log(data);

      const result= await homeNest.insertOne(data);
      res.send(result);
      
    })
  //Get services from DB
  app.get('/properties',async(req,res)=>{
    const {category}=req.query
    console.log(category);
    
    const query={}
    if(category){
      query.category=category
      
    }
    const result= await homeNest.find(query).toArray();
    res.send(result);
  })

  app.get('/properties/:id',async(req,res)=>{
   
    const id=req.params
    console.log(id);

    const query ={_id: new ObjectId(id)}
    const result=await homeNest.findOne(query)
    res.send(result)
    
  })

  app.get('/my-properties',async(req,res)=>{

    const {email}= req.query
   const query={email:email}
   const result=await homeNest.find(query).toArray()
   res.send(result);
    
  })

  app.put('/update/:id',async(req,res)=>{
    const data=req.body
    const id=req.params
     const query ={_id: new ObjectId(id)}
    
     const updateProperties={
       $set:data
    }
    const result=await homeNest.updateOne(query,updateProperties)
    res.send(result);
    
   
  });

  app.delete('/delete/:id',async(req,res)=>{
    const id=req.params
    const query ={_id: new ObjectId(id)}
    const result= await homeNest.deleteOne(query)
    res.send(result);
  })

  app.post("/ratings", async (req, res) => {
  const data = req.body;
  const result = await ratingsCollection.insertOne(data);
  res.send(result);
});

app.get("/property-ratings/:propertyId", async (req, res) => {
  const propertyId = req.params.propertyId;
  const result = await ratingsCollection.find({ propertyId }).toArray();
  res.send(result);
});

app.get("/my-ratings", async (req, res) => {
  const email = req.query.email;
  const result = await ratingsCollection.find({ reviewerEmail: email }).toArray();
  res.send(result);
});





   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{

    res.send('Hello Sabbir');
})

app.listen(port,()=>{
    console.log(`server is running ${port}`)
})
