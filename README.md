# recruitment-backend-track-typescript
An evaluation exercise for candidates willing to test their back-end capabilities. Typescript language track


1). come avviare il docker
Il progetto utilizza un Dockerfile multistage con due sezioni:
- development
- production
comandi:
- docker compose up --build => per creare il container sfruttando l'immagine development lanciare il comando

- BUILD_TARGET=production docker compose up --build -d => per creare il container sfruttando l'immagine di produzione. se la variabile BUILD_TARGET non viene valorizzata, di default viene passato "development".