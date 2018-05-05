import * as React from 'react';
import File from '../models/File';
import FileComponent from './File';
import { FileGridProps } from '../interfaces/FileGridProps';

const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gridTemplateRows: 'auto',
    gridGap: 10,
    marginTop: 10
};

interface FileGridState {
}

export default class FileGrid extends React.Component<FileGridProps, FileGridState> {

    render() {
        return (            
            <div style={gridStyle}> {
                    this.props.files.map(
                        (file) => <FileComponent key={file.id} file={file} onDeleted={this.props.onDeleted} enableSharing={this.props.enableSharing} />
                    )
                }
            </div>
        );
    }
}
