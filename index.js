import createStore from './src/store/configureStore';
import startApp from './App';
import { Provider } from 'react-redux';
import { registerScreens } from './src/screens';

let store = createStore();
registerScreens(store, Provider);
startApp(store);
