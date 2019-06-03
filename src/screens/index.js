import { Navigation } from 'react-native-navigation';
import Colors from '../styles/colors';

const setInitialLayout = () => {
  const defaultOptions =
    {
      statusBar: {
        style: 'light',
      },
      layout: {
        backgroundColor: 'white',
        orientation: ['portrait', 'landscape'],
      },
      topBar: {
        buttonColor: 'black',
        background: {
          color: 'white',
        },
      },
      bottomTabs: {
        elevation: 8, // BottomTabs elevation in dp
        titleDisplayMode: 'alwaysShow',
        backgroundColor: 'white',
      },
    };

  Navigation.setDefaultOptions(defaultOptions);
};


export function registerScreens(store, provider) {
  setInitialLayout();

  Navigation.registerComponentWithRedux(
    'Initializing', () => require('./InitializingScreen').default,
    provider, store);
  Navigation.registerComponentWithRedux(
    'Auth:EmailSignIn', () => require('./auth/EmailSignInScreen').default,
    provider, store);
  Navigation.registerComponentWithRedux(
    'Auth:SignIn', () => require('./auth/SignInScreen').default,
    provider, store);
  Navigation.registerComponent(
    'Auth:SignUp', () => require('./auth/SignUpScreen').default);
  Navigation.registerComponentWithRedux(
    'Home', () => require('./HomeScreen').default,
    provider, store);
  Navigation.registerComponentWithRedux(
    'Drawer', () => require('./DrawerScreen').default,
    provider, store);
  Navigation.registerComponentWithRedux(
    'Group', () => require('./GroupScreen').default,
    provider, store);
  Navigation.registerComponentWithRedux(
    'Channel', () => require('./ChannelScreen').default,
    provider, store);
}
