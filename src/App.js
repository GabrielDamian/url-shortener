import Processor from './Processor';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PageNotFound from './PageNotFound';
import RedirectCompoent from './RedirectComponent';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Processor}/>
        <Route exact path="/links/:id" component={RedirectCompoent}/>
        <Route exact path="/pagenotfound" component={PageNotFound} />
        <Route path="*" component={PageNotFound}/>
      </Switch> 
    </Router>

  );
}

export default App;
