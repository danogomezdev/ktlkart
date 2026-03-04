# 🏎️ KTLKART - Sitio Web Oficial

## Estructura del proyecto

```
ktlkart/
├── frontend/
│   └── index.html          ← Página web completa (abrir en navegador)
├── backend/
│   ├── server.js           ← Servidor Node.js principal
│   ├── package.json        ← Dependencias
│   ├── .env.example        ← Variables de entorno (renombrar a .env)
│   ├── routes/
│   │   ├── contact.js      ← Endpoint envío de emails
│   │   └── products.js     ← Endpoint productos
│   └── uploads/
│       ├── tierra/         ← Fotos del chasis Tierra
│       ├── asfalto/        ← Fotos del chasis Asfalto
│       └── escuela/        ← Fotos del chasis Escuela
└── README.md
```

---

## ⚙️ INSTALACIÓN Y CONFIGURACIÓN

### 1. Instalar Node.js
Descargá Node.js desde https://nodejs.org (versión LTS)

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```
Editá el archivo `.env` con tus datos:

```env
PORT=3001
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
OWNER_EMAIL=gonzalovega23@icloud.com
WHATSAPP_NUMBER=5493462597788
```

### 4. Configurar Gmail para envío de emails
1. Activar verificación en 2 pasos en tu cuenta Google
2. Ir a: Google Account → Seguridad → Contraseñas de aplicaciones
3. Crear contraseña para "Correo" + "Otro dispositivo"
4. Usar esa contraseña en EMAIL_PASS

### 5. Iniciar el backend
```bash
cd backend
npm run dev    # con auto-recarga (desarrollo)
# o
npm start      # producción
```

### 6. Ver el sitio web
Abrí el archivo `frontend/index.html` en tu navegador.

---

## 📸 CÓMO AGREGAR FOTOS

1. Guardá las fotos en la carpeta correspondiente:
   - `backend/uploads/tierra/` → fotos del KTL Tierra
   - `backend/uploads/asfalto/` → fotos del KTL Asfalto
   - `backend/uploads/escuela/` → fotos del KTL Escuela

2. Formatos aceptados: `.jpg`, `.jpeg`, `.png`, `.webp`

3. Las fotos se mostrarán automáticamente en el sitio.

---

## 🚀 SUBIR A PRODUCCIÓN (ktlkart.com.ar)

### Opción A - Hosting compartido (ej: Hostinger, SiteGround)
1. Subí el contenido de `frontend/` a `public_html/`
2. Para el backend, necesitás un VPS o hosting Node.js

### Opción B - VPS (recomendado)
1. Subí todo el proyecto al servidor
2. Instalá Node.js y PM2: `npm install -g pm2`
3. Iniciá el backend: `pm2 start backend/server.js --name ktlkart`
4. Configurá Nginx para servir el frontend y hacer proxy al backend

### Opción C - Railway/Render (gratis para empezar)
1. Subí el proyecto a GitHub
2. Conectá con Railway.app o Render.com
3. Configurá las variables de entorno en el dashboard

---

## 📱 FUNCIONALIDADES

- ✅ Página principal con hero section
- ✅ 3 tarjetas de productos (Tierra, Asfalto, Escuela)
- ✅ Modal detallado para cada producto con especificaciones
- ✅ Formulario de consulta/reserva con envío de email
- ✅ Email de confirmación al cliente
- ✅ Botón flotante de WhatsApp
- ✅ Diseño responsive (mobile/tablet/desktop)
- ✅ Custom cursor racing
- ✅ Animaciones al hacer scroll
- ✅ Rate limiting en el backend
- ✅ Soporte para fotos de productos

## 🔮 FUNCIONALIDADES FUTURAS (ya preparado)
- 🔄 Venta online (agregar pasarela de pago)
- 🔄 Panel de administración de productos
- 🔄 Galería de fotos expandida
- 🔄 Blog/noticias de karting

---

## 📞 Soporte
- WhatsApp: +54 9 3462 597788
- Email: gonzalovega23@icloud.com
