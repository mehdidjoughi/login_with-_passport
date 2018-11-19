const express = require('express');
const authRouter = require('./routes/auth-routes')
const profileRouter = require('./routes/profile-routes')
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const passport = require('passport')
const cookieSession = require('cookie-session')


const app = express();

// set view engine
app.set('view engine', 'ejs');


//encrypte coockie
app.use(cookieSession({
    maxAge : 24*60*60*1000,
    keys : [keys.session.cookieKey]
}))

app.use(passport.initialize())
app.use(passport.session())


// connect to MongoDB
mongoose.connect(keys.mongodb.dbURL , ()=>{
    console.log('connected to mongodb')
})

app.use('/auth' , authRouter)
app.use( '/profile' , profileRouter)

// create home route
app.get('/', (req, res) => {
    res.render('home', {user : req.user});
});

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});