import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import UploadIcon from 'mdi-react/UploadIcon';
import authenticationService from '../services/AuthenticationService';
import fileService from '../services/FileService';

const uploadButtonStyle: React.CSSProperties = {
    marginLeft: -12,
    marginRight: 20,
};

const labelStyle: React.CSSProperties = {
    display: 'none'
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
    uploadPercentCompleted: number;
}

export class NavMenu extends React.Component<{}, NavMenuState> {
    private inputFileRef: HTMLInputElement;

    constructor(props: {}) {
        super(props);

        this.state = {
            isLoggedIn: authenticationService.isLoggedIn,
            uploadPercentCompleted: 0
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

    onUploadProgressChanged = (percentCompleted: number) => {
        this.setState({
            uploadPercentCompleted: percentCompleted
        });
    }

    onFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.currentTarget;
        const { files } = fileInput;

        if (files.length > 0) {
            await fileService.upload(files, this.onUploadProgressChanged);
        }
    }

    public render() {
        return (
            <AppBar>
                <Toolbar>
                    <label style={labelStyle}>
                        <input type="file" ref={ref => this.inputFileRef = ref} onChange={this.onFileChanged} />
                    </label>
                    <IconButton style={uploadButtonStyle} onClick={e => this.inputFileRef.click()} color="inherit">
                        <UploadIcon />
                    </IconButton>
                    <Typography style={flex} variant="title" color="inherit">
                        <Link style={link} to="/">SimpleDrive</Link>
                    </Typography>
                    <LinearProgress variant="query" value={this.state.uploadPercentCompleted} />
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
