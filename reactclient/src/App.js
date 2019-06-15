import React from 'react';
import {Route, NavLink, withRouter} from 'react-router-dom';

import './App.css';
import Signin from './auth/signin';
import Signup from './auth/signup';
import Jokes from './jokes/jokeslist';
import Logout from './logout';

//must import withRouter and Wrap App with it as HOC 
//see below so that React Router props is extended to App
// since 

function App(props) {
  //pass in props in App to use props in logout function below
function logout() {
  localStorage.removeItem('jwt');
 props.history.push('/Logout');
}

  return (
    <>
      <header>
   <NavLink to ="/Signin">Login</NavLink>
   &nbsp; | &nbsp;
   <NavLink to ="/Signup">Sign-Up</NavLink>
   &nbsp; | &nbsp;
   <NavLink to ="/Jokes">Jokes</NavLink>
   &nbsp; | &nbsp;
   <button type="button" onClick={logout}>Log Out</button>
   </header>
    <main>
      <Route path='/Signin' component={Signin}></Route>
      <Route path='/Signup' component={Signup}></Route>
      <Route path='/Jokes' component={Jokes}></Route>
      <Route path='/Logout' component={Logout}></Route>
    </main>
    
    </>
  );
}
//must import withRouter and Wrap App with it as HOC 
//see below so that React Router props is extended to App
// since 
export default withRouter(App);
