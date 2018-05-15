import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import sharingService from "../services/SharingService";

interface FileShareProps {
    fileId: string;
    permission: number;
}

interface FileShareState {
}

export default class FileShareDialog extends React.Component<RouteComponentProps<FileShareProps>, FileShareState> {
    
    constructor(props: RouteComponentProps<FileShareProps>) {
        super(props);
        this.state = {};
    }
    
    async componentDidMount() {
        const params = this.props.match.params;
        try {
            await sharingService.getAccess(params.fileId, params.permission);
            toast.success("Success!")
        } catch {
            toast.error("Oops, could not share the file with you", {autoClose: 5000});
        }

        this.props.history.push('/shared');
    }

    render(): JSX.Element {
        return (null);
    }
}