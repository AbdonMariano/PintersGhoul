# 👻 PintersGhoul

![PintersGhoul Banner](./assets/banner.png)

> **PintersGhoul** es una aplicación móvil inspirada en Pinterest con temática de Tokyo Ghoul, construida con React Native y Expo. Descubre, comparte y organiza contenido visual relacionado con Tokyo Ghoul en una interfaz moderna y fluida.

---

## 📖 Descripción General

PintersGhoul es una aplicación social para compartir y descubrir imágenes, fan art, wallpapers y contenido relacionado con el universo de Tokyo Ghoul. La app ofrece una experiencia similar a Pinterest pero optimizada para la comunidad de fans del anime y manga Tokyo Ghoul.

### Funcionalidades Destacadas

- **Feed de Pins**: Grid masonry de 2 columnas con imágenes locales y remotas
- **Vista de Detalle**: Visualización ampliada con zoom hasta 3x
- **Sistema de Comentarios**: Comentarios jerárquicos con respuestas y likes, persistencia con AsyncStorage
- **Interacciones Sociales**: Like, guardar, compartir y descargar pins
- **Shop the Look**: Productos relacionados con enlaces a tiendas externas
- **Sistema de Tableros**: Organización de pins por categorías
- **Búsqueda Visual**: Busca contenido similar usando imágenes
- **Notificaciones Avanzadas**: Sistema completo de notificaciones con filtros y prioridades
- **Idea Pins**: Crea contenido multi-slide con editor integrado
- **Mensajería**: Sistema de chats con otros usuarios
- **Autenticación**: Login/Registro con sesión persistente

---

## 🛠️ Tecnologías y Stack

### Frontend
- **React Native** (0.81.4) - Framework principal
- **Expo SDK** (54.0.0) - Plataforma de desarrollo
- **TypeScript** (5.9.2) - Tipado estático

### UI/UX
- **expo-linear-gradient** - Gradientes estilizados
- **@expo/vector-icons** - Iconografía
- **React Native Gesture Handler** - Gestos táctiles
- **Custom Animations** - Animaciones fluidas

### Persistencia y Estado
- **AsyncStorage** - Almacenamiento de pins, comentarios, sesiones
- **SecureStore** - Credenciales seguras
- **CommentService** - Sistema de comentarios con lazy loading
- **BoardService** - Gestión de tableros
- **AuthService** - Autenticación y sesión

### Media y Compartir
- **expo-image-picker** - Selección de imágenes
- **expo-media-library** - Acceso a galería (requiere Development Build)
- **expo-sharing** - Compartir contenido
- **React Native Share API** - Compartir nativo

### Testing
- **Jest** (29.x) - Framework de testing
- **@testing-library/react-native** - Testing de componentes
- **Custom mocks** - Mocks de Expo modules

---

## 📦 Estructura del Proyecto

```
PintersGhoul/
├── assets/               # Imágenes locales y recursos
│   └── images/          # Imágenes de usuario
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── AnimatedButton.tsx
│   │   ├── ImageCard.tsx
│   │   ├── CommentsModal.tsx
│   │   ├── ShopTheLookModal.tsx
│   │   ├── BottomNavigation.tsx
│   │   └── ...
│   ├── screens/         # Pantallas principales
│   │   ├── HomeScreen.tsx
│   │   ├── ImageDetailScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── BoardsScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   └── ...
│   ├── services/        # Lógica de negocio
│   │   ├── AuthService.ts
│   │   ├── CommentService.ts
│   │   ├── BoardService.ts
│   │   ├── StorageService.ts
│   │   └── ...
│   ├── constants/       # Constantes y configuración
│   │   ├── Colors.ts
│   │   └── Images.ts
│   └── utils/           # Utilidades
│       └── animations.ts
├── __tests__/           # Tests unitarios e integración
├── jest/                # Configuración y mocks de Jest
├── App.tsx             # Punto de entrada
├── package.json        # Dependencias
├── tsconfig.json       # Configuración TypeScript
└── metro.config.js     # Configuración Metro bundler
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ o 23+
- npm o yarn
- Expo Go app (para testing en dispositivo)
- Android Studio o Xcode (para Development Build)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AbdonMariano/PintersGhoul.git
cd PintersGhoul

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npx expo start

# O limpiar caché e iniciar
npx expo start -c
```

### Ejecutar en Dispositivo

1. **Android**: Escanea el QR con Expo Go
2. **iOS**: Escanea el QR con la cámara nativa
3. **Emulador**: Presiona `a` (Android) o `i` (iOS) en la terminal

### Configuración de Metro

El proyecto incluye polyfills personalizados para compatibilidad con React Native:

```javascript
// metro.config.js
config.serializer = {
  getPolyfills: (...args) => [
    ...baseGetPolyfills(...args), 
    path.resolve(__dirname, 'global-polyfills.js')
  ]
};
```

---

## 🎨 Características Principales

### 1. Feed Infinito de Pins
- Grid de 2 columnas con layout masonry
- Optimizaciones de FlatList (removeClippedSubviews, windowing)
- Soporte para imágenes locales (require) y remotas (URL)
- Renderizado condicional con placeholders

### 2. Sistema de Comentarios Persistente
- Comentarios con respuestas anidadas
- Likes individuales por comentario
- Persistencia en AsyncStorage por pin
- Lazy loading para optimización
- Contador de comentarios en tiempo real

### 3. Vista de Detalle Inmersiva
- Zoom con gestos (hasta 3x)
- Información completa del pin
- Acciones rápidas (like, save, share)
- Estadísticas (likes, vistas, guardados)
- Tags y categorías

### 4. Autenticación Completa
- Login con email/contraseña
- Registro de nuevos usuarios
- Sesión persistente con AsyncStorage
- Credenciales seguras en SecureStore
- Logout con limpieza de sesión

### 5. Sistema de Tableros
- Crear tableros públicos/privados
- Organizar pins por categorías
- Colaboradores en tableros
- Estadísticas por tablero
- Covers personalizables

### 6. Shop the Look
- Detección de productos en pins
- Enlaces directos a tiendas
- Comparación de precios
- Reseñas y calificaciones
- Lista de compras

### 7. Notificaciones Avanzadas
- Filtros por tipo (social, contenido, sistema)
- Prioridades (urgent, high, medium, low)
- Marcar como leído/no leído
- Eliminar notificaciones
- Configuración granular

---

## 🎯 Roadmap y Mejoras Futuras

### En Desarrollo
- [ ] Búsqueda visual con IA
- [ ] Sistema de mensajería completo
- [ ] Drawer navigation
- [ ] Animaciones con Reanimated 2
- [ ] Persistencia de pins en AsyncStorage
- [ ] Sincronización con backend

### Planeado
- [ ] Modo oscuro completo
- [ ] Internacionalización (i18n)
- [ ] Compartir a redes sociales
- [ ] Editor de imágenes integrado
- [ ] Stories/Reels estilo Instagram
- [ ] Videollamadas
- [ ] Integración con Firebase

---

## 🐛 Issues Conocidos y Soluciones

### Error: "Value for uri cannot be cast from Double to String"
**Causa**: Pasar números (require) a la propiedad uri de Image  
**Solución**: Renderizado condicional distinguiendo string vs number
```tsx
{typeof imageUri === 'string' ? (
  <Image source={{ uri: imageUri }} />
) : typeof imageUri === 'number' ? (
  <Image source={imageUri} />
) : null}
```

### Limitaciones en Expo Go
- MediaLibrary requiere Development Build para funcionalidad completa
- Compartir archivos usa Share.share (solo mensaje) en vez de Sharing.shareAsync
- Algunas APIs nativas no disponibles

### Solución: Development Build
```bash
# Crear Development Build
eas build --profile development --platform android
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Tests Implementados
- ✅ HomeScreen rendering y funcionalidad
- ✅ ImageCard interactions
- ✅ Mocks de Expo modules
- 🔄 Servicios (en progreso)

---

## 📱 Capturas de Pantalla

### Feed Principal
![Feed](./assets/screenshots/feed.png)

### Vista de Detalle
![Detail](./assets/screenshots/detail.png)

### Comentarios
![Comments](./assets/screenshots/comments.png)

### Perfil de Usuario
![Profile](./assets/screenshots/profile.png)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución
- Seguir el estilo de código existente
- Agregar tests para nuevas features
- Actualizar documentación
- Commits descriptivos

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

---

## 👨‍💻 Autor

**Abdon Mariano**
- GitHub: [@AbdonMariano](https://github.com/AbdonMariano)
- Proyecto: [PintersGhoul](https://github.com/AbdonMariano/PintersGhoul)

---

## 🙏 Agradecimientos

- Inspirado en Pinterest
- Temática de Tokyo Ghoul por Sui Ishida
- Comunidad de React Native y Expo
- Contributors y testers

---

## 📞 Soporte

Si encuentras algún bug o tienes sugerencias:
- Abre un [Issue](https://github.com/AbdonMariano/PintersGhoul/issues)
- Contacta al autor

---

**¡Disfruta compartiendo contenido de Tokyo Ghoul! 👻📌**

