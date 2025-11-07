import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import BackButton from '../components/BackButton';

interface Notification {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'save' | 'mention';
  user: string;
  userAvatar: string;
  message: string;
  pinImage?: string;
  time: string;
  isRead: boolean;
}

export default function NotificationsScreen({ onBack, onTabPress }: { onBack: () => void; onTabPress?: (tab: string) => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      user: 'GhoulArtist',
      userAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      message: 'le dio like a tu pin "Kaneki Transformation"',
      pinImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      time: '2h',
      isRead: false,
    },
    {
      id: '2',
      type: 'follow',
      user: 'TokyoGhoulFan',
      userAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      message: 'empezó a seguirte',
      time: '4h',
      isRead: false,
    },
    {
      id: '3',
      type: 'save',
      user: 'AnimeLover',
      userAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      message: 'guardó tu pin "Ghoul Mask" en su tablero "Arte Tokyo Ghoul"',
      pinImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      time: '6h',
      isRead: true,
    },
    {
      id: '4',
      type: 'comment',
      user: 'MangaReader',
      userAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      message: 'comentó en tu pin "Tokyo Ghoul Art"',
      pinImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      time: '1d',
      isRead: true,
    },
    {
      id: '5',
      type: 'mention',
      user: 'CosplayMaster',
      userAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      message: 'te mencionó en un comentario',
      time: '2d',
      isRead: false,
    },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'follow':
        return '👥';
      case 'comment':
        return '💬';
      case 'save':
        return '📌';
      case 'mention':
        return '📢';
      default:
        return '🔔';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notification.id ? { ...notif, isRead: true } : notif
      )
    );
    Alert.alert('Notificación', `Ver ${notification.message}`);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const handleAdvancedNotifications = () => {
    if (onTabPress) {
      onTabPress('advanced-notifications');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationLeft}>
        <Image source={{ uri: item.userAvatar }} style={styles.userAvatar} />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>
            <Text style={styles.userName}>{item.user}</Text> {item.message}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.notificationRight}>
        <Text style={styles.notificationIcon}>
          {getNotificationIcon(item.type)}
        </Text>
        {item.pinImage && (
          <Image source={{ uri: item.pinImage }} style={styles.pinImage} />
        )}
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
               <View style={styles.header}>
                 <BackButton onPress={onBack} title="Notificaciones" showTitle />
                 <View style={styles.headerButtons}>
                   {unreadCount > 0 && (
                     <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllRead}>
                       <Text style={styles.markAllText}>Marcar todo como leído</Text>
                     </TouchableOpacity>
                   )}
                   <TouchableOpacity style={styles.advancedButton} onPress={handleAdvancedNotifications}>
                     <Text style={styles.advancedButtonText}>⚙️ Avanzadas</Text>
                   </TouchableOpacity>
                 </View>
               </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{unreadCount}</Text>
            <Text style={styles.statLabel}>No leídas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notifications.length - unreadCount}</Text>
            <Text style={styles.statLabel}>Leídas</Text>
          </View>
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
                Te notificaremos cuando tengas nuevas interacciones
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.ghoulRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  markAllButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  markAllText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  advancedButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  advancedButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 10,
  },
  unreadNotification: {
    backgroundColor: Colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  userName: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notificationRight: {
    alignItems: 'center',
    marginLeft: 10,
  },
  notificationIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  pinImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
