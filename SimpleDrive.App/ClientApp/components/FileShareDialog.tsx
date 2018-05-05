import * as React from "react";
import { Dialog, DialogTitle, List, FormControl, InputLabel, Select, MenuItem, Input, FormHelperText, TextField, Tooltip, IconButton, Button } from "material-ui";
import { PermissionTypes } from "../models/enumerations/PermissionTypes";
import { ResourcePermission } from "../models/ResourcePermission";
import fileService from "../services/FileService";
import File from "../models/File";
import ContentCopyIcon from "mdi-react/ContentCopyIcon";

interface FileShareDialogProps {
    isOpen: boolean;
    file: File;
    onClose: () => void
}

interface FileShareDialogState {
    shareLink: string;
    permission: PermissionTypes;
    permissionData: PermissionData;
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
        
        this.state = this.createState(PermissionTypes.Read);
    }

    private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const intId = Number(event.target.value);
        this.setState(this.createState(intId));
    }

    private createState(permissionId: PermissionTypes): FileShareDialogState {
        return {
            shareLink: fileService.getSharingLink(this.props.file, permissionId),
            permission: permissionId,
            permissionData: permissionsData.find(p => p.value == permissionId)
        };
    }

    private copyShareLink = () => {
        document.execCommand('copy');
    }

    render() {  
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
            </Dialog>
        );
    }
}