import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import './styles/app.css'
import './styles/w3.css'
import {Enter} from'./components/enter'
import {Admin} from "./components/admin";
import {Partner} from "./components/partner";

class NotFound extends Component {
  render() {
      return <h1>not found</h1>
  }
}

class App extends Component {
  render() {
    return(
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Enter}/>
            <Route path="/admin" component={Admin}/>
            <Route path="/partner" component={Partner}/>
            <Route component={NotFound}/>
          </Switch>
        </BrowserRouter>
    )
  }
}

export default App;
