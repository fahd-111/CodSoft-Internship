import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import TasksCount from './Screens/TasksCount';
import OnBoardingScreen from './Screens/OnBoardingScreen'
import CompletedTasks from './Screens/CompletedTasks';
import PendingTasks from './Screens/PendingTasks';
import { Tasks } from './assets';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer styles={styles.container}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="OnBoardingScreen">
          <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
          <Stack.Screen
            name="Tasks" component={Tasks}
            options={{
              gestureEnabled: true,
            }} />
          <Stack.Screen name="TasksCount" component={TasksCount}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen name="CompletedTasks" component={CompletedTasks}
            options={{
              headerShown: true,
              presentation: 'modal',
              animationTypeForReplace: 'pop',
              animation: 'slide-from-bottom',
              headerBackTitle: '',
              headerTitle: '',
              headerBackTitleStyle: {

                color: 'white'
              },

              headerTintColor: 'white',
              headerStyle: {
                backgroundColor: '#320069',
              }
            }}
          />
          <Stack.Screen name="PendingTasks" component={PendingTasks}
            options={{
              headerShown: true,
              presentation: 'modal',
              animationTypeForReplace: 'pop',
              animation: 'slide-from-bottom',
              headerBackTitle: '',
              headerTitle: '',
              headerBackTitleStyle: {
                color: 'white'
              },
              headerTintColor: 'white',
              headerStyle: {
                backgroundColor: '#320069',
              }
            }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});