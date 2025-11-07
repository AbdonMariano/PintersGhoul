import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';
import RefreshButton from '../components/RefreshButton';
import ExternalLinkCard from '../components/ExternalLinkCard';
import { Colors } from '../constants/Colors';
import { ExternalLink, LinkService } from '../services/LinkService';

export default function LinksScreen({ onBack }: { onBack: () => void }) {
  const [links, setLinks] = useState<ExternalLink[]>(LinkService.getAllLinks());
  const [filteredLinks, setFilteredLinks] = useState<ExternalLink[]>(links);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: '🔗' },
    { id: 'shop', name: 'Tiendas', icon: '🛒' },
    { id: 'blog', name: 'Blogs', icon: '📝' },
    { id: 'video', name: 'Videos', icon: '🎥' },
    { id: 'tutorial', name: 'Tutoriales', icon: '📚' },
    { id: 'official', name: 'Oficial', icon: '✅' },
    { id: 'fanart', name: 'Fan Art', icon: '🎨' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLinks(LinkService.getAllLinks());
      setFilteredLinks(LinkService.getAllLinks());
      setIsRefreshing(false);
    }, 1500);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let filtered = links;

    if (query.trim()) {
      filtered = LinkService.searchLinks(query);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(link => link.category === selectedCategory);
    }

    setFilteredLinks(filtered);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    let filtered = links;

    if (searchQuery.trim()) {
      filtered = LinkService.searchLinks(searchQuery);
    }

    if (categoryId !== 'all') {
      filtered = filtered.filter(link => link.category === categoryId);
    }

    setFilteredLinks(filtered);
  };

  const handleAddLink = () => {
    Alert.prompt(
      'Agregar Enlace',
      'URL del enlace:',
      (url) => {
        if (url && LinkService.validateUrl(url)) {
          const domain = LinkService.extractDomain(url);
          const newLink = LinkService.addLink({
            url,
            title: `Nuevo enlace de ${domain}`,
            description: 'Enlace agregado por el usuario',
            domain,
            category: 'blog',
            isVerified: false,
          });
          setLinks(prev => [newLink, ...prev]);
          setFilteredLinks(prev => [newLink, ...prev]);
          Alert.alert('¡Éxito!', 'Enlace agregado correctamente');
        } else {
          Alert.alert('Error', 'URL inválida');
        }
      }
    );
  };

  const handleLinkPress = (link: ExternalLink) => {
    Alert.alert(
      'Abrir Enlace',
      `¿Quieres abrir "${link.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir',
          onPress: async () => {
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
        }
      ]
    );
  };

  const renderCategory = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryChip,
        selectedCategory === category.id && styles.activeCategoryChip
      ]}
      onPress={() => handleCategoryFilter(category.id)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.activeCategoryText
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderLink = ({ item }: { item: ExternalLink }) => (
    <ExternalLinkCard
      link={item}
      onPress={handleLinkPress}
      showCategory={true}
    />
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <BackButton onPress={onBack} title="Enlaces" showTitle />
          <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar enlaces..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddLink}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={({ item }) => renderCategory(item)}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {filteredLinks.length} enlaces encontrados
          </Text>
          <Text style={styles.statsSubtext}>
            {links.filter(link => link.isVerified).length} verificados
          </Text>
        </View>

        <FlatList
          data={filteredLinks}
          renderItem={renderLink}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔗</Text>
              <Text style={styles.emptyTitle}>No hay enlaces</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer enlace'}
              </Text>
            </View>
          }
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryChip: {
    backgroundColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statsText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
  },
  statsSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
