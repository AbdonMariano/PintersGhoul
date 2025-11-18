import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Comment, CommentService } from '../services/CommentService';
import { AuthService } from '../services/AuthService';
import AnimatedButton from './AnimatedButton';

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  pinId: string;
  pinTitle: string;
  pinImage: string | number;
  onCommentsChanged?: (count: number) => void;
}

export default function CommentsModal({ 
  visible, 
  onClose, 
  pinId, 
  pinTitle, 
  pinImage,
  onCommentsChanged,
}: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>(CommentService.getCommentsByPin(pinId));
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!visible) return;
    let mounted = true;
    CommentService.getCommentsByPinAsync(pinId).then(list => {
      if (mounted) setComments(list);
      if (onCommentsChanged) {
        const count = CommentService.getCommentThread(pinId).totalComments;
        onCommentsChanged(count);
      }
    });
    return () => { mounted = false; };
  }, [visible, pinId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const current = AuthService.getCurrentUser();

    const comment = CommentService.addComment({
      pinId,
      userId: current?.id || 'user1',
      username: current?.displayName || current?.username || 'Usuario Actual',
      userAvatar: current?.avatar || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      content: newComment.trim(),
    });

    setComments(prev => [...prev, comment]);
    setNewComment('');
    if (onCommentsChanged) {
      const count = CommentService.getCommentThread(pinId).totalComments;
      onCommentsChanged(count);
    }
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    const current = AuthService.getCurrentUser();

    const reply = CommentService.addReply(parentId, {
      pinId,
      userId: current?.id || 'user1',
      username: current?.displayName || current?.username || 'Usuario Actual',
      userAvatar: current?.avatar || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      content: replyText.trim(),
    });

    setComments(prev => 
      prev.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );
    setReplyText('');
    setReplyingTo(null);
    if (onCommentsChanged) {
      const count = CommentService.getCommentThread(pinId).totalComments;
      onCommentsChanged(count);
    }
  };

  const handleLikeComment = (commentId: string) => {
    CommentService.likeComment(commentId);
    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId
              ? {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                }
              : reply
          ),
        };
      })
    );
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert(
      'Eliminar Comentario',
      '¿Estás seguro de eliminar este comentario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            CommentService.deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            if (onCommentsChanged) {
              const count = CommentService.getCommentThread(pinId).totalComments;
              onCommentsChanged(count);
            }
          },
        },
      ]
    );
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

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Image source={{ uri: item.userAvatar }} style={styles.userAvatar} />
        <View style={styles.commentInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.timestamp}>
            {formatTime(item.timestamp)}
            {item.isEdited && ' (editado)'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => handleDeleteComment(item.id)}
        >
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.commentContent}>{item.content}</Text>

      <View style={styles.commentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLikeComment(item.id)}
        >
          <Text style={[styles.actionIcon, item.isLiked && styles.likedIcon]}>
            {item.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setReplyingTo(item.id)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Responder</Text>
        </TouchableOpacity>
      </View>

      {replyingTo === item.id && (
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Escribe tu respuesta..."
            placeholderTextColor={Colors.textMuted}
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <View style={styles.replyActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setReplyingTo(null);
                setReplyText('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleAddReply(item.id)}
            >
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {item.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {item.replies.map(reply => (
            <View key={reply.id} style={styles.replyItem}>
              <View style={styles.replyHeader}>
                <Image source={{ uri: reply.userAvatar }} style={styles.replyAvatar} />
                <View style={styles.replyInfo}>
                  <Text style={styles.replyUsername}>{reply.username}</Text>
                  <Text style={styles.replyTimestamp}>
                    {formatTime(reply.timestamp)}
                  </Text>
                </View>
              </View>
              <Text style={styles.replyContent}>{reply.content}</Text>
              <View style={styles.replyActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLikeComment(reply.id)}
                >
                  <Text style={[styles.actionIcon, reply.isLiked && styles.likedIcon]}>
                    {reply.isLiked ? '❤️' : '🤍'}
                  </Text>
                  <Text style={styles.actionText}>{reply.likes}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Comentarios</Text>
              <Text style={styles.subtitle}>{pinTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pinPreview}>
            {typeof pinImage === 'string' && pinImage ? (
              <Image source={{ uri: pinImage }} style={styles.pinImage} />
            ) : typeof pinImage === 'number' ? (
              <Image source={pinImage} style={styles.pinImage} />
            ) : null}
          </View>
          <View style={styles.listWrapper}>
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={item => item.id}
              style={styles.commentsList}
              contentContainerStyle={comments.length === 0 ? styles.emptyContentContainer : undefined}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>💬</Text>
                  <Text style={styles.emptyTitle}>No hay comentarios</Text>
                  <Text style={styles.emptySubtitle}>
                    Sé el primero en comentar
                  </Text>
                </View>
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Escribe un comentario..."
              placeholderTextColor={Colors.textMuted}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !newComment.trim() && styles.disabledButton]}
              onPress={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    width: '95%',
    maxHeight: '90%',
    overflow: 'hidden',
    flex: 1,
  },
  listWrapper: {
    flex: 1,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.text,
  },
  pinPreview: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pinImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  commentContainer: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentInfo: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  moreButton: {
    padding: 5,
  },
  moreIcon: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  commentContent: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 10,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  likedIcon: {
    color: Colors.primary,
  },
  actionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  replyContainer: {
    marginTop: 10,
    paddingLeft: 20,
  },
  replyInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.text,
    minHeight: 40,
    marginBottom: 8,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sendButtonText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: 'bold',
  },
  repliesContainer: {
    marginTop: 10,
    paddingLeft: 20,
  },
  replyItem: {
    marginBottom: 10,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  replyInfo: {
    flex: 1,
  },
  replyUsername: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
  },
  replyTimestamp: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  replyContent: {
    fontSize: 12,
    color: Colors.text,
    lineHeight: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    maxHeight: 100,
    marginRight: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
