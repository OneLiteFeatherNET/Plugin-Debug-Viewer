import React, {useEffect, useState} from 'react';
import './App.css';
import {useParams} from "react-router";
import {DebugFileContent} from "./models/DebugFileContent";
import {getZipData} from "./loader/ZipLoader";
import {Tab, initTE} from "tw-elements";
import {FileType} from "./models/FileType";
import hljs from 'highlight.js';


function createTabContent(fileContent: DebugFileContent, index: number) {
    const target = `tabs-${index}`
    const arial = `tabs-${index}-tab`
    const content = (debug: DebugFileContent) => {
        switch (debug.fileType) {
            case FileType.HOCON:
            case FileType.JSON:
            case FileType.LOG:
            case FileType.TEXT:
            case FileType.YAML:
                return debug.content as string;
        }
        return ""
    };
    const highlight = (debug: DebugFileContent) => {
        switch (debug.fileType) {
            case FileType.HOCON:
            case FileType.JSON:
                return "language-json";
            case FileType.LOG:
                return "language-accesslog"
            case FileType.YAML:
                return "language-yaml"
        }
        return "language-accesslog"
    };
    if (index === 0) {
        return (
            <div
                className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                id={target}
                role="tabpanel"
                aria-labelledby={arial}
                data-te-tab-active
                key={index}
            >
                <pre>
                    <code className={highlight(fileContent)}>
                        {content(fileContent)}
                    </code>
                </pre>
            </div>
        );
    }
    return (
        <div
            className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id={target}
            role="tabpanel"
            aria-labelledby={arial}
            key={index}
        >
            <pre>
                <code className={highlight(fileContent)}>
                    {content(fileContent)}
                </code>
            </pre>
        </div>
    );
}

function createTabEntry(name: String, index: number) {
    const target = `#tabs-${index}`
    const arialTarget = `tabs-${index}`
    if (index === 0) {
        return (
            <li role="presentation" key={index}>
                <a
                    href={target}
                    className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                    data-te-toggle="pill"
                    data-te-target={target}
                    data-te-nav-active
                    role="tab"
                    aria-controls={arialTarget}
                    aria-selected="true"
                >{name}</a
                >
            </li>
        );
    }
    return (
        <li role="presentation" key={index}>
            <a
                href={target}
                className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                data-te-toggle="pill"
                data-te-target={target}
                role="tab"
                aria-controls={arialTarget}
                aria-selected="false"
            >{name}</a
            >
        </li>
    );
}

function App() {
    useEffect(() => {
        initTE({Tab});
        document.querySelectorAll("pre code").forEach(
            (el) =>  hljs.highlightElement(el as HTMLElement)
        );
    });
    const params = useParams();
    const [value, setValue] = useState<DebugFileContent[]>([])
    useEffect(() => {

        const content = async () => {
            const data = await getZipData({params});
            setValue(data);
        };
        content().catch(console.error);
    }, [params]);
    const tabs = value.map((value1, index) => createTabEntry(value1.uiTabName, index));
    const contents = value.map((value1, index) => createTabContent(value1, index));
    return (<div className={"dark bg-slate-800"}>
        <ul
            className="flex list-none flex-row flex-wrap"
            role="tablist"
            data-te-nav-ref>
            {tabs}
        </ul>
        <div>
            {contents}
        </div>
    </div>);
}

export default App;
