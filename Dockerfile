# ==============================================================================
# Etapa 1: Compilación de la aplicación Angular con Node.js 20 Alpine
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifiestos de paquetes
COPY package*.json ./

# Instalación limpia de dependencias
RUN npm ci

# Copiar el código fuente del proyecto
COPY . .

# Compilar para producción (usa environment.prod.ts)
RUN npm run build -- --configuration production

# ==============================================================================
# Etapa 2: Servidor Web Nginx ultra-ligero para Producción en Render
# Consumo en ejecución: < 15MB RAM y mínimo CPU
# ==============================================================================
FROM nginx:alpine AS runner

# Copiar configuración optimizada para SPA de Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build compilado desde la etapa builder
COPY --from=builder /app/dist/urban-feet-frontend/browser /usr/share/nginx/html

EXPOSE 80

# En Render, la variable $PORT se inyecta dinámicamente; reemplazamos el puerto al iniciar
CMD ["/bin/sh", "-c", "sed -i 's/listen 80;/listen '\"${PORT:-80}\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
