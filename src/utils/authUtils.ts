import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommonActions,
  NavigationContainerRef,
} from '@react-navigation/native';
import { AppDispatch } from '@/store/store';
import { logOut } from '@/store/authSlice';

// ====== 全域變數 ======
let navigationRef: NavigationContainerRef<any> | null = null;
let dispatchRef: AppDispatch | null = null;

// ====== Setter functions ======
export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
  navigationRef = ref;
};

export const setDispatchRef = (dispatch: AppDispatch) => {
  dispatchRef = dispatch;
};

// ====== Getter with check ======
const getDispatchRef = (): AppDispatch => {
  if (!dispatchRef) {
    throw new Error('[AuthUtils] dispatchRef not set!');
  }
  return dispatchRef;
};

// ====== 登出處理器 ======
export const handleUnauthorizedLogout = async () => {
  console.warn('[Auth] 401 Unauthorized - clearing storage and redirecting');

  try {
    const dispatch = getDispatchRef();
    dispatch(logOut());

    if (navigationRef) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              state: {
                routes: [{ name: 'Home' }],
              },
            },
          ],
        })
      );
    } else {
      console.warn('[AuthUtils] navigationRef is not set!');
    }
  } catch (error: any) {
    console.error('[Auth] handleUnauthorizedLogout error:', error);
  }
};
