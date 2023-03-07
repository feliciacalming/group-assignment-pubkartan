# PUBKARTAN

Group project in the course API-Development at **Medieinstitutet**.

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#the-team">The Team</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

## About The Project

Pubkartan is a reviewsite, where users can register to look for Pubs in different swedish cities. When logged in, a user can add a pub, if it's not already on the site, write reviews and look at other users reviews.

## Built With

This is the tech stack used for this project:

- [Node](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/index.html)

## The Team

The team that built this consisted of the following members.

#### Adam Danielsson

- [LinkedIn](https://www.linkedin.com/in/adam-danielsson-589265193/)
- [Github](https://github.com/adamovd)

#### Felicia Calming

- [LinkedIn](https://www.linkedin.com/in/felicia-calming/)
- [Github](https://github.com/feliciacalming)

#### Johan Sträng

- [LinkedIn](https://www.linkedin.com/in/johan-str%C3%A4ng-a2b81824b/)
- [Github](https://github.com/JohanStrang)

## Getting Started

Clone this repo and open it in an editor such as VS Code.

### Installation

1. ```sh
   git clone https://github.com/feliciacalming/group-assignment-pubkartan
   ```
2. ```sh
   npm i
   ```
3. ```sh
   npm run seedDb
   ```
4. ```sh
   npm run dev
   ```
5. Create an .env-file at the root of the directory and add the following:
   ```bash
   PORT = 3000
   JWT_SECRET = XXXX
   ```
