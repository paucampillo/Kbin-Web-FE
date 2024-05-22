import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CommentList from './components/Comments/CommentList';
import MagazineList from './components/Magazines/MagazineList';
import ThreadList from './components/Threads/ThreadList';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/comments" component={CommentList} />
          <Route path="/magazines" component={MagazineList} />
          <Route path="/threads" component={ThreadList} />
          <Route path="/profile/edit" component={EditProfile} />
          <Route path="/profile/:userId" component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
