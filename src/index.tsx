import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    createHashRouter,
    RouterProvider,
} from 'react-router-dom';
import App from "./App";

const router = createHashRouter([
    {
        path: "/:binId/:server/",
        children: [
            {
                path: "",
                element: <App/>
            }
        ]
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
