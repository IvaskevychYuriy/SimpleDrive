import * as React from 'react';
import Hidden from 'material-ui/Hidden';
import { Route } from 'react-router-dom';
import { Menu } from './Menu';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface LayoutProps {
    children?: React.ReactNode;
}

const root: React.CSSProperties = {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
};

const bodyDiv: React.CSSProperties = {
    flexGrow: 1,
    minWidth: 0, // So the Typography noWrap works
    marginTop: 80,
    display: 'flex',
    justifyContent: 'center'
};

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return (
            <React.Fragment>
                <div style={root}>
                    <Route component={Menu} />
                    <div style={bodyDiv}>
                        {this.props.children}
                    </div>
                </div>

                <ToastContainer
                    position="bottom-center"
                    autoClose={2000}
                    hideProgressBar
                    closeOnClick
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover />
            </React.Fragment>
        );
    }
}
