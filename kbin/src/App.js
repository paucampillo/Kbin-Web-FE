import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CommentList from './components/Comments/CommentList';
import MagazineList from './components/Magazines/MagazineList';
import ThreadList from './components/Threads/ThreadList';
import SearchList from './components/Search/SearchList';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import MainLayout from './components/Layouts/MainLayout';
import SpecificThread from './components/Threads/SpecificThread';
import ThreadCreate from './components/Threads/ThreadCreate';
import './App.css';

function App() {
  document.body.classList.add('theme--dark')
  document.head.classList.add('header')
  return (

    <Router>

      <MainLayout>
        <div className="App">

          <Switch>
            <Route exact path="/" component={ThreadList} />
            <Route exact path="/threads" component={ThreadList} />
            <Route path="/threads/new" component={ThreadCreate} />
            <Route path="/thread/:thread_id" component={SpecificThread} />
            <Route path="/comments" component={CommentList} />
            <Route path="/magazines" component={MagazineList} />
            <Route path="/search" component={SearchList} />
            <Route path="/profile/edit" component={EditProfile} />
            <Route path="/profile/:userId" component={Profile} />
          </Switch>

        </div>
      </MainLayout>
    </Router>
  );
}

export default App;
