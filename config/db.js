const mongoose = require('mongoose');
const MONGOURI = "mongodb+srv://<Username>:<password>@cluster0-9vtky.mongodb.net/<DB-Name>?retryWrites=true&w=majority";

const connectMongo = async () => {
    try{
       await mongoose.connect(MONGOURI,{useNewUrlParser: true, useUnifiedTopology: true});
        console.log("DB connected");
    }
    catch(e)
    {
        console.log(e);
        throw e;
    }
}

module.exports = connectMongo;
