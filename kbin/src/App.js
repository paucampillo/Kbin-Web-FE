import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CommentList from './components/Comments/CommentList';
import ReplyComment from './components/Threads/ReplyComment';
import EditCommentForm from './components/Threads/EditCommentForm';
import MagazineList from './components/Magazines/MagazineList';
import ThreadList from './components/Threads/ThreadList';
import SearchList from './components/Search/SearchList';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import MainLayout from './components/Layouts/MainLayout';
import SpecificThread from './components/Threads/SpecificThread';
import ThreadCreate from './components/Threads/ThreadCreate';
import MagazineForm from './components/Magazines/MagazineForm'; // Ajusta la ruta según tu estructura de proyecto
import MagazinePage from './components/Magazines/MagazinePage';
import LinkCreate from './components/Threads/LinkCreate';
import ThreadLinkEdit from './components/Threads/ThreadLinkEdit';
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
            <Route path="/thread/:thread_id/edit" component={ThreadLinkEdit} />
            <Route path="/thread/:thread_id" component={SpecificThread} />
            <Route path="/links/new" component={LinkCreate} />

            <Route path="/comments" component={CommentList} />
            <Route path="/reply_comment/:thread_id/:parent_comment_id/:parent_reply_id?" component={ReplyComment} />
            <Route path="/reply_edit/:thread_id/:comment_id" component={EditCommentForm} />

            <Route path="/magazines/new" component={MagazineForm} />
            <Route path="/magazines/:magazineId" component={MagazinePage} /> 
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
