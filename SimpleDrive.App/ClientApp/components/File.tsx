import * as React from 'react';
import FileModel from '../models/File';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import FileIcon from 'mdi-react/FileIcon';

export interface FileProps {
    file: FileModel,
    onDeleted: (file: FileModel) => Promise<void>
}

export interface FileState {
}

const fileStyle: React.CSSProperties = {
    width: '100px',
    height: '120px',
    backgroundColor: 'red',
};

export default class File extends React.Component<FileProps, FileState> {
    constructor(props: FileProps) {
        super(props);

        this.state = {
        }
    }

    private onDeleteClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
        await this.props.onDeleted(this.props.file);
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
                <CardActions>
                    <Button size="small" href={this.props.file.uri}>Download</Button>
                    <Button size="small" onClick={this.onDeleteClicked}>Delete</Button>
                </CardActions>
            </Card>
        );
    }
}
