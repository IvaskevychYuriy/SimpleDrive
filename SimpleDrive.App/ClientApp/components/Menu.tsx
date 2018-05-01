import { RouteComponentProps } from "react-router";
import * as React from "react";
import authenticationService from '../services/AuthenticationService';
import { NavMenu } from "../components/NavMenu";
import { SideMenu } from "../components/SideMenu";
import { MenuRouterProps } from "../interfaces/MenuRouterProps";

interface MenuState {
    isLoggedIn: boolean;
}

export class Menu extends React.Component<RouteComponentProps<{}>, MenuState> {

    constructor(props: RouteComponentProps<{}>) {
        super(props);

        this.state = {
            isLoggedIn: authenticationService.isLoggedIn
        };
    }

    render() {
        const props: any = { isLoggedIn: this.state.isLoggedIn, ...this.props };

        return (
            <>
                <NavMenu {...props} />
                { this.state.isLoggedIn ? <SideMenu {...props} /> : null }
            </>
        );
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
}