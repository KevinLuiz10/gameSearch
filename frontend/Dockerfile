FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# A porta padrão do Vite é 5173
EXPOSE 5173

# "--host" libera o acesso externo (fora do container)
CMD ["npm", "run", "dev", "--", "--host"]