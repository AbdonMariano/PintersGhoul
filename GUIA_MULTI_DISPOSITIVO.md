# 🎨 PintersGhoul - Guía Multi-Dispositivo

## 📱 Ejecutar en Diferentes Dispositivos

### 1️⃣ Móvil (iOS / Android)

#### Opción A: Usando Expo Go
```bash
# Iniciar el servidor
npx expo start

# Escanear el código QR con:
# - iOS: Cámara nativa
# - Android: App Expo Go
```

#### Opción B: Emulador
```bash
# Android
npx expo start --android

# iOS (solo Mac)
npx expo start --ios
```

---

### 2️⃣ Tablet

La app se adapta automáticamente a tablets mostrando **3 columnas** de pins.

```bash
# Mismo comando que móvil
npx expo start
```

---

### 3️⃣ Laptop / Web

#### Opción A: Metro Bundler (Recomendado)
```bash
# Iniciar en modo web
npx expo start --web

# O simplemente
npx expo start
# Luego presionar 'w' para abrir en navegador
```

#### Opción B: Navegador directo
```bash
# Abrir en navegador
npx expo start

# Visitar: http://localhost:8081
```

**Nota:** Si ves JSON en lugar de la app, asegúrate de:
1. Usar `npx expo start --web`
2. Abrir `http://localhost:8081` (no 19000 ni 19001)
3. Limpiar caché: `npx expo start -c --web`

---

### 4️⃣ Desktop (Windows / Mac / Linux)

```bash
# Mismo comando
npx expo start --web
```

La app mostrará **5 columnas** de pins optimizadas para pantallas grandes.

---

### 5️⃣ TV / Pantallas Grandes

Para pantallas 4K o superiores, la app automáticamente muestra **6 columnas**.

```bash
npx expo start --web
```

---

## 🎯 Características Responsivas

### Columnas por Dispositivo
- 📱 **Móvil**: 2 columnas
- 📱 **Móvil Grande**: 2 columnas
- 📱 **Tablet**: 3 columnas
- 💻 **Laptop**: 4 columnas
- 🖥️ **Desktop**: 5 columnas
- 📺 **TV/4K**: 6 columnas

### Breakpoints
```
Móvil:        < 480px
Tablet:       480-768px
Laptop:       768-1024px
Desktop:      1024-1440px
TV:           > 1440px
```

---

## 🆕 Nuevas Funcionalidades

### ✅ Comentarios en Pins
- Botón 💬 en cada pin muestra el número de comentarios
- Click para ver todos los comentarios
- Agregar nuevos comentarios desde el detalle del pin

### ✅ Descarga de Pins
- Botón ⬇️ en cada pin permite compartir/descargar
- Compatible con todos los dispositivos
- Sistema de compartir nativo del dispositivo

### ✅ Sección de Comentarios en Detalle
- Vista expandida de comentarios en el `ImageDetailScreen`
- Contador de comentarios en tiempo real
- Modal completo para gestión de comentarios

---

## 🐛 Solución de Problemas

### Problema: JSON manifest en laptop
**Solución:**
```bash
# Limpiar caché y reiniciar
npx expo start -c --web

# O borrar manualmente
rm -rf .expo node_modules/.cache
npm install
npx expo start --web
```

### Problema: Imágenes lentas al abrir
**Solución:** Ya implementado ✅
- Modal con animación `fade` (más rápida)
- `React.memo()` para evitar re-renders
- `useCallback()` para optimizar handlers
- Carga progresiva de imágenes

### Problema: App no se adapta al tamaño
**Solución:**
- Recargar la página (Ctrl+R o Cmd+R)
- Verificar que `app.json` tenga `"platforms": ["ios", "android", "web"]`

---

## 📊 Configuración de Dispositivos

El archivo `src/utils/responsive.ts` maneja automáticamente:
- ✅ Detección de tipo de dispositivo
- ✅ Número de columnas
- ✅ Ancho de columnas (238px estándar Pinterest)
- ✅ Padding responsivo
- ✅ Tamaño de fuente adaptativo

---

## 🚀 Comandos Útiles

```bash
# Iniciar en modo desarrollo
npx expo start

# Limpiar caché
npx expo start -c

# Solo web
npx expo start --web

# Solo Android
npx expo start --android

# Solo iOS
npx expo start --ios

# Modo túnel (acceso desde cualquier red)
npx expo start --tunnel
```

---

## 🎨 Optimizaciones Implementadas

### Performance
- ✅ React.memo() en componentes pesados
- ✅ useCallback() para handlers
- ✅ Lazy loading de imágenes
- ✅ Animaciones aceleradas por hardware
- ✅ removeClippedSubviews para listas grandes

### UX Multi-Dispositivo
- ✅ Layout responsivo automático
- ✅ Breakpoints adaptados a cada pantalla
- ✅ Fuentes escalables
- ✅ Touch/Click optimizados
- ✅ Scrollbar personalizada en web

---

## 📝 Notas Importantes

1. **Web:** La app funciona mejor en navegadores modernos (Chrome, Firefox, Safari, Edge)
2. **Móvil:** Requiere Expo Go o Development Build
3. **Tablet:** Se detecta automáticamente por resolución
4. **Desktop:** Optimizado para pantallas > 1024px

---

## 🔧 Desarrollo

Para agregar soporte a nuevos dispositivos, edita:
```
src/utils/responsive.ts
```

Donde puedes ajustar:
- Breakpoints
- Número de columnas
- Padding por dispositivo
- Multiplicadores de fuente

---

**¡Disfruta PintersGhoul en todos tus dispositivos! 🎉**
