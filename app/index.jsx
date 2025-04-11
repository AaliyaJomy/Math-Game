import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native'
import React from 'react'
import {Link } from 'expo-router'

import background from "@/assets/images/background.png"

const app = () => {
  return (
    <View style = {styles.container}>
      <ImageBackground
      source={background}
      resize="cover"
      style={styles.image}
      >
      <Text style={styles.text}>Mathlete</Text>
      <Link href= "/explore" style={{marginHorizontal: 'auto'}} asChild><Pressable style={styles.button}> <Text style={styles.buttonText}>Start</Text></Pressable></Link>
      </ImageBackground>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection: 'column',
  },
  image:{
    width:'100%',
    height:'100%',
    flex:1,
    resizeMode:'cover',
    justifyContent: 'center',
  },
  text: {
    color:'white',
    fontSize: 42,
    fontWeight:'bold',
    textAlign: 'center',
  },
  button:{
    height: 60,
    borderRadius:20,
    backgroundColor: 'rgb(0,0,0,0.75)',
    padding:6,
  },
  buttonText: {
    color:'white',
    fontSize: 16,
    fontWeight:'bold',
    textAlign: 'center',
    padding:4,
  }
})