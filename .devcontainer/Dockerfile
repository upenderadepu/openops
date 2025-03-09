# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT=18-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

RUN npm install -g \
  @angular/cli \
  nx \
  cross-env@7.0.3

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  git \
  locales \
  locales-all \
  libcap-dev \
  wget \
  unzip \
  && rm -rf /var/lib/apt/lists/*

# Set the locale
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install yq
RUN wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/bin/yq && \
  chmod +x /usr/bin/yq

# Install hcledit
RUN wget https://github.com/minamijoyo/hcledit/releases/download/v0.2.15/hcledit_0.2.15_linux_amd64.tar.gz -O /tmp/hcledit_0.2.15_linux_amd64.tar.gz && \
  tar -C /usr/bin -xf /tmp/hcledit_0.2.15_linux_amd64.tar.gz && \
  chmod +x /usr/bin/hcledit && \
  rm /tmp/hcledit_0.2.15_linux_amd64.tar.gz
