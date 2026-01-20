FROM node:18-bullseye

# Install basic tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    wget \
    ca-certificates \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install Angular CLI globally
RUN npm install -g @angular/cli@16

# Set up workspace
WORKDIR /workspace

# Default command
CMD ["sleep", "infinity"]
