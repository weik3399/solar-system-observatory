FROM python:3.11-slim

WORKDIR /app

COPY . .

ENV STOCK_BOARD_HOST=0.0.0.0

EXPOSE 4173

CMD ["python", "local_server.py"]
