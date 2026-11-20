# 👟 UrbanFeet — Frontend E-commerce SPA & Asistente Virtual

Aplicación de página única (SPA) moderna, responsiva y de alto rendimiento para la plataforma de calzado **UrbanFeet**. Desarrollada como parte del curso de **Innovación y Transformación Digital (UTP - Ciclo 2026)**.

---

## 🌐 Accesos Rápidos y Despliegue en la Nube

| Recurso | Enlace / Acceso | Estado |
| :--- | :--- | :--- |
| **Frontend Web (Producción)** | 🔗 [https://ind-urban-feet-frontend.onrender.com](https://ind-urban-feet-frontend.onrender.com) | `Online` |
| **Backend REST API (Producción)** | 🔗 [https://ind-urban-feet-backend.onrender.com/api](https://ind-urban-feet-backend.onrender.com/api) | `Online` |
| **Repositorio Frontend (GitHub)** | 🔗 [https://github.com/Renzito0637d/IND-urban-feet-frontend.git](https://github.com/Renzito0637d/IND-urban-feet-frontend.git) | `develop` |
| **Repositorio Backend (GitHub)** | 🔗 [https://github.com/Renzito0637d/IND-urban-feet-backend.git](https://github.com/Renzito0637d/IND-urban-feet-backend.git) | `develop` |

> [!NOTE]  
> **Comportamiento FinOps (Render Free Tier):** Debido al plan gratuito en Render, si el backend no ha tenido actividad reciente, puede requerir de 30 a 45 segundos para reactivarse en la primera consulta.

---

## 📊 Matriz de Tecnologías y Herramientas del Proyecto

| Capa / Módulo | Tecnología / Herramienta | Rol en la Experiencia de Usuario |
| :--- | :--- | :--- |
| **Framework SPA** | **Angular 19+ (Standalone Components)** | Arquitectura moderna sin módulos complejos, enrutamiento con *Lazy Loading* y rendimiento optimizado. |
| **Gestión de Estado** | **Angular Signals & RxJS** | Estado reactivo para cálculo inmediato de totales en el carrito, sincronización de filtros y estados del chat. |
| **Diseño y Estilos** | **Tailwind CSS + Modo Oscuro** | Interfaz limpia, urbana y responsiva con soporte nativo de modo claro y oscuro (`dark mode`). |
| **Componentes UI** | **Angular Material + ngx-sonner** | Modales de detalle de producto (`MatDialog`), controles de formulario y notificaciones interactivas toast. |
| **Asistente Virtual B2C** | **UrbanBot (Google Gemini Flash API)** | Widget flotante de chat con respuestas puntuales de stock, guía de tallas y tarjetas que abren el modal del producto. |
| **Plataforma Analítica Conectada** | **Databricks AI/BI & Genie Agent** | Ecosistema Lakehouse que procesa transacciones de la tienda para generar tableros analíticos y agente Text-to-SQL. |
| **Despliegue Web** | **Nginx Alpine en Render** | Servidor web ultra ligero con consumo inferior a 15 MB de memoria RAM. |

---

## 🧩 Módulos Principales de la Aplicación

### 1. Catálogo Dinámico con Paginación y Filtros Delegados
* Filtros combinados por Marca, Tipo, Género, Talla y Rango de Precio.
* Delegación de consultas a PostgreSQL para evitar sobrecarga de memoria en el navegador.

### 2. Carrito de Compras Reactivo
* **Validación de stock físico en tiempo real:** Impide añadir cantidades superiores a las existencias físicas para mitigar sobreventas.
* **Cálculo automático de envío:** Tarifa plana de S/ 20 para compras menores a S/ 300, y **envío 100% gratuito** a todo el Perú a partir de S/ 300.

### 3. Asistente Virtual Inteligente (UrbanBot)
* Widget flotante disponible en todas las vistas de clientes.
* Preguntas frecuentes predeterminadas (tallas importadas, zapatillas running, envío gratis).
* **Tarjetas interactivas de zapatillas recomendadas:** Muestra miniatura, marca, precio y un botón **"Ver"** que abre el modal del calzado al instante para elegir talla y comprar.

### 4. Panel de Administración y Gestión
* Módulo de productos y variaciones (gestión de URLs de imágenes, tallas, colores y stock físico).
* Bandeja de pedidos con transiciones de estado (`COMPLETADO`, `CANCELADO`, `REEMBOLSADO`).
* Monitoreo de ventas e inventario sincronizado con el modelo analítico de **Databricks**.

### 5. Libro de Reclamaciones (Cumplimiento Normativo)
* Formulario normativo para registro de reclamos y quejas conforme a la regulación peruana (INDECOPI / Ley N.º 29733), con vinculación automática de cuenta si la sesión está abierta.

---

## 📂 Estructura del Proyecto

```text
src/app/
├── admin/                 # Vistas y panel de administración (Lazy Loaded)
│   ├── layout/            # Layout administrativo con sidebar
│   └── pages/             # Gestión de zapatillas, variaciones, pedidos, ventas
├── components/            # Componentes reutilizables
│   ├── chat-widget/       # Widget flotante de UrbanBot (Gemini Flash)
│   ├── producto-detalle/  # Modal interactivo de producto (colores/tallas)
│   ├── header/ & footer/  # Cabecera y pie de página
│   └── layout-cliente/    # Layout público del cliente
├── interceptors/          # Interceptores HTTP (api-prefix, error handling)
├── models/                # Interfaces TypeScript (Zapatilla, Carrito, Pedido, Chat)
├── pages/                 # Vistas públicas (Inicio, Catálogo, Carrito, Reclamos)
└── services/              # Clientes de comunicación REST con Spring Boot
```

---

## 🛠️ Ejecución Local

### Prerrequisitos
* **Node.js 20+**
* **npm 10+**
* Backend de Spring Boot ejecutándose en `http://localhost:8080`

### 1. Instalación de Dependencias
```bash
cd IND-urban-feet-frontend
npm install
```

### 2. Iniciar Servidor de Desarrollo
```bash
npm start
# O mediante el CLI de Angular:
# npx ng serve
```
La aplicación web se abrirá automáticamente en `http://localhost:4200`.

### 3. Compilación para Producción
```bash
npm run build
```
Los archivos estáticos listos para Nginx se generarán en la carpeta `dist/urban-feet-frontend`.
