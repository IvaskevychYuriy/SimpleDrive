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
                <SideMenu {...props} />
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

        // if not logged in and not on public files page -> redirect there
        if (!isLoggedIn && this.props.location.pathname !== '/public') {
            this.props.history.push('/public');
        }
    }
}