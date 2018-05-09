import * as React from "react";
import { Dialog, DialogTitle, FormControl, InputLabel, Select, MenuItem, Input, FormHelperText, TextField, Button, Checkbox } from "material-ui";
import { PermissionTypes } from "../models/enumerations/PermissionTypes";
import { ResourcePermission } from "../models/ResourcePermission";
import sharingService from "../services/SharingService";
import File from "../models/File";
import { FileShareModel } from "../models/FileShareModel";
import { toast } from 'react-toastify';

interface FileShareDialogProps {
    isOpen: boolean;
    file: File;
    onClose: () => void
}

interface FileShareDialogState {
    shareLink: string;
    permission: PermissionTypes;
    permissionData: PermissionData;
    isPubliclyVisible: boolean;
}

interface PermissionData {
    value: PermissionTypes;
    text: string;
    description: string;
}

const permissionsData: PermissionData[] = [{
    value: PermissionTypes.Read,
    text: 'Read',
    description: 'Allows users to view and download files'
},{
    value: PermissionTypes.Write,
    text: 'Write',
    description: 'Also allows to edit files'
},{
    value: PermissionTypes.Full,
    text: 'Full',
    description: 'Also allows to delete files'
}];

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

const linkStyle: React.CSSProperties = {
    flex: 3,
    marginLeft: '0.5em'
}

export default class FileShareDialog extends React.Component<FileShareDialogProps, FileShareDialogState> {

    constructor(props: FileShareDialogProps) {
        super(props);
        
        this.state = {
            shareLink: '',
            permission: 0,
            permissionData: permissionsData[0],
            isPubliclyVisible: props.file.isPubliclyVisible
        }; 
    }

    async componentDidMount() {
        this.setState(await this.createState(PermissionTypes.Read));
    }

    private handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const intId = Number(event.target.value);
        this.setState(await this.createState(intId));
    }
    
    private handleFileVisibilityChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            isPubliclyVisible: event.target.checked
        });
    }

    private async createState(permissionId: PermissionTypes): Promise<FileShareDialogState> {
        if (this.props.isOpen) {
            return {
                shareLink: await sharingService.getSharingLink(this.props.file, permissionId),
                permission: permissionId,
                permissionData: permissionsData.find(p => p.value == permissionId),
                isPubliclyVisible: this.state.isPubliclyVisible
            };
        } else {
            return this.state;
        }
    }

    private saveFileShareOptions = async () => {
        const model: FileShareModel = {
            fileId: this.props.file.id,
            isPubliclyVisible: this.state.isPubliclyVisible
        };

        try {
            await sharingService.saveShareOptions(model);
            toast.info(`Successfully made a file ${this.state.isPubliclyVisible ? '' : 'not '}public!`)
        } catch {
            toast.error("Could not update sharing options", {autoClose: 5000});
        }
    }

    render() {  
        const test: any = {};
        if (this.state.isPubliclyVisible) {
            test['checked'] = 'checked';
        }

        return (
            <Dialog open={this.props.isOpen} style={dialogStyle} onClose={this.props.onClose}>
                <DialogTitle style={dialogTitleStyle}>Generate Share Link</DialogTitle>
                <div style={dialogContentStyle}>
                    <FormControl style={permissionStyle}>
                        <InputLabel htmlFor="permission-type">Permission</InputLabel>
                        <Select
                            value={this.state.permission}
                            onChange={this.handleChange}
                            input={<Input name="permissionId" id="permission-type" />}>
                            { permissionsData.map(p => <MenuItem key={p.value} value={p.value}>{p.text}</MenuItem>) }
                        </Select>
                        <FormHelperText>{this.state.permissionData.description}</FormHelperText>
                    </FormControl>

                    <TextField
                        id="share-link"
                        label="Share Link"
                        value={this.state.shareLink}
                        style={linkStyle}
                        disabled>
                    </TextField>
                </div>
                <div style={dialogContentStyle}>
                    <FormControl >
                        <InputLabel htmlFor="public-visibility" shrink>Public</InputLabel>
                        <Checkbox
                            id="public-visibility"
                            onChange={this.handleFileVisibilityChange}
                            checked={this.state.isPubliclyVisible}>
                        </Checkbox>
                    </FormControl>
                </div>
                <div style={dialogContentStyle}>
                    <div style={{flex: 10}}></div>
                    <FormControl >
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.saveFileShareOptions}>
                            Save
                    </Button>
                    </FormControl>
                </div>
            </Dialog>
        );
    }
}
