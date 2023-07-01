import React, { useState, useEffect } from 'react';
import CarService from '../services/CarService.js';

const CarTable = () => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCar, setSelectedCar] = useState(null);
    const [editFormData, setEditFormData] = useState({
    });
    const [addFormData, setAddFormData] = useState({
      car: '',
      car_model: '',
      car_color: '',
      car_model_year: '',
      car_vin: '',
      price: '',
      availability: '',
    });
  
    const entriesPerPage = 10;
  
    useEffect(() => {
      const fetchData = async () => {
        try {
            const response = await CarService.getAll();
            setCars(response.data); 
          } catch (error) {
            console.log('Error fetching data:', error);
          }
      };
  
      fetchData();
    }, []);
    
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  //search
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    };

  const filteredCars = cars.filter((car) =>
  car.car.toLowerCase().includes(searchTerm.toLowerCase())
);

const indexOfLastEntry = currentPage * entriesPerPage;
const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
const currentEntries = filteredCars.slice(
  indexOfFirstEntry,
  indexOfLastEntry
);
  
    const handleActionSelect = (carId, action) => {
      const selectedCar = cars.find((car) => car.id === carId);
      setSelectedCar({ ...selectedCar, action });
      setEditFormData({
        car_color: selectedCar.car_color,
        price: selectedCar.price,
        availability: selectedCar.availability,
        car_year: selectedCar.car_year,
      });
    };
  
    const handleEditFormChange = (e) => {
      setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleEditFormSubmit = async (e) => {
      e.preventDefault();
      try {
        // Combine the selected car's data with the edited form data
        const editedCarData = {
          ...selectedCar,
          ...editFormData,
        };
    
        // Parse availability as a boolean
        editedCarData.availability = editedCarData.availability === 'true';
    
        await CarService.update(selectedCar.id, editedCarData);
        const updatedCars = cars.map((car) =>
          car.id === selectedCar.id ? editedCarData : car
        );
        setCars(updatedCars);
        closeModal();
      } catch (error) {
        console.log('Error updating car:', error);
      }
    };
  
    const handleDeleteConfirmation = async () => {
      try {
        await CarService.delete(selectedCar.id);
        const updatedCars = cars.filter((car) => car.id !== selectedCar.id);
        setCars(updatedCars);
        closeModal();
      } catch (error) {
        console.log('Error deleting car:', error);
      }
    };
  
    const handleAddFormChange = (e) => {
      setAddFormData({
        ...addFormData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleAddFormSubmit = async (e) => {
      e.preventDefault();
      try {
        await CarService.save(addFormData);
        const response = await CarService.getAll();
        setCars(response.data.cars);
        closeModal();
      } catch (error) {
        console.log('Error adding car:', error);
      }
    };
  
    const closeModal = () => {
      setSelectedCar(null);
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={() => handleActionSelect(null, 'add')}>Add car</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Manufacturer</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((car) => (
              <tr key={car.id}>
                <td>{car.car}</td>
                <td>{car.car_model}</td>
                <td>{car.car_model_year}</td>
                <td>
                <select
  value={selectedCar ? selectedCar.action : ''}
  onChange={(e) => handleActionSelect(car.id, e.target.value)}
>
                    <option value="">Select Action</option>
                    <option value="edit">Edit</option>
                    <option value="delete">Delete</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          {Array.from(
            { length: Math.ceil(cars.length / entriesPerPage) },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              enabled={currentPage === page}
            >
              {page}
            </button>
          ))}
        </div>
        {selectedCar && (
          <div className="modal">
            {selectedCar.action === 'edit' ? (
              <div>
                <h3>Edit Car {selectedCar.id}</h3>
                <form onSubmit={handleEditFormSubmit}>
                <label>
      Car:
      <input
        type="text"
        name="car"
        value={editFormData.car}
        onChange={handleEditFormChange}
        defaultValue={selectedCar.car}
        disabled
      />
    </label>
    <label>
      Manufacturer:
      <input
        type="text"
        name="car_model"
        defaultValue={selectedCar.car_model}
        value={editFormData.car_model}
        onChange={handleEditFormChange}
        disabled
      />
    </label>
    <label>
      Year:
      <input
        type="text"
        name="car_year"
        value={editFormData.car_year}
        onChange={handleEditFormChange}
        defaultValue={selectedCar.car_model_year}
        disabled
      />
    </label>
    <label>
      VIN:
      <input
        type="text"
        name="car_vin"
        value={editFormData.car_vin}
        onChange={handleEditFormChange}
        defaultValue={selectedCar.car_vin}
        disabled
      />
    </label>
    <label>
      Color:
      <input
        type="text"
        name="car_color"
        value={editFormData.car_color}
        onChange={handleEditFormChange}
      />
    </label>
    <label>
      Price:
      <input
        type="text"
        name="price"
        value={editFormData.price}
        defaultValue={selectedCar.price}
        onChange={handleEditFormChange}
      />
    </label>
    <label>
      Availability:
      <input
        type="text"
        name="availability"
        value={editFormData.availability}
        defaultValue={selectedCar.availability}
        onChange={handleEditFormChange}
      />
    </label>
                  <button type="submit" enabled>
                    Save
                  </button>
                  <button type="button" onClick={closeModal}>
                    Cancel
                  </button>
                </form>
              </div>
            ) : selectedCar.action === 'delete' ? (
              <div>
                <h3>Delete Car {selectedCar.id}</h3>
                <p>Are you sure you want to delete this car?</p>
                <button onClick={handleDeleteConfirmation}>Delete</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            ) : selectedCar.action === 'add' ? (
              <div>
                <h3>Add Car</h3>
                <form onSubmit={handleAddFormSubmit}>
                  <label>
                    Car:
                    <input
                      type="text"
                      name="car"
                      value={addFormData.car}
                      onChange={handleAddFormChange}
                    />
                  </label>
                  <label>
                    Manufacturer:
                    <input
                      type="text"
                      name="car_model"
                      value={addFormData.car_model}
                      onChange={handleAddFormChange}
                    />
                  </label>
                  <label>
                    Year:
                    <input
                      type="text"
                      name="car_model_year"
                      value={addFormData.car_model_year}
                      onChange={handleAddFormChange}
                    />
                  </label>
                  <label>
                    Color:
                    <input
                      type="text"
                      name="car_color"
                      value={addFormData.car_color}
                      onChange={handleAddFormChange}
                    />
                  </label>
                  <label>
                    VIN:
                    <input
                      type="text"
                      name="car_vin"
                      value={addFormData.car_vin}
                      onChange={handleAddFormChange}
                    />
                  </label>
                  <label>
                    Price:
                    <input
                      type="text"
                      name="price"
                      value={addFormData.price}
                      onChange={handleAddFormChange}
                    />
                  </label>
                  <label>
                    Availability:
                    <input
                      type="text"
                      name="availability"
                      value={addFormData.availability}
                      onChange={handleAddFormChange}
                    />
                  </label>
                  <button type="submit">Add</button>
                  <button type="button" onClick={closeModal}>
                    Cancel
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  };
  
  export default CarTable;