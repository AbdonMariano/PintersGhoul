// Advanced Notifications System for Tokyo Ghoul app
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'save' | 'mention' | 'message' | 'system' | 'trending' | 'recommendation';
  title: string;
  message: string;
  userId: string;
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  pinId?: string;
  pinImage?: string;
  pinTitle?: string;
  commentId?: string;
  messageId?: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'social' | 'content' | 'system' | 'marketing';
  actionUrl?: string;
  metadata?: { [key: string]: any };
}

export interface NotificationSettings {
  userId: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  likeNotifications: boolean;
  commentNotifications: boolean;
  followNotifications: boolean;
  saveNotifications: boolean;
  mentionNotifications: boolean;
  messageNotifications: boolean;
  systemNotifications: boolean;
  trendingNotifications: boolean;
  recommendationNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export class NotificationService {
  private static notifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      title: 'Nuevo Like',
      message: 'Ghoul Artist le dio like a tu pin "Kaneki Transformation"',
      userId: 'user1',
      actorId: 'ghoul_artist',
      actorName: 'Ghoul Artist',
      actorAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      pinId: '1',
      pinImage: 'https://i.pinimg.com/564x/8a/4b/2a/8a4b2a1c3f5e7d9b8c6a4e2f1d3c5b7a.jpg',
      pinTitle: 'Kaneki Transformation',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      isRead: false,
      isImportant: false,
      priority: 'medium',
      category: 'social',
    },
    {
      id: '2',
      type: 'comment',
      title: 'Nuevo Comentario',
      message: 'Tokyo Ghoul Fan comentó en tu pin "Touka Fanart"',
      userId: 'user1',
      actorId: 'tokyo_ghoul_fan',
      actorName: 'Tokyo Ghoul Fan',
      actorAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      pinId: '2',
      pinImage: 'https://i.pinimg.com/564x/7b/3c/9d/7b3c9d2e4f6a8c1b9d7e5f3a2c4b6d8e.jpg',
      pinTitle: 'Touka Fanart',
      commentId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: false,
      isImportant: true,
      priority: 'high',
      category: 'social',
    },
    {
      id: '3',
      type: 'follow',
      title: 'Nuevo Seguidor',
      message: 'Manga Reader empezó a seguirte',
      userId: 'user1',
      actorId: 'manga_reader',
      actorName: 'Manga Reader',
      actorAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isRead: true,
      isImportant: false,
      priority: 'medium',
      category: 'social',
    },
    {
      id: '4',
      type: 'trending',
      title: 'Pin Trending',
      message: 'Tu pin "Kaneki Ken - Ghoul Form" está siendo trending en Tokyo Ghoul',
      userId: 'user1',
      pinId: '1',
      pinImage: 'https://i.pinimg.com/564x/8a/4b/2a/8a4b2a1c3f5e7d9b8c6a4e2f1d3c5b7a.jpg',
      pinTitle: 'Kaneki Ken - Ghoul Form',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: false,
      isImportant: true,
      priority: 'high',
      category: 'content',
    },
    {
      id: '5',
      type: 'recommendation',
      title: 'Recomendación Personalizada',
      message: 'Basado en tus intereses, te recomendamos estos pins de Tokyo Ghoul',
      userId: 'user1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      isRead: false,
      isImportant: false,
      priority: 'low',
      category: 'content',
    },
    {
      id: '6',
      type: 'system',
      title: 'Actualización de la App',
      message: 'Nueva funcionalidad: Sistema de mensajería disponible',
      userId: 'user1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      isRead: true,
      isImportant: true,
      priority: 'medium',
      category: 'system',
      actionUrl: 'app://settings',
    }
  ];

  private static settings: NotificationSettings = {
    userId: 'user1',
    pushNotifications: true,
    emailNotifications: false,
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    saveNotifications: true,
    mentionNotifications: true,
    messageNotifications: true,
    systemNotifications: true,
    trendingNotifications: true,
    recommendationNotifications: false,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
    },
    frequency: 'immediate',
  };

  static getAllNotifications(): Notification[] {
    return this.notifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  static getUnreadNotifications(): Notification[] {
    return this.notifications
      .filter(n => !n.isRead)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static getNotificationsByType(type: string): Notification[] {
    return this.notifications
      .filter(n => n.type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static getImportantNotifications(): Notification[] {
    return this.notifications
      .filter(n => n.isImportant)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (!notification) return false;

    notification.isRead = true;
    return true;
  }

  static markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
  }

  static createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    this.notifications.unshift(newNotification);
    return newNotification;
  }

  static deleteNotification(notificationId: string): boolean {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index === -1) return false;

    this.notifications.splice(index, 1);
    return true;
  }

  static getNotificationSettings(): NotificationSettings {
    return this.settings;
  }

  static updateNotificationSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  static getNotificationStats(): {
    total: number;
    unread: number;
    important: number;
    byType: { [key: string]: number };
    byPriority: { [key: string]: number };
  } {
    const total = this.notifications.length;
    const unread = this.notifications.filter(n => !n.isRead).length;
    const important = this.notifications.filter(n => n.isImportant).length;

    const byType = this.notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const byPriority = this.notifications.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      total,
      unread,
      important,
      byType,
      byPriority,
    };
  }

  static createLikeNotification(pinId: string, pinTitle: string, pinImage: string, actorId: string, actorName: string, actorAvatar: string): Notification {
    return this.createNotification({
      type: 'like',
      title: 'Nuevo Like',
      message: `${actorName} le dio like a tu pin "${pinTitle}"`,
      userId: 'user1',
      actorId,
      actorName,
      actorAvatar,
      pinId,
      pinImage,
      pinTitle,
      isImportant: false,
      priority: 'medium',
      category: 'social',
    });
  }

  static createCommentNotification(pinId: string, pinTitle: string, pinImage: string, actorId: string, actorName: string, actorAvatar: string, commentId: string): Notification {
    return this.createNotification({
      type: 'comment',
      title: 'Nuevo Comentario',
      message: `${actorName} comentó en tu pin "${pinTitle}"`,
      userId: 'user1',
      actorId,
      actorName,
      actorAvatar,
      pinId,
      pinImage,
      pinTitle,
      commentId,
      isImportant: true,
      priority: 'high',
      category: 'social',
    });
  }

  static createFollowNotification(actorId: string, actorName: string, actorAvatar: string): Notification {
    return this.createNotification({
      type: 'follow',
      title: 'Nuevo Seguidor',
      message: `${actorName} empezó a seguirte`,
      userId: 'user1',
      actorId,
      actorName,
      actorAvatar,
      isImportant: false,
      priority: 'medium',
      category: 'social',
    });
  }

  static createTrendingNotification(pinId: string, pinTitle: string, pinImage: string): Notification {
    return this.createNotification({
      type: 'trending',
      title: 'Pin Trending',
      message: `Tu pin "${pinTitle}" está siendo trending en Tokyo Ghoul`,
      userId: 'user1',
      pinId,
      pinImage,
      pinTitle,
      isImportant: true,
      priority: 'high',
      category: 'content',
    });
  }

  static createRecommendationNotification(): Notification {
    return this.createNotification({
      type: 'recommendation',
      title: 'Recomendación Personalizada',
      message: 'Basado en tus intereses, te recomendamos estos pins de Tokyo Ghoul',
      userId: 'user1',
      isImportant: false,
      priority: 'low',
      category: 'content',
    });
  }

  static createSystemNotification(title: string, message: string, actionUrl?: string): Notification {
    return this.createNotification({
      type: 'system',
      title,
      message,
      userId: 'user1',
      isImportant: true,
      priority: 'medium',
      category: 'system',
      actionUrl,
    });
  }

  static shouldSendNotification(type: string): boolean {
    const settings = this.getNotificationSettings();
    
    switch (type) {
      case 'like': return settings.likeNotifications;
      case 'comment': return settings.commentNotifications;
      case 'follow': return settings.followNotifications;
      case 'save': return settings.saveNotifications;
      case 'mention': return settings.mentionNotifications;
      case 'message': return settings.messageNotifications;
      case 'system': return settings.systemNotifications;
      case 'trending': return settings.trendingNotifications;
      case 'recommendation': return settings.recommendationNotifications;
      default: return false;
    }
  }

  static isQuietHours(): boolean {
    const settings = this.getNotificationSettings();
    if (!settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = parseInt(settings.quietHours.start.split(':')[0]) * 60 + parseInt(settings.quietHours.start.split(':')[1]);
    const endTime = parseInt(settings.quietHours.end.split(':')[0]) * 60 + parseInt(settings.quietHours.end.split(':')[1]);

    if (startTime > endTime) {
      // Overnight quiet hours
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      // Same day quiet hours
      return currentTime >= startTime && currentTime <= endTime;
    }
  }
}
