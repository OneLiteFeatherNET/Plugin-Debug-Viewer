import {HLJSApi, Language} from "highlight.js";

export function latestlogHighlightjs(hljs: HLJSApi): Language {
    return {
        name: "Paper latest log",
        contains: [
            // Time
            {
                match: "(\\[[0-9]{2}:[0-9]{2}:[0-9]{2}\\])",
                scope: "regexp",
                relevance: 1
            },
            // Level
            {
                match: "(\\[[A-Za-z #0-9]*\\/([A-Z]*)\\])",
                scope: "meta",
                relevance: 0
            },

        ]
    };
}