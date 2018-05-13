import * as React from 'react';
import File from '../models/File';
import FileComponent from './File';
import { FileGridProps } from '../interfaces/FileGridProps';

import fileService from '../services/FileService';
import { Tooltip, IconButton, LinearProgress } from 'material-ui';
import { UploadIcon } from 'mdi-react';

const gridWrapperStyle: React.CSSProperties = {
    width: '100%',
    marginLeft: 10,
    marginRight: 10,    
};

const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gridTemplateRows: 'auto',
    gridGap: 10,
    marginTop: 10
};

const labelStyle: React.CSSProperties = {
    display: 'none'
};

const uploadBtnContainer: React.CSSProperties = {
    textAlign: 'center',
    minHeight: '5em'
};

interface FileGridState {
    files: File[];
    uploadPercentCompleted: number;
}

export default class FileGrid extends React.Component<FileGridProps, FileGridState> {
    private inputFileRef: HTMLInputElement;

    constructor(props: FileGridProps) {
        super(props);

        this.state = {
            files: [],
            uploadPercentCompleted: 0
        }
    }
    
    async componentDidMount() {
        await this.fetch();
    }

    private fetch = async () => {
        this.setState({
            files: await fileService.listFiles(this.props.gridType)
        });
    }
    
    private deleteFile = async (file: File) => {
        await fileService.delete(file.id);
        this.setState({
            files: this.state.files.filter(f => f.id !== file.id)
        });
    }
    
    private onUploadProgressChanged = (percentCompleted: number) => {
        if (percentCompleted <= 0 || percentCompleted >= 100) {
            percentCompleted = 0;
        }

        this.setState({
            uploadPercentCompleted: percentCompleted,
        });
    }

    private onFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.currentTarget;
        const { files } = fileInput;

        if (files.length > 0) {
            await fileService.upload(files, this.onUploadProgressChanged);
            await this.fetch();
        }
    }

    render() {
        const { files } = this.state;        
        const isInProgress = this.state.uploadPercentCompleted > 0;

        return (  
            <div style={gridWrapperStyle}>     
                { this.props.canUploadNew 
                ?   (<React.Fragment>
                        <LinearProgress variant="determinate"
                            value={this.state.uploadPercentCompleted}
                            style={{ display: isInProgress ? 'block' : 'none' }} />

                        <label style={labelStyle}>
                            <input type="file" ref={ref => this.inputFileRef = ref} onChange={this.onFileChanged} />
                        </label>
                        <div style={uploadBtnContainer}>
                            <Tooltip title="Upload file">
                                <IconButton onClick={e => this.inputFileRef.click()} color="inherit">
                                    <UploadIcon className="upload-btn" size={32} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </React.Fragment>)
                : null }   

                <div style={gridStyle}> {
                    files.map(
                        (file) => <FileComponent key={file.id} file={file} onDeleted={this.deleteFile} />
                    )
                }
                </div>
            </div>
        );
    }
}
