import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import Login from './components/Login';
import FileShare from './components/FileShare';
import FileGrid from './components/FileGrid';
import UsersGrid from './components/UsersGrid';
import SummaryGrid from './components/SummaryGrid';
import { GridTypes } from './models/enumerations/GridTypes';

export const routes = <Layout>
    <Route exact path="/" render={(props) => <FileGrid gridType={GridTypes.Public} {...props} />} />

    <Route exact path='/share/:fileId/:permission' component={FileShare} />

    <Route exact path='/files' render={(props) => <FileGrid gridType={GridTypes.Personal} canUploadNew {...props} />} />
    <Route exact path='/allfiles' render={(props) => <FileGrid gridType={GridTypes.All} {...props} />} />
    <Route exact path='/shared' render={(props) => <FileGrid gridType={GridTypes.Shared} {...props} />} />
    <Route exact path='/public' render={(props) => <FileGrid gridType={GridTypes.Public} {...props} />} />

    <Route exact path='/users' render={(props) => <UsersGrid {...props} />} />
    <Route exact path='/summary' render={(props) => <SummaryGrid {...props} />} />

    <Route exact path='/login' component={Login} />
    <Route exact path='/register' component={Login} />
</Layout>;
