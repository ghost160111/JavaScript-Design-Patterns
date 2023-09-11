class Server {
  constructor(ip, port) {
    this.ip = ip;
    this.port = port;
  }

  get Url() {
    return `https://${this.ip}:${this.port}`;
  }
}

function aws(server) {
  server.isAWS = true;
  server.awsInfo = function() {
    return server.Url;
  }

  return server;
}

function azure(server) {
  server.isAZURE = true;
  server.port += 500;

  return server;
}

const s1 = aws(new Server("12.34.56.78", 8080));

console.log(s1.isAWS); // true
console.log(s1.awsInfo()); // https://12.34.56.78:8080

const s2 = azure(new Server("98.87.65.43", 1000));

console.log(s2.isAZURE); // true
console.log(s2.Url); // https://98.87.65.43:1500



