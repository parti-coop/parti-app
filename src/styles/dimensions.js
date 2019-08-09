import {
  Platform
} from 'react-native';

export default {
  homeChannelLogo: Platform.select({ ios: 20, android: 26 }),
};
