import './App.css';
import { Header, } from './components';
import { Home, Guide } from './pages';
import { Route, Switch, Link } from "wouter";
import { supabase } from './supabaseClient';
import WebApp from '@twa-dev/sdk';

function App() {
  WebApp.ready();
  WebApp.expand();
  return (
    <div className="App">
      <Header></Header>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/guide" component={Guide} />
      </Switch>
    </div>
  );
}

export default App;
