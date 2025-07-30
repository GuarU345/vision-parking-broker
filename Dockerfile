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

# Verificar que los archivos se compilaron correctamente
RUN ls -la dist/

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]
