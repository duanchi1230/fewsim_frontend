import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

/**
 * For demo: load the scenario list first
 */
// const DUMMY_PROJ_NAME = 'test';
//
// fetch('/proj/' + DUMMY_PROJ_NAME, {method: 'GET'})
//     .then(r => r.json())
//     .then(proj => {
//         const {supportedMethods} = proj;
//
//         const methodFetches = supportedMethods.map(
//             method => [
//                 `/proj/${DUMMY_PROJ_NAME}/${method}/scenario`,
//                 {method: 'GET'}
//             ]
//         );
//         try {
//             Promise.all(
//                 methodFetches.map(([url, options]) => fetch(url, options))
//             )
//                 .then(responses => Promise.all(responses.map(res => res.json())))
//                 .then(scenariosPerMethod => {
//
//                     // fill the scenarios into the proj
//                     for (let i = 0; i < supportedMethods.length; i++) {
//                         proj[supportedMethods[i]] = scenariosPerMethod[i];
//                     }
//
//                     ReactDOM.render(
//                         <App proj={proj}/>,
//                         document.getElementById('root')
//                     );
//                     serviceWorker.register();
//                 });
//         } catch (err) {
//             console.log(err);
//         }
//     });

// fetch('/proj/test/weap/scenario', {
//     cache: 'no-cache',
//     method: 'GET'
// })
//     .then(response => response.json())
//     .then(responseJSON => {
//         console.log(responseJSON);
//
//     });

ReactDOM.render(<App className='App'/>, document.getElementById('root'));
serviceWorker.register();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
