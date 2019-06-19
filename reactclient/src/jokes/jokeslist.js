import React from 'react';
import { Grid, Paper, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import './jokes.css';
import { withStyles} from '@material-ui/core/styles';

import axios from 'axios';
import requiresAuth from '../auth/requiresAuth';

// const styles = theme => ({
//  cardMargin: {    
//    margin: '1rem',   
//   },
// });

class Jokes extends React.Component   {
  constructor(props) {
    super(props);

    this.state = {
       jokes: []
    };
    
  }


render() {

    return (
     
        <div style={{ marginTop: 20, padding: 30 }}>
           <h2>Welcome to Dad Jokes</h2>
           <div >
        <Grid   container spacing={8}  justify="center">
       
 
            {this.state.jokes.map((u, index)=> (
                  <Grid item key={u.id}           
                  direction="row"
                  justify="center"
                  alignItems="center"
                  md={3}
                  margin='1rem'
                >
             
                       <Card 
                       >
              <CardActionArea>
                <CardMedia
               
                  component="img"
                  alt="Contemplative Reptile"
                  height="140"
                  image={require('../img/dad.jpg')}
                  title="Dad Joke"
                />
               <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                   Joke # {index}
                  </Typography>
                  <Typography component="p">{u.joke}</Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Share
                </Button>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
      
        ))}
      </Grid>
      </div>
    </div>
  );
}

componentDidMount () {
    const endpoint = '/Jokes';
    //const endpoint = 'http://localhost:5000/api/users';

    //     MUST MUST MUST GRAB THE TOKEN FROM MEMORY, LOCAL STORAGE, (WHEREVER STORED)
    // AND MUST ASSEMBLE THE HEADERS LIKE BELOW FOR EACH CLIENT 
   // const token = localStorage.getItem('jwt');




 //   const requestConfig = {
 //       headers: {
    //         authorization: token,
    //     },
    // };
    axios
   // .get(endpoint, requestConfig)
    .get(endpoint)
    .then(res => {
       // client passes back token each time
       
        this.setState({jokes: res.data});
    })
    .catch(err=> console.error(err));
}
}

 export default requiresAuth(Jokes);



// import React from 'react';
// import axios from 'axios';
// import requiresAuth from '../auth/requiresAuth';


// class Jokes extends React.Component {
//     state = {
//        jokes: []
//     };


// render() {
//     return (
//         <div>
//         <h2>Welcome to Dad Jokes</h2>
//         <ul>
//             {this.state.jokes.map(u=> (
//                 <li key={u.id}>{u.joke}</li>
//             ) )}
//             </ul>
//       </div>
//     );
// }

// componentDidMount () {
//     const endpoint = '/Jokes';
    // const endpoint = 'http://localhost:5000/api/users';

        //MUST MUST MUST GRAB THE TOKEN FROM MEMORY, LOCAL STORAGE, (WHEREVER STORED)
    //AND MUST ASSEMBLE THE HEADERS LIKE BELOW FOR EACH CLIENT 
    // const token = localStorage.getItem('jwt');




    // const requestConfig = {
    //     headers: {
    //         authorization: token,
    //     },
    // };
    // axios
    // .get(endpoint, requestConfig)
    // .get(endpoint)
    // .then(res => {
        //client passes back token each time
       
//         this.setState({jokes: res.data});
//     })
//     .catch(err=> console.error(err));
// }
// }

// export default requiresAuth(Jokes);

//what if we have 20 more users that need tokens to be sent 
//Authenticated is whats actually is rendered if using requiresAuth HOC function
