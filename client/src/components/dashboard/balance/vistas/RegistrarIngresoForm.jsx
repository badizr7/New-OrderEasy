import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { getCategoriesByUser } from "../../../../services/categoryServices";
import { getAllProducts } from "../../../../services/productServices";
import { createVenta } from "../../../../services/ventaService"; 
import "./styles/RegistrarIngresoForm.css";

const RegistrarIngresoForm = ({ cerrarFormulario }) => {
 const { register, handleSubmit, formState: { errors }, reset } = useForm();
 const [categoriasConProductos, setCategoriasConProductos] = useState([]);
 const [mensaje, setMensaje] = useState(null);
 const [cargando, setCargando] = useState(false);

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

 const onSubmit = async (data) => {
   try {
     setCargando(true);
     const token = localStorage.getItem("token");
     
     const productoSeleccionado = categoriasConProductos
       .flatMap(cat => cat.productos)
       .find(prod => prod._id === data.productoId);

     if (!productoSeleccionado) {
       throw new Error("Producto no encontrado");
     }

     // Verificación de stock
     if (productoSeleccionado.cantidadDisponible < data.cantidad) {
       await Swal.fire({
         icon: 'error',
         title: 'Stock Insuficiente',
         text: `Solo hay ${productoSeleccionado.cantidadDisponible} unidades disponibles de ${productoSeleccionado.nombre}`,
         confirmButtonColor: '#3085d6',
         confirmButtonText: 'Entendido'
       });
       return;
     }

     const ventaData = {
       productoNombre: productoSeleccionado.nombre,
       cantidad: Number(data.cantidad),
       descripcion: data.descripcion || ""
     };

     await createVenta(ventaData, token);
     
     // Mensaje de éxito
     await Swal.fire({
       icon: 'success',
       title: '¡Venta Exitosa!',
       text: `Se ha registrado la venta de ${data.cantidad} unidades de ${productoSeleccionado.nombre}`,
       showConfirmButton: true,
       confirmButtonText: 'Aceptar',
       confirmButtonColor: '#3085d6',
       timer: 3000,
       timerProgressBar: true,
       position: 'center',
       backdrop: true
     });

     reset();
     cerrarFormulario();
   } catch (error) {
     await Swal.fire({
       icon: 'error',
       title: 'Error en la Venta',
       text: error.response?.data?.mensaje || 'Error al registrar la venta',
       confirmButtonColor: '#3085d6',
       confirmButtonText: 'Cerrar'
     });
   } finally {
     setCargando(false);
   }
 };

 return (
   <div className="fondo-modal" onClick={cerrarFormulario}>
     <div className="ventana-flotante" onClick={(e) => e.stopPropagation()}>
       <button className="cerrar-modal" onClick={cerrarFormulario}>✖</button>
       <h2 className="titulo">Registrar Venta</h2>

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
                     {producto.nombre} - Stock: {producto.cantidadDisponible}
                   </option>
                 ))
               ) : (
                 <option disabled>No hay productos</option>
               )}
             </optgroup>
           ))}
         </select>
         {errors.productoId && <p className="error">{errors.productoId.message}</p>}

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
           {...register("descripcion")} 
           className="textarea" 
           placeholder="Opcional"
         ></textarea>

         <div className="botones-formulario">
           <button type="submit" className="boton" disabled={cargando}>
             {cargando ? "Registrando..." : "Registrar Venta"}
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};

export default RegistrarIngresoForm;