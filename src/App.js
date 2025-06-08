import './App.css';
import { Header, AuthProvider, useAuth } from './components';
import { Home, Guide, Profile, TestPage, TestsList, TestResult } from './pages';
import { Route, Switch } from 'wouter';
import WebApp from '@twa-dev/sdk';


export default function App() {
  WebApp.ready();
  WebApp.expand();
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/guide/:id" component={Guide} />
          <Route path="/profile" component={Profile} />
          <Route path="/test" component={TestsList} />
          <Route path="/test/:id" component={TestPage} />
          <Route path="/testRes" component={TestResult} />
        </Switch>
      </div>
    </AuthProvider>
  );
}