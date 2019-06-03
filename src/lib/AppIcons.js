import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const loadedIconsMap = {};

/**
 * Load icons into memory for RNN bottomTabs and leftButtons/rightButtons
 * @returns {Promise} Returns a promise that resolves when all the icons are loaded into memory.
 */
const loadIcons = async () => {
  loadedIconsMap.currentUser = await Icon.getImageSource(Platform.select({android: "md-person", ios: "ios-person"}), 30);
  loadedIconsMap.drawerMenu = await Icon.getImageSource(Platform.select({android: "md-menu", ios: "ios-menu"}), 30);
  loadedIconsMap.close = await Icon.getImageSource(Platform.select({android: "md-close", ios: "ios-close"}), 30);
  loadedIconsMap.signIn = await Icon.getImageSource(Platform.OS === 'android' ? "md-log-in" : "ios-log-in", 30);
  loadedIconsMap.signUp = await Icon.getImageSource(Platform.OS === 'android' ? "md-person-add" : "ios-person-add", 30);
}

export { loadedIconsMap, loadIcons };
