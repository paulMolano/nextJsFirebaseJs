import React, { useState } from "react";
import { css } from "@emotion/react";
import Router from "next/Router";
import Layout from "../components/layout/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";

import firebase from "../firebase";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";

export default function Login() {
  return (
    <>
      <Layout>
        <h1>Login</h1>
      </Layout>
    </>
  );
}
