import React, { useState, useContext } from "react";
import { css } from "@emotion/react";
import Router, { useRouter } from "next/Router";
import Layout from "../components/layout/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";

import { FirebaseContext } from "../firebase";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";

export default function NuevoProducto() {
  const [error, guardarError] = useState(false);

  const STATE_INICIAL = {
    nombre: "",
    empresa: "",
    imagen: "",
    url: "",
    descripcion: "",
  };

  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  //hook de routing para redireccionar
  const router = useRouter();

  //context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearProducto() {
    //si el usuario no está autenticado
    if (!usuario) {
      return router.push("/login");
    }

    //crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
    };

    //insertarlo en la base de datos
    firebase.db.collection("productos").add(producto);
  }

  return (
    <>
      <Layout>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          Nuevo Producto
        </h1>
        <Formulario onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Información General</legend>

            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu Nombre"
                value={nombre}
                onChange={handleChange}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}

            <Campo>
              <label htmlFor="empresa">Empresa</label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                placeholder="Nombre Empresa o Compañia"
                value={empresa}
                onChange={handleChange}
              />
            </Campo>
            {errores.empresa && <Error>{errores.empresa}</Error>}

            {/* <Campo>
              <label htmlFor="imagen">Imagen</label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                value={imagen}
                onChange={handleChange}
              />
            </Campo>
            {errores.imagen && <Error>{errores.imagen}</Error>} */}

            <Campo>
              <label htmlFor="url">URL</label>
              <input
                type="url"
                id="url"
                name="url"
                placeholder="Introduce la URL del producto"
                value={url}
                onChange={handleChange}
              />
            </Campo>
            {errores.url && <Error>{errores.url}</Error>}
          </fieldset>

          <fieldset>
            <legend>Sobre tu producto</legend>
            <Campo>
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={descripcion}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.empresa && <Error>{errores.empresa}</Error>}
          </fieldset>

          {error && <Error>{error}</Error>}

          <InputSubmit type="submit" value="Crear Producto" />
        </Formulario>
      </Layout>
    </>
  );
}
