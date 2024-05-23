import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CommentList from './components/Comments/CommentList';
import MagazineList from './components/Magazines/MagazineList';
import ThreadList from './components/Threads/ThreadList';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import MainLayout from './components/Layouts/MainLayout'
import MagazineForm from './components/Magazines/MagazineForm'; // Ajusta la ruta según tu estructura de proyecto

import './App.css';

function App() {
  document.body.classList.add('theme--dark')
  document.head.classList.add('header')
  return (
    
    <Router>
      
      <MainLayout>
      <div className="App">
        
        <Switch>
          <Route path="/magazines/new" component={MagazineForm} />
          <Route path="/comments" component={CommentList} />
          <Route path="/magazines" component={MagazineList} />
          <Route path="/threads" component={ThreadList} />
          <Route path="/profile/edit" component={EditProfile} />
          <Route path="/profile/:userId" component={Profile} />
          
        </Switch>
      </div>
      </MainLayout>      
    </Router>
  );
}

export default App;
