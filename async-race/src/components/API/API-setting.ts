export const APISettings = {
  baseURL: 'http://127.0.0.1:3000',
  path: {
    garage: '/garage',
    winners: '/winners',
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
};
