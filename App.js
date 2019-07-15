import {
  Provider
} from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { registerScreens, setInitialLayout } from './src/screens';

import { loadIcons } from './src/lib/AppIcons';
import { goToInitialize } from './src/screens/routes';

async function bootstrap() {
  await loadIcons();
}

export default (store) => {
  registerScreens(store, Provider);
  Navigation.events().registerAppLaunchedListener(() => {
    setInitialLayout();
    bootstrap().then(() => goToInitialize(store));
  });
};
