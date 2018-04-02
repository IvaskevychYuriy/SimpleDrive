import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

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

export class NavMenu extends React.Component<{}, {}> {
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
                    <Button color="inherit">
                        <Link style={link} to="/login">Login</Link>
                    </Button>
                    <Button color="inherit">
                        <Link style={link} to="/register">Register</Link>
                    </Button>
                </Toolbar>
            </AppBar>
        );
    }
}
