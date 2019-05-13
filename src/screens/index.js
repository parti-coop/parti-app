import { Navigation } from 'react-native-navigation';

export function registerScreens(store, provider) {
  Navigation.registerComponentWithRedux(
    'Initializing', () => require('./InitializingScreen').default,
    provider, store);
  Navigation.registerComponentWithRedux(
    'SignIn', () => require('./auth/SignInScreen').default,
    provider, store);
  Navigation.registerComponent(
    'SignUp', () => require('./auth/SignUpScreen').default);
  Navigation.registerComponentWithRedux(
    'Home', () => require('./HomeScreen').default,
    provider, store);
}
