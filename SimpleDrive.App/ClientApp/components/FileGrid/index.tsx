import * as React from 'react';
import File from '../../models/File';
import FileComponent from '../File';
import fileService from '../../services/FileService';

export interface FileGridProps {
}

interface FileGridState {
    files: File[];
}

const divStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gridTemplateRows: 'auto',
    width: '100%',
    gridGap: '10px',
    marginLeft: '10px',
    marginRight: '10px',
};

export default class FileGrid extends React.Component<FileGridProps, FileGridState> {
    constructor(props: FileGridProps) {
        super(props);

        this.state = {
            files: []
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

    render() {
        const { files } = this.state;        

        return (
            <div style={divStyle}>
                {
                    this.state.files.map(
                        (file) => <FileComponent key={file.id} file={file} onDeleted={this.deleteFile}/>
                    )
                }
            </div>
        );
    }
}
