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

import Error404 from "../components/layout/404";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";

export default function NuevoProducto() {
  const [error, guardarError] = useState(false);
  const [imagen, guardarImagen] = useState(null);

  const STATE_INICIAL = {
    nombre: "",
    empresa: "",
    url: "",
    descripcion: "",
  };

  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, url, descripcion } = valores;

  //hook de routing para redireccionar
  const router = useRouter();

  //context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);
  console.log(usuario);

  const handleFile = (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files[0]);
      guardarImagen(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const uploadTask = await firebase.storage
      .ref(`productos/${imagen.lastModified}${imagen.name}`)
      .put(imagen);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    return downloadURL;
  };

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
      imagen: await handleUpload(),
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName,
      },
      haVotado: [],
    };

    //insertarlo en la base de datos
    firebase.db.collection("productos").add(producto);

    return router.push("/");
  }

  return (
    <>
      <Layout>
        {!usuario ? (
          <Error404 />
        ) : (
          <>
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
                    placeholder="Nombre del Producto"
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

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    onInput={(e) => handleFile(e)}
                  />
                </Campo>
                {errores.imagen && <Error>{errores.imagen}</Error>}

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

              <fieldset
                css={css`
                  width: 100%;
                `}
              >
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
          </>
        )}
      </Layout>
    </>
  );
}
