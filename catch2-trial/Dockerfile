FROM ubuntu:20.04

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
        cmake \
        g++ \
        git \
        make \
        ninja-build \
        python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir cpplint

CMD [ "tail", "-f", "/dev/null" ]
