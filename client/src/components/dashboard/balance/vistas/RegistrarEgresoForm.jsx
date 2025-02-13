import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { getCategoriesByUser } from "../../../../services/categoryServices";
import { getAllProducts } from "../../../../services/productServices";
import { createEgreso } from "../../../../services/egresoService";
import "./styles/RegistrarIngresoForm.css";

const RegistrarEgresoForm = ({ cerrarFormulario }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [categoriasConProductos, setCategoriasConProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Observar el valor seleccionado del producto
  const productoIdSeleccionado = watch("productoId");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const categoriasData = await getCategoriesByUser(token);
        const productosData = await getAllProducts(token);

        if (!Array.isArray(categoriasData) || !Array.isArray(productosData)) {
          console.error("Los datos de la API no son un array");
          return;
        }

        const categoriasMap = categoriasData.reduce((acc, categoria) => {
          acc[categoria.nombre] = { ...categoria, productos: [] };
          return acc;
        }, {});

        productosData.forEach((producto) => {
          if (categoriasMap[producto.categoriaNombre]) {
            categoriasMap[producto.categoriaNombre].productos.push(producto);
          }
        });

        setCategoriasConProductos(Object.values(categoriasMap));
      } catch (error) {
        console.error("Error al cargar datos:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los datos',
          confirmButtonColor: '#3085d6'
        });
      }
    };

    cargarDatos();
  }, []);

  // Actualizar producto seleccionado cuando cambia la selección
  useEffect(() => {
    if (productoIdSeleccionado) {
      const producto = categoriasConProductos
        .flatMap(cat => cat.productos)
        .find(prod => prod._id === productoIdSeleccionado);
      setProductoSeleccionado(producto);
    } else {
      setProductoSeleccionado(null);
    }
  }, [productoIdSeleccionado, categoriasConProductos]);

  const onSubmit = async (data) => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("No hay token de autenticación. Inicie sesión.");
      }
  
      if (!productoSeleccionado) {
        throw new Error("Debe seleccionar un producto válido.");
      }
  
      const egresoData = {
        productoId: productoSeleccionado._id,  // ✅ Se envía el ID del producto
        productoNombre: productoSeleccionado.nombre,
        cantidad: Number(data.cantidad),
        precioCompra: productoSeleccionado.precioCompra,  // ✅ Enviar precioCompra si el backend lo usa
        descripcion: data.descripcion || ""
      };
  
      // Llamar a la API para crear el egreso
      const resultado = await createEgreso(egresoData, token);
  
      // Calcular el total
      const total = data.cantidad * productoSeleccionado.precioCompra;
  
      // Mostrar alerta de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Egreso Registrado!',
        html: `
          <p>Se ha registrado la compra de:</p>
          <p><strong>${data.cantidad}</strong> unidades de <strong>${productoSeleccionado.nombre}</strong></p>
          <p>Precio de compra: $${productoSeleccionado.precioCompra}</p>
          <p>Total: $${total}</p>
        `,
        confirmButtonColor: '#3085d6',
        timer: 5000,
        timerProgressBar: true,
        position: 'center',
      });
  
      reset();
      cerrarFormulario();
    } catch (error) {
      console.error("Error en el egreso:", error);
  
      await Swal.fire({
        icon: 'error',
        title: 'Error en el Egreso',
        text: error.response?.data?.mensaje || error.message || 'Error al registrar el egreso',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setCargando(false);
    }
  };
  

  return (
    <div className="fondo-modal" onClick={cerrarFormulario}>
      <div className="ventana-flotante" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar-modal" onClick={cerrarFormulario}>✖</button>
        <h2 className="titulo">Registrar Egreso</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="formulario">
          <label className="label">Producto:</label>
          <select 
            {...register("productoId", { required: "El producto es obligatorio" })} 
            className="select"
          >
            <option value="">Seleccione un producto</option>
            {categoriasConProductos.map((categoria) => (
              <optgroup key={categoria._id} label={categoria.nombre}>
                {categoria.productos.length > 0 ? (
                  categoria.productos.map((producto) => (
                    <option key={producto._id} value={producto._id}>
                      {producto.nombre} - Precio de compra: ${producto.precioCompra}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay productos</option>
                )}
              </optgroup>
            ))}
          </select>
          {errors.productoId && <p className="error">{errors.productoId.message}</p>}

          {productoSeleccionado && (
            <div className="info-producto">
              <p>Precio de compra: ${productoSeleccionado.precioCompra}</p>
              <p>Stock actual: {productoSeleccionado.cantidadDisponible} unidades</p>
            </div>
          )}

          <label className="label">Cantidad:</label>
          <input 
            type="number" 
            {...register("cantidad", { 
              required: "Ingrese una cantidad", 
              min: { value: 1, message: "La cantidad debe ser mayor a 0" }
            })} 
            className="input" 
          />
          {errors.cantidad && <p className="error">{errors.cantidad.message}</p>}

          <label className="label">Descripción:</label>
          <textarea
            {...register("descripcion", { required: "La descripción es obligatoria" })}
            className="textarea"
            placeholder="Descripción"
          ></textarea>

          <div className="botones-formulario">
            <button type="submit" className="boton" disabled={cargando}>
              {cargando ? "Registrando..." : "Registrar Egreso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarEgresoForm;