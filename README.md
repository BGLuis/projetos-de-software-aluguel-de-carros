<div align="center">

![Angular][Angular.io]
![Nestjs][Nestjs.io]
![Mysql][Mysql.io]
![Sass][Sass.io]
![Docker][Docker.io]

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]

  <!-- <a href="https://github.com/bgluis/projetos-de-software-aluguel-de-carros/">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

  <h3>Alugueis de carros</h3>
  Trabalho de projeto de software
</div>

# 📖 Sobre

Projeto para a criação para um gerencialmente alugueis de carros passado pelo professor João Aramuni da disciplina de Projeto de Software

# 💻 Como iniciar

### Requisitos

-   Habilitar a virtualização no BIOS do seu computador
-   Ter o Docker instalado

### Instalação do Docker

1. Acesse o site oficial: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Baixe e instale o Docker conforme seu sistema operacional (Linux, Windows ou Mac).

3. Após instalar, verifique se está tudo certo:

```bash
docker --version
docker-compose --version
```

### Executando o ambiente de desenvolvimento

1. No diretório do projeto, execute:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

2. Para parar os containers:

```bash
docker compose -f docker-compose.dev.yml down
```

## Executando localmente

### Requisitos

-   Node 22

### Instalação do node

1. Acesse o site oficial: [https://nodejs.org/](https://nodejs.org/)
2. Baixe e instale o Node.js conforme seu sistema operacional (Linux, Windows ou Mac).

3. Após instalar, verifique se está tudo certo:

```bash
node --version
npm --version
```

# 🤝 Contribuidores

 <a href = "https://github.com/bgluis/projetos-de-software-aluguel-de-carros/graphs/contributors">
   <img src = "https://contrib.rocks/image?repo=bgluis/projetos-de-software-aluguel-de-carros"/>
 </a>

 <!-- Links -->
 <!-- https://github.com/iuricode/readme-template-->

[repossitory-path]: bgluis/projetos-de-software-aluguel-de-carros/
[contributors-shield]: https://img.shields.io/github/contributors/bgluis/projetos-de-software-aluguel-de-carros.svg?style=for-the-badge
[contributors-url]: https://github.com/bgluis/projetos-de-software-aluguel-de-carros/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bgluis/projetos-de-software-aluguel-de-carros.svg?style=for-the-badge
[forks-url]: https://github.com/bgluis/projetos-de-software-aluguel-de-carros/network/members
[stars-shield]: https://img.shields.io/github/stars/bgluis/projetos-de-software-aluguel-de-carros.svg?style=for-the-badge
[stars-url]: https://github.com/bgluis/projetos-de-software-aluguel-de-carros/stargazers
[issues-shield]: https://img.shields.io/github/issues/bgluis/projetos-de-software-aluguel-de-carros.svg?style=for-the-badge
[issues-url]: https://github.com/bgluis/projetos-de-software-aluguel-de-carros/issues
[license-shield]: https://img.shields.io/github/license/bgluis/projetos-de-software-aluguel-de-carros.svg?style=for-the-badge
[license-url]: https://github.com/bgluis/projetos-de-software-aluguel-de-carros/blob/master/LICENSE.txt
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Nestjs.io]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[Mysql.io]: https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&color=00758f&logoColor=white
[Sass.io]: https://img.shields.io/badge/Sass-000?style=for-the-badge&logo=sass&color=cc6699&logoColor=white
[Docker.io]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
