import File from '../models/File';

export interface FileGridProps {
    files: File[],
    onDeleted?: (file: File) => Promise<void>,
    enableSharing?: boolean
}