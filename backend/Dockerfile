# Use Python 3.9 (stable for PyTorch)
FROM python:3.9

# Set working directory
WORKDIR /code

# Copy requirements and install
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy your code and model
COPY ./efficientnet_b0_full_model.pth /code/efficientnet_b0_full_model.pth
COPY ./main.py /code/main.py

# Create a writable directory for cache (Hugging Face requirement)
RUN mkdir -p /code/cache && chmod 777 /code/cache
ENV TORCH_HOME=/code/cache

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]