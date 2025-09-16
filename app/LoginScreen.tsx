import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter();

  // Verifica se já tem usuário salvo
  const verificarUsuarioLogado = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem("@user");
      if (usuarioSalvo) {
        router.push('/HomeScreen');
      }
    } catch (error) {
      console.log("Erro ao verificar login", error);
    }
  };

  useEffect(() => {
    verificarUsuarioLogado();
  }, []);

  // Login com Firebase
  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        router.push('/HomeScreen');
      })
      .catch((error) => {
        const errorCode = error.code;

        if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
          Alert.alert("Erro", "Email ou senha incorretos.");
        } else if (errorCode === 'auth/user-not-found') {
          Alert.alert("Erro", "Usuário não encontrado.");
        } else {
          Alert.alert("Erro", "Não foi possível realizar o login.");
        }
      });
  };

  // Recuperação de senha
  const esqueceuSenha = () => {
    if (!email) {
      alert("Digite seu e-mail para recuperar a senha.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Enviado e-mail de recuperação de senha.");
      })
      .catch((error) => {
        console.log("Error:", error.message);
        alert("Erro ao enviar e-mail de recuperação.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>

      {/* Campo Email */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão Login */}
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      {/* Link para Cadastro */}
      <Link href="/CadastrarScreen" style={styles.link}>
        Não tem conta? Cadastre-se
      </Link>

      {/* Link Esqueci a Senha */}
      <Text style={styles.link} onPress={esqueceuSenha}>
        Esqueci minha senha
      </Text>
    </View>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  botao: {
    backgroundColor: '#00B37E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});
