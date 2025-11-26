# 🎮 GameSearch

> Um catálogo moderno e responsivo para explorar os melhores jogos gratuitos disponíveis no mercado.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)

---

## Sobre o Projeto

**GameSearch** é uma Single Page Application (SPA) desenvolvida como parte da disciplina de Desenvolvimento Fullstack. O objetivo da aplicação é oferecer uma interface intuitiva para que usuários possam buscar, filtrar e visualizar detalhes de centenas de jogos *free-to-play*.

O projeto foca em performance e experiência do usuário (UX), implementando técnicas modernas de otimização de busca e layout responsivo que se adapta de celulares a monitores ultrawide.

---

## Acesse o Projeto

Você pode ver a aplicação rodando em tempo real através dos links abaixo:

- **Link Principal:** [game-search-mu.vercel.app](https://game-search-mu.vercel.app)
- **Link Alternativo:** [game-search-git-main-kevin-luizs-projects.vercel.app](https://game-search-git-main-kevin-luizs-projects.vercel.app)

---

## API Consumida

Os dados da aplicação são alimentados pela **FreeToGame API**.

- **Fonte:** [FreeToGame API Documentation](https://www.freetogame.com/api-doc)
- **Descrição:** Uma API pública que fornece acesso a uma vasta base de dados de jogos gratuitos, incluindo informações como título, descrição, gênero, plataforma e imagens.

---

## Tecnologias Utilizadas

- **React.js:** Biblioteca principal para construção da interface.
- **Vite:** Ferramenta de build para um desenvolvimento rápido e otimizado.
- **Material UI (MUI):** Biblioteca de componentes para um design system robusto e consistente.
- **Context API:** Para gerenciamento global de estado dos jogos.
- **Vercel:** Plataforma utilizada para o deploy e hospedagem.

---

## Funcionalidades Destacadas

### 🔍 Busca Inteligente com Debounce
Para tornar a pesquisa mais dinâmica e performática, foi implementada a técnica de **Debounce**.
- **Como funciona:** O sistema detecta quando o usuário está digitando e aguarda **1 segundo** de inatividade antes de realizar a busca automaticamente.
- **Benefício:** Isso evita filtragens desnecessárias a cada letra digitada, melhorando o desempenho da aplicação e oferecendo uma experiência de uso mais fluida, sem a necessidade de clicar sempre no botão "Buscar".

---

Como rodar localmente

Clone o repositório:

git clone [https://github.com/KevinLuiz10/gameSearch.git](https://github.com/KevinLuiz10/gameSearch.git)


Entre na pasta do projeto:

cd GameSearch


Instale as dependências:

npm install


Rode o servidor de desenvolvimento:

npm run dev


Desenvolvido por Kevin Lima e Alexis Liasch para a disciplina de Desenvolvimento Fullstack.