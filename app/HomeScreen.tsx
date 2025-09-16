import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link } from 'expo-router';
import { auth } from '../src/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // Verifica se já existe usuário logado
  const verificarUsuarioLogado = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem('@user');
      if (usuarioSalvo) {
        router.push('/HomeScreen');
      }
    } catch (error) {
      console.log('Erro ao verificar login', error);
    }
  };

  useEffect(() => {
    verificarUsuarioLogado();
  }, []);

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
        console.log('Erro:', error.message);
        Alert.alert('Erro', 'Email ou senha incorretos');
      });
  };

  const esqueceuSenha = () => {
    if (!email) {
      Alert.alert('Atenção', 'Digite seu e-mail para recuperar a senha');
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => Alert.alert('Sucesso', 'E-mail de recuperação enviado'))
      .catch((error) => {
        console.log('Erro:', error.message);
        Alert.alert('Erro', 'Não foi possível enviar o e-mail de recuperação');
      });
  };

  const mudarIdioma = (lang: string) => i18n.changeLanguage(lang);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{t('login') || 'Login'}</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder={t('password') || 'Senha'}
        placeholderTextColor="#888"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>{t('login') || 'Login'}</Text>
      </TouchableOpacity>

      <View style={styles.idiomas}>
        <TouchableOpacity onPress={() => mudarIdioma('pt')}>
          <Text>PT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => mudarIdioma('en')}>
          <Text>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => mudarIdioma('es')}>
          <Text>ES</Text>
        </TouchableOpacity>
      </View>

      <Link href="/CadastrarScreen" style={styles.link}>
        {t('register') || 'Cadastrar'}
      </Link>

      <Text style={styles.link} onPress={esqueceuSenha}>
        {t('forgotPassword') || 'Esqueceu a senha?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#333', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  botao: { backgroundColor: '#00B37E', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  textoBotao: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  idiomas: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  link: { textAlign: 'center', marginTop: 10, color: '#00B37E' },
});
