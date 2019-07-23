import { Navigation } from 'react-native-navigation';

import { loadedIconsMap } from '../lib/AppIcons';

const NAV_ID_AUTH_TAB = 'authTab';
const NAV_ID_SIGN_IN = 'signIn';
const NAV_ID_EMAIL_SIGN_IN = 'emailSignIn';
const NAV_ID_SIGN_UP = 'signUp';
const NAV_ID_HOME = 'homeRoot';

export const goToInitialize = store => Navigation.setRoot({
  root: {
    component: {
      name: 'Initializing',
      passProps: {
        store,
      },
    },
  },
});

export const goToAuthRoot = async () => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: NAV_ID_AUTH_TAB,
        children: [
          {
            stack: {
              id: NAV_ID_SIGN_IN,
              children: [
                {
                  component: {
                    name: 'Auth:SignIn',
                    options: {
                      topBar: {
                        visible: false,
                      },
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'Sign In',
                  icon: loadedIconsMap.signIn,
                },
                bottomTabs: {
                  visible: false,
                  animate: false,
                },
              },
            },
          },
          {
            component: {
              id: NAV_ID_SIGN_UP,
              name: 'Auth:SignUp',
              options: {
                bottomTab: {
                  text: 'Sign Up',
                  icon: loadedIconsMap.signUp,
                },
                bottomTabs: {
                  visible: false,
                  animate: false,
                },
              },
            },
          },
        ],
      },
    },
  });
};

export const goToAuthRootSignIn = () => Navigation.mergeOptions(
  NAV_ID_AUTH_TAB, {
    bottomTabs: {
      currentTabId: NAV_ID_SIGN_IN,
    },
  },
);

export const goToAuthRootSignUp = () => Navigation.mergeOptions(
  NAV_ID_AUTH_TAB, {
    bottomTabs: {
      currentTabId: NAV_ID_SIGN_UP,
    },
  },
);

export const goToAuthRootEmailSignIn = (componentId) => {
  goToAuthRootSignIn();
  Navigation.push(
    componentId, {
      component: {
        id: NAV_ID_EMAIL_SIGN_IN,
        name: 'Auth:EmailSignIn',
        options: {
          topBar: {
            title: {
              text: '이메일 로그인',
            },
          },
        },
      },
    },
  );
};

/*
  * Default drawer width is screen width - header height
  * with a max width of 280 on mobile and 320 on tablet
  * https://material.io/guidelines/patterns/navigation-drawer.html
  */
// const { height, width } = Dimensions.get('window');
// const isLandscape = width > height;
// const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
export const goToHomeRoot = () => Navigation.setRoot({
  root: {
    stack: {
      id: NAV_ID_HOME,
      children: [
        {
          component: {
            name: 'Home',
            options: {
              topBar: {
                noBorder: true,
                elevation: 0,
              }
            },
          },
        },
      ],
    },
  },
});

export const goToHomeRootChannel = channel => Navigation.push(
  NAV_ID_HOME, {
    component: {
      name: 'Channel',
      passProps: {
        currentChannel: channel,
      },
    },
  },
);
