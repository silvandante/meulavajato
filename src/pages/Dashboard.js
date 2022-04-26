import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FinantialManager from './tabs/FinantialManager';
import { NavigationActions, CommonActions } from '@react-navigation/native';
import { IconButton } from "react-native-paper"
import FinantialWasher from './tabs/FinantialWasher';
import Profile from './tabs/Profile';
import Schedules from './tabs/Schedules';
import Washers from './tabs/Washers';
import { theme } from '../utils/theme';
import { useSelector } from 'react-redux';
import {auth} from "../config/firebaseconfig"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Address from './tabs/Address';

const Tab = createBottomTabNavigator();

const Dashboard = ({navigation}) => {

  const { user } = useSelector(state => state);

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        AsyncStorage.clear()
        const resetAction = CommonActions.reset({
          index: 1,
          routes: [{ name: "Login"}]
        })
        navigation.dispatch(resetAction)
      })
      .catch(error => alert(error.message))
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

            if (route.name === 'Início') {
              iconName = focused
                ? 'home'
                : 'home-outline'
            } else if (route.name === 'Preços') {
              iconName = 'cash'
            } else if (route.name === 'Endereço') {
              iconName = focused
                ? 'map-marker'
                : 'map-marker-outline'
            }
          // You can return any component that you like here!
          return <IconButton
              icon={iconName}
              color={focused ? theme.colors.primary : theme.colors.secondary}
              size={30}
          />
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        options={{  tabBarLabel: 'Início',
        headerRight: () => (
          <IconButton icon="logout" onPress={logout}/>
        ), }}
        name="Início" component={Schedules} />
      {/*<Tab.Screen name="Lavadores" component={Washers} />*/}
      {user.user.role == "MANAGER" && <Tab.Screen 
        options={{  tabBarLabel: 'Preços',
        headerRight: () => (
          <IconButton icon="logout" onPress={logout}/>
        ), }}
        name="Preços" component={FinantialManager} />}
      {/*<Tab.Screen name="Financeiro" component={FinantialWasher} />*/}
      {/*<Tab.Screen name="Perfil" component={Profile} />*/}
      <Tab.Screen name="Endereço" component={Address} />
    </Tab.Navigator>
  );
}

export default Dashboard