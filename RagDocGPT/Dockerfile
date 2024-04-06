FROM python:3.11.8-slim

RUN apt-get update && apt-get install -y gcc python3-dev

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]