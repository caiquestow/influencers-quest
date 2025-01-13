# Use uma imagem base com Node.js e Python
FROM node:18

# Instale Python3
RUN apt-get update && apt-get install -y python3 python3-pip

# Copie o código para o container
WORKDIR /app
COPY . .

# Instale as dependências do Node.js
RUN npm install

# Exponha a porta 3000
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "run", "start"]
