FROM quay.io/sampandey001/secktor
RUN git clone https://github.com/naxordeve/AquaSeek /root/naxordeve
WORKDIR /root/naxordeve/
RUN npm install npm@latest
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]

