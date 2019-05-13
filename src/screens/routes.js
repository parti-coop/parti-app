import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons';

const NAV_ID_AUTH_TAB = 'authTab';
const NAV_ID_SIGN_IN = 'signIn';
const NAV_ID_SIGN_UP = 'signUp';
const NAV_ID_HOME = 'home';


export const goToInitialize = () => Navigation.setRoot({
  root: {
    component: {
      name: "Initializing"
    }
  }
});

export const goToAuth = async () => {
  const signInIcon = await Icon.getImageSource(Platform.OS === 'android' ? "md-log-in" : "ios-log-in", 30);
  const signUpIcon = await Icon.getImageSource(Platform.OS === 'android' ? "md-person-add" : "ios-person-add", 30);

  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: NAV_ID_AUTH_TAB,
        children: [
          {
            component: {
              name: 'SignIn',
              options: {
                bottomTab: {
                  text: 'Sign In',
                  icon: signInIcon
                },
                bottomTabs: {
                  visible: false,
                  animate: false
                }
              }
            },
          },
          {
            component: {
              name: 'SignUp',
              options: {
                bottomTab: {
                  text: 'Sign Up',
                  icon: signUpIcon
                },
                bottomTabs: {
                  visible: false,
                  animate: false
                }
              }
            },
          },
        ],
      }
    }
  });
}


export const selectSignInTabOnAuth = () => Navigation.mergeOptions(
  NAV_ID_AUTH_TAB, {
  bottomTabs: {
    currentTabIndex: 'SignIn'
  }
});

export const selectSignUpTabOnAuth = () => Navigation.mergeOptions(
  NAV_ID_AUTH_TAB, {
  bottomTabs: {
    currentTabIndex: 'SignUp'
  }
});

export const goHome = () => Navigation.setRoot({
  root: {
    stack: {
      id: NAV_ID_HOME,
      children: [
        {
          component: {
            name: 'Home',
          }
        }
    ],
    }
  }
})
