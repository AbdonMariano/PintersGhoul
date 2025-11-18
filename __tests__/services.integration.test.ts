/**
 * Test de integración para verificar que todos los servicios funcionan correctamente
 */

import { AuthService } from '../src/services/AuthService';
import { BoardService } from '../src/services/BoardService';
import { SearchService } from '../src/services/SearchService';
import { StorageService } from '../src/services/StorageService';
import { CommentService } from '../src/services/CommentService';

describe('API and Services Integration Tests', () => {
  
  describe('AuthService', () => {
    it('should check session without errors', async () => {
      const result = await AuthService.checkSession();
      expect(result).toHaveProperty('isAuthenticated');
      expect(typeof result.isAuthenticated).toBe('boolean');
    });

    it('should login with valid credentials', async () => {
      const result = await AuthService.login({
        email: 'alex18abdon@gmail.com',
        password: 'password123',
        rememberMe: false
      });
      
      expect(result).toHaveProperty('success');
      if (result.success) {
        expect(result.user).toBeDefined();
        expect(result.user?.email).toBe('alex18abdon@gmail.com');
      }
    });

    it('should fail login with invalid password', async () => {
      const result = await AuthService.login({
        email: 'alex18abdon@gmail.com',
        password: '123', // Password too short
        rememberMe: false
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should register new user', async () => {
      const uniqueUsername = `testuser_${Date.now()}`;
      const result = await AuthService.register({
        username: uniqueUsername,
        email: `${uniqueUsername}@test.com`,
        password: 'password123',
        displayName: 'Test User',
        bio: 'Test bio'
      });
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.username).toBe(uniqueUsername);
    });
  });

  describe('BoardService', () => {
    it('should get all boards', () => {
      const boards = BoardService.getAllBoards();
      expect(Array.isArray(boards)).toBe(true);
      expect(boards.length).toBeGreaterThan(0);
    });

    it('should create a new board', () => {
      const newBoard = BoardService.createBoard({
        name: 'Test Board',
        description: 'Test Description',
        coverImage: 'https://example.com/image.jpg',
        isPrivate: false,
        collaborators: [],
        category: 'test'
      });

      expect(newBoard).toBeDefined();
      expect(newBoard.name).toBe('Test Board');
      expect(newBoard.id).toBeDefined();
      expect(newBoard.pinCount).toBe(0);
    });

    it('should get board by id', () => {
      const boards = BoardService.getAllBoards();
      if (boards.length > 0) {
        const board = BoardService.getBoardById(boards[0].id);
        expect(board).toBeDefined();
        expect(board?.id).toBe(boards[0].id);
      }
    });

    it('should add pin to board', () => {
      const boards = BoardService.getAllBoards();
      if (boards.length > 0) {
        const result = BoardService.addPinToBoard(boards[0].id, 'pin123');
        expect(result).toBe(true);
        
        const updatedBoard = BoardService.getBoardById(boards[0].id);
        expect(updatedBoard?.pinCount).toBeGreaterThan(0);
      }
    });

    it('should delete board', () => {
      const testBoard = BoardService.createBoard({
        name: 'To Delete',
        description: 'Will be deleted',
        coverImage: 'https://example.com/image.jpg',
        isPrivate: false,
        collaborators: [],
        category: 'test'
      });

      const result = BoardService.deleteBoard(testBoard.id);
      expect(result).toBe(true);

      const deletedBoard = BoardService.getBoardById(testBoard.id);
      expect(deletedBoard).toBeUndefined();
    });
  });

  describe('SearchService', () => {
    it('should search by keywords', () => {
      const results = SearchService.searchByKeywords('kaneki');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should get search suggestions', () => {
      const suggestions = SearchService.getSearchSuggestions('kan');
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should get trending searches', () => {
      const trending = SearchService.getTrendingSearches();
      expect(Array.isArray(trending)).toBe(true);
      expect(trending.length).toBeGreaterThan(0);
    });

    it('should get category keywords', () => {
      const keywords = SearchService.getCategoryKeywords('kaneki');
      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe('CommentService', () => {
    it('should get comment thread for pin', () => {
      const thread = CommentService.getCommentThread('pin1');
      expect(thread).toBeDefined();
      expect(thread).toHaveProperty('totalComments');
      expect(thread).toHaveProperty('comments');
      expect(Array.isArray(thread.comments)).toBe(true);
    });

    it('should add new comment', () => {
      const newComment = CommentService.addComment({
        pinId: 'testpin1',
        userId: 'user1',
        username: 'TestUser',
        userAvatar: 'https://example.com/avatar.jpg',
        content: 'Test comment',
        parentId: undefined
      });

      expect(newComment).toBeDefined();
      expect(newComment.content).toBe('Test comment');
      expect(newComment.id).toBeDefined();
    });

    it('should reply to comment', () => {
      const parentComment = CommentService.addComment({
        pinId: 'testpin2',
        userId: 'user1',
        username: 'TestUser',
        userAvatar: 'https://example.com/avatar.jpg',
        content: 'Parent comment',
        parentId: undefined
      });

      const reply = CommentService.addReply(parentComment.id, {
        pinId: 'testpin2',
        userId: 'user2',
        username: 'TestUser2',
        userAvatar: 'https://example.com/avatar2.jpg',
        content: 'Reply to comment',
        parentId: undefined
      });

      expect(reply).toBeDefined();
      expect(reply.parentId).toBe(parentComment.id);
      expect(reply.content).toBe('Reply to comment');
    });

    it('should toggle like on comment', () => {
      const comment = CommentService.addComment({
        pinId: 'testpin3',
        userId: 'user1',
        username: 'TestUser',
        userAvatar: 'https://example.com/avatar.jpg',
        content: 'Comment to like',
        parentId: undefined
      });

      const initialLikes = comment.likes;
      CommentService.likeComment(comment.id);
      
      const thread = CommentService.getCommentThread('testpin3');
      const likedComment = thread.comments.find(c => c.id === comment.id);
      
      expect(likedComment?.likes).toBe(initialLikes + 1);
    });

    it('should delete comment', () => {
      const comment = CommentService.addComment({
        pinId: 'testpin4',
        userId: 'user1',
        username: 'TestUser',
        userAvatar: 'https://example.com/avatar.jpg',
        content: 'Comment to delete',
        parentId: undefined
      });

      const result = CommentService.deleteComment(comment.id);
      expect(result).toBe(true);

      const thread = CommentService.getCommentThread('testpin4');
      const deletedComment = thread.comments.find(c => c.id === comment.id);
      expect(deletedComment).toBeUndefined();
    });
  });

  describe('StorageService', () => {
    it('should save and retrieve user session', async () => {
      const session = {
        userId: 'test123',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
        lastLogin: new Date().toISOString()
      };

      await StorageService.saveUserSession(session);
      // Esperar un poco para que AsyncStorage procese
      await new Promise(resolve => setTimeout(resolve, 100));
      const retrieved = await StorageService.getUserSession();

      expect(retrieved).toBeDefined();
      if (retrieved) {
        expect(retrieved.userId).toBe(session.userId);
        expect(retrieved.username).toBe(session.username);
      }
    });

    it('should clear session', async () => {
      await StorageService.clearSession();
      await new Promise(resolve => setTimeout(resolve, 100));
      const session = await StorageService.getUserSession();
      expect(session).toBeNull();
    });
  });
});
