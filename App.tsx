import 'react-native-reanimated';
import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import store from '@/store/store';
import RootStackNavigator from '@/navigators/RootStackNavigator';
import 'react-native-gesture-handler';
import LoadingMask from '@/component/LoadingMask';
import { DialogProvider } from '@/context/DialogContext';
import { setNavigationRef } from '@/utils/authUtils';
export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any> | null>(null);

  return (
    <Provider store={store}>
      <LoadingMask />
      <NavigationContainer
        ref={(ref) => {
          navigationRef.current = ref;
          if (ref) {
            setNavigationRef(ref);
          }
        }}
      >
        <DialogProvider>
          <RootStackNavigator />
        </DialogProvider>
      </NavigationContainer>
    </Provider>
  );
}
