import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import authenticationService from '../services/AuthenticationService';

const menuButtonStyle: React.CSSProperties = {
    marginLeft: -12,
    marginRight: 20,
};

const flex: React.CSSProperties = {
    flex: 1
};

const link: React.CSSProperties = {
    textDecoration: 'none',
    color: 'inherit'
};

interface NavMenuState {
    isLoggedIn: boolean;
}

export class NavMenu extends React.Component<{}, NavMenuState> {
    constructor(props: {}) {
        super(props);
        
        this.state = {
            isLoggedIn: authenticationService.isLoggedIn
        };
    }

    componentDidMount() {
        authenticationService.addCallback(this.onLoginStateChanged);
    }

    componentWillUnmount() {
        authenticationService.removeCallback(this.onLoginStateChanged);
    }

    onLoginStateChanged = (isLoggedIn: boolean) => {
        this.setState({
            isLoggedIn
        });
    }

    onLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        await authenticationService.logout();
    }

    public render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton style={menuButtonStyle} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography style={flex} variant="title" color="inherit">
                        <Link style={link} to="/">SimpleDrive</Link>
                    </Typography>
                    {
                        this.state.isLoggedIn ?
                            (
                                <Button color="inherit" onClick={this.onLogout} >
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Button color="inherit">
                                        <Link style={link} to="/login">Login</Link>
                                    </Button>
                                    <Button color="inherit">
                                        <Link style={link} to="/register">Register</Link>
                                    </Button>
                                </>
                            )
                    }
                </Toolbar>
            </AppBar>
        );
    }
}
