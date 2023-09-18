import { View, Text, StyleSheet,Image, Pressable} from 'react-native'
import React from 'react'
import Swiper from 'react-native-swiper';
import { StudyGirl,ToDoList } from '../assets/index';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const OnBoardingScreen = () => {
  const navigation = useNavigation(); // Access the navigation object

  return (
    <View style={styles.fullScreen}>
      <View style = {styles.UpperDesign}>
        <Swiper>
          <ScreenOne/>
          <ScreenTwo/>
        </Swiper>
      </View>
      <View style = {styles.BottomDesign}>
       <Pressable 
        style={styles.buttonContainer}
        
        onPress={() => navigation.navigate('TasksCount')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  )
}

export const ScreenOne = ()=>{
  return(
    <View style = {styles.container}>
     <Image 
     source={ToDoList}>
     </Image>
     <Text style={styles.descriptipnText}>Welcome to </Text>
     <Text style={styles.descriptipnText}>
     To-Do List Application!</Text>
    </View>
  );
};

export const ScreenTwo =()=>{
  return(
    <View style = {styles.container}>
     <Image 
     source={StudyGirl}>
     </Image>
     <Text style={styles.descriptipnText}>Keep Records</Text>
     <Text style={styles.descriptipnText}>
     of Your Important Tasks</Text>
    </View>
  );
};



export default OnBoardingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  },
  fullScreen:{
    flex:1,
    
  },
  image:{
    marginTop:30,
  },
 
  UpperDesign:{
    flex: 0.7,

  },
  BottomDesign:{
    flex:.30,
    borderTopEndRadius:29,
    borderTopStartRadius:29,
    backgroundColor: '#320069',
    alignContent:'center',
    justifyContent:'center',
    
    
  },
  descriptipnText:{
    fontSize:20,
    fontWeight:'bold'
  },
  buttonContainer: {
    backgroundColor: 'white',
    borderRadius: 15, 
    paddingVertical: 9, 
    paddingHorizontal: 10, 
    marginHorizontal:110,
    
  },
  buttonText: {
    color: 'black', // Text color
    fontSize: 20, // Font size
    textAlign: 'center', // Text alignment
    
  },
  
});
