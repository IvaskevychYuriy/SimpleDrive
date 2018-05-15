import * as React from "react";
import { User } from "../models/User";
import UserEditDialog from "./UserEditDialog";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip } from "material-ui";
import { TableEditIcon } from "mdi-react";
import DeleteIcon from "mdi-react/DeleteIcon";

import usersService from "../services/UsersService";
import { toast } from 'react-toastify';

const rootStyle: React.CSSProperties = {
    overflowX: 'auto',
    width: '90%'
};

interface UsersGridProps {
}

interface UsersGridState {
    users: User[];
    currentEditingUser: User;
    editingEnabled: boolean;
}

export default class UsersGrid extends React.Component<UsersGridProps, UsersGridState> {
    constructor(props: UsersGridProps) {
        super(props);

        this.state = {
            users: [],
            currentEditingUser: {} as User,
            editingEnabled: false
        };
    }

    async componentDidMount() {
        this.setState({
            users: await usersService.get()
        });
    }

    private handleDelete = async (user: User) => {
        try {
            await usersService.delete(user.id);
            toast.success(`User '${user.userName}' was deleted`);
            this.setState({
                users: this.state.users.filter(u => u.id !== user.id)
            });
        } catch {
            toast.error(`Couldn't delete user '${user.userName}'`);
        }
    }

    private editUser = (user: User) => {
        this.setState({
            currentEditingUser: user,
            editingEnabled: true
        });
    }

    private onEditClose = async () => {
        this.setState({
            users: await usersService.get(),
            currentEditingUser: {} as User,
            editingEnabled: false
        });
    }
    
    private actions = (user: User) => (
        <div>
            <Tooltip title="Delete">
                <IconButton onClick={async () => await this.handleDelete(user)}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
                <IconButton onClick={() => this.editUser(user)}>
                    <TableEditIcon />
                </IconButton>
            </Tooltip>
        </div>
    );

    render() {
        return (
            <Paper style={rootStyle}>
                <Table className="ordinalFontRoot">
                    <TableHead className="table-head-bold-font">
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell numeric>Quota</TableCell>
                            <TableCell numeric>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { this.state.users.map(u => {
                            return (
                                <TableRow key={u.id}>
                                    <TableCell>{u.userName}</TableCell>
                                    <TableCell numeric>{u.quotaAllowed}</TableCell>
                                    <TableCell numeric>{this.actions(u)}</TableCell>
                                </TableRow>
                            );
                        }) }
                    </TableBody>
                </Table>
                
                <UserEditDialog isOpen={this.state.editingEnabled} user={this.state.currentEditingUser} onClose={this.onEditClose}></UserEditDialog>
            </Paper>
        );
    }
}