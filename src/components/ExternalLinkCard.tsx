import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { ExternalLink, LinkService } from '../services/LinkService';
import AnimatedButton from './AnimatedButton';

interface ExternalLinkCardProps {
  link: ExternalLink;
  onPress?: (link: ExternalLink) => void;
  showCategory?: boolean;
  compact?: boolean;
}

export default function ExternalLinkCard({ 
  link, 
  onPress, 
  showCategory = true, 
  compact = false 
}: ExternalLinkCardProps) {
  const handlePress = async () => {
    if (onPress) {
      onPress(link);
    } else {
      try {
        const canOpen = await Linking.canOpenURL(link.url);
        if (canOpen) {
          await Linking.openURL(link.url);
        } else {
          Alert.alert('Error', 'No se puede abrir este enlace');
        }
      } catch (error) {
        Alert.alert('Error', 'Error al abrir el enlace');
      }
    }
  };

  const categoryIcon = LinkService.getCategoryIcon(link.category);
  const categoryColor = LinkService.getCategoryColor(link.category);
  const favicon = LinkService.getDomainFavicon(link.domain);

  if (compact) {
    return (
      <AnimatedButton onPress={handlePress} style={styles.compactContainer}>
        <LinearGradient
          colors={[Colors.surface, Colors.background]}
          style={styles.compactGradient}
        >
          <View style={styles.compactContent}>
            <Image source={{ uri: favicon }} style={styles.compactFavicon} />
            <View style={styles.compactTextContainer}>
              <Text style={styles.compactTitle} numberOfLines={1}>
                {link.title}
              </Text>
              <Text style={styles.compactDomain} numberOfLines={1}>
                {link.domain}
              </Text>
            </View>
            {link.isVerified && (
              <Text style={styles.verifiedIcon}>✅</Text>
            )}
          </View>
        </LinearGradient>
      </AnimatedButton>
    );
  }

  return (
    <AnimatedButton onPress={handlePress} style={styles.container}>
      <LinearGradient
        colors={[Colors.surface, Colors.background]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.domainContainer}>
            <Image source={{ uri: favicon }} style={styles.favicon} />
            <Text style={styles.domain}>{link.domain}</Text>
          </View>
          {link.isVerified && (
            <View style={styles.verifiedContainer}>
              <Text style={styles.verifiedIcon}>✅</Text>
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {link.title}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {link.description}
        </Text>

        {showCategory && (
          <View style={styles.categoryContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryIcon}>{categoryIcon}</Text>
              <Text style={styles.categoryText}>
                {link.category.charAt(0).toUpperCase() + link.category.slice(1)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.linkText}>Toca para abrir</Text>
          <Text style={styles.arrow}>→</Text>
        </View>
      </LinearGradient>
    </AnimatedButton>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  domainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favicon: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 2,
  },
  domain: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 10,
    color: Colors.text,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  // Compact styles
  compactContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  compactGradient: {
    padding: 12,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactFavicon: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 3,
  },
  compactTextContainer: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  compactDomain: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
