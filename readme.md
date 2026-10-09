# Big Data Lakehouse & Monitoring Stack

A complete, local Big Data and Lakehouse environment running on Docker Compose. It integrates Apache Spark (PySpark), Apache Iceberg, PostgreSQL, MySQL, Apache Kafka, Elasticsearch, Logstash, Kibana, MLflow, and Jupyter Notebook.

---

## 🚀 Services & Local URLs

| Service | Local URL / Endpoint | Description | Default Credentials / Notes |
| :--- | :--- | :--- | :--- |
| **Jupyter Notebook** | [http://localhost:8888](http://localhost:8888) | PySpark + Iceberg workspace | Check token via `docker logs jupyter-notebook` |
| **MLflow UI** | [http://localhost:5001](http://localhost:5001) | ML Experiment Tracking | Backed by MySQL |
| **Spark Master UI** | [http://localhost:8080](http://localhost:8080) | Apache Spark Cluster Dashboard | Master node monitoring |
| **Kibana** | [http://localhost:5601](http://localhost:5601) | Elasticsearch Monitoring & Logs | Security disabled for easy local access |
| **Elasticsearch** | [http://localhost:9200](http://localhost:9200) | Search and Analytics Engine | Single-node cluster |
| **Kafka Broker** | `localhost:9092` | Event Streaming Platform | Connected with Zookeeper |
| **PostgreSQL** | `localhost:5432` | Metadata & Lake Database | User: `admin` \| Pass: `password123` \| DB: `metastore` |
| **MySQL** | `localhost:3306` | MLflow Backend Database | User: `mlflow_user` \| Pass: `mlflowpassword123` \| DB: `mlflow_db` |

---

## 📂 Project Structure

```text
big-data/
├── docker-compose.yml
├── jupyter/
│   ├── Dockerfile
│   └── requirements.txt
├── logstash/
│   └── pipeline/
│       └── logstash.conf
├── notebooks/
└── mlflow_artifacts/
```

---

## 🛠️ How to Run

1. Make sure you are in the root directory of the project.
2. Start all containers in detached mode:
   ```bash
   docker compose up -d
   ```
3. To stop the stack and clean up temporary volumes:
   ```bash
   docker compose down -v