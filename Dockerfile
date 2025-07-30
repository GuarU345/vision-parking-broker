# Usar Node.js 22 slim como imagen base
FROM node:22-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar archivos de configuración de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN pnpm exec tsc

# Exponer el puerto si es necesario (opcional, dependiendo de tu aplicación)
# EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]
