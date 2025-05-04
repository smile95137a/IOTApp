import {
  NavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { useDispatch, Provider } from 'react-redux';
import LoadingMask from './src/component/LoadingMask';
import { DialogProvider } from './src/context/DialogContext';
import RootStackNavigator from './src/navigators/RootStackNavigator';
import store, { AppDispatch } from './src/store/store';
import { setDispatchRef, setNavigationRef } from './src/utils/authUtils';

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
