FROM ubuntu:20.04

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
        ca-certificates \
        cmake \
        g++ \
        git \
        make \
        ninja-build \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

CMD [ "tail", "-f", "/dev/null" ]
