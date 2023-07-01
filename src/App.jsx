import React from 'react';
import CarTable from './components/CarTable';

const cars = [

];

const App = () => {
  return (
    <div>
      <h1>Car List</h1>
      <CarTable cars={cars} />
    </div>
  );
};

export default App;
