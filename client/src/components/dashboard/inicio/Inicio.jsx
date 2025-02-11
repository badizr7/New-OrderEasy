import React, { useEffect, useState } from 'react';


function Inicio() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recuperar los datos del usuario del almacenamiento local
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData)); // Parsear el usuario desde localStorage
    }
  }, []);

  return (
    <div className=''>
      <h2>Inicio</h2>
      {user ? (
        <p>
          Bienvenido, {user.primerNombre} {user.primerApellido}!
        </p>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default Inicio;
