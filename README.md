# Flores Amarillas 🌼

Una página web romántica y elegante que recrea un campo de flores amarillas flotando entre las nubes, con un contador que celebra el tiempo transcurrido desde una fecha especial.

## Descripción

Al abrir la página aparece un cielo de atardecer, un campo de flores amarillas construidas enteramente con HTML y CSS, pétalos de rosa cayendo, partículas de luz y corazones flotantes. En el centro, un contador calcula en tiempo real cuántos años, meses, días y minutos han pasado desde el **06 de octubre de 2021**, acompañado de un mensaje de amor.

Es un proyecto 100% estático: no requiere backend, base de datos ni frameworks. Funciona abriendo `index.html` directamente en cualquier navegador, y está listo para publicarse en GitHub Pages.

## Tecnologías utilizadas

- **HTML5** semántico
- **CSS3** (gradientes, animaciones, variables CSS, media queries)
- **JavaScript** vanilla (ES6+), sin librerías ni frameworks

## Estructura de carpetas

```
flores-amarillas/
│
├── index.html
├── README.md
├── .gitignore
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── assets/
    ├── images/
    └── audio/
```

## Personalizar

- **Fecha de inicio:** cambia `START_DATE` en `js/script.js`.
- **Título y mensaje:** edita el texto dentro de `<header class="hero-text">` y `<p class="love-message">` en `index.html`.
- **Colores:** ajusta las variables dentro de `:root` en `css/style.css`.
- **Cantidad de flores:** modifica `FLOWER_COUNT` en `js/script.js`.

## Cómo subirlo a GitHub

Desde la carpeta del proyecto, ejecuta:

```bash
git init
git add .
git commit -m "Primer commit"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

Reemplaza `URL_DEL_REPOSITORIO` por la URL de tu repositorio en GitHub (por ejemplo `https://github.com/tu-usuario/flores-amarillas.git`).

## Cómo activar GitHub Pages

1. Entra a tu repositorio en GitHub.
2. Ve a **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige la rama **main** y la carpeta **/root**.
5. Guarda los cambios (**Save**).

## Cómo obtener el enlace público

Después de guardar, GitHub tardará uno o dos minutos en publicar el sitio. El enlace aparecerá en la misma sección de **Settings → Pages**, con el formato:

```
https://tu-usuario.github.io/flores-amarillas/
```

---

Hecho con cariño para una persona especial. 🌼❤️
