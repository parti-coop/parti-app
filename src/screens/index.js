import { Navigation } from 'react-native-navigation';

export function registerScreens(store, provider) {
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
    'Group', () => require('./GroupScreen').default,
    provider, store);
}
