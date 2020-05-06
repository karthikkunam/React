FROM node:12.16.1-alpine3.11
LABEL AUTHOR=Hari.Mukkapati@7-11.com
ENV PORT=5000 DEL_PKGS="libgcc libstdc++" RM_DIRS=/usr/include
WORKDIR /opt/webapp
COPY . ./
RUN pwd && ls -la
RUN apk --no-cache update && apk --no-cache upgrade && apk add --no-cache git libcurl g++ zip python3 python make linux-headers paxctl libgcc libstdc++ gnupg
# RUN npm config set registry http://app-n-loadb-ig2d2aaehljl-531754914.us-east-1.elb.amazonaws.com/repository/npm-group/
RUN git config --global url.https://github.com/.insteadOf git://github.com/
RUN npm config set registry https://jfrog.devops.7-11.com/api/npm/npm/

# RUN npm config set @7eleven:registry http://jfrog.devops.7-11.com:4873/
RUN pwd && npm install --unsafe-perm && npm audit fix --force && npm run build
RUN cp -r node_modules/ /opt/webapp/dist/node_modules/
RUN cp *.key /opt/webapp/dist/


FROM node:12.16.1-alpine3.11
LABEL AUTHOR=Hari.Mukkapati@7-11.com
ENV PORT=5000 RM_DIRS=/usr/include

WORKDIR /opt/webapp
RUN apk --no-cache update && apk --no-cache upgrade && apk add --no-cache zip g++ make && cd /tmp/ && \
    wget https://curl.haxx.se/download/curl-7.69.0.tar.gz && tar -xvzf curl-7.69.0.tar.gz && rm *.gz && ls -al && cd curl-7.69.0 && ls -al && ./configure && make && make install && which curl && curl -V && \
    ls -al /usr/local/lib/node_modules/ && npm -v && npm install -g npm@latest && npm -v && \
    rm -rf /tmp/* && \
    adduser -S sevenbossspace && \
	  addgroup -S sevenbossspace && \
    chown -R sevenbossspace:sevenbossspace /opt/webapp && \
    apk del make gcc g++ && \
    rm -rf ${RM_DIRS} /SHASUMS256.txt /tmp/* \
    /usr/share/man/* /usr/share/doc /root/.npm /root/.node-gyp /root/.config \
    /usr/lib/node_modules/npm/man /usr/lib/node_modules/npm/doc /usr/lib/node_modules/npm/docs \
    /usr/lib/node_modules/npm/html /usr/lib/node_modules/npm/scripts && \
    { rm -rf /root/.gnupg || true; }

COPY --from=0 /opt/webapp/dist /opt/webapp
EXPOSE 5000
CMD ["node", "/opt/webapp/server.js"]
