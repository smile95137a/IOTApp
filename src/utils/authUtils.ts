import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommonActions,
  NavigationContainerRef,
} from '@react-navigation/native';

let navigationRef: NavigationContainerRef<any> | null = null;

export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
  navigationRef = ref;
};

export const handleUnauthorizedLogout = async () => {
  console.warn('[Auth] 401 Unauthorized - clearing storage and redirecting');
  await AsyncStorage.clear();

  if (navigationRef) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }], // ← 你要導回的首頁名稱
      })
    );
  } else {
    console.error('Navigation ref not set!');
  }
};
