FROM node:16

ARG DEBIAN_FRONTEND=noninteractive

# Run as root to install the necessary prerequisites
USER root

# Install linux packages
RUN apt update && apt install -y curl git zip unzip less

RUN npm i -g truffle

# Setup SSH related stuff
WORKDIR /root
RUN mkdir .ssh
RUN touch .ssh/config
RUN printf '\
Host github.com \n\
  HostName ssh.github.com \n\
  Port 443 \n\
  IdentityFile ~/.ssh/id_github_ed25519 \n\
' > .ssh/config

RUN touch .ssh/id_github_ed25519
