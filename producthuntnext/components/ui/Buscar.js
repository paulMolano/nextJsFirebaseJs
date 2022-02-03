import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Router from "next/router";

const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 300px;
`;
const InputSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 3rem;
  background-image: url("/static/img/buscar.png");
  background-repeat: no-repeat;
  position: absolute;
  margin: 0 auto;
  right: 1rem;
  background-color: white;
  border: none;

  &:hover {
    cursor: pointer;
  }
`;

const Buscar = () => {
  const [busqueda, guardarBusqueda] = useState("");

  const buscarProducto = (e) => {
    e.preventDefault();

    if (busqueda.trim() === "") return;

    // redireccionar a /buscar
    Router.push({
      pathname: "/buscar",
      query: { q: busqueda },
    });
  };

  return (
    <>
      <form
        css={css`
          position: relative;
          display: flex;
          align-items: center;
        `}
        onSubmit={buscarProducto}
      >
        <InputText
          type="text"
          placeholder="Buscar Productos"
          onChange={(e) => guardarBusqueda(e.target.value)}
        />
        <InputSubmit type="submit" />
      </form>
    </>
  );
};

export default Buscar;
