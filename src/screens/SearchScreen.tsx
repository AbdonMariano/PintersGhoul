import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ImageCard from '../components/ImageCard';
import BackButton from '../components/BackButton';
import RefreshButton from '../components/RefreshButton';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ImageSearchModal from '../components/ImageSearchModal';
import { Colors } from '../constants/Colors';
import { SamplePins } from '../constants/Images';
import { SearchService } from '../services/SearchService';
import { RecommendationService } from '../services/RecommendationService';

interface Pin {
  id: string;
  imageUri: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

export default function SearchScreen({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Pin[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchHistory, setSearchHistory] = useState<string[]>(['Kaneki', 'Tokyo Ghoul', 'Anime']);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trendingSearches] = useState(SearchService.getTrendingSearches());

  const categories = [
    { id: 'all', name: 'Todo', icon: '🌟' },
    { id: 'kaneki', name: 'Kaneki', icon: '👤' },
    { id: 'ghoul', name: 'Ghouls', icon: '😈' },
    { id: 'art', name: 'Arte', icon: '🎨' },
    { id: 'manga', name: 'Manga', icon: '📚' },
    { id: 'anime', name: 'Anime', icon: '📺' },
    { id: 'cosplay', name: 'Cosplay', icon: '👗' },
    { id: 'wallpaper', name: 'Wallpapers', icon: '🖼️' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      // Add to search history
      if (!searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
      }
      
      // Update recommendation service
      RecommendationService.addSearchQuery(query);
      
      // Get search suggestions
      const searchSuggestions = SearchService.getSearchSuggestions(query);
      setSuggestions(searchSuggestions);
      
      // Simulate advanced search
      setTimeout(() => {
        const keywords = SearchService.searchByKeywords(query);
        const filtered = SamplePins.filter(pin => {
          const searchText = `${pin.title} ${pin.description} ${pin.author}`.toLowerCase();
          return keywords.some(keyword => searchText.includes(keyword.toLowerCase())) ||
                 searchText.includes(query.toLowerCase());
        });
        setSearchResults(filtered);
        setIsSearching(false);
      }, 1000);
    } else {
      setSearchResults([]);
      setSuggestions([]);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Get personalized recommendations
      const personalizedFeed = RecommendationService.getPersonalizedFeed(SamplePins);
      setSearchResults(personalizedFeed);
      setIsRefreshing(false);
    }, 1500);
  };

  const handleImageSearchResults = (results: Pin[]) => {
    setSearchResults(results);
    setSearchQuery('Búsqueda por imagen');
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setSearchResults(SamplePins);
    } else {
      const filtered = SamplePins.filter(pin =>
        pin.title.toLowerCase().includes(categoryId.toLowerCase()) ||
        pin.description.toLowerCase().includes(categoryId.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const handleLike = (id: string) => {
    setSearchResults(prevPins =>
      prevPins.map(pin =>
        pin.id === id
          ? {
              ...pin,
              isLiked: !pin.isLiked,
              likes: pin.isLiked ? pin.likes - 1 : pin.likes + 1,
            }
          : pin
      )
    );
  };

  const handleSave = (id: string) => {
    setSearchResults(prevPins =>
      prevPins.map(pin =>
        pin.id === id ? { ...pin, isSaved: !pin.isSaved } : pin
      )
    );
  };

  const handleShowOptions = (pin: Pin) => {
    // Handle options modal
  };

  const handleImagePress = (pin: Pin) => {
    Alert.alert('Resultado', pin.title || 'Ver detalles del pin');
  };

  const renderPin = ({ item }: { item: Pin }) => (
    <ImageCard
      pin={item}
      onLike={handleLike}
      onSave={handleSave}
      onShowOptions={handleShowOptions}
      onImagePress={handleImagePress}
    />
  );

  const renderCategory = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        selectedCategory === category.id && styles.selectedCategory,
      ]}
      onPress={() => handleCategoryFilter(category.id)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.selectedCategoryText,
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <BackButton onPress={onBack} title="Buscar" showTitle />
          <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pins de Tokyo Ghoul..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.imageSearchButton}
            onPress={() => setShowImageSearch(true)}
          >
            <Text style={styles.imageSearchIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Sugerencias:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSearch(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {searchQuery.length === 0 && (
          <View style={styles.trendingContainer}>
            <Text style={styles.trendingTitle}>Tendencias</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {trendingSearches.map((trend, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.trendingChip}
                  onPress={() => handleSearch(trend)}
                >
                  <Text style={styles.trendingText}>{trend}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map(renderCategory)}
        </ScrollView>

        {searchQuery.length === 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Búsquedas recientes</Text>
            {searchHistory.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => handleSearch(term)}
              >
                <Text style={styles.historyText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ImageSearchModal
          visible={showImageSearch}
          onClose={() => setShowImageSearch(false)}
          onSearchResults={handleImageSearchResults}
        />

        {isSearching ? (
          <View style={styles.loadingContainer}>
            <LoadingSkeleton width="100%" height={200} style={styles.skeleton} />
            <LoadingSkeleton width="100%" height={200} style={styles.skeleton} />
            <LoadingSkeleton width="100%" height={200} style={styles.skeleton} />
          </View>
        ) : (
          <FlatList
            data={searchResults.length > 0 ? searchResults : SamplePins}
            renderItem={renderPin}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.primary}
              />
            }
          />
        )}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.ghoulRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
    color: Colors.text,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  historyContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  historyText: {
    color: Colors.text,
    fontSize: 14,
  },
  skeleton: {
    marginBottom: 10,
  },
  imageSearchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  imageSearchIcon: {
    fontSize: 20,
    color: Colors.text,
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  suggestionChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  suggestionText: {
    color: Colors.text,
    fontSize: 12,
  },
  trendingContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  trendingChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  trendingText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
