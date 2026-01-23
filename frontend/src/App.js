import './App.css';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import { Switch, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App">
      <Toaster />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/chats" component={ChatPage} />
      </Switch>
    </div>
  );
}

export default App;