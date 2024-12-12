import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist'
import store from "../redux/store.ts";

let persist = persistStore(store)

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate persistor={persist}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>
)
