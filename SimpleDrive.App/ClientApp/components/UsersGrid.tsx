import * as React from "react";
import { User } from "../models/User";
import UserEditDialog from "./UserEditDialog";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, FormHelperText, InputLabel, FormControl, Input, Button } from "material-ui";
import { TableEditIcon } from "mdi-react";
import DeleteIcon from "mdi-react/DeleteIcon";

import usersService from "../services/UsersService";
import { toast } from 'react-toastify';

const rootStyle: React.CSSProperties = {
    overflowX: 'auto',
    width: '90%'
};

const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    marginTop: 50
};

const spacerStyle: React.CSSProperties = {
    flex: 20
};

interface UsersGridProps {
}

interface UsersGridState {
    users: User[];
    currentEditingUser: User;
    editingEnabled: boolean;
    currentAgeFilter?: number;
    currentUsedSizeForAge?: number;
}

export default class UsersGrid extends React.Component<UsersGridProps, UsersGridState> {
    constructor(props: UsersGridProps) {
        super(props);

        this.state = {
            users: [],
            currentEditingUser: {} as User,
            editingEnabled: false,
            currentAgeFilter: null,
            currentUsedSizeForAge: null
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

    private hangleAgeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            currentAgeFilter: Number(event.target.value)
        });
    }

    private filterByAge = async () => {
        try {
            const sizeUsed = await usersService.usedSize(this.state.currentAgeFilter);
            this.setState({
                currentUsedSizeForAge: sizeUsed
            });
        } catch {
            toast.error("An error occured");
        }
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
                            <TableCell>Location</TableCell>
                            <TableCell numeric>Quota</TableCell>
                            <TableCell numeric>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.users.map(u => {
                            return (
                                <TableRow key={u.id}>
                                    <TableCell>{u.userName}</TableCell>
                                    <TableCell>{u.location}</TableCell>
                                    <TableCell numeric>{u.quotaAllowed}</TableCell>
                                    <TableCell numeric>{this.actions(u)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <div style={filterContainerStyle}>
                    <FormControl>
                        <InputLabel htmlFor="age" shrink>Age</InputLabel>
                        <Input name="age" id="age"
                            type="numeric"
                            value={this.state.currentAgeFilter || 0}
                            onChange={this.hangleAgeFilterChange}
                        >
                        </Input>
                        <FormHelperText>Registration Age</FormHelperText>
                    </FormControl>

                    <FormControl >
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.filterByAge}>
                            Filter
                        </Button>
                    </FormControl>
                    
                    <div style={spacerStyle}></div>

                    <div>
                        <p>{this.state.currentUsedSizeForAge}</p>
                    </div>
                </div>
                
                <UserEditDialog isOpen={this.state.editingEnabled} user={this.state.currentEditingUser} onClose={this.onEditClose}></UserEditDialog>
            </Paper>
        );
    }
}
