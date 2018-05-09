import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import { RouteComponentProps } from 'react-router-dom';
import { MenuRouterProps } from '../interfaces/MenuRouterProps';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import StarIcon from '@material-ui/icons/Star';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import authenticationService from '../services/AuthenticationService';


const drawerWidth = 200;

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

    constructor(props: MenuRouterProps<{}>) {
        super(props);
    }

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
        const isAdmin = authenticationService.userProfile.roles
            && authenticationService.userProfile.roles.indexOf("Administrator") !== -1;
        return (
            <Drawer variant="permanent" style={drawerPaper}>
                <div style={emptyHeaderPlaceholder}></div>
                <List style={drawer}>{this.mainItems}</List>
                <Divider />
                {
                    isAdmin?
                    (<React.Fragment>
                        <List style={drawer}>{this.adminItems}</List>
                        <Divider />
                        </React.Fragment>
                    ): null
                        
               }
            </Drawer>

        );
    }
}
