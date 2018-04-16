import * as React from 'react';
import File from '../../models/File';
import FileComponent from '../File';

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

        const files: File[] = [];
        for (let i = 0; i < 40; ++i) {
            const file = new File({
                id: i,
                name: `'File #${i}`
            });
            files.push(file);
        }

        this.state = {
            files
        };
    }

    render() {
        const { files } = this.state;        

        return (
            <div style={divStyle}>
                {
                    this.state.files.map(
                        (file) => <FileComponent key={file.id} file={file}/>
                    )
                }
            </div>
        );
    }
}
