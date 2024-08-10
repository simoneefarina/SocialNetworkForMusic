**RELAZIONE PROGETTO TECNOLOGIE E LINGUAGGI WEB INFORMATICA**

Relazione progetto "Social Network for Music" per il corso "Programmazione e linguaggi per il web" (a.a. 2023-2024, appello di Febbraio). Realizzato![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.001.png) da Farina Simone (matricola 962865).

**STRUTTURA DEL PROGETTO** 

**TECNOLOGIE UTILIZZATE** 

**FRONTEND**

- HTML, EJS
- CSS, bootstrap

**BACKEND** 

- NodeJS
- Express
- Mongoose
- Bcrypt
- jsonwebtoken

**DATABASE**

- MongoDB

**PRESENTAZIONE DELL'APPLICAZIONE** 

Il sito sarà raggiungibile all’indirizzo http://localhost:3000

**Signup / Login**

Autenticazione utente 

![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.002.jpeg)

![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.003.jpeg)

**Profile** 

Ricerca canzoni albums e cantanti dalla barra di ricerca 

![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.004.jpeg)

**Search**

Ricerca canzoni albums e cantanti dalla barra di ricerca 

![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.005.jpeg)

**Artists**

Artisti preferiti 

![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.006.jpeg)

**My Playlist**

Le mie playlist 

![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.007.jpeg)

![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.008.jpeg)

**Search Public Playlist**

Ricerca per tag e nome della playlist tra le playlist pubbliche 

![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.009.jpeg)

![](Aspose.Words.dbe3bc63-352e-4e25-a69b-eb838b3dbe68.010.jpeg)

**STRUTTURA CODICE** 

**FRONTEND** 

Il progetto è organizzato in più pagine, la cui navigazione è gestita lato server tramite l'utilizzo della classe ***express.Router*** in (pages.js). Ogni pagina viene popolata dinamicamente attraverso delle richieste all'API ('/api'), Cercando di rispettare le regole **REST**'.Anche in qeusto caso gestito da ***express.Router*** in (router-api.js). Le pagine si suddividono in **EJS** e **HTML**. Le pagine **HTML** sono salvate in una directory differente (/public) e sono e sono le seguenti (public/login.html) e (public/signup.html). Ho creato queste due pagine poichè non necessitano di alcun valore dinamico al loro interno, e vengono inviati come file (res.sendFile()). Ho strutturato le directory del frontend in questo modo: 

public: 

- Css: stile css 
- Images: immagine utilizzata come test 
- Js: contiene i file javasvript 
- Artist 
- Playlist 
- publicPlaylist 
- user 
- views: all’interno sono contenuti tutti i file \*.ejs 

**BACKEND** 

Il backend è organizzato in vari file in (/controllers). Ognuno gestisce i diversi endpoint raggruppati per gruppo. Sono poi richiamati in routerapi.js per fornire le funzionalita API REST.

Ho strutturato le directory del frontend in questo modo: 

- controllers: gestisce i vari endpoint 
- models: contiene tutti i vari schemi di mongoose 
- middlewares: funzioni intermedie  
- routes: contiene tutti i vari file che gestiscono il routing 
- config: contiene la connessione a database  

**STRUTTURA DATABASE** 

**User** 

- \_id 
- Name 
- Surname 
- Email 
- Password 

**Artist** 

- \_id 
- userID 
- artistIds[] 

**Likedplaylist** 

- \_id 
- userID 
- playlist[] 

**Genres** 

- \_id 
- userID 
- isSelected[] 

**Playlist** 

- \_id 
- userID 
- name 
- description 
- tracks[] 
- tags[] 
- isPublic 

**SCELTE IMPLEMENTATIVE** 

**Autenticazione e Autorizzazione (JWT)** 

Per gestire l'autenticazione viene utilizzato JSON Web Tokens (JWT). Dopo che un utente effettua la registrazione o effettua il login viene creato un token e lo invia al client. Viene utilizzato per operazioni successive per accedere a pagine protette.

const accessToken = jwt.sign(             

{ id : newUser.\_id },             process.env.JWT\_ACCESS\_SECRET,  

`            `{ expiresIn: process.env.JWT\_ACCESS\_EXPIRES\_IN }  );  

res.cookie('jwt', accessToken, {              httpOnly: true,              

//secure: true,  

maxAge: 24 \* 60 \* 60 \* 1000  });  

**Middleware cookieJwtAuth** 

Questo middleware si occupa di verificare la presenza del token JWT nella richiesta. Successivamente verifica che sia valido. Se valido estrae lo userId dal token e lo aggiunge a req.userId. Se invalido reinderizza a /login.

const token = req.cookies.jwt;  

`    `if(!token){  

`      `res.status(400).json({message: 'Token doesnt exists'});      } 

`    `const user = jwt.verify(token, process.env.JWT\_ACCESS\_SECRET);        req.userId = user.id;  

**EJS** 

Il progetto fa uso di Embedded Javascript (EJS) come motore per il template engine. Ho stato scelto questo template perchè permette di generare pagine HTML dinamiche, e perchè è progettato per semplificare il processo di rendering di contenuti dinamici nelle applicazioni Web

**TOKEN SPOTIFY** 

Il progetto comunica con spotify per ottenere tracce, album e artisti. La gestione delle chiamate è all'interno di spotifyAuthentication.js. Creazione del token, e controllo validità.

if (!accessToken || Date.now() >= tokenExpirationTime) {         

try {  

`            `const { clientId, clientSecret } = await fetchCredentials();  

`            `const response = await fetch('https://accounts.spotify.com/api/token',  

method: 'POST',                 headers: { 'Content-Type': application/x-www-form-urlencoded', 

'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)  

`                `},  

`                `body: 'grant\_type=client\_credentials'              });  

`            `if (!response.ok) {  

`                `throw new Error('Failed to retrieve access token');              }  

const data = await response.json();             

accessToken = data.access\_token;  

`         `tokenExpirationTime = Date.now() + (data.expires\_in \* 1000); // Convert expires\_in to milliseconds          } catch (error) {  

`            `console.error('Error retrieving access token:', error);  

`        `}  
