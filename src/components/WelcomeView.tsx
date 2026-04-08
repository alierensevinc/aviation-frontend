import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plane } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export const WelcomeView = ({
  onSuggestionPress,
}: {
  onSuggestionPress: (text: string) => void;
}) => {
  const suggestions = [
    "İstanbul Havalimanı (IST) teknik özellikleri neler?",
    "Sabiha Gökçen'den (SAW) hangi havayolları uçar?",
    "Türkiye'nin en eski havalimanı hangisidir?",
  ];

  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.welcomeHeader}>
        <Plane color={COLORS.primary} size={48} />
        <Text style={styles.welcomeTitle}>SkyGuide TR'ye Hoş Geldiniz</Text>
        <Text style={styles.welcomeDescription}>
          Türkiye havacılığı, havalimanları ve uçuş prosedürleri hakkında merak
          ettiğiniz her şeyi sorabilirsiniz.
        </Text>
      </View>

      <View style={styles.suggestionWrapper}>
        <Text style={styles.suggestionTitle}>Şunlarla başlayabilirsiniz:</Text>
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => onSuggestionPress(item)}
          >
            <Text style={styles.suggestionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  suggestionWrapper: {
    width: '100%',
    gap: 12,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  suggestionButton: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 15,
    color: COLORS.secondary,
    fontWeight: '500',
  },
});