import { GridTypes } from '../models/enumerations/GridTypes';

export interface FileGridProps {
    gridType: GridTypes;
    canUploadNew?: boolean;
}