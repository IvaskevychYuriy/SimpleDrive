import * as React from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import { RouteComponentProps } from 'react-router';
import Button from 'material-ui/Button';
import { withRouter } from 'react-router'

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

    onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
                <Grid container={true} direction="column">
                    <Grid item={true} xs={4}>
                        <FormControl>
                            <InputLabel required={true} htmlFor="email">Email</InputLabel>
                            <Input
                                id="email"
                                type="email"
                                value={this.state.email}
                                onChange={this.onEmailChange} 
                            />
                        </FormControl>
                    </Grid>
                        <Grid item={true} xs={4}>
                            <FormControl>
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
                        <FormControl>
                            <InputLabel disableAnimation={true} htmlFor="rememberMe"  >Remember me</InputLabel>
                            <Input 
                                id="rememberMe"
                                type="checkbox"
                                value={this.state.password}
                                onChange={this.onPasswordChange} 
                            />
                        </FormControl>
                    </Grid>
                    <Grid item={true} xs={4}>
                        <Button>
                            {
                                this.isLogin ? 'Login' : 'Register'
                            } 
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default withRouter(Login);
