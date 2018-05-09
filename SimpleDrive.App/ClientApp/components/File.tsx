import * as React from 'react';
import FileModel from '../models/File';
import FileShareDialog from '../components/FileShareDialog';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import DownloadIcon from 'mdi-react/DownloadIcon';
import DeleteIcon from 'mdi-react/DeleteIcon';
import ShareIcon from 'mdi-react/ShareIcon';
import FileIcon from 'mdi-react/FileIcon';
import Tooltip from 'material-ui/Tooltip';

import fileService from '../services/FileService';
import { PermissionTypes } from '../models/enumerations/PermissionTypes';

interface FileProps {
    file: FileModel,
    onDeleted?: (file: FileModel) => Promise<void>
}

interface FileState {
    openShareDialog: boolean;
}

const fileStyle: React.CSSProperties = {
    width: '100px',
    height: '120px',
    backgroundColor: 'red',
};

const actionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end'
};

export default class File extends React.Component<FileProps, FileState> {
    constructor(props: FileProps) {
        super(props);

        this.state = {
            openShareDialog: false
        };
    }

    private onDeleteClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (this.props.onDeleted && this.hasPermission(PermissionTypes.Full)) {
            await this.props.onDeleted(this.props.file);
        }
    }
    
    private onShareClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (this.hasPermission(PermissionTypes.Full)) {
            this.setState({
                openShareDialog: true
            });
        }
    }

    private closeShareDialog = () => {
        this.setState({
            openShareDialog: false
        });
    }

    private hasPermission(permission?: PermissionTypes) {
        return this.props.file.isOwner
            || (permission == null || this.props.file.permission >= permission)
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography color="textSecondary">
                        {this.props.file.name}
                    </Typography>
                    <IconButton>
                        <FileIcon/>
                    </IconButton>
                </CardContent>

                <CardActions style={actionsContainerStyle}>
                    {this.hasPermission(PermissionTypes.Full)
                        ? <Tooltip title="Delete">
                            <IconButton onClick={this.onDeleteClicked}>
                                <DeleteIcon />
                            </IconButton> 
                          </Tooltip>
                        : null}
                    
                    <Tooltip title="Download">
                        <IconButton href={this.props.file.uri}>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>

                    {this.hasPermission(PermissionTypes.Full)
                        ? <Tooltip title="Share">
                            <IconButton onClick={this.onShareClicked}>
                                <ShareIcon />
                            </IconButton> 
                          </Tooltip>
                        : null}
                </CardActions>

                <FileShareDialog isOpen={this.state.openShareDialog} file={this.props.file} onClose={this.closeShareDialog} />
            </Card>
        );
    }
}
