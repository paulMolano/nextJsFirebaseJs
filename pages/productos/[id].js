import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { FirebaseContext } from "../../firebase";
import Layout from "../../components/layout/Layout";
import Error404 from "../../components/layout/404";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;
const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  //state del componente
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardarConsultarDB] = useState(true);

  //Routing para obtener el id actuar
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //Context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          guardarProducto(producto.data());
          guardarConsultarDB(false);
        } else {
          guardarError(true);
          guardarConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando";

  const {
    comentarios,
    creado,
    descripcion,
    nombre,
    url,
    imagen,
    votos,
    creador,
    haVotado,
  } = producto;

  console.log(usuario);
  //Administrar y validar los votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push("/");
    }

    // Verificar si el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) return;

    //Obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    // guardar el ID del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    guardarProducto({
      ...producto,
      haVotado: nuevoHaVotado,
    });

    //  Actualizar en la BD
    firebase.db.collection("productos").doc(id).update({
      votos: nuevoTotal,
      haVotado: nuevoHaVotado,
    });

    // Actualizar el state
    guardarProducto({
      ...producto,
      votos: nuevoTotal,
    });

    guardarConsultarDB(true);
  };

  // Funciones para crear comentarios
  const comentarioChange = (e) => {
    guardarComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  // Identifica si el comentario es del creador del producto
  const esCreador = (id) => {
    if (creador.id == id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }

    // información extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    // Tomar copia de comentarios y agregarlos al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    // Actualizar la BD
    firebase.db.collection("productos").doc(id).update({
      comentarios: nuevosComentarios,
    });

    // Actualizar el state
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });

    guardarConsultarDB(true); // hay un COMENTARIO, por lo tanto consultar a la BD
  };

  // función que revisa que el creador del producto sea el mismo que esta autenticado
  const puedeBorrar = () => {
    if (!usuario) return false;

    if (creador.id === usuario.uid) {
      return true;
    }
  };

  // elimina un producto de la bd
  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }

    if (creador.id !== usuario.uid) {
      return router.push("/");
    }

    try {
      await firebase.db.collection("productos").doc(id).delete();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      {error ? (
        <Error404 />
      ) : (
        <div className="contenedor">
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            {nombre}
          </h1>
          <ContenedorProducto>
            <div>
              <p>
                Publicado por {creador.nombre} hace:{" "}
                {formatDistanceToNow(new Date(creado), { locale: es })}{" "}
              </p>
              <img src={imagen} alt={nombre} />
              <p>{descripcion}</p>

              {usuario && (
                <>
                  <h2>Agrega tu comentario</h2>
                  <form onSubmit={agregarComentario}>
                    <Campo>
                      <input
                        type="text"
                        name="mensaje"
                        onChange={comentarioChange}
                      />
                    </Campo>
                    <InputSubmit type="submit" value="Agregar Comentario" />
                  </form>
                </>
              )}

              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >
                Comentarios
              </h2>

              {comentarios.length === 0 ? (
                "Aún no hay comentarios"
              ) : (
                <ul>
                  {comentarios.map((comentario, i) => (
                    <li
                      key={`${comentario.usuarioId}-${i}`}
                      css={css`
                        border: 1px solid #e1e1e1;
                        padding: 2rem;
                      `}
                    >
                      <p>{comentario.mensaje}</p>
                      <p>
                        Escrito por:
                        <span
                          css={css`
                            font-weight: bold;
                          `}
                        >
                          {""} {comentario.usuarioNombre}
                        </span>
                      </p>
                      {esCreador(comentario.usuarioId) && (
                        <CreadorProducto>Creador</CreadorProducto>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <aside>
              <Boton target="_blank" bgColor="true" href={url}>
                Visitar URL
              </Boton>

              <div
                css={css`
                  margin-top: 5rem;
                `}
              >
                {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                <p
                  css={css`
                    text-align: center;
                  `}
                >
                  {votos} Votos
                </p>
              </div>
            </aside>
          </ContenedorProducto>
          {puedeBorrar() && (
            <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Producto;
