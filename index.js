const express = require("express")
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()

// middleware for the project.
app.use(cors())
app.use(express.json())

// Connecting application.
const uri = `mongodb+srv://${process.env.DataBase_UName}:${process.env.DataBase_Pass}@cluster0.1n7br.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function runDataBase() {
    try {

        app.get('/books', async (req, res) => {
            await client.connect();
            const dName = client.db("MyBookyD_Base").collection("Books");

            const query = {};
            const cursor = dName.find(query);

            const allBooks = await cursor.toArray();
            res.send(allBooks);
        })
    }
    finally {

    }
}

runDataBase().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Connecting...! Connected now..')
})

app.listen(port, () => {
    console.log('Updating port....');
})