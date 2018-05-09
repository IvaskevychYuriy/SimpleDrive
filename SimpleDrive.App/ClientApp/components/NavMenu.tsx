import * as React from 'react';
import { Link, NavLink, RouteComponentProps } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import authenticationService from '../services/AuthenticationService';
import { MenuRouterProps } from '../interfaces/MenuRouterProps';

const flex: React.CSSProperties = {
    flex: 1
};

const link: React.CSSProperties = {
    textDecoration: 'none',
    color: 'inherit'
};

const appBar: React.CSSProperties = {
    zIndex: 10,
};

interface NavMenuState {
}

export class NavMenu extends React.Component<MenuRouterProps<{}>, NavMenuState> {

    constructor(props: MenuRouterProps<{}>) {
        super(props);
    }

    onLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        await authenticationService.logout();
    }

    public render() {
        return (
            <AppBar position="absolute" style={appBar} >
                <Toolbar>
                    <Typography style={flex} variant="title" color="inherit">
                        <Link style={link} to="/">SimpleDrive</Link>
                    </Typography>                    
                    {
                        this.props.isLoggedIn ?
                            (
                                <Button color="inherit" onClick={this.onLogout} >
                                    Logout
                                </Button>
                            ) : (
                                <React.Fragment>
                                    <Button onClick={() => this.props.history.push('/login')} color="inherit">
                                        Login
                                    </Button>
                                    <Button onClick={() => this.props.history.push('/register')} color="inherit">
                                        Register
                                    </Button>
                                </React.Fragment>
                            )
                    }
                </Toolbar>
            </AppBar>
        );
    }
}
