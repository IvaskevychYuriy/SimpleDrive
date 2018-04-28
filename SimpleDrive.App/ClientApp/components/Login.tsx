import * as React from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import { RouteComponentProps } from 'react-router';
import Button from 'material-ui/Button';
import { withRouter } from 'react-router'
import authenticationService from '../services/AuthenticationService';
import { LoginInfo } from '../models/LoginModel';
import { UserProfile } from '../models/UserProfile';

export interface LoginProps {
}

export interface LoginState {
    email: string;
    password: string;
    rememberMe: boolean;
}

class Login extends React.Component<RouteComponentProps<LoginProps>, LoginState> {
    constructor(props: RouteComponentProps<LoginProps>) {
        super(props);

        this.state = {
            email: '',
            password: '',
            rememberMe: false
        };
    }

    get isLogin(): boolean {
        return this.props.location.pathname === '/login';
    }

    onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const model = new LoginInfo();
        Object.assign(model, this.state);

        try {
            if (this.isLogin) {
                await authenticationService.login(model);
            } else {
                await authenticationService.register(model);
            }

            this.props.history.push('/');
        }
        catch (e) {

        }
    }

    onEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            email: e.currentTarget.value
        })
    }

    onPasswordChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            password: e.currentTarget.value
        })
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Grid container={true} spacing={16} justify="center">
                    <Grid item={true} xs={12}>
                        <FormControl fullWidth={true}>
                            <InputLabel required={true} htmlFor="email">Email</InputLabel>
                            <Input
                                id="email"
                                type="email"
                                value={this.state.email}
                                onChange={this.onEmailChange} 
                            />
                        </FormControl>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <FormControl fullWidth={true}>
                            <InputLabel required={true} htmlFor="password">Password</InputLabel>
                            <Input 
                                id="password"
                                type="password"
                                value={this.state.password}
                                onChange={this.onPasswordChange} 
                            />
                        </FormControl>
                    </Grid>
                    <Grid item={true} xs={4}>
                        <Button fullWidth={true} type="submit" variant="raised"> {this.isLogin ? 'Login' : 'Register'} </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default withRouter(Login);
