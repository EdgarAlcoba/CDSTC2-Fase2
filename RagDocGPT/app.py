from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from langchain_openai.chat_models import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import PromptTemplate
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import DocArrayInMemorySearch
from operator import itemgetter

app = Flask(__name__)

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = "gpt-3.5-turbo"

model = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model=MODEL)
embeddings = OpenAIEmbeddings()
parser = StrOutputParser()

template = """
Actua como si fueras un asistente de primeros auxilios. Responde como si estuvieras hablando directamente al paciente. Responde a las instrucciones fijándote únicamente en el contexto dado. Si no puedes responder a un instrucción simplemente di "No lo sé, contacta con un profesional para obtener ayuda". Si la emergencia es grave debes hacer énfasis en que tu paciente debe buscar atención médica profesional.
Quiero que la respuesta sea un json_object con tres pares clave-valor. Las claves deben estar entre comillas "". La primera clave será text y contendrá la respuesta a la pregunta. La segunda clave será facialExpression y contendrá una expresión facial de la siguiente lista: default, smile, sad y angry. Asocia la respuesta_doctor a la expresión facial que consideres más adecuada. La tercera clave será animation y será un valor de la siguiente lista: Standing, StandingBetter, TalkingArm, TalkingSeriously, TalkingTwoArms, TextingWhileStanding. Asocia la respuesta_doctor a la animación que consideres más adecuada.
Repply in the same lenguage as the next Pregunta content.

Contexto: {context}

Pregunta: {question}
"""
prompt = PromptTemplate.from_template(template)

loader = PyPDFLoader("ilovepdf_merged.pdf")
pages = loader.load_and_split()

vectorstore = DocArrayInMemorySearch.from_documents(pages, embedding=embeddings)
retriever = vectorstore.as_retriever()

chain = (
    {
        "context": itemgetter("question") | retriever,
        "question": itemgetter("question"),
    }
    | prompt
    | model
    | parser
)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get('question')
    if not question:
        return jsonify({"error": "Question not provided"}), 400

    result = None
    result = chain.invoke({"question": question})
    
    if result is None:
        return jsonify({"error": "No response generated"}), 500

    return result

if __name__ == '__main__':
    app.run(port=8080, host='0.0.0.0')
