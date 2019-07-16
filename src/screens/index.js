/* eslint-disable global-require */
import { Navigation } from 'react-native-navigation';

const setInitialLayout = () => {
  const defaultOptions = {
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

const registerScreens = (store, provider) => {
  Navigation.registerComponentWithRedux(
    'Initializing', () => require('./InitializingScreen').default,
    provider, store
  );
  Navigation.registerComponentWithRedux(
    'Auth:EmailSignIn', () => require('./auth/EmailSignInScreen').default,
    provider, store
  );
  Navigation.registerComponentWithRedux(
    'Auth:SignIn', () => require('./auth/SignInScreen').default,
    provider, store
  );
  Navigation.registerComponent(
    'Auth:SignUp', () => require('./auth/SignUpScreen').default,
  );
  Navigation.registerComponentWithRedux(
    'Channel', () => require('./ChannelScreen').default,
    provider, store
  );
  Navigation.registerComponentWithRedux(
    'Home', () => require('./HomeScreen').default,
    provider, store
  );
  Navigation.registerComponentWithRedux(
    'ChannelTopBarTitle', () => require('./ChannelTopBarTitleScreen').default,
    provider, store
  );
};

export { registerScreens, setInitialLayout };
