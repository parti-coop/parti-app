import createStore from './src/store/configureStore';
import startApp from './App';

const store = createStore();
startApp(store);
