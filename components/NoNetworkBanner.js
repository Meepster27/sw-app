import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NoNetworkBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>??  No internet connection. Please check your network and try again.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#b00020',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
