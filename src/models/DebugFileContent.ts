import {FileType} from "./FileType";

export interface DebugFileContent {
    content: string | Blob | undefined;
    fileType: FileType;
    uiTabName: string;
}