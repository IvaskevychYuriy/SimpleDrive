import { RouteComponentProps } from "react-router";

export interface MenuRouterProps<P> extends RouteComponentProps<P> {
    isLoggedIn: boolean;
}