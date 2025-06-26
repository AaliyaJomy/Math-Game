import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = () => {
  const [mode, setMode] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [progress, setProgress] = useState({
    addition: { score: 0, total: 3 },
    subtraction: { score: 0, total: 3 },
    multiplication: { score: 0, total: 3 }
  });

  const validateEmail = (email) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const validatePassword = (pw) => {
    const isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);
    if (!isValid) {
      setPasswordError('Password must be at least 8 characters with letters and numbers!!!');
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleSubmit = () => {
    if (!username.trim()) return;
    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;
    if (mode === 'create' && !role) {
      setRoleError('Please select a role');
      return;
    }

    if (role === 'Parent') {
      if (!parentName.trim() || !validateEmail(parentEmail)) {
        setRoleError('Please enter valid parent name and email');
        return;
      }
    }

    setRoleError('');
    setAccountInfo({
      username,
      email,
      role,
      parentName: role === 'Parent' ? parentName : null,
      parentEmail: role === 'Parent' ? parentEmail : null,
    });
  };

  const handleLogout = () => {
    setAccountInfo(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setRole(null);
    setParentEmail('');
    setParentName('');
    setPasswordError('');
    setRoleError('');
    setMode(null);
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadProgress = async () => {
        try {
          const additionData = await AsyncStorage.getItem('additionScore');
          const subtractionData = await AsyncStorage.getItem('subtractionScore');
          const multiplicationData = await AsyncStorage.getItem('multiplicationScore');

          const addition = additionData ? JSON.parse(additionData) : { score: 0, total: 3 };
          const subtraction = subtractionData ? JSON.parse(subtractionData) : { score: 0, total: 3 };
          const multiplication = multiplicationData ? JSON.parse(multiplicationData) : { score: 0, total: 3 };

          setProgress({ addition, subtraction, multiplication });
        } catch (err) {
          console.error('Error loading progress:', err);
        }
      };
      loadProgress();
    }, [])
  );

  const renderProgress = (label, score, total) => {
    const percentage = (score / total) * 100;
    return (
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>{label}</Text>
        <View style={{ backgroundColor: '#e5e7eb', height: 10, borderRadius: 6, overflow: 'hidden' }}>
          <View
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
            }}
          />
        </View>
        <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>High score: {score} of {total} </Text>
      </View>
    );
  };

  if (accountInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {accountInfo.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.cardTitle}>{accountInfo.username}</Text>
          <Text style={styles.cardSubtitle}>Email: {accountInfo.email}</Text>
          <Text style={styles.cardSubtitle}>Role: {accountInfo.role}</Text>

          {accountInfo.role === 'Parent' && (
            <>
              <Text style={styles.cardSubtitle}>Parent Name: {accountInfo.parentName}</Text>
              <Text style={styles.cardSubtitle}>Parent Email: {accountInfo.parentEmail}</Text>
            </>
          )}

          <View style={{ width: '100%', marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Your Progress</Text>
            {renderProgress('Addition', progress.addition.score, progress.addition.total)}
            {renderProgress('Subtraction', progress.subtraction.score, progress.subtraction.total)}
            {renderProgress('Multiplication', progress.multiplication.score, progress.multiplication.total)}
          </View>

          <Pressable style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    );
  }

return (
  <View style={styles.container}>
    {!mode ? (
      <>
        <Text style={styles.header}>Welcome</Text>
        <Pressable style={styles.button} onPress={() => setMode('login')}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setMode('create')}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
      </>
    ) : (
      <>
        <Text style={styles.header}>{mode === 'login' ? 'Login' : 'Create Account'}</Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}

        {mode === 'create' && (
          <>
            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Select Role:</Text>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'Student' && styles.selectedRole]}
                onPress={() => setRole('Student')}
              >
                <Text style={styles.roleText}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'Parent' && styles.selectedRole]}
                onPress={() => setRole('Parent')}
              >
                <Text style={styles.roleText}>Parent</Text>
              </TouchableOpacity>
            </View>
            {roleError ? <Text style={{ color: 'red' }}>{roleError}</Text> : null}

            {role === 'Parent' && (
              <>
                <TextInput
                  placeholder="Parent Name"
                  style={styles.input}
                  value={parentName}
                  onChangeText={setParentName}
                />
                <TextInput
                  placeholder="Parent Email"
                  style={styles.input}
                  value={parentEmail}
                  onChangeText={setParentEmail}
                />
              </>
            )}
          </>
        )}

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {mode === 'login' ? 'Login' : 'Create Account'}
          </Text>
        </Pressable>

        <Pressable onPress={() => setMode(null)} style={{ marginTop: 20 }}>
          <Text style={{ color: '#2563eb', textAlign: 'center' }}>Back</Text>
        </Pressable>
      </>
    )}
  </View>
);

};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0ff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  avatar: {
    backgroundColor: '#3b82f6',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 10,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 4,
  },
  input: {
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 8,
  marginBottom: 10,
  fontSize: 16,
  borderWidth: 1,
  borderColor: '#d1d5db',
},
roleButton: {
  flex: 1,
  padding: 10,
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 8,
  marginHorizontal: 5,
  alignItems: 'center',
  backgroundColor: '#fff',
},
selectedRole: {
  backgroundColor: '#bfdbfe',
},
roleText: {
  fontWeight: 'bold',
  color: '#1f2937',
},

});
