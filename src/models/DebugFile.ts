import {FileType} from "./FileType";

export interface DebugFile {
    filePath: string;
    fileType: FileType;
    uiTabName: string;
}