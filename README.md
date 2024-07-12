# Projeto CRUD de Veículos

Este é um projeto backend para gerenciamento de veículos, desenvolvido em Node.js. Ele inclui operações CRUD (Create, Read, Update, Delete) e utiliza Jest para testes unitários. O banco de dados utilizado é SQLite e os dados podem ser salvos em arquivos.

## Funcionalidades

- CRUD de veículos com os seguintes atributos:
  - id
  - placa
  - chassi
  - renavam
  - modelo
  - marca
  - ano

## Pré-requisitos

- Node.js
- Docker e Docker Compose

## Como rodar o projeto

### Usando Docker Compose

1. Clone o repositório:
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2. Execute o Docker Compose:
    ```bash
    docker-compose up --build
    ```

3. A API estará disponível em: `http://localhost:3000`

### Rodando localmente

1. Clone o repositório:
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Inicie o servidor:
    ```bash
    npm start
    ```

4. A API estará disponível em: `http://localhost:3000`

## Executando os testes unitários

Para rodar os testes unitários, siga os passos abaixo:

1. Certifique-se de estar no diretório do projeto:
    ```bash
    cd <NOME_DO_REPOSITORIO>
    ```

2. Execute os testes:
    ```bash
    npm test
    ```

## Endpoints da API

### Criar um veículo
- **POST** `/vehicles`
  - Body: 
    ```json
    {
      "placa": "ABC-1234",
      "chassi": "12345678901234567",
      "renavam": "12345678901",
      "modelo": "Modelo X",
      "marca": "Marca Y",
      "ano": 2020
    }
    ```

### Listar todos os veículos
- **GET** `/vehicles`

### Buscar um veículo por ID
- **GET** `/vehicles/:id`

### Atualizar um veículo
- **PUT** `/vehicles/:id`
  - Body: 
    ```json
    {
      "placa": "ABC-1234",
      "chassi": "12345678901234567",
      "renavam": "12345678901",
      "modelo": "Modelo X",
      "marca": "Marca Y",
      "ano": 2021
    }
    ```

### Deletar um veículo
- **DELETE** `/vehicles/:id`

## Estrutura do Projeto

    .
    ├── src
    │   ├── controllers
    │   ├── models
    │   ├── routes
    │   ├── services
    │   └── app.js
    ├── test
