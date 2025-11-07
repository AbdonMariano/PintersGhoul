import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

interface Pin {
  id: string;
  imageUri: string | number; // string (remota) o number (require local)
  title: string;
  description: string;
  author: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface OptionsModalProps {
  visible: boolean;
  pin: Pin | null;
  onClose: () => void;
  onFollow: (author: string) => void;
  onShare: (pin: Pin) => void;
  onCopyLink: (pin: Pin) => void;
  onDownload: (pin: Pin) => void;
  onHide: (pin: Pin) => void;
  onReport: (pin: Pin) => void;
}

export default function OptionsModal({
  visible,
  pin,
  onClose,
  onFollow,
  onShare,
  onCopyLink,
  onDownload,
  onHide,
  onReport,
}: OptionsModalProps) {
  if (!pin) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

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
            <Text style={styles.title}>Opciones</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.options}>
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleAction(() => onFollow(pin.author))}
            >
              <Text style={styles.optionText}>Seguir {pin.author} 🌸</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleAction(() => onShare(pin))}
            >
              <Text style={styles.optionText}>Compartir este Pin</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleAction(() => onCopyLink(pin))}
            >
              <Text style={styles.optionText}>Copiar enlace</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleAction(() => onDownload(pin))}
            >
              <Text style={styles.optionText}>Descargar imagen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleAction(() => onHide(pin))}
            >
              <Text style={styles.optionText}>Ocultar Pin</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleAction(() => onReport(pin))}
            >
              <Text style={[styles.optionText, styles.reportText]}>Reportar Pin</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
  },
  options: {
    paddingVertical: 10,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  reportText: {
    color: Colors.error,
  },
  closeButtonBottom: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
  },
});
