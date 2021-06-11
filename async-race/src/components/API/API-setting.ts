export const APISettings = {
  baseURL: 'http://127.0.0.1:3000',
  path: {
    garage: '/garage',
    winners: '/winners',
    engine: '/engine',
  },
  methods: {
    post: 'POST',
    delete: 'DELETE',
    put: 'PUT',
  },
  headers: {
    contentType: 'application/json',
  },
  standartCar: {
    name: 'Unknown',
    color: '#e5e5e5',
  },
  status: {
    start: 'started',
    stop: 'stopped',
    drive: 'drive',
  },
  serverErrorCode: 500,
};
