FROM debian:10

# RUN sed -i 's,archive.ubuntu.com,ftp.riken.jp/Linux,g' /etc/apt/sources.list

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        curl \
        g++ \
        git \
        make \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

#
# Protocol Buffers
#
ENV PROTOBUF_VERSION 2.6.0

RUN curl -fSL "https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOBUF_VERSION}/protobuf-${PROTOBUF_VERSION}.tar.gz" | tar zxv \
    && cd protobuf-${PROTOBUF_VERSION} \
    && ./configure \
    && make \
    && make check \
    && make install \
    && cd / \
    && rm -rf protobuf-${PROTOBUF_VERSION} \
    && ldconfig

#
# Go
#
ENV GO_VERSION 1.16

RUN curl -fSL "https://dl.google.com/go/go${GO_VERSION}.linux-amd64.tar.gz" | tar zxv \
    && mv go /usr/local/go

ENV PATH $PATH:/usr/local/go/bin

ENV GOPATH /go

#
# protoc-gen-doc
#
RUN go get -u github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc

ENV PATH $PATH:/go/bin/

CMD ["tail", "-f", "/dev/null"]
