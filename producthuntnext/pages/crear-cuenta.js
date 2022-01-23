import React from "react";
import { css } from "@emotion/react";
import Layout from "../components/layout/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";
import validarCrearCuenta from "../validacion/validarCrearCuenta";

import firebase from "../firebase";

//Validaciones
import useValidacion from "../hooks/useValidacion";

export default function CrearCuenta() {
  const STATE_INICIAL = {
    nombre: "",
    email: "",
    password: "",
  };

  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;

  function crearCuenta() {
    firebase.registrar(nombre, email, password);
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
          Crear Cuenta
        </h1>
        <Formulario onSubmit={handleSubmit} noValidate>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Tu email"
              value={email}
              onChange={handleChange}
            />
          </Campo>

          {errores.email && <Error>{errores.email}</Error>}

          <Campo>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Tu Password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.password && <Error>{errores.password}</Error>}

          <InputSubmit type="submit" value="Crear Cuenta" />
        </Formulario>
      </Layout>
    </>
  );
}
