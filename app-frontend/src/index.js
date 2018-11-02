import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import './index.css';
import './css/App.css';
import './css/common.css';
import 'antd/dist/antd.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

const store = createStore(rootReducer);
window.store = store;
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));


serviceWorker.unregister();
