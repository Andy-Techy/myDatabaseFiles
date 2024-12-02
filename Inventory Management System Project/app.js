//importing basic modules. 
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
//requiring object id 
const {ObjectId} = require('mongodb');

//importing the exported functions in connection file
const { connectToDb, getDb} = require('./connection');

//init app & middleware
const app = express()
app.use(express.json());

//middleware
app.use(bodyParser.json());

//Db connection
let db
connectToDb((err) => {
    if(!err) {
        app.listen(3000, () => {
            console.log('listening on port 3000')
        })
        db = getDb()
    }
});

//sign up route
app.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;
        //check if user already exists
        const user = await   
        db.collection('users')
           .findOne({username})
           .then (user => {
                if(user) {
                    return res.status(400).json({error: 'User already exists'});
                } 
    
            });
        
        //hash password
        const hashedpassword = await bcrypt.hash(password, 10);

        //adding One  new user to database
        await db.collection('users')
        .insertOne({firstname: firstname, lastname: lastname, username: username, email: email, password: hashedpassword});
        res.status(201).json({message: 'User added successfully'});      
    }catch(err) {
        console.error(err);
        res.status(500).json({error: 'could not add user to database'});
    }
});

        //login route
app.post('/login', async (req, res) => {
    try {
        const { username , password } = req.body;

        //check if user exists
        const user = await 
        db.collection('users')
           .findOne({username})
                if(!user) {
                    return res.status(400).json({error: 'User does not exist'});
                }
            
        //check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({error: 'Password does not match'});
        }
            //hash password
        const hashedpassword = await bcrypt.hash(password, 10);

        //adding One  new user to database
        await db.collection('login')
        .insertOne({username: username,  password: hashedpassword});
        res.status(201).json({message: 'Log in Success!'});

    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'could not login'});
    }
});

//generate jwt token
// const jwtToken = jwt.sign(password)

//get users
app.get('/users', async (req, res) => {
    try {
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'could not get users'});
    }
});

//get user by id
app.get('/users/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('users')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
         res.status(200).json(doc)
         })
        .catch(err => {
         res.status(500).json({error: 'Could not fetch document'});
         })
    }else {
        res.status(400).json({error: 'Invalid id'});
    }
});

//delete user by id
app.delete('/users/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('users')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
         res.status(200).json(result)
         })
        .catch(err => {
         res.status(500).json({error: 'Could not delete document'});
         })
    }else {
        res.status(400).json({error: 'Invalid id'});
    }
});

//update user with new user 
app.put('/users/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('users')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: req.body})
        .then(result => {
         res.status(200).json(result)
         })
        .catch(err => {
         res.status(500).json({error: 'Could not update document'});
         })
    }else {
        res.status(400).json({error: 'Invalid id'});
    }
});

//TELEVISION COLLECTION
//create a single television
app.post('/television', (req, res) => {
    const television = req.body

    db.collection('television')
        .insertOne(television)
        .then(result => {
            res.status(201).json(result)
         })
         .catch(err => {
            res.status(500).json({error: 'Could not create document'});
         })
    });
    //Creating more than one televsion
app.post('/televisions', (req, res) => {
    const television = req.body

    db.collection('television')
        .insertMany(television)
        .then(result => {
            res.status(201).json(result)
         })
         .catch(err => {
            res.status(500).json({error: 'Could not create document'});
         })
    });
    //Getting televisions
app.get('/televisions', (req, res) => {
    //pagination
    const page = req.query.page || 0
    const televisionsPerPage = 10
    let teles = []

    db.collection('television')
    .find()
    .skip(page * televisionsPerPage)
    .limit(televisionsPerPage)
    .forEach(tele => teles.push(tele))
    .then(() => {
        res.status(200).json(teles)
     }) 
    .catch(() => {
        res.status(500).json({error: 'Could not fetch documents'});
     })
    
});
    //Delete a television
app.delete('/television/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('television')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
          res.status(200).json(result)
        })
       .catch(err => {
        res.status(500).json({error: 'Could not delete document'});
        })
    }else {
        res.status(500).json({error: 'Invalid ID'});
    }
});
    //Get a single television                                                                                                                                                                        
app.get('/television/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('television')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
         res.status(200).json(doc)
         })
        .catch(err => {
         res.status(500).json({error: 'Could not fetch document'});
         })
    }else {
        res.status(400).json({error: 'Invalid id'});
    }
});
    //Update a television
app.patch('/television/:id', (req, res) => {
    const update = req.body

    if(ObjectId.isValid(req.params.id)) {
        db.collection('television')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: update})
        .then(result => {
          res.status(200).json(result)
        })
       .catch(err => {
        res.status(500).json({error: 'Could not update document'});
        })
    }else {
        res.status(500).json({error: 'Invalid ID'});
    }
});
        //SPEAKERS COLLECTION   
//Create a single speaker
app.post('/speaker', (req, res) => {
    const speaker = req.body

    db.collection('speakers')
        .insertOne(speaker)
        .then(result => {
            res.status(201).json(result)
         })
         .catch(err => {
            res.status(500).json({error: 'Could not create document'});
         })
    });

    //Creating more than one SPEAKER
app.post('/speakers', (req, res) => {
    const speaker = req.body

    db.collection('speakers')
        .insertMany(speaker)
        .then(result => {
            res.status(201).json(result)
         })
         .catch(err => {
            res.status(500).json({error: 'Could not create document'});
         })
    });

    //Getting speakers
app.get('/speakers', (req, res) => {

    //pagination
    const page = req.query.page || 0
    const speakersPerPage = 10
    let speakers = []

    db.collection('speakers')
    .find()
    .skip(page * speakersPerPage)
    .limit(speakersPerPage)
    .forEach(speaker => speakers.push(speaker))
    .then(() => {
        res.status(200).json(speakers)
     }) 
    .catch(() => {
        res.status(500).json({error: 'Could not fetch documents'});
     })
    
});

    //Delete a speaker
app.delete('/speakers/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('speakers')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
          res.status(200).json(result)
        })
       .catch(err => {
        res.status(500).json({error: 'Could not delete document'});
        })
    }else {
        res.status(500).json({error: 'Invalid ID'});
    }
});

    //Get a single speaker                                                                                                                                                                        
app.get('/speakers/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('speakers')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
         res.status(200).json(doc)
         })
        .catch(err => {
         res.status(500).json({error: 'Could not fetch document'});
         })
    }else {
        res.status(400).json({error: 'Invalid id'});
    }
});

    //Update a speaker
app.patch('/speakers/:id', (req, res) => {
    const update = req.body

    if(ObjectId.isValid(req.params.id)) {
        db.collection('speakers')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: update})
        .then(result => {
          res.status(200).json(result)
        })
       .catch(err => {
        res.status(500).json({error: 'Could not update document'});
        })
    }else {
        res.status(500).json({error: 'Invalid ID'});
    }
});
            // LAPTOP COLLECTIONS

    //Create a single laptop
app.post('/laptop', (req, res) => {
    const laptop = req.body

    db.collection('laptops')
        .insertOne(laptop)
        .then(result => {
            res.status(201).json(result)
         })
         .catch(err => {
            res.status(500).json({error: 'Could not create document'});
         })
    });
    //Creating more than one laptop
app.post('/laptops', async (req, res) => {
    const laptop = req.body;
    
    db.collection('laptops')
        .insertMany(laptop)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({error: 'Could not create document'});
        });
});
    //Get laptops
app.get('/laptops', (req, res) => { 
    //pagination
    const page = req.query.page || 0
    const laptopsPerPage = 10
    let laps = []

    db.collection('laptops')
    .find()
    .sort({ brand: 1})
    .skip(page * laptopsPerPage)
    .limit(laptopsPerPage)
    .forEach(lap => laps.push(lap))
    .then(() => {
        res.status(200).json(laps);
     }) 
    .catch(() => {
        res.status(500).json({error: 'Could not fetch documents'});
     })
});
    //Delete  a laptop
    app.delete('/laptops/:id', (req, res) => {
        if(ObjectId.isValid(req.params.id)) {

            db.collection('laptops')
            .deleteOne({_id: new ObjectId(req.params.id)})
            .then(result => {
              res.status(200).json(result);
            })
           .catch(err => {
            res.status(500).json({error: 'Could not delete document'});
            });
        }else {
            res.status(500).json({error: 'Invalid ID'});
        }
    });   
//Update a laptop
    app.patch('/laptops/:id', (req, res) => {
        const update = req.body
    
        if(ObjectId.isValid(req.params.id)) {
            db.collection('laptops')
            .updateOne({_id: new ObjectId(req.params.id)}, {$set: update})
            .then(result => {
              res.status(200).json(result)
            })
           .catch(err => {
            res.status(500).json({error: 'Could not update document'});
            })
        }else {
            res.status(500).json({error: 'Invalid ID'});
        }
    });

            //SMART PHONES COLLECTIONS 
//Create a single smartphone
app.post('/smartphone', (req, res) => {
    const smartphone = req.body

    db.collection('smartphones')
        .insertOne(smartphone)
        .then(result => {
            res.status(201).json(result);
         })
         .catch(err => {
            res.status(500).json({error: 'Could not create document'});
         })
    });

//Creating more than one smartphone
app.post('/smartphones', async (req, res) => {
    const smartphone = req.body;
    
    db.collection('smartphones')
        .insertMany(smartphone)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({error: 'Could not create document'});
        })
});
    //Get smartphones
app.get('/smartphones', (req, res) => {
    //pagination
    const page = req.query.page || 0
    const smartphonesPerPage = 10
    let phones = []

    db.collection('smartphones')
    .find()
    .sort({ brand: 1})
    .skip(page * smartphonesPerPage)
    .limit(smartphonesPerPage)
    .forEach(phone => phones.push(phone))
    .then(() => {
        res.status(200).json(phones)
     }) 
    .catch(() => {
        res.status(500).json({error: 'Could not fetch documents'});
     })
});
     //Delete a smartphone
     app.delete('/smartphones/:id', (req, res) => {
        if(ObjectId.isValid(req.params.id)) {
            db.collection('smartphones')
            .deleteOne({_id: new ObjectId(req.params.id)})
            .then(result => {
              res.status(200).json(result)
            })
           .catch(err => {
            res.status(500).json({error: 'Could not delete document'});
            })
        }else {
            res.status(500).json({error: 'Invalid ID'});
        }
    });
        //Update a smart phone
    app.patch('/smartphones/:id', (req, res) => {
        const update = req.body
    
        if(ObjectId.isValid(req.params.id)) {
            db.collection('smartphones')
            .updateOne({_id: new ObjectId(req.params.id)}, {$set: update})
            .then(result => {
              res.status(200).json(result)
            })
           .catch(err => {
            res.status(500).json({error: 'Could not update document'});
            })
        }else {
            res.status(500).json({error: 'Invalid ID'});
        }
    });
    // KITCHEN APPLIANCES 
// Create a single kitchen appliance
app.post('/kitchenappliance',  (req, res) => {
    const kitchenappliance = req.body

    db.collection('kitchenappliances')
        .insertOne(kitchenappliance)
        .then(result => {
            res.status(201).json(result);
         })
         .catch(err => {
            res.status(500).json({error: 'Could not create document'});
         })
    });
//Creating more than one kitchenappliance
app.post('/kitchenappliances', async (req, res) => {
    try {
        const appliances = req.body;
        const allAppliances = [];
        
        for (const key in appliances) {
            if (Array.isArray(appliances[key])) {
                allAppliances.push(...appliances[key]);
            }
        }
        
        const result = await db.collection('kitchenappliances').insertMany(allAppliances);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Could not create documents' });
    }
});

// app.post('/kitchenappliances', async (req, res) => {

//     const kitchenappliance = req.body.documents;

//     if (!Array.isArray(kitchenappliance)) {
//         return res.status(400).json({ error: 'Documents must be provided as an array' });
//     }
    
//     db.collection('kitchenappliances')
//         .insertMany(kitchenappliance)
//         .then(result => {
//             res.status(201).json(result);
//         })
//         .catch(err => {
//             console.error('Error:', err);
//             res.status(500).json({error: 'Could not create document'});
//         })
// });
    
        //Get kitchenappliances  with blenders  
app.get('/kitchenappliances/blender', (req, res) => {

    // Define the blender array for filtering
    const blender = ["Vitamix", "Ninja", "Blendtec", "KitchenAid", "Oster", "Hamilton Beach", "Breville", "Cuisinart", "Magic Bullet", "NutriBullet"];

    //pagination
    const page = req.query.page || 0;
    const kitchenappliancesPerPage = 10;
    let kitchapps = [];

    db.collection('kitchenappliances')
    .find({brand: {$in: blender}})
    .sort({ brand: 1})
    .skip(page * kitchenappliancesPerPage)
    .limit(kitchenappliancesPerPage)
    .forEach(kitchapp => kitchapps.push(kitchapp))
    .then(() => {
        res.status(200).json(kitchapps)
     }) 
    .catch(() => {
        res.status(500).json({error: 'Could not fetch documents'});
     })
});
     //Delete a kitchenappliance
     app.delete('/kitchenappliance/:id', (req, res) => {
        if(ObjectId.isValid(req.params.id)) {
            db.collection('kitchenappliances')
            .deleteOne({_id: new ObjectId(req.params.id)})
            .then(result => {
              res.status(200).json(result)
            })
           .catch(err => {
            res.status(500).json({error: 'Could not delete document'});
            })
        }else {
            res.status(500).json({error: 'Invalid ID'});
        }
    });
    
        //Update a kitchenappliance
    app.patch('/kitchenappliances/:id', (req, res) => {
        const update = req.body
    
        if(ObjectId.isValid(req.params.id)) {
            db.collection('kitchenappliances')
            .updateOne({_id: new ObjectId(req.params.id)}, {$set: update})
            .then(result => {
              res.status(200).json(result)
            })
           .catch(err => {
            res.status(500).json({error: 'Could not update document'});
            })
        }else {
            res.status(500).json({error: 'Invalid ID'});
        }
    });
//getting books without pagination
//app.get('/books/:id', (req, res) => {
    //     if(ObjectId.isValid(req.params.id)) {
    //         db.collection('books')
    //         .findOne({_id: new ObjectId(req.params.id)})
    //         .then(doc => {
    //         res.status(200).json(doc)
    //         })
    //        .catch(err => {
    //         res.status(500).json({error: 'Could not fetch document'})
    //         })
    //     }else {
    //         res.status(500).json({error: 'Invalid ID'})
    //     }
    // })