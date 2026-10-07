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
