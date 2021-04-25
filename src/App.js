import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/Register" component={Register}/>
          <Route exact path="/" render={() => (<Redirect to="/login"/>)} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
