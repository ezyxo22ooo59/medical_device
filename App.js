import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Button, FlatList, Text, StyleSheet, View } from 'react-native';
import axios from 'axios';

const App = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.12.113:5001/users');
      setUsers(response.data);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const sendData = async () => {
    try {
      const response = await axios.post('http://192.168.12.113:5001/user', { name });
      if (response.status === 201) {
        setMessage('User added successfully!');
        fetchUsers(); // Refresh the list of users
      } else {
        setMessage('Failed to add user');
      }
    } catch (error) {
      setMessage(`Error: ${error.response.data.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
        />
        <Button title="Send Data" onPress={sendData} />
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.id}: {item.name}
          </Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    padding: 8,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: 'red',
  },
});

export default App;