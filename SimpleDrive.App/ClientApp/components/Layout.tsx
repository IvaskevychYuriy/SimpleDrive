import * as React from 'react';
import { NavMenu } from './NavMenu';
import Hidden from 'material-ui/Hidden';
import { Route } from 'react-router-dom';

export interface LayoutProps {
    children?: React.ReactNode;
}

const bodyDiv: React.CSSProperties = {
    marginTop: '80px',
    display: 'flex',
    justifyContent: 'center'
};

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return (
            <div>
                <Route component={NavMenu} />
                <div style={bodyDiv}>
                    { this.props.children }
                </div>
            </div>
        );
    }
}
