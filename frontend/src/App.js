import './App.css';
import ChatPage from './pages/ChatPage';
// import { Button, ButtonGroup, HStack } from "@chakra-ui/react"
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/chats" component={ChatPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
