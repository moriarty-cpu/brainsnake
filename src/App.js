import './App.css';
import { Header, } from './components';
import { Home } from './pages';
import { Route, Switch } from "wouter";
import { supabase } from './supabaseClient';

function App() {
  return (
    <div className="App">
        <Header></Header>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
    </div>
  );
}

export default App;
