import 'react-native-reanimated';
import React, { useRef, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import store, { AppDispatch } from '@/store/store';
import RootStackNavigator from '@/navigators/RootStackNavigator';
import 'react-native-gesture-handler';
import LoadingMask from '@/component/LoadingMask';
import { DialogProvider } from '@/context/DialogContext';
import { setNavigationRef, setDispatchRef } from '@/utils/authUtils';

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any> | null>(null);

  const Initializer = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      setDispatchRef(dispatch);
    }, [dispatch]);

    return null;
  };

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
          <Initializer />
          <RootStackNavigator />
        </DialogProvider>
      </NavigationContainer>
    </Provider>
  );
}
