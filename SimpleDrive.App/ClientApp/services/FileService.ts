import http from "./core/http";
import { AxiosResponse } from "axios";
import File from '../models/File';

class FileService {
    async listPersonal(): Promise<File[]> {
        const response = await http.get<File[]>('files');
        return this.mapToFiles(response);
    }
    
    // mocked
    async listShared(): Promise<File[]> {
        const response = await http.get<File[]>('files');
        return this.mapToFiles(response);
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

    async delete(fileId: number) {

        await http.delete(`files/${fileId}`);
    }

    private mapToFiles = (response: AxiosResponse<File[]>) => response.data.map(x => new File(x));
}

export default new FileService();
