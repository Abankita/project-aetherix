FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt ./requirements.txt
RUN apt-get update \
    && apt-get install -y --no-install-recommends libexpat1 \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt
RUN python -c "import rasterio"
COPY backend/main.py ./main.py
COPY AETHERIX_DASHBOARD_DATA/AETHERIX_DASHBOARD_DATA /data
ENV DATA_ROOT=/data
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
