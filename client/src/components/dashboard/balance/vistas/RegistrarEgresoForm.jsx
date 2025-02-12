import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCategoriesByUser } from "../../../../services/categoryServices";
import { getAllProducts } from "../../../../services/productServices";
import "./styles/RegistrarIngresoForm.css";

const RegistrarEgresoForm = ({ cerrarFormulario }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [categoriasConProductos, setCategoriasConProductos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");

        // Obtener datos de la API
        const categoriasData = await getCategoriesByUser(token);
        const productosData = await getAllProducts(token);

        if (!Array.isArray(categoriasData) || !Array.isArray(productosData)) {
          console.error("Los datos de la API no son un array");
          return;
        }

        // Crear un objeto con categorías y sus productos
        const categoriasMap = categoriasData.reduce((acc, categoria) => {
          acc[categoria.nombre] = {
            ...categoria,
            productos: [],
          };
          return acc;
        }, {});

        // Agregar productos a su respectiva categoría usando `categoriaNombre`
        productosData.forEach((producto) => {
          if (categoriasMap[producto.categoriaNombre]) {
            categoriasMap[producto.categoriaNombre].productos.push(producto);
          }
        });

        // Convertir el objeto en un array para usar en el `map`
        setCategoriasConProductos(Object.values(categoriasMap));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, []);

  // Función para manejar el envío del formulario
  const onSubmit = (data) => {
    console.log("Egreso registrado:", data);
    cerrarFormulario();
  };

  return (
    <div className="fondo-modal" onClick={cerrarFormulario}>
      <div className="ventana-flotante" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar-modal" onClick={cerrarFormulario}>✖</button>
        <h2 className="titulo">Registrar Egreso</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="formulario">
          {/* Selección de Producto */}
          <label className="label">Producto:</label>
          <select {...register("productoId", { required: "El producto es obligatorio" })} className="select">
            <option value="">Seleccione un producto</option>
            {categoriasConProductos.map((categoria) => (
              <optgroup key={categoria._id.$oid || categoria._id} label={categoria.nombre}>
                {categoria.productos.length > 0 ? (
                  categoria.productos.map((producto) => (
                    <option key={producto._id.$oid || producto._id} value={producto._id.$oid || producto._id}>
                      {producto.nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay productos</option>
                )}
              </optgroup>
            ))}
          </select>
          {errors.productoId && <p className="error">{errors.productoId.message}</p>}

          {/* Cantidad */}
          <label className="label">Cantidad:</label>
          <input type="number" {...register("cantidad", { required: "Ingrese una cantidad", min: 1 })} className="input" />
          {errors.cantidad && <p className="error">{errors.cantidad.message}</p>}

          {/* Descripción */}
          <label className="label">Descripción:</label>
          <textarea {...register("descripcion")} className="textarea" placeholder="Opcional"></textarea>

          {/* Botones */}
          <div className="botones-formulario">
            <button type="submit" className="boton">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarEgresoForm;
