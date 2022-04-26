import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Login from "./src/pages/Login"
import Dashboard from "./src/pages/Dashboard"
import { Provider as ReactReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import ScheduleDetail from "./src/pages/singlepages/ScheduleDetail"
import Register from "./src/pages/Register"
import configureStore from './src/redux/store';
import AddSchedule from "./src/pages/singlepages/AddSchedule"
import Toast from 'react-native-toast-message';

const store = configureStore()
const Stack = createStackNavigator()

import { LogBox } from 'react-native';
import _ from 'lodash';

LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
console.warn = message => {
if (message.indexOf('Setting a timer') <= -1) {
   _console.warn(message);
   }
};

export default function App() {
  return (
    <ReactReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{
              headerShown: false
            }}
            initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={Login}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
            />
            <Stack.Screen
              name="ScheduleDetail"
              component={ScheduleDetail}
            />
            <Stack.Screen
              name="Register"
              component={Register}
            />
            <Stack.Screen
              name="AddSchedule"
              component={AddSchedule}
            />
          </Stack.Navigator>
          <Toast position={'bottom'} bottomOffset={85} innerRef={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </PaperProvider>
    </ReactReduxProvider>
  )
}