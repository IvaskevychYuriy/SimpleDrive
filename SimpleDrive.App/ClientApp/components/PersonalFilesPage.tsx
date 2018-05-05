import * as React from 'react';
import File from '../models/File';
import FileComponent from './File';
import FileGridComponent from './FileGrid';
import fileService from '../services/FileService';
import { LinearProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import UploadIcon from 'mdi-react/UploadIcon';
import Tooltip from 'material-ui/Tooltip';

export interface PersonalFilesPageProps {
}

interface PersonalFilesPageState {
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

const uploadBtnContainer: React.CSSProperties = {
    textAlign: 'center',
    minHeight: '5em'
};

export default class PersonalFilesPage extends React.Component<PersonalFilesPageProps, PersonalFilesPageState> {
    private inputFileRef: HTMLInputElement;

    constructor(props: PersonalFilesPageProps) {
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
        this.setState({
            files: await fileService.listPersonal()
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

        return <div style={divStyle}>
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
            
            <FileGridComponent files={this.state.files} onDeleted={this.deleteFile} enableSharing={true} />
        </div>;
    }
}
