//console.log('WASSUP');

const express = require('express')
const bodyParser = require('body-parser')
const MongoClient= require('mongodb').MongoClient
const app = express()

const connectionString = 'mongodb+srv://Karl:Lpcho123@cluster0.uamuz.mongodb.net/Natality?retryWrites=true&w=majority'

//parser
app.use(express.urlencoded({ extended: true}))

app.listen(3000, function(){
    console.log('listening to port 3000')
})

//app.get(endpoint, callback)


// app.get('/', function(req, res)  {
//     res.sendFile(__dirname + '/index.html')
// })



MongoClient.connect(connectionString, {
    useUnifiedTopology: true
})
    .then(client => {
    
    //connects to the database
    console.log('Connected to Database')
    const db = client.db('Natality')
    const quotesCollection = db.collection('quotes')
    
    //middlewares
    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(express.json())



    //allows the user to read data from the database
    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
        .then(results => {
            console.log("Data retrieve")
            res.render('index.ejs', {quotes: results})
        })
        .catch(error => console.error(error))
        // ...
        
      })
    
    
    //submit
        app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
        .then(result => {
            console.log("Submitted to database")
            res.redirect('/')
        })
        .catch(error => console.error(error))
    })


    //update
    app.post('/update', (req, res) => {
        var findName = req.body.find;
        var updateName = req.body.name;
        var updateQuote = req.body.quote
        quotesCollection.findOneAndUpdate(
            {name: req.body.find},
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
            
        )
        .then(result => {
            console.log("Update Succesful")
            res.redirect('/')
        })
        .catch(error => console.error(error))
        
    })

    //Delete
    app.post('/delete', (req, res) => {
        
        quotesCollection.deleteOne(
            {name: req.body.deleteFind},
            
        )
        .then(result => {

            if (result.deletedCount == 0){
                console.log("No data to delete")
                return res.redirect('/')
            }
            console.log("Delete Succesful")
            res.redirect('/')
        })
        .catch(error => console.error(error))
        
    })
    


    app.listen()
    
    
}).catch(error => console.error(error))


