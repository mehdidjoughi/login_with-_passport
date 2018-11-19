const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model')

passport.serializeUser((user,done)=>{
    done(null , user.id)
})

passport.deserializeUser((id , done)=>{
    User.findById(id).then((user)=>{
        done(null , user)
    })
})

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (acecssToken , refreshToken , profile , done) => {
        // passport callback function
        User.findOne({googleid : profile.id}).then((currentUser)=>{
            if(currentUser){

                console.log('user alredy existe' + currentUser)
                done(null , currentUser)
            }else{

                new User({
                    username : profile.displayName,
                    googleid : profile.id,
                    thumbnail : profile._json.image.url
                }).save().then(  (newUser) =>{
                    console.log('new User'+ newUser)
                    done(null , newUser)
                })
            }
        })

        
    })
);