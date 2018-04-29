import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import Login from './components/Login';
import SharedFilesPage from './components/SharedFilesPage';
import PersonalFilesPage from './components/PersonalFilesPage';

export const routes = <Layout>
    <Route exact path="/" component={ PersonalFilesPage } />
    <Route exact path='/files' component={ PersonalFilesPage } />
    <Route exact path='/shared' component={ SharedFilesPage } />
    <Route exact path='/login' component={ Login } />
    <Route exact path='/register' component={ Login } />
</Layout>;
