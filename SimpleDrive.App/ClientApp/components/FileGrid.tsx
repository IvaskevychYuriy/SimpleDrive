import * as React from 'react';
import File from '../models/File';
import FileComponent from './File';
import fileService from '../services/FileService';
import { LinearProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import UploadIcon from 'mdi-react/UploadIcon';

export interface FileGridProps {
}

interface FileGridState {
    files: File[];
    uploadPercentCompleted: number;
}

const labelStyle: React.CSSProperties = {
    display: 'none'
};

const divStyle: React.CSSProperties = {
    width: '100%',
    marginLeft: '10px',
    marginRight: '10px',    
};

const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gridTemplateRows: 'auto',
    gridGap: '10px',
    marginTop: '10px'
};

export default class FileGrid extends React.Component<FileGridProps, FileGridState> {
    private inputFileRef: HTMLInputElement;

    constructor(props: FileGridProps) {
        super(props);

        this.state = {
            files: [],
            uploadPercentCompleted: 0
        };
    }

    async componentDidMount() {
        await this.fetch();
    }

    private fetch = async () => {
        const files = await fileService.list();
        this.setState({
            files
        });
    }

    private deleteFile = async (file: File) => {
        await fileService.delete(file.id);

        const files = this.state.files.filter(f => f.id !== file.id);
        this.setState({
            files
        });
    }

    private onUploadProgressChanged = (percentCompleted: number) => {
        this.setState({
            uploadPercentCompleted: percentCompleted
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

        return <div style={divStyle}>
            <LinearProgress variant="determinate" value={this.state.uploadPercentCompleted} />
            <div style={gridStyle}>
                {
                    this.state.files.map(
                        (file) => <FileComponent key={file.id} file={file} onDeleted={this.deleteFile}/>
                    )
                }
                <label style={labelStyle}>
                    <input type="file" ref={ref => this.inputFileRef = ref} onChange={this.onFileChanged} />
                </label>
                <IconButton onClick={e => this.inputFileRef.click()} color="inherit">
                    <UploadIcon size={32}/>
                </IconButton>
            </div>
        </div>;
    }
}
