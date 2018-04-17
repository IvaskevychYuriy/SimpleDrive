import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Login from './components/Login';
import FileGrid from './components/FileGrid';

export const routes = <Layout>
    <Route exact path='/' component={ FileGrid } />
    <Route exact path='/login' component={ Login } />
    <Route exact path='/register' component={ Login } />
</Layout>;
