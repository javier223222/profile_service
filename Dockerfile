# Usar Node.js 18 como imagen base
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar prisma schema
COPY prisma ./prisma/

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Crear usuario no root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar propietario de los archivos
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer el puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
