const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mgf3ixl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
    const serviceCollection = client.db('learn').collection('services');
    const blogCollection = client.db('blog').collection('provide');
    const reviewCollection = client.db('mahamud').collection('review');

    //all data
    app.get('/services', async (req,res) => {
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    })

    //sepcific id
    app.get('/services/:id', async (req, res) => {
        const id= req.params.id;
        const query = { _id: ObjectId(id) }
        const service = await serviceCollection.findOne(query)
        res.send(service)


    })

    //limit data 
    app.get('/serviceslimit', async (req, res) => {
        const query = {}
        const cursor = serviceCollection.find(query).limit(3);
        const services = await cursor.toArray();
        res.send(services)

    })
    //blog data
    app.get('/blog', async (req, res) => {
        const query = {}
        const cursor = blogCollection.find(query)
        const blog = await cursor.toArray()
        res.send(blog);
    })
    //review post
    app.post('/review', async (req,res) => {
        const review = req.body
        const result = await reviewCollection.insertOne(review)
        res.send(result)
    })

    // review get
     app.get('/review', async (req,res) => {
        let query = {}
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor = reviewCollection.find(query);
        const review = await cursor.toArray();
        res.send(review)
        
     })

     //Delete

     app.delete('/review/:id',  async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
    })

    //addReview
    app.post('/add-review', async(req, res) => {
        const review = req.body;
        const result = await serviceCollection.insertOne(review);
        res.send(result);
    })


    }
     
    finally {

    }
}

run().catch(err => console.error(err));


app.get('/', (req,res) => {
    res.send('Learn To Code')
})

app.listen(port, () => {
    console.log(`Learn To code running on ${port}`)
})