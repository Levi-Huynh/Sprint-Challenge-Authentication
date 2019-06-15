import React from 'react';
import axios from 'axios';

class Signup extends React.Component {
    state={
        username: 'Jill',
        password: 'mellon'
    }
render() {
    return (
<>
<h2>Signup</h2>
<form onSubmit={this.submitForm}>
    <div>
        <label htmlFor="username"/>
        <input 
        id="username" 
    onChange={this.handleChange} 
    value={this.state.username} 
    type="text"/>
    </div>

    <div>
        <label htmlFor="password"/>
<input id="password" 
        onChange={this.handleChange} 
        value={this.state.password} 
        type="password"/>
        </div>
   
    <div><button type="submit">Sign-Up</button></div>
</form>
</>
    );
}

handleChange = event => {
    //graps from event.target see the callback you're passing is targe
     const {id, value} = event.target;
  this.setState({[id]: value})
}

submitForm = event => {
    event.preventDefault();
    const endpoint = 'http://localhost:3500/api/register';

    axios
    .post(endpoint, this.state)
    .then(res=>{
        console.log(res);
        localStorage.setItem('jwt', res.data.token);
        this.props.history.push('/Jokes');
    })
    .catch(err=>{
        console.error('Register Error', err);
    });
};

}

export default Signup; 