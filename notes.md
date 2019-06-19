Password Hashing vs Encryption for password storage.
Encryption is two-way that goes: plain text + private key = encrypted password and then encrypted + key = original password.
Cryptographic Hashes are one way: parameters + input = hash. It is pure, given the same parameters and input it generates the same hash.
If the database of users and the key are compromised, it is possible to decrypt the passwords to their original values, this is bad because users tend to share passwords across different sites. This is one reason why Cryptographic Hashing is the preferred method of storing user passwords.

-A common way that attackers circumvent the one way nature of hashing algorithms is by pre-calculating hashes for all possible character combinations up to a particular length using different hashing techniques. The result of that then is stored into a database table known as a rainbow table and whenever there is a breach and an attacker gets access to a database with hashed passwords, they check every password against their table.

#We aim to slow down hackers’ ability to get at a user’s password. To do so, we are going to add time to our security algorithm to produce what is known as a Key Derivation Function. (bcrypt is library of this)

#[Hash] + [Time] = [Key Derivation Function].

#Instead of writing our own Key Derivation Function (fancy name for hashing function), we’ll use a well known and popular module called bcryptjs. This module is well supported and stable, but there are other options you can explore.

#bcyrpt features
-password hashing function.
-implements salting both manual and automatically.
-accumulative hashing rounds.
Having an algorithm that hashes the information multiple times (rounds) means an attacker needs to have the hash, know the algorithm used, and how many rounds were used to generate the hash in the first place.

Every HTTP message, be it a request or a response, has two main parts: the headers and the body.

The headers are a key/value store that includes information about the request. There are several standard headers, but we can add our own if needed.

To send cookies the server will add the Set-Cookie header to the response like so: "Set-Cookie": "session=12345". Notice how the value of a header is just a string. The browser will read the header and save a cookie called session with the value 12345 in this example. We will use a library that takes care of creating and sending the cookie.

The body contains the data portion of the message.

The browser will add the "Cookie": "session=12345" header on every subsequent request and the server.

Cookies are not accessible from JavaScript or anywhere, they are cryptographically signed. Very secure.

There are sever libraries for handling sessions in Node.js, below are two examples:

client-sessions
express-session

#Cookies
automatically included on every request
unique to each domain + device pair
cannot be sent to a different domain
sent in the cookie header
has a body that can have extra identifying information
max size around 4KB

#Storing session data in memory
data stored in memory is wiped when the server restarts.
causes memory leaks as more and more memory is used as the application continues to store data in session for different clients.
good for development due to its simplicity.

#Using cookes to transfer session data.
a cookie is a small key/value pair data structure that is passed back and forth between client and server and stored in the browser.
the server use it to store information about a particular client/user.
#workflow for using cookies as session storage:
the server issues a cookie with an expiration time and sends it with the response.
browsers automatically store the cookie and send it on every request to the same domain.
the server can read the information contained in the cookie (like the username).
the server can make changes to the cookie before sending it back on the response.
rinse and repeat.

#Drawbacks when using cookies

small size, around 4KB.
sent in every request, increasing the size of the request if too much information is stored in them.
if an attacker gets a hold of the private key used to encrypt the cookie they could read the cookie data.
Storing session data in Memory Cache (preferred way of storing sessions in production applications)
stored as key-value pair data in a separate server.
the server still uses a cookie, but it only contains the session id.
the memory cache server uses that session id to find the session data.
Advantages

#quick lookups.
decoupled from the api server.
a single memory cache server can serve may applications.
automatically remove old session data.
Downsides

#another server to set up and manage.
extra complexity for small applications.
hard to reset the cache without losing all session data.
Storing session data in a database
similar to storing data in a memory store.
the session cookie still holds the session id.
the server uses the session id to find the session data in the database.
retrieving data from a database is slower than reading from a memory cache.
causes chatter between the server and the database.
need to manage/remove old sessions manually or the database will be filled with unused session data. Most libraries now manage this for you.

#example
const session = require('express-session');

// configure express-session middleware
server.use(
  session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: true, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);

#express-session uses cookies for session management.

#The resave option forces the session to be saved back to the session store, even if the session was never modified during the request.

#The saveUninitialized flag, forces a session that is “uninitialized” to be saved to the store. A session is uninitialized when it is new but not modified. Choosing false is useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie.

#Now we can store session data in one route handler and read it in another. (including user data)
app.get('/', (req, res) => {
  req.session.name = 'Frodo';
  res.send('got it');
});

app.get('/greet', (req, res) => {
  const name = req.session.name;
  res.send(`hello ${req.session.name}`);
});

express-session uses in-memory storage by default.

Note how we generalize the session cookie’s name, to make it harder for attackers to know which library we’re using to manage our sessions. This is akin to using helmet to hide the X-Powered-By=Express header.

#overview
Restricting access to endpoints is a two step process:

we write middleware to check that there is a session for the client.
we place that middleware in front of the endpoints we want to restrict.

#restricted middleware
function protected(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
}
#Then we add that middleware to the endpoints we’d like to protect

server.get('/api/users', protected, (req, res) => {
  db('users')
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

#JWT
A JWT is a string that has three parts separated by a period (.). Those are:

The header.
The payload.
The signature.

#header
#The header will contain the algorithm with the token type. 
#Typically the header for a JWT will look like this.
{
  "alg": "HS256",
  "typ": "JWT"
}

#payload
The payload includes claims (fancy name for things like permissions for the user) information or any other data we’d like to store in the token, which is most likely a user id. There are specific claims defined in the JWT standard, and you can also add your own properties to this object.

{
  "sub": "1234567890", // standard - subject, normally the user id
  "name": "John Doe", // custom property
  "iat": 1516239022 // standard - The Date the token was issued, expressed in seconds since epoch.
}

#Signature
To create a signature, we must create a string by base64 encoding the header and payload together, and then signing it with a secret.

Combining all three parts, you will get a JWT that looks like this:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

#let’s produce and send a token on successful login.

add jsonwebtoken to the project and require it into auth-router.js.
change the /login endpoint inside the auth-router.js to produce and send the token.

// ./auth/auth-router.js

const jwt = require('jsonwebtoken'); // installed this library

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user); // new line

        // the server needs to return the token to the client
        // this doesn't happen automatically like it happens with cookies
        res.status(200).json({
          message: `Welcome ${user.username}!, have a token...`,
          token, // attach the token as part of the response
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
    // ...otherData
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}

#add the ./config/secrets.js file to hold the jwtSecret
// the secrets will be safely stored in an environment variable, these are placeholders for development
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'add a third table for many to many',
};

#require secrets.js into auth-router.js: const secrets = require('../config/secrets.js');

login with the student/hired user and show the token
review the steps taken one more time.
We have a server that can produce and send JWTs on successful login.

#CLIENT SIDE AUTH
-When a client application needs to authenticate with a Web API that uses tokens instead of sessions and cookies, the client is responsible for holding on to the token and sending it on every request.

-save JSON Web Token to local storage on login
-remove JSON Web Token from local storage on logout

After successful login, the server will send the token as part of the response data.

Change the handleSubmit event handler to use the browser’s API to store the token in local storage:
handleSubmit = event => {
  event.preventDefault();

  // point this to the login endpoint in your API
  const endpoint = 'http://localhost:5000/api/auth/login';

  axios
    .post(endpoint, this.state)
    .then(res => {
      // store the token to local storage
      localStorage.setItem('jwt', res.data.token); // store token to local storage
    })
    .catch(error => console.error(error));
  // the client could show a nice toast with the error
};

#The line that reads: localStorage.setItem('jwt', res.data.token); saves the token using jwt as the key and the token as the value.

#LOGOUT 

// we can use withRouter to have React Router pass the required props like history down to our component
import { Route, NavLink, withRouter } from 'react-router-dom';

logout = () => {
  localStorage.removeItem('jwt'); // removes the token from local storage

  this.props.history.push('/login');
};

export default withRouter(App);