# DocGPT
## Sobre el proyecto:
El proyecto consiste en la creación de un asistente virtual de primeros auxilios que sea capaz de responder consultas de distinta naturaleza.  
El proyecto ha sido realizado por el equipo Sinco para la fase 2 de la tercera edición del CDS Tech Challenge.

## Cómo ejecutar el proyecto
#### Software necesario:
Docker
#### Paso 1:
Clonar el proyecto
```Terminal
$ git clone https://github.com/EdgarAlcoba/CDSTC2-Fase2.git
```
#### Paso 2:
Es necesario modificar las siguientes variables de entorno en el archivo docker-compose o incluirlas en tu sistema operativo  

```Terminal
MONGO_URI = URL de tu base de datos  
NODE_ENV = DEV ó PROD  
SECRET_KEY = Cadena de 32 caracteres aleatorios  
OPENAI_API_KEY = Api key de OpenAI  
ELEVEN_LABS_API_KEY = Api key de 11ElevenLabs  
```
#### Paso 3:
Seleccionar el directorio en el que se haya clonado el repositorio y ejecutar el comando:  
```Terminal
$ docker-compose up --build
```

