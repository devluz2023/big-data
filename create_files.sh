#!/bin/bash

# Criando a estrutura de diretórios caso não existam
mkdir -p logstash/pipeline
mkdir -p jupyter
mkdir -p notebooks

# 1. docker-compose.yml
echo "Criando docker-compose.yml..."
cat << 'EOL' > docker-compose.yml
version: '3.8'

networks:
  lakehouse-net:
    driver: bridge

volumes:
  postgres_data:
  es_data:
  kafka_data:
  zookeeper_data:

services:
  # ==========================================
  # POSTGRESQL (Metastore / Lake Database)
  # ==========================================
  postgres:
    image: postgres:15-alpine
    container_name: postgres-metastore
    environment:
      POSTGRES_DB: metastore
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - lakehouse-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d metastore"]
      interval: 5s
      timeout: 5s
      retries: 5

  # ==========================================
  # APACHE KAFKA & ZOOKEEPER
  # ==========================================
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    volumes:
      - zookeeper_data:/var/lib/zookeeper/data
    networks:
      - lakehouse-net

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    volumes:
      - kafka_data:/var/lib/kafka/data
    networks:
      - lakehouse-net

  # ==========================================
  # ELASTICSEARCH (Monitoramento / Logs)
  # ==========================================
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.3
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    networks:
      - lakehouse-net

  # ==========================================
  # LOGSTASH
  # ==========================================
  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.3
    container_name: logstash
    depends_on:
      - elasticsearch
    ports:
      - "5044:5044"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    networks:
      - lakehouse-net

  # ==========================================
  # KIBANA
  # ==========================================
  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.3
    container_name: kibana
    depends_on:
      - elasticsearch
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    networks:
      - lakehouse-net

  # ==========================================
  # APACHE SPARK (Master / Driver base)
  # ==========================================
  spark-master:
    image: bitnami/spark:3.5.0
    container_name: spark-master
    environment:
      - SPARK_MODE=master
      - SPARK_RPC_AUTHENTICATION_ENABLED=no
      - SPARK_RPC_ENCRYPTION_ENABLED=no
      - SPARK_LOCAL_STORAGE_ENCRYPTION_ENABLED=no
      - SPARK_SSL_ENABLED=no
    ports:
      - "8080:8080"
      - "7077:7077"
    networks:
      - lakehouse-net

  # ==========================================
  # JUPYTER NOTEBOOK (PySpark + Iceberg)
  # ==========================================
  jupyter:
    build:
      context: ./jupyter
      dockerfile: Dockerfile
    container_name: jupyter-notebook
    depends_on:
      - spark-master
      - postgres
      - kafka
    ports:
      - "8888:8888"
    environment:
      - JUPYTER_ENABLE_LAB=yes
      - GRANT_SUDO=yes
    volumes:
      - ./notebooks:/home/jovyan/work
    networks:
      - lakehouse-net
EOL

# 2. jupyter/Dockerfile
echo "Criando jupyter/Dockerfile..."
cat << 'EOL' > jupyter/Dockerfile
FROM jupyter/pyspark-notebook:spark-3.5.0

USER root

# Instala dependências do sistema se necessário
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

USER jovyan

# Instala pacotes Python adicionais
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt
EOL

# 3. jupyter/requirements.txt
echo "Criando jupyter/requirements.txt..."
cat << 'EOL' > jupyter/requirements.txt
pyspark==3.5.0
kafka-python==2.0.2
elastic-search==8.11.3
psycopg2-binary==2.9.9
pandas==2.1.4
requests==2.31.0
EOL

# 4. logstash/pipeline/logstash.conf
echo "Criando logstash/pipeline/logstash.conf..."
cat << 'EOL' > logstash/pipeline/logstash.conf
input {
  beats {
    port => 5044
  }
  tcp {
    port => 5000
    codec => json
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "lakehouse-logs-%{+YYYY.MM.dd}"
  }
}
EOL

echo "Todos os arquivos foram criados com sucesso na pasta atual!"
echo "Para iniciar o projeto, execute: docker compose up --build -d"
