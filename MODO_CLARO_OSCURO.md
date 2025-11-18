# Sistema de Modo Claro/Oscuro en Vista de Detalle de Pin

## 📋 Descripción General

Se ha implementado un sistema de alternancia entre modo claro (estilo Pinterest) y modo oscuro (estilo Tokyo Ghoul) en la pantalla de detalle de imagen (`ImageDetailScreen.tsx`).

## ✨ Características Implementadas

### 1. **Botón de Toggle**
- Ubicado en el header junto al título "Detalle del Pin"
- Ícono dinámico:
  - ☀️ (sol) cuando está en modo oscuro
  - 🌙 (luna) cuando está en modo claro
- Botón circular con fondo del tema actual
- Transición suave en web con efecto hover

### 2. **Temas Disponibles**

#### **Modo Oscuro (Tokyo Ghoul)** - Por defecto
```typescript
background: Colors.background         // Fondo oscuro
surface: Colors.surface               // Superficies grises
text: Colors.text                     // Texto blanco
textSecondary: Colors.textSecondary   // Texto gris claro
border: '#333'                        // Bordes oscuros
gradient: [Colors.gradientStart, Colors.gradientEnd]
```

#### **Modo Claro (Pinterest)**
```typescript
background: Colors.pinterestBackground      // #FFFFFF
surface: Colors.pinterestSurface            // #FFFFFF
text: Colors.pinterestText                  // #211922
textSecondary: Colors.pinterestTextSecondary // #5F5F5F
border: Colors.pinterestBorder              // #E9E9E9
gradient: ['#F0F0F0', '#FFFFFF']
```

### 3. **Componentes Afectados por el Tema**

#### **Header**
- Fondo adaptable (transparente en oscuro, superficie en claro)
- Texto del título con color dinámico
- Botones (back y theme) con fondo del tema actual

#### **Imagen**
- Contenedor con fondo dinámico
- Placeholder con colores temáticos
- Botones de acción (like, save, share) con superficie temática

#### **Información del Pin**
- Título: color de texto principal
- Descripción: color de texto secundario
- Autor: color de texto principal
- Etiquetas: fondo de superficie, texto principal, borde temático

#### **Estadísticas**
- Números: color de texto principal
- Etiquetas: color de texto secundario
- Iconos: mantienen su color natural (emojis)

#### **Botones de Acción**
- Botón compartir: fondo de superficie con borde temático
- Texto con color principal del tema

#### **Sección de Comentarios**
- Título: color de texto principal
- "Ver todos": color rojo de Pinterest (consistente en ambos temas)
- Input de comentario: fondo de superficie, borde temático, texto secundario

### 4. **StatusBar Dinámica**
```typescript
<StatusBar 
  barStyle={isDarkMode ? "light-content" : "dark-content"} 
  backgroundColor={themeColors.background} 
/>
```

## 🎨 Colores Utilizados

### Colores de Pinterest (Modo Claro)
- **Background**: `#FFFFFF` (blanco puro)
- **Surface**: `#FFFFFF` (blanco puro)
- **Text**: `#211922` (negro suave)
- **Text Secondary**: `#5F5F5F` (gris medio)
- **Border**: `#E9E9E9` (gris muy claro)
- **Red**: `#E60023` (rojo Pinterest - usado en "Ver todos")

### Colores de Tokyo Ghoul (Modo Oscuro)
- **Background**: Gradiente oscuro
- **Surface**: Gris medio
- **Text**: Blanco/Gris claro
- **Borders**: `#333` (gris oscuro)

## 💡 Uso

1. Abre cualquier pin en vista detallada
2. Presiona el botón ☀️/🌙 en la esquina superior derecha
3. El tema cambiará instantáneamente afectando todos los componentes
4. El estado se mantiene mientras la vista esté abierta

## 🔧 Implementación Técnica

### Estado del Tema
```typescript
const [isDarkMode, setIsDarkMode] = useState(true);
```

### Toggle Function
```typescript
const toggleTheme = useCallback(() => {
  setIsDarkMode(prev => !prev);
}, []);
```

### Colores Dinámicos
```typescript
const themeColors = {
  background: isDarkMode ? Colors.background : Colors.pinterestBackground,
  surface: isDarkMode ? Colors.surface : Colors.pinterestSurface,
  text: isDarkMode ? Colors.text : Colors.pinterestText,
  textSecondary: isDarkMode ? Colors.textSecondary : Colors.pinterestTextSecondary,
  border: isDarkMode ? '#333' : Colors.pinterestBorder,
  gradientStart: isDarkMode ? Colors.gradientStart : '#F0F0F0',
  gradientEnd: isDarkMode ? Colors.gradientEnd : '#FFFFFF',
};
```

### Aplicación de Estilos
```typescript
<Text style={[styles.pinTitle, { color: themeColors.text }]}>
  {pin.title}
</Text>
```

## 📱 Compatibilidad

- ✅ iOS
- ✅ Android
- ✅ Web
- ✅ Cursor pointer en web para mejor UX
- ✅ Transiciones CSS solo en plataforma web

## 🎯 Beneficios

1. **Flexibilidad Visual**: Los usuarios pueden elegir su preferencia
2. **Mejor Legibilidad**: Modo claro ideal para ambientes luminosos
3. **Coherencia de Marca**: Modo oscuro mantiene la identidad Tokyo Ghoul
4. **UX Mejorada**: Cambio instantáneo sin recarga
5. **Accesibilidad**: Soporte para diferentes condiciones de iluminación

## 🚀 Próximas Mejoras Sugeridas

1. **Persistencia del Tema**: Guardar preferencia en AsyncStorage
2. **Animación de Transición**: Fade suave entre temas
3. **Tema Automático**: Detectar preferencia del sistema
4. **Aplicar a Toda la App**: Extender a HomeScreen y otras pantallas
5. **Modo de Ahorro de Batería**: Sugerir modo oscuro en batería baja

## 📝 Notas de Desarrollo

- El tema NO persiste entre sesiones (siempre inicia en modo oscuro)
- Solo afecta a `ImageDetailScreen.tsx` actualmente
- Compatible con el sistema de colores existente en `Colors.ts`
- No interfiere con el tema dual de HomeScreen (web/móvil)
