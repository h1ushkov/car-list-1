import axios from 'axios';

const CAR_API_BASE_URL = 'http://localhost:8080/api/v1/cars';

class CarService {
  getAll() {
    return axios.get(CAR_API_BASE_URL);
  }

  getById(id) {
    return axios.get(CAR_API_BASE_URL + '/' + id);
  }

  save(car) {
    return axios.post(CAR_API_BASE_URL, car);
  }

  update(id, car) {
    return axios.put(CAR_API_BASE_URL + '/' + id, car);
  }

  delete(id) {
    return axios.delete(CAR_API_BASE_URL + '/' + id);
  }

}

export default new CarService();
