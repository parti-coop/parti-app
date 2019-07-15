import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const loadedIconsMap = {};

/**
 * Load icons into memory for RNN bottomTabs and leftButtons/rightButtons
 * @returns {Promise} Returns a promise that resolves when all the icons are loaded into memory.
 */
const loadIcon = (name, size) => Icon.getImageSource(Platform.select({ android: `md-${name}`, ios: `ios-${name}` }), size);

const loadIcons = async () => {
  loadedIconsMap.currentUser = await loadIcon('person', 30);
  loadedIconsMap.drawerMenu = await loadIcon('menu', 30);
  loadedIconsMap.close = await loadIcon('close', 30);
  loadedIconsMap.signIn = await loadIcon('log-in', 30);
  loadedIconsMap.signUp = await loadIcon('preson-add', 30);
  loadedIconsMap.search = await loadIcon('search', 30);
  loadedIconsMap.notifications = await loadIcon('notifications', 30);
  loadedIconsMap.more = await loadIcon('more', 30);
};

export { loadedIconsMap, loadIcons };
