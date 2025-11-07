import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';
import RefreshButton from '../components/RefreshButton';
import { Colors } from '../constants/Colors';
import { Notification, NotificationService } from '../services/NotificationService';

export default function AdvancedNotificationsScreen({ onBack }: { onBack: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>(NotificationService.getAllNotifications());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [settings, setSettings] = useState(NotificationService.getNotificationSettings());

  const filters = [
    { id: 'all', name: 'Todas', icon: '🔔' },
    { id: 'unread', name: 'No leídas', icon: '📬' },
    { id: 'important', name: 'Importantes', icon: '⭐' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'content', name: 'Contenido', icon: '📌' },
    { id: 'system', name: 'Sistema', icon: '⚙️' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setNotifications(NotificationService.getAllNotifications());
      setIsRefreshing(false);
    }, 1500);
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    let filtered = NotificationService.getAllNotifications();

    switch (filterId) {
      case 'unread':
        filtered = filtered.filter(n => !n.isRead);
        break;
      case 'important':
        filtered = filtered.filter(n => n.isImportant);
        break;
      case 'social':
        filtered = filtered.filter(n => n.category === 'social');
        break;
      case 'content':
        filtered = filtered.filter(n => n.category === 'content');
        break;
      case 'system':
        filtered = filtered.filter(n => n.category === 'system');
        break;
    }

    setNotifications(filtered);
  };

  const handleNotificationPress = (notification: Notification) => {
    NotificationService.markAsRead(notification.id);
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    
    if (notification.actionUrl) {
      Alert.alert('Acción', `Navegar a: ${notification.actionUrl}`);
    }
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (notificationId: string) => {
    NotificationService.deleteNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleSettingsChange = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    NotificationService.updateNotificationSettings(newSettings);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 1000 * 60) return 'Ahora';
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return Colors.primary;
      case 'high': return '#FF6B6B';
      case 'medium': return '#4ECDC4';
      case 'low': return Colors.textSecondary;
      default: return Colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'like': '❤️',
      'comment': '💬',
      'follow': '👥',
      'save': '📌',
      'mention': '📢',
      'message': '💬',
      'system': '⚙️',
      'trending': '🔥',
      'recommendation': '💡',
    };
    return icons[type] || '🔔';
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
        item.isImportant && styles.importantNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationTitleRow}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <View style={styles.notificationMeta}>
              <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          {item.actorName && (
            <View style={styles.actorInfo}>
              <Image source={{ uri: item.actorAvatar }} style={styles.actorAvatar} />
              <Text style={styles.actorName}>{item.actorName}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {item.pinImage && (
        <Image source={{ uri: item.pinImage }} style={styles.pinPreview} />
      )}

      <View style={styles.notificationFooter}>
        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]} />
        <Text style={styles.categoryText}>{item.category}</Text>
        {item.isImportant && (
          <Text style={styles.importantText}>⭐ Importante</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilter = (filter: any) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterChip,
        selectedFilter === filter.id && styles.activeFilterChip
      ]}
      onPress={() => handleFilterChange(filter.id)}
    >
      <Text style={styles.filterIcon}>{filter.icon}</Text>
      <Text style={[
        styles.filterText,
        selectedFilter === filter.id && styles.activeFilterText
      ]}>
        {filter.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSetting = (key: string, label: string, description?: string) => (
    <View key={key} style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={settings[key as keyof typeof settings] as boolean}
        onValueChange={(value) => handleSettingsChange(key, value)}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={settings[key as keyof typeof settings] ? Colors.text : Colors.textSecondary}
      />
    </View>
  );

  const stats = NotificationService.getNotificationStats();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <BackButton onPress={onBack} title="Notificaciones" showTitle />
          <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.unread}</Text>
            <Text style={styles.statLabel}>No leídas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.important}</Text>
            <Text style={styles.statLabel}>Importantes</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersList}
        >
          {filters.map(renderFilter)}
        </ScrollView>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleMarkAllAsRead}>
            <Text style={styles.actionButtonText}>📬 Marcar todo como leído</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={notifications}
          renderItem={renderNotification}
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
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>No hay notificaciones</Text>
              <Text style={styles.emptySubtitle}>
                {selectedFilter === 'unread' ? 'No tienes notificaciones sin leer' : 'No hay notificaciones para mostrar'}
              </Text>
            </View>
          }
        />

        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Configuración de Notificaciones</Text>
          {renderSetting('pushNotifications', 'Notificaciones Push', 'Recibir notificaciones en el dispositivo')}
          {renderSetting('likeNotifications', 'Likes', 'Cuando alguien le da like a tus pins')}
          {renderSetting('commentNotifications', 'Comentarios', 'Cuando alguien comenta en tus pins')}
          {renderSetting('followNotifications', 'Seguidores', 'Cuando alguien te sigue')}
          {renderSetting('trendingNotifications', 'Trending', 'Cuando tus pins están trending')}
        </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(45, 55, 72, 0.7)',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filtersContainer: {
    marginBottom: 15,
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  activeFilterText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  importantNotification: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeIcon: {
    fontSize: 18,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  actorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  actorName: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  deleteButton: {
    padding: 5,
  },
  deleteIcon: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  pinPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  priorityIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginRight: 10,
  },
  importantText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  settingsContainer: {
    backgroundColor: 'rgba(45, 55, 72, 0.7)',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
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
