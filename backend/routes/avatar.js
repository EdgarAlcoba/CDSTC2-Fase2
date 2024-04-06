const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const dotenv = require("dotenv");
const ElevenLabs = require("elevenlabs-node");
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = "Rfj8YxsU5Gg9QdQE7F9O";
const voice = new ElevenLabs(
  {
    apiKey: elevenLabsApiKey, // Your API key from Elevenlabs
    voiceId: voiceID,             // A Voice ID from Elevenlabs
  }
);
const fsi = require('fs');

const axios = require('axios');

const fs = require('fs').promises;
const OpenAI = require("openai");
//dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "-",
});

//console.log(elevenLabsApiKey, process.env.OPENAI_API_KEY)

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);
  console.log("Petición ffmpeg");
  await execCommand(
    `ffmpeg -y -i ./audios/message_${message}.mp3 ./audios/message_${message}.wav`
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
    `./rhubarb/rhubarb -f json -o ./audios/message_${message}.json ./audios/message_${message}.wav -r phonetic`
    // -r phonetic is faster but less accurate
  );
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

router.post("/", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    res.send({
      messages: [
        {
          text: "Hey dear... How was your day?",
          audio: await audioFileToBase64("./audios/intro_0.wav"),
          lipsync: await readJsonTranscript("./audios/intro_0.json"),
          facialExpression: "smile",
          animation: "TalkingArm",
        },
        {
          text: "I missed you so much... Please don't go for so long!",
          audio: await audioFileToBase64("./audios/intro_1.wav"),
          lipsync: await readJsonTranscript("./audios/intro_1.json"),
          facialExpression: "default",
          animation: "TalkingTwoArms",
        },
      ],
    });
    return;
  }
  /*
  console.log("User message", userMessage);
  console.log("User ID", req.body.userID);
  console.log("Conversation ID", req.body.conversationID);
*/

  if (!elevenLabsApiKey || openai.apiKey === "-") {
    res.send({
      messages: [
        {
          text: "Please my dear, don't forget to add your API keys!",
          audio: await audioFileToBase64("./audios/api_0.wav"),
          lipsync: await readJsonTranscript("./audios/api_0.json"),
          facialExpression: "angry",
          animation: "Angry",
        },
        {
          text: "You don't want to ruin Wawa Sensei with a crazy ChatGPT and ElevenLabs bill, right?",
          audio: await audioFileToBase64("./audios/api_1.wav"),
          lipsync: await readJsonTranscript("./audios/api_1.json"),
          facialExpression: "smile",
          animation: "Laughing",
        },
      ],
    });
    return;
  }

  // TODO petición a http://localhost:8080/ask
  console.log("Petición a python");
  let aiResponse;
  let messages = { messages: [] };
  try {
    const response = await axios.post('http://10.10.10.6:8080/ask', {
      question: userMessage
    });
    // Aquí puedes manejar la response de la API externa
    aiResponse = response.data;
  } catch (error) {
    // Manejo de errores
    return res.status(400).send(error);
    //return res.status(400).send("Error creating model message");
  }


  //TODO petición a guardarMensaje localhost:5000/chat....
  console.log("Petición a backend");
  try {
    const response = await axios.post(`http://localhost:5000/api/chat/${req.body.userID}/${req.body.conversationID}/messageAI`, {
      message: aiResponse.text
    });
    // Aquí puedes manejar la response de la API externa
    // console.log(response.data);
  } catch (error) {
    // Manejo de errores
    return res.status(400).send("Error saving model message");
  }
  messages.messages.push(aiResponse);
  
  const directorioActual = process.cwd();

// Lee el contenido del directorio
  fsi.readdir(directorioActual, (err, archivos) => {
  if (err) {
    console.error('Error al leer el directorio:', err);
    return;
    }

    console.log('Contenido del directorio actual:');
    archivos.forEach(archivo => {
      console.log(archivo);
    });
  });
  /*const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    max_tokens: 1000,
    temperature: 0.6,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content: `
        You are a doctor.
        You will always reply with a JSON array of messages. With a maximum of 3 messages.
        Each message has a text, facialExpression, and animation property.
        The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
        The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry. 
        `,
      },
      {
        role: "user",
        content: userMessage || "Hello",
      },
    ],
  });
  let messages = JSON.parse(completion.choices[0].message.content);*/
  if (messages.messages) {
    messages = messages.messages; // ChatGPT is not 100% reliable, sometimes it directly returns an array and sometimes a JSON object with a messages property
  }
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    // generate audio file
    const fileName = `./audios/message_${i}.mp3`; // The name of your audio file
    const textInput = message.text; // The text you wish to convert to speech
    //console.log("TextInput",textInput);
    //console.log(elevenLabsApiKey,"|",voiceID,"|",fileName,"|",textInput);
    console.log("Petición audio");
    await voice.textToSpeech({
      // Required Parameters
      fileName: fileName,
      textInput: textInput,
    }).then((res) => {
      console.log(res);
    });
    //await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, textInput);
    // generate lipsync
    console.log("Petición lipSync");
    await lipSyncMessage(i);
    message.audio = await audioFileToBase64(fileName);
    message.lipsync = await readJsonTranscript(`./audios/message_${i}.json`);
  }

  res.send({ messages });
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

module.exports = router;