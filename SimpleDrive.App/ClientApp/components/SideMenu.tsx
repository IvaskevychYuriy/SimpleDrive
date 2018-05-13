import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { MenuRouterProps } from '../interfaces/MenuRouterProps';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSharedIcon from '@material-ui/icons/FolderShared';

import authenticationService from '../services/AuthenticationService';
import RoleNames from '../constants/RoleNames';
import { UserProfile } from '../models/UserProfile';

const drawerWidth = 220;

const drawerPaper: React.CSSProperties = {
    position: 'relative',
    width: drawerWidth,
    zIndex: 9
};

const drawer: React.CSSProperties = {
    width: drawerWidth
}

const emptyHeaderPlaceholder: React.CSSProperties = {
    minHeight: 64 - 8
};

interface SideMenuState {
}  

export class SideMenu extends React.Component<MenuRouterProps<{}>, SideMenuState> {

    private guestItems = (
        <div>
            <ListItem button onClick={() => this.props.history.push('/public')}>
                <ListItemIcon>
                    <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="Public Documents" />
            </ListItem>
        </div>
    )

    private mainItems = (
        <div>
            <ListItem button onClick={() => this.props.history.push('/files')}>
                <ListItemIcon>
                    <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="My Documents" />
            </ListItem>
            <ListItem button onClick={() => this.props.history.push('/shared')}>
                <ListItemIcon>
                    <FolderSharedIcon />
                </ListItemIcon>
                <ListItemText primary="Shared with me" />
            </ListItem>
        </div>
    );

    private adminItems = (
        <div>
            <ListItem button onClick={() => this.props.history.push('/allfiles')}>
                <ListItemIcon>
                    <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="All Documents" />
            </ListItem>
        </div>
    );

    render() {
        const roles = (authenticationService.userProfile || new UserProfile()).roles || [];
        const isUser = roles && roles.indexOf(RoleNames.userRole) !== -1;
        const isAdmin = roles && roles.indexOf(RoleNames.adminRole) !== -1;

        return (
            <Drawer variant="permanent" style={drawerPaper}>
                <div style={emptyHeaderPlaceholder}></div>

                <List style={drawer}>{this.guestItems}</List>
                <Divider />

                {
                    isUser 
                    ? ( <React.Fragment>
                            <List style={drawer}>{this.mainItems}</List>
                            <Divider />
                        </React.Fragment>)
                    : null
                }

                {
                    isAdmin 
                    ? ( <React.Fragment>
                            <List style={drawer}>{this.adminItems}</List>
                            <Divider />
                        </React.Fragment>)
                    : null
                }
            </Drawer>
        );
    }
}
