import JSZip from "jszip";
import {Params} from "react-router-dom";
import {DebugFile} from "../models/DebugFile";
import {DebugFileContent} from "../models/DebugFileContent";
import {FileType} from "../models/FileType";

const ZIP = new JSZip();

export async function getZipData({params}: {params: Params}): Promise<DebugFileContent[]> {
    const binId = params.binId;
    const server = params.server;
    const response = await fetch(`${server}/${binId}`);
    let value = await response.body?.getReader().read();
    if (value == null) return [];
    let zipFile = await ZIP.loadAsync(value!.value as Uint8Array);
    const debugJson = await zipFile.file("debug.json")?.async("string");
    if (debugJson == null) return [];
    const debugFiles = JSON.parse(debugJson!) as DebugFile[];
    const debugFileContent: DebugFileContent[] = []
    for (let debugFile of debugFiles) {
        const fileName = debugFile.filePath;
        const loadTyp = (fileType: FileType) => {
            switch (fileType) {
                case FileType.JSON:
                case FileType.LOG:
                case FileType.TEXT:
                case FileType.HOCON:
                case FileType.YAML:
                    return "string";
                default:
                    return "blob";
            }
        }
        const content = await zipFile.file(fileName)?.async(loadTyp(debugFile.fileType))
        debugFileContent.push({fileType: debugFile.fileType, content: content, uiTabName: debugFile.uiTabName})
    }
    return debugFileContent;
}