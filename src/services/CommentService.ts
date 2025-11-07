// Comments System for Tokyo Ghoul pins
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Comment {
  id: string;
  pinId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  parentId?: string;
  isEdited: boolean;
  editedAt?: string;
}

export interface CommentThread {
  id: string;
  pinId: string;
  comments: Comment[];
  totalComments: number;
  lastActivity: string;
}

export class CommentService {
  private static readonly STORAGE_PREFIX = '@PinteresGhoul:comments_';
  private static loadedPins = new Set<string>();
  private static comments: Comment[] = [
    {
      id: '1',
      pinId: '1',
      userId: 'ghoul_artist',
      username: 'Ghoul Artist',
      userAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      content: '¡Increíble fanart de Kaneki! Los colores están perfectos 🔥',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likes: 12,
      isLiked: false,
      replies: [],
      isEdited: false,
    },
    {
      id: '2',
      pinId: '1',
      userId: 'tokyo_ghoul_fan',
      username: 'Tokyo Ghoul Fan',
      userAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      content: '¿Alguien sabe qué episodio es este? Quiero verlo de nuevo',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      likes: 8,
      isLiked: true,
      replies: [
        {
          id: '3',
          pinId: '1',
          userId: 'manga_reader',
          username: 'Manga Reader',
          userAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
          content: 'Es del episodio 12 de la primera temporada, cuando Kaneki se transforma',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          likes: 5,
          isLiked: false,
          replies: [],
          parentId: '2',
          isEdited: false,
        }
      ],
      isEdited: false,
    },
    {
      id: '4',
      pinId: '2',
      userId: 'anime_lover',
      username: 'Anime Lover',
      userAvatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      content: 'Touka es mi personaje favorito de Tokyo Ghoul 💜',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      likes: 15,
      isLiked: false,
      replies: [],
      isEdited: false,
    }
  ];

  private static storageKey(pinId: string) {
    return `${this.STORAGE_PREFIX}${pinId}`;
  }

  private static async ensureLoadedForPin(pinId: string): Promise<void> {
    if (this.loadedPins.has(pinId)) return;
    try {
      const raw = await AsyncStorage.getItem(this.storageKey(pinId));
      if (raw) {
        const persisted: Comment[] = JSON.parse(raw);
        // Merge, avoid duplicates by id
        const existingIds = new Set(this.comments.filter(c => c.pinId === pinId).map(c => c.id));
        for (const c of persisted) {
          if (!existingIds.has(c.id)) {
            this.comments.push(c);
          }
        }
      }
    } catch (e) {
      console.warn('[CommentService] Error loading persisted comments', e);
    } finally {
      this.loadedPins.add(pinId);
    }
  }

  private static async saveCommentsForPin(pinId: string): Promise<void> {
    try {
      const pinComments = this.comments.filter(c => c.pinId === pinId);
      await AsyncStorage.setItem(this.storageKey(pinId), JSON.stringify(pinComments));
    } catch (e) {
      console.warn('[CommentService] Error saving comments', e);
    }
  }

  static getCommentsByPin(pinId: string): Comment[] {
    return this.comments
      .filter(comment => comment.pinId === pinId && !comment.parentId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  static async getCommentsByPinAsync(pinId: string): Promise<Comment[]> {
    await this.ensureLoadedForPin(pinId);
    return this.getCommentsByPin(pinId);
  }

  static addComment(comment: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'isLiked' | 'replies' | 'isEdited'>): Comment {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
      isEdited: false,
    };

    this.comments.push(newComment);
    // Persist in background
    void this.saveCommentsForPin(newComment.pinId);
    return newComment;
  }

  static addReply(parentId: string, reply: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'isLiked' | 'replies' | 'isEdited'>): Comment {
    const newReply: Comment = {
      ...reply,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
      parentId,
      isEdited: false,
    };

    this.comments.push(newReply);

    // Add reply to parent comment
    const parentComment = this.comments.find(c => c.id === parentId);
    if (parentComment) {
      parentComment.replies.push(newReply);
    }

    // Persist in background
    void this.saveCommentsForPin(newReply.pinId);
    return newReply;
  }

  static likeComment(commentId: string): boolean {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return false;

    comment.isLiked = !comment.isLiked;
    comment.likes += comment.isLiked ? 1 : -1;
    void this.saveCommentsForPin(comment.pinId);
    return true;
  }

  static editComment(commentId: string, newContent: string): boolean {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return false;

    comment.content = newContent;
    comment.isEdited = true;
    comment.editedAt = new Date().toISOString();
    void this.saveCommentsForPin(comment.pinId);
    return true;
  }

  static deleteComment(commentId: string): boolean {
    const commentIndex = this.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return false;

    // Remove from parent's replies if it's a reply
    const comment = this.comments[commentIndex];
    if (comment.parentId) {
      const parentComment = this.comments.find(c => c.id === comment.parentId);
      if (parentComment) {
        parentComment.replies = parentComment.replies.filter(r => r.id !== commentId);
      }
    }

    this.comments.splice(commentIndex, 1);
    void this.saveCommentsForPin(comment.pinId);
    return true;
  }

  static getCommentThread(pinId: string): CommentThread {
    const comments = this.getCommentsByPin(pinId);
    const totalComments = this.comments.filter(c => c.pinId === pinId).length;
    const lastActivity = comments.length > 0 
      ? comments[comments.length - 1].timestamp 
      : new Date().toISOString();

    return {
      id: `thread_${pinId}`,
      pinId,
      comments,
      totalComments,
      lastActivity,
    };
  }

  static getMostLikedComments(pinId: string, limit: number = 5): Comment[] {
    return this.comments
      .filter(comment => comment.pinId === pinId && !comment.parentId)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }

  static getRecentComments(pinId: string, limit: number = 10): Comment[] {
    return this.comments
      .filter(comment => comment.pinId === pinId && !comment.parentId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  static searchComments(query: string): Comment[] {
    const normalizedQuery = query.toLowerCase();
    return this.comments.filter(comment =>
      comment.content.toLowerCase().includes(normalizedQuery) ||
      comment.username.toLowerCase().includes(normalizedQuery)
    );
  }

  static getCommentStats(pinId: string): {
    totalComments: number;
    totalLikes: number;
    averageLikes: number;
    mostActiveUser: string;
  } {
    const pinComments = this.comments.filter(c => c.pinId === pinId);
    const totalComments = pinComments.length;
    const totalLikes = pinComments.reduce((sum, c) => sum + c.likes, 0);
    const averageLikes = totalComments > 0 ? totalLikes / totalComments : 0;

    // Find most active user
    const userActivity = pinComments.reduce((acc, comment) => {
      acc[comment.userId] = (acc[comment.userId] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const mostActiveUser = Object.keys(userActivity).reduce((a, b) => 
      userActivity[a] > userActivity[b] ? a : b, ''
    );

    return {
      totalComments,
      totalLikes,
      averageLikes,
      mostActiveUser,
    };
  }

  static getCommentReactions(commentId: string): {
    likes: number;
    isLiked: boolean;
    reactions: { [key: string]: number };
  } {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) {
      return { likes: 0, isLiked: false, reactions: {} };
    }

    return {
      likes: comment.likes,
      isLiked: comment.isLiked,
      reactions: {
        like: comment.likes,
        love: 0,
        laugh: 0,
        wow: 0,
      }
    };
  }
}
