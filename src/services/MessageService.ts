// Messaging System for Tokyo Ghoul community
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'pin' | 'board';
  pinId?: string;
  boardId?: string;
  imageUri?: string;
  timestamp: string;
  isRead: boolean;
  isEdited: boolean;
  editedAt?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  bio: string;
  followers: number;
  following: number;
}

export class MessageService {
  private static conversations: Conversation[] = [
    {
      id: '1',
      participants: ['user1', 'ghoul_artist'],
      lastMessage: {
        id: '1',
        senderId: 'ghoul_artist',
        receiverId: 'user1',
        content: '¡Mira este increíble fanart de Kaneki que encontré!',
        type: 'pin',
        pinId: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: false,
        isEdited: false,
      },
      unreadCount: 2,
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isGroup: false,
    },
    {
      id: '2',
      participants: ['user1', 'tokyo_ghoul_fan', 'manga_reader'],
      lastMessage: {
        id: '2',
        senderId: 'manga_reader',
        receiverId: 'user1',
        content: '¿Alguien sabe dónde puedo conseguir el manga completo?',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isRead: true,
        isEdited: false,
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isGroup: true,
      groupName: 'Tokyo Ghoul Fans',
      groupImage: 'https://i.pinimg.com/564x/8a/4b/2a/8a4b2a1c3f5e7d9b8c6a4e2f1d3c5b7a.jpg',
    }
  ];

  private static messages: Message[] = [
    {
      id: '1',
      senderId: 'ghoul_artist',
      receiverId: 'user1',
      content: '¡Hola! Vi que te gustó mi pin de Kaneki',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      isRead: true,
      isEdited: false,
    },
    {
      id: '2',
      senderId: 'user1',
      receiverId: 'ghoul_artist',
      content: '¡Sí! Es increíble, ¿cómo lo hiciste?',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: true,
      isEdited: false,
    },
    {
      id: '3',
      senderId: 'ghoul_artist',
      receiverId: 'user1',
      content: '¡Mira este increíble fanart de Kaneki que encontré!',
      type: 'pin',
      pinId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: false,
      isEdited: false,
    }
  ];

  private static users: User[] = [
    {
      id: 'ghoul_artist',
      username: 'ghoul_artist',
      displayName: 'Ghoul Artist',
      avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      isOnline: true,
      lastSeen: new Date().toISOString(),
      bio: 'Artista digital especializado en Tokyo Ghoul',
      followers: 1234,
      following: 567,
    },
    {
      id: 'tokyo_ghoul_fan',
      username: 'tokyo_ghoul_fan',
      displayName: 'Tokyo Ghoul Fan',
      avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      bio: 'Fanático de Tokyo Ghoul desde el primer día',
      followers: 890,
      following: 234,
    },
    {
      id: 'manga_reader',
      username: 'manga_reader',
      displayName: 'Manga Reader',
      avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      isOnline: true,
      lastSeen: new Date().toISOString(),
      bio: 'Lector ávido de manga y anime',
      followers: 456,
      following: 123,
    }
  ];

  static getAllConversations(): Conversation[] {
    return this.conversations.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  static getMessagesByConversation(conversationId: string): Message[] {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) return [];

    return this.messages
      .filter(m => 
        conversation.participants.includes(m.senderId) && 
        conversation.participants.includes(m.receiverId)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  static sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead' | 'isEdited'>): Message {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
      isEdited: false,
    };

    this.messages.push(newMessage);
    this.updateConversation(newMessage);
    return newMessage;
  }

  static updateConversation(message: Message) {
    const conversation = this.conversations.find(c => 
      c.participants.includes(message.senderId) && 
      c.participants.includes(message.receiverId)
    );

    if (conversation) {
      conversation.lastMessage = message;
      conversation.updatedAt = message.timestamp;
      if (message.senderId !== 'user1') {
        conversation.unreadCount++;
      }
    }
  }

  static markAsRead(conversationId: string) {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      this.messages
        .filter(m => 
          conversation.participants.includes(m.senderId) && 
          conversation.participants.includes(m.receiverId) &&
          m.receiverId === 'user1'
        )
        .forEach(m => m.isRead = true);
    }
  }

  static getUserById(userId: string): User | undefined {
    return this.users.find(u => u.id === userId);
  }

  static searchUsers(query: string): User[] {
    const normalizedQuery = query.toLowerCase();
    return this.users.filter(user =>
      user.username.toLowerCase().includes(normalizedQuery) ||
      user.displayName.toLowerCase().includes(normalizedQuery) ||
      user.bio.toLowerCase().includes(normalizedQuery)
    );
  }

  static createGroupConversation(participants: string[], groupName: string, groupImage?: string): Conversation {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      participants,
      lastMessage: {
        id: '0',
        senderId: 'system',
        receiverId: 'system',
        content: 'Conversación grupal creada',
        type: 'text',
        timestamp: new Date().toISOString(),
        isRead: true,
        isEdited: false,
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
      isGroup: true,
      groupName,
      groupImage,
    };

    this.conversations.push(newConversation);
    return newConversation;
  }

  static getTotalUnreadCount(): number {
    return this.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }

  static deleteMessage(messageId: string): boolean {
    const messageIndex = this.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return false;

    this.messages.splice(messageIndex, 1);
    return true;
  }

  static editMessage(messageId: string, newContent: string): boolean {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) return false;

    message.content = newContent;
    message.isEdited = true;
    message.editedAt = new Date().toISOString();
    return true;
  }
}
