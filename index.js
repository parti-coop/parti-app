import moment from 'moment';
import Moment from 'react-moment';
import createStore from './src/store/configureStore';
import startApp from './App';
import 'moment/locale/ko';

moment.locale('ko');
Moment.startPooledTimer();

const store = createStore();
startApp(store);
