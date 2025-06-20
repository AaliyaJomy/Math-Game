import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

import background from '@/assets/images/background.png';

const app = () => {
  return (
    <View style={styles.container}>

      <Image source={background} style={styles.logo} />

      <Link href="/explore" style={{ marginHorizontal: 'auto' }} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Explore</Text>
        </Pressable>
      </Link>

      <Link href="/login" style={{ marginHorizontal: 'auto' }} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default app;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  logo: {
    width: 450,
    height: 400,
    marginBottom: 1,
    resizeMode: 'contain',
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'purple',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
  },
});
