import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

const LoginScreen = () => {
  const [mode, setMode] = useState(null); // null, 'login', 'create'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const validatePassword = (pw) => {
    const isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);
    if (!isValid) {
      setPasswordError('Password must be at least 8 characters with letters and numbers.');
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleSubmit = () => {
    if (!username.trim()) return;
    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;

    setAccountInfo({ username, email });
  };

  const handleLogout = () => {
    setAccountInfo(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setPasswordError('');
    setMode(null);
  };

  if (accountInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Account Info</Text>
        <Text style={styles.info}>Username: {accountInfo.username}</Text>
        <Text style={styles.info}>Email: {accountInfo.email}</Text>

        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    );
  }

  if (!mode) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Welcome!</Text>
        <Pressable style={styles.button} onPress={() => setMode('login')}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setMode('create')}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{mode === 'login' ? 'Login' : 'Create Account'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) validatePassword(text); // re-check when user types
        }}
        onBlur={() => validatePassword(password)}
        value={password}
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {mode === 'login' ? 'Login' : 'Create Account'}
        </Text>
      </Pressable>
      <Pressable onPress={() => setMode(null)} style={{ marginTop: 10 }}>
        <Text style={{ color: '#3b82f6', textAlign: 'center' }}>Go Back</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf0',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: -6,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 14,
  },
  info: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 8,
  },
});
