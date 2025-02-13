# FriendIAry

FriendIAry es una aplicación móvil desarrollada en React Native con Expo, diseñada para ayudar a los usuarios a registrar y gestionar sus pensamientos y emociones a través de notas escritas y grabaciones de audio. La aplicación incorpora inteligencia artificial para analizar el sentimiento de las notas y proporcionar respuestas empáticas basadas en su contenido.

## 📌 Características Principales

- **Creación de Notas:** Permite a los usuarios escribir notas con un título opcional y guardarlas en Firebase.
- **Conversión de Voz a Texto:** Grabación de notas de voz con transcripción automática mediante Google Speech-to-Text API.
- **Análisis de Sentimientos:** Uso de OpenAI GPT-3.5 Turbo para detectar emociones en las notas y asignar un emoji representativo.
- **Mensajes de Apoyo Personalizados:** Genera mensajes de ánimo según el análisis de sentimiento de cada nota.
- **Historial de Notas:** Visualización y gestión de todas las notas creadas por el usuario.
- **Autenticación con Firebase:** Implementa login y registro de usuarios.

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd friendiary
```

### 2️⃣ Instalar Dependencias
```bash
npm install  # O bien, yarn install
```

### 3️⃣ Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:
```env
FIREBASE_API_KEY=TU_CLAVE
FIREBASE_AUTH_DOMAIN=TU_DOMINIO
FIREBASE_PROJECT_ID=TU_ID
FIREBASE_STORAGE_BUCKET=TU_BUCKET
FIREBASE_MESSAGING_SENDER_ID=TU_SENDER_ID
FIREBASE_APP_ID=TU_APP_ID
GOOGLE_SPEECH_TO_TEXT_API_KEY=TU_CLAVE
OPENAI_API_KEY=TU_CLAVE
```
Asegúrate de que tu `babel.config.js` tiene lo siguiente para poder leer variables de entorno:
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [["module:react-native-dotenv"]],
  };
};
```

### 4️⃣ Configurar Firebase
- Crea un proyecto en Firebase.
- Habilita Firebase Authentication y Firestore Database.
- Descarga el archivo `google-services.json` y colócalo en la raíz del proyecto.

### 5️⃣ Ejecutar la Aplicación
```bash
npx expo start
```

---

## 📂 Estructura del Proyecto
```
friendiary/
│-- assets/              # Archivos de imágenes y multimedia
│-- backend/             # Lógica de análisis de sentimientos y conversión de voz a texto
│-- pantallas/           # Componentes principales de la app (Menu, Historial, etc.)
│-- styles/              # Archivos de estilos para cada pantalla
│-- firebase.js          # Configuración de Firebase
│-- .env                 # Variables de entorno (NO subir a GitHub)
│-- App.js               # Punto de entrada de la app
│-- app.json             # Configuración de Expo
│-- babel.config.js      # Configuración de Babel
│-- package.json         # Dependencias del proyecto
│-- README.md            # Documentación del proyecto
```

---

## 📌 Funcionalidades Detalladas

### 🔹 Crear Notas
- Desde la pantalla `CrearNotas.js`, el usuario puede escribir una nota y guardarla en Firebase.
- Las notas se guardan en `notas/{usuario}/mis_notas/{notaID}` en Firestore.

### 🔹 Grabar Audio y Convertirlo a Texto
- Se activa la grabación con `expo-av`.
- El audio se convierte en texto usando `Google Speech-to-Text API`.
- El texto transcrito se guarda en Firebase como una nota escrita automáticamente.

### 🔹 Analizar Sentimientos con GPT-3.5 Turbo
- Cada nota se analiza con OpenAI GPT-3.5 Turbo.
- Se asigna un emoji de estado de ánimo basado en el análisis (😃, 🙂, 😐, 😟, 😢).
- Se genera un mensaje empático y motivador en `HistorialNotas.js`.

### 🔹 Historial de Notas
- Se listan todas las notas del usuario.
- Al tocar una nota, se abre su contenido completo.
- Al tocar el emoji de estado de ánimo, se muestra un mensaje generado por IA.

---

## 🔧 Tecnologías Utilizadas

- **React Native**: Desarrollo móvil.
- **Expo**: Manejo del entorno de desarrollo.
- **Firebase**: Base de datos y autenticación.
- **Google Cloud Speech-to-Text API**: Transcripción de audio.
- **OpenAI GPT-3.5 Turbo**: Análisis de sentimientos y generación de mensajes.

---

## 🤝 Contribución
Si deseas contribuir al proyecto:
1. Realiza un fork del repositorio.
2. Crea una nueva rama: `git checkout -b mi-nueva-feature`.
3. Realiza los cambios y confirma: `git commit -m "Agregada nueva feature"`.
4. Sube los cambios: `git push origin mi-nueva-feature`.
5. Abre un Pull Request.

---

## 📜 Licencia
Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

---


