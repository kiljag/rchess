# React Chess

Chess Player made with React/Typescript.
This project is hosted [here](http://rchess.kjagadeesh.com)

![board image](https://github.com/kiljag/rchess/blob/master/src/assets/chess-board.png?raw=true)

## Docker Image

``` bash
docker pull kjagadeesh/rchess
docker run -dp 8080:8080 kjagadeesh/rchess
```

## Manual building
```bash

# clone and install dependencies
git clone https://https://github.com/kiljag/rchess
cd rchess
cd client && npm i
cd server && npm i
npm run dev
```
