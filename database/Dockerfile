FROM postgres

# Update package list to enable subsequent installs. 
RUN apt-get update -y
# Install build tools
RUN apt-get install build-essential -y
# Install postgres development tools so can install external extensions
RUN apt-get install postgresql-server-dev-14 -y
# Install wget so can retrieve extension(s) from web source
RUN apt-get install wget -y

WORKDIR /tmp

# Retrieve pg_hashids extension
RUN wget --no-check-certificate https://github.com/iCyberon/pg_hashids/archive/refs/tags/v1.2.1.tar.gz
RUN tar -xf v1.2.1.tar.gz

WORKDIR /tmp/pg_hashids-1.2.1

RUN make
RUN make install