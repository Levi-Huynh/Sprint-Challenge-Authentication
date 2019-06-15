const axios = require('axios');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model.js');
const { authenticate } = require('../auth/authenticate.js');
const secrets = require('../auth/authenticate.js'); 

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
 let user = req.body;
  const hash =  bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

 Users.add(user)
    .then(user => {
      console.log(user);
      const token = generateToken(user);
      res.status(201).json({user,token});
    })
    .catch(error => {
      res.status(500).json(error);
    });
 }



// async function register (req, res) {
//   try{ let user = req.body;
//    const hash = await bcrypt.hashSync(user.password, 10); // 2 ^ n
//    user.password = hash;
 
//   const reg = await Users.add(user);
//     if(reg) {
//        res.status(201).json(reg);
//      }else{
    
//        res.status(500).json(error); }
//      }catch (error) {
//       res
//       .status(500)
//       .json({ message: 'We ran into error registering user' });
//   }
// };





function login(req, res) {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // req.session.username = user.username;
     //the cookie is sent by the express-session library 
     const token= generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials, You shall not pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}



function generateToken(user) {
  //payload is data
  //nomrally good to store secret in different file location
  const payload = {
    //docs will show you options for your payload, secret ,options 
    //subject - who is this token identifying
    //docs: npm jsonwebtoken
    subject: user.id, //what the token is describing
    username: user.username,
    roles: user.department, //normally would be found in db user.roles
    };

  

    const options = {
      expiresIn: '1h',
    };

  return jwt.sign(payload, secrets.jwtKey, options)
}
