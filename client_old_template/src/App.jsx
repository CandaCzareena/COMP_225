/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from '../MainRouter';
import Logo from './assets/Logo-Saul.png';

const App = () => {
  return (
    <>
    <div class = "logo">
      <img src={Logo} width="75" height="75" alt="" />
    </div>
    <Router>
      <MainRouter />
    </Router>
    </>
  );
};

export default App;