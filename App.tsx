import 'react-native-reanimated';
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from '@/store/store';
import RootStackNavigator from '@/navigators/RootStackNavigator';
import 'react-native-gesture-handler';
import LoadingMask from '@/component/LoadingMask';
import { DialogProvider } from '@/context/DialogContext';
export default function App() {
  return (
    <Provider store={store}>
      <LoadingMask />
      <NavigationContainer>
        <DialogProvider>
          <RootStackNavigator />
        </DialogProvider>
      </NavigationContainer>
    </Provider>
  );
}
