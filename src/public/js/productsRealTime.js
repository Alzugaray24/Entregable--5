const socket = io();
const div = document.getElementById("productosRealTime");
const boton = document.getElementById("boton");
const errorTitle = document.getElementById("error-title");

socket.on("connect", () => {
  console.log("Conectado al servidor");

  socket.on("productsRealTime", (data) => {
    const productsHTML = data.map((product) => {
      return `<li class="product-list-item">
      <strong class="product-title">Título:</strong> ${product.title}<br>
      <strong class="product-description">Descripción:</strong> ${product.description}<br>
      <strong class="product-code">Código:</strong> ${product.code}<br>
      <strong class="product-price">Precio: USD ${product.price}</strong><br>
      <strong class="product-stock">Stock: ${product.stock}</strong>
      </li>`;
    });

    div.innerHTML = productsHTML.join("");
  });
});

boton.addEventListener("click", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;

  const product = {
    title,
    description,
    code,
    price,
    stock,
    status: true,
    category: "friend",
    thumbnails: [],
  };

  socket.emit("nuevo_producto", product);
});

socket.on("nuevos_productos", (data) => {
  const productsHTML = data.map((product) => {
    return `<li class="product-list-item">
    <strong class="product-title">Título:</strong> ${product.title}<br>
    <strong class="product-description">Descripción:</strong> ${product.description}<br>
    <strong class="product-code">Código:</strong> ${product.code}<br>
    <strong class="product-price">Precio: USD ${product.price}</strong><br>
    <strong class="product-stock">Stock: ${product.stock}</strong>
    </li>`;
  });

  div.innerHTML = productsHTML.join("");

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("code").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
});

socket.on("mensaje_error", (data) => {
  Swal.fire({
    icon: "error",
    title: "¡Ups, ha ocurrido un error!",
    text: data,
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
    background: "#f2dede",
    customClass: {
      popup: "error-popup-class",
    },
  });
});
