import React from 'react';
import {Route, NavLink, withRouter} from 'react-router-dom';


function Logout(props) {
    //pass in props in App to use props in logout function below
  
  
    return (
      <>
     
   <main>
     <h1>Log Out Success. Come Back for More Jokes</h1>
     </main>
      </>
    );
  }
  //must import withRouter and Wrap App with it as HOC 
  //see below so that React Router props is extended to App
  // since 
  export default Logout;
  