FROM debian:10

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        ca-certificates \
        curl \
        git \
        make \
        unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

#
# Protocol Buffers
#
ENV PROTOBUF_VERSION 3.17.3

RUN curl -fSL "https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOBUF_VERSION}/protoc-${PROTOBUF_VERSION}-linux-x86_64.zip" > protobuf.zip \
    && unzip -p protobuf.zip bin/protoc > /usr/local/bin/protoc \
    && chmod +x /usr/local/bin/protoc \
    && rm -f protobuf.zip

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
