import http from "./core/http";
import { AxiosResponse } from "axios";
import File from '../models/File';

class FileService {
    async list(): Promise<File[]> {
        const response = await http.get<File[]>('files');

        return response.data.map(x => new File(x));
    }

    async upload(files: FileList, progress: (percentCompleted: number) => void) {
        const formData = new FormData();

        for (let i = 0; i < files.length; ++i) {
            const file = files[i];
            formData.append('files', file, file.name);
        }

        await http.post('files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent: ProgressEvent) => {
                const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                progress(percentCompleted);
            }
        });
    }
}

export default new FileService();
