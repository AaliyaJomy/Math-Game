import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const Explore = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Math Challenge</Text>

      <Link href="/addition" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Addition Quiz</Text>
        </Pressable>
      </Link>

      <Link href="/subtraction" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Subtraction Quiz</Text>
        </Pressable>
      </Link>

      <Link href="/multiplication" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Multiplication Quiz</Text>
        </Pressable>
      </Link>

      <Link href="/puzzle" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Math Puzzle</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
