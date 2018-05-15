import * as React from "react";
import { Dialog, DialogTitle, FormControl, InputLabel, Select, MenuItem, Input, FormHelperText, TextField, Button, Checkbox } from "material-ui";
import { UserEditModel } from "../models/UserEditModel";
import { User } from "../models/User";

import { toast } from 'react-toastify';
import usersService from "../services/UsersService";

interface UserEditProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

interface UserEditState {
    editModel: UserEditModel;
}

const dialogStyle: React.CSSProperties = {
    fontSize: '2rem'
}

const dialogTitleStyle: React.CSSProperties = {
    paddingLeft: '4rem',
    paddingTop: '2rem'
}

const dialogContentStyle: React.CSSProperties = {
    padding: '0 4rem 2rem 4rem',
    width: '50rem',
    display: 'flex'
}

const permissionStyle: React.CSSProperties = {
    flex: 1
}

export default class UserEditDialog extends React.Component<UserEditProps, UserEditState> {

    constructor(props: UserEditProps) {
        super(props);
        
        this.state = {
            editModel: { ...props.user } as UserEditModel
        }; 
    }

    componentWillReceiveProps(props: UserEditProps) {  
        this.setState({
            editModel: { ...props.user } as UserEditModel
        });
    }

    private saveUserEditOptions = async () => {
        try {
            await usersService.update(this.state.editModel);
            toast.info(`Updated user '${this.props.user.userName}'`)
        } catch {
            toast.error("Could not edit user");
        }
    }

    private handleAllowQuotaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            editModel: { ...this.state.editModel, ...{
                quotaAllowed: event.target.checked ? 0 : null
            }}
        });
    }

    private handleQuotaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            editModel: { ...this.state.editModel, ...{
                quotaAllowed: Number(event.target.value)
            }}
        });
    }

    render() {
        const doLimit = this.state.editModel.quotaAllowed !== undefined
            && this.state.editModel.quotaAllowed !== null;

        return (
            <Dialog open={this.props.isOpen} style={dialogStyle} onClose={this.props.onClose}>
                <DialogTitle style={dialogTitleStyle}>Edit user '{this.props.user.userName}'</DialogTitle>
                <div style={dialogContentStyle}>
                    <FormControl className="form-checkbox">
                        <InputLabel htmlFor="limit-quota" shrink>Limit Quota</InputLabel>
                        <Checkbox
                            id="limit-quota"
                            onChange={this.handleAllowQuotaChange}
                            checked={doLimit}
                            defaultChecked={doLimit}
                        >
                        </Checkbox>
                    </FormControl>
                </div>
                <div style={dialogContentStyle}>
                    <FormControl style={permissionStyle} disabled={!doLimit}>
                        <InputLabel htmlFor="quota-limit" shrink>Quota</InputLabel>
                        <Input name="allowedQuota" id="quota-limit"
                            type="numeric"
                            value={this.state.editModel.quotaAllowed || ''}
                            onChange={this.handleQuotaChange}
                        >
                        </Input>
                        <FormHelperText>Quota Limit</FormHelperText>
                    </FormControl>
                </div>
                <div style={dialogContentStyle}>
                    <div style={{flex: 10}}></div>
                    <FormControl >
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.saveUserEditOptions}>
                            Save
                    </Button>
                    </FormControl>
                </div>
            </Dialog>
        );
    }
}
