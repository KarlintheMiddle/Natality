//console.log('WASSUP');

const express = require('express')
const bodyParser = require('body-parser')
const MongoClient= require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;

const app = express()

const connectionString = 'mongodb+srv://Karl:Lpcho123@cluster0.uamuz.mongodb.net/Natality?retryWrites=true&w=majority'

//parser
app.use(express.urlencoded({ extended: true}))

app.listen(3000, function(){
    console.log('listening to port 3000')
})

//app.get(endpoint, callback)


// app.get('/', function(req, res)  {
//     res.sendFile(__dirname + '/public/pages/death.ejs')
//  })


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
    app.use('/',express.static(__dirname + '/public'));
    app.use('/',express.static(__dirname + '/views'));
    app.use(express.json())
    
    //allows the user to read data from the database 
    app.get('/death', (req, res) => {
        db.collection('quotes').find().toArray()
        .then(results => {
            console.log("Death page Data retrieve")
            res.render('death.ejs', {quotes: results})
            console.log({quotes: results});
            
        })
        .catch(error => console.error(error))
        // ...
        
      })
    
    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
        .then(results => {
            console.log("Data retrieve")
            
            
        })
        .catch(error => console.error(error))
        // ...
        
      })
      var bar = {};
      app.get('/death-statistic', (req, res) => {
        db.collection("quotes", function(err, collection) {
            collection.find().sort({order_num: 1}).toArray(function(err, result) {
              if (err) {
                throw err;
              } else {
                for (i=0; i<result.length; i++) {
                  collectionOne[i] = result[i];
                }
              }
            });
            db.collection("quotes", function(err, collection) {
              collection.find().sort({order_num: 1}).toArray(function(err, result) {
                if (err) {
                  throw err;
                } else {
                  for (i=0; i<result.length; i++) {
                    collectionTwo[i] = result[i];
                  }
                }
              });
            });
            // Thank you aesede!
            res.render('death-statistic.ejs', {
              quotes: collectionOne,
              quotes: collectionTwo
            });
            console.log({
                quotes: collectionOne,
                quotes: collectionTwo
              })
        
          });
          });


    
    
    //submit death.ejs
        app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
        .then(result => {
            console.log("Submitted to database")
            res.redirect('death')
        })
        .catch(error => console.error(error))
    })


    //update death.ejs
    app.post('/update', (req, res) => {
        var findID = new ObjectID(req.body.id);
        var updateDOD = req.body.dateOfDeath;
        var updateFirstName = req.body.fname;
        var updateMiddleName = req.body.mname;
        var updateLastName = req.body.lname;
        var updateBirthday = req.body.bday;
        var updateAge = req.body.age;
        var updateICD10 = req.body.icd10;
        var updateCOD = req.body.causeofdeath;
        var updatePOD = req.body.placeofdeath;
        var updateBarangay = req.body.Barangay;
        
        quotesCollection.findOneAndUpdate(
            {_id: findID},
            {
                $set: {
                    dateOfDeath: updateDOD,
                    fname: updateFirstName,
                    mname: updateMiddleName,
                    lname: updateLastName,
                    bday: updateBirthday,
                    age: updateAge,
                    icd10: updateICD10,
                    causeofdeath: updateCOD,
                    placeofdeath: updatePOD,
                    Barangay: updateBarangay

                }
            },
            {
                upsert: true
            }
            
        )
        .then(result => {
            console.log("Update Succesful")
            res.redirect('death')
        })
        .catch(error => console.error(error))
        
    })

    //Delete death.ejs
    app.post('/delete', (req, res) => {
        var findID = new ObjectID(req.body.delid);
        quotesCollection.deleteOne(
            {_id: findID},
            
        )
        .then(result => {

            if (result.deletedCount == 0){
                console.log("No data to delete")
                return res.redirect('death')
            }
            console.log("Delete Succesful")
            res.redirect('death')
        })
        .catch(error => console.error(error))
        
    })
    


    app.listen()
    
    
}).catch(error => console.error(error))


