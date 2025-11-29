# 🎮 GameSearch

> Um catálogo para explorar os melhores jogos gratuitos disponíveis no mercado.


## Sobre o Projeto

**GameSearch** é uma Single Page Application (SPA) desenvolvida como parte da disciplina de Desenvolvimento Fullstack. O objetivo da aplicação é oferecer uma interface intuitiva para que usuários possam buscar, filtrar e visualizar detalhes de centenas de jogos *free-to-play*.
---

## API Consumida

Os dados da aplicação são alimentados pela **FreeToGame API**.

- **Fonte:** [FreeToGame API Documentation](https://www.freetogame.com/api-doc)
- **Descrição:** Uma API pública que fornece acesso a uma vasta base de dados de jogos gratuitos, incluindo informações como título, descrição, gênero, plataforma e imagens.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando a seguinte stack tecnológica:

### Frontend
* **React:** Biblioteca JavaScript para construção da interface do usuário.
* **Vite:** Build tool para desenvolvimento rápido e otimizado.
* **Material UI:** Biblioteca de componentes React.

### Backend
* **Node.js:** Ambiente de execução JavaScript server-side.
* **Express.js:** Framework para construção da API REST.

### Banco de Dados
* **MySQL:** Sistema de gerenciamento de banco de dados relacional.

### DevOps & Infraestrutura
* **Docker:** Para containerização da aplicação.
* **Docker Compose:** Para orquestração dos serviços (App, API e DB).
---

## Como Rodar Localmente

### Pré-requisitos
* Git
* Docker e Docker Compose

### Passo a Passo

1. **Clone o repositório:**

    git clone [https://github.com/seu-usuario/seu-projeto.git](https://github.com/seu-usuario/seu-projeto.git)
    cd seu-projeto

2. **Permissão de Execução:**
   É necessário dar permissão ao script de inicialização (Linux/Mac/WSL):

    chmod +x init.sh

3. **Iniciando a Aplicação:**
   Execute o script para construir e subir os containers:

    ./init.sh

   **Nota:** O script `init.sh` cuida de parar containers antigos, fazer o build e subir a aplicação limpa.

---

## 🔌 Acessos

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| **Frontend** | http://localhost:5173 | Interface Web (Vite) |
| **Backend** | http://localhost:3000 | API REST (Node) |
| **Banco** | localhost:3306 | Porta MySQL Exposta |

---

## 🗃️ Banco de Dados

O banco de dados `gamesearch_db` é criado automaticamente na primeira execução através do volume do Docker.

* **Host:** localhost
* **Port:** 3306
* **Database:** gamesearch_db
* **User/Password:** Definidos no docker-compose.yml


Desenvolvido por Kevin Lima e Alexis Liasch para a disciplina de Desenvolvimento Fullstack.