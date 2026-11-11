# La Caja de los Recuerdos — Sofía's Bat Mitzvah Art Project

Sitio web para el proyecto artístico escolar de Sofía.

🌐 **Ver el sitio:** https://marcepincha.github.io/sofia-bat-mitzvah

## 📁 Estructura

```
sofia-bat-mitzvah/
├── index.html          ← Página principal
├── css/style.css       ← Estilos
├── js/main.js          ← Interacciones
├── audio/
│   └── hatikvah.mp3    ← Música de fondo
├── data/
│   └── galeria.csv     ← Descripciones de las fotografías
├── images/
│   ├── mockup.jpg      ← Foto de la maqueta (WhatsApp Image)
│   └── galeria/        ← Fotografías familiares de la galería
└── README.md
```

## 🖼️ Agregar las fotos

1. Guardá la foto de la maqueta como `images/mockup.jpg`
2. Guardá las fotografías familiares dentro de `images/galeria/` y publicá los cambios en GitHub. El sitio detecta automáticamente los archivos de esa carpeta (JPG, PNG, GIF, WebP y AVIF).
3. Para agregar descripciones, editá `data/galeria.csv` usando el nombre exacto de la imagen. Podés dejar vacíos los idiomas sin descripción.

La detección automática usa la API pública de GitHub Pages; si abrís el sitio fuera de GitHub Pages, la galería usa como lista alternativa los archivos incluidos en `data/galeria.csv`.

## 🚀 Publicar en GitHub Pages

1. Creá un repositorio en GitHub llamado `sofia-bat-mitzvah`
2. Subí todos estos archivos
3. En Settings → Pages → Source: seleccioná `main` / `root`
4. ¡Listo! El sitio estará en `https://marcepincha.github.io/sofia-bat-mitzvah`

## 🎵 Música

El Hatikva (הַתִּקְוָה) se reproduce en loop desde `audio/hatikvah.mp3`. El navegador puede requerir que la persona interactúe con la página antes de permitir la reproducción con sonido.
