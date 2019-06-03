import { Platform, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation'

import { loadedIconsMap } from '../lib/AppIcons';

const NAV_ID_AUTH_TAB = 'authTab';
const NAV_ID_SIGN_IN = 'signIn';
const NAV_ID_EMAIL_SIGN_IN = 'emailSignIn';
const NAV_ID_SIGN_UP = 'signUp';
const NAV_ID_HOME = 'home';
const NAV_ID_HOME_CHANNEL = 'homeChannel';

export const goToInitialize = (store) => Navigation.setRoot({
  root: {
    component: {
      name: "Initializing",
      passProps: {
        store: store,
      }
    }
  }
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
                        visible: false
                      }
                    }
                  }
                },
              ],
              options: {
                bottomTab: {
                  text: 'Sign In',
                  icon: loadedIconsMap.signIn
                },
                bottomTabs: {
                  visible: false,
                  animate: false
                }
              }
            }
          },
          {
            component: {
              id: NAV_ID_SIGN_UP,
              name: 'Auth:SignUp',
              options: {
                bottomTab: {
                  text: 'Sign Up',
                  icon: loadedIconsMap.signUp
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

export const goToAuthRootSignIn = () => Navigation.mergeOptions(
  NAV_ID_AUTH_TAB, {
    bottomTabs: {
      currentTabId: NAV_ID_SIGN_IN
    }
});

export const goToAuthRootSignUp = () => Navigation.mergeOptions(
  NAV_ID_AUTH_TAB, {
    bottomTabs: {
      currentTabId: NAV_ID_SIGN_UP
    }
});

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
              text: '이메일 로그인'
            }
          }
        }
      }
    }
  );
}

export const goToHomeRoot = () => {
  /*
   * Default drawer width is screen width - header height
   * with a max width of 280 on mobile and 320 on tablet
   * https://material.io/guidelines/patterns/navigation-drawer.html
   */
  const { height, width } = Dimensions.get('window');
  const smallerAxisSize = Math.min(height, width);
  const isLandscape = width > height;
  const isTablet = smallerAxisSize >= 600;
  const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
  const maxWidth = isTablet ? 320 : 280;
  const drawerWidth =  Math.min(smallerAxisSize - appBarHeight, maxWidth) + 20;

  return Navigation.setRoot({
    root: {
      sideMenu: {
        left: {
          component: {
            id: 'Drawer',
            name: 'Drawer',
          },
        },
        center: {
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
        },
        options: {
          sideMenu: {
            left: {
              width: drawerWidth,
            },
          },
        }
      }
    }
  });
}

export const goToHomeRootGroup = (componentId) => Navigation.showModal({
  stack: {
    children: [{
      component: {
        name: 'Group'
      }
    }]
  }
});

export const goToHomeRootChannel = (componentId) => Navigation.push(
  componentId, {
    component: {
      id: NAV_ID_HOME_CHANNEL,
      name: 'Channel'
    }
  }
);
