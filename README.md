# FLISoL UTP 2026 – Generador de Pase

Aplicación mínima en React que genera el **pase personalizado** del evento **FLISoL UTP 2026**. El usuario sube su foto, escribe su nombre y descarga su entrada lista para compartir.

- 📅 **Fecha:** Sábado 25 de abril de 2026
- 📍 **Lugar:** Universidad Tecnológica del Perú – Lima, Perú

---

## 1. Stack

| Herramienta    | Versión |
| -------------- | ------- |
| React          | 19      |
| Vite           | 8       |
| Tailwind CSS   | 3       |
| framer-motion  | 12      |
| lucide-react   | 1.x     |

---

## 2. Estructura

```text
flisol/
├── public/
│   └── images/
│       ├── plantilla-pase.png      # Plantilla base del pase (3375 × 4219)
│       └── flisol-utp-favicon.jpg  # Favicon
├── src/
│   ├── components/
│   │   └── TicketGenerator.jsx     # ⭐ Componente único
│   ├── constants/
│   │   └── designTokens.js         # Clases tipográficas reutilizables
│   ├── App.jsx                     # Monta TicketGenerator
│   ├── index.css                   # Tailwind + estilos globales
│   └── main.jsx                    # Punto de entrada React
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── eslint.config.js
```

---

## 3. Cómo ejecutar

Requisitos: Node.js 20+ y npm 10+.

```bash
npm install
npm run dev       # entorno de desarrollo
npm run build     # build de producción
npm run preview   # previsualizar build
npm run lint      # lint
```

---

## 4. Cómo funciona el componente

`src/components/TicketGenerator.jsx` dibuja todo el pase sobre un `<canvas>` de 3375×4219 px:

1. Carga la plantilla `/images/plantilla-pase.png` como fondo.
2. Recorta la foto del usuario en círculo (o muestra un avatar placeholder con silueta).
3. Renderiza el nombre dentro de un "pill" blanco centrado.
4. Permite **descargar** la imagen en PNG o **compartir** abriendo LinkedIn con texto pre-armado.

### Constantes de layout (en el mismo archivo)

| Constante              | Significado                                              |
| ---------------------- | -------------------------------------------------------- |
| `PHOTO_CENTER_X / Y`   | Centro del círculo de foto (porcentaje sobre el canvas)  |
| `PHOTO_RADIUS`         | Radio del círculo (porcentaje sobre el ancho)            |
| `PHOTO_BORDER_WIDTH`   | Grosor del borde blanco                                  |
| `NAME_PILL_Y`          | Posición vertical del pill de nombre                     |
| `NAME_PILL_HEIGHT`     | Alto del pill                                            |
| `NAME_FONT_SIZE`       | Tamaño de fuente del nombre                              |
| `NAME_PILL_PADDING`    | Padding horizontal del pill                              |

Para cambiar la plantilla del pase, reemplaza `public/images/plantilla-pase.png` y, si las proporciones cambian, ajusta esas constantes.
