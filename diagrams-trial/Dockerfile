FROM python:3-slim-buster as requirements

# hadolint ignore=DL3013
RUN pip install poetry

COPY pyproject.toml poetry.lock ./
RUN poetry export -f "requirements.txt" > requirements.txt

FROM python:3-slim-buster

# hadolint ignore=DL3008
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        graphviz \
        inotify-tools \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=requirements /requirements.txt .

RUN pip install -r requirements.txt

CMD [ "tail", "-f", "/dev/null" ]
