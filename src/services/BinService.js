const axios = require('axios');


class BinService {
  constructor({ url, request = axios }) {
    this.url = url;
    this.request = request;
  }

  getAll() {
    return this.request.get(`${this.url}/api/bins`)
      .then(({ data }) => data);
  }

  getByHash(hash) {
    return this.request.get(`${this.url}/api/bins/${hash}`)
      .then(({ data }) => data);
  }

  deleteHash(hash) {
    return this.request.delete(`${this.url}/api/bins/${hash}`)
      .then(({ data }) => data);
  }

  generateHash() {
    return this.request.post(`${this.url}/api/bins`)
      .then(({ data }) => data);
  }
}

export default BinService;
