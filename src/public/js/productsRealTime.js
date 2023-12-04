const socket = io();
const div = document.getElementById("productosRealTime");
const boton = document.getElementById("boton");
const errorTitle = document.getElementById("error-title")

socket.on("connect", () => {
  console.log("Conectado al servidor");

  socket.on("productsRealTime", (data) => {
    const productsHTML = data.map((el) => {
      return `<li class="product-list-item"><strong style="font-size:20px">${el.title}</strong>: USD${el.price} - STOCK: <span style="color:green">${el.stock}</span></li>`;
    });

    div.innerHTML = productsHTML.join("");
  });
});

boton.addEventListener("click", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;

  const product = {
    title,
    price,
    stock,
  };

  socket.emit("nuevo_producto", product);
  socket.on("nuevos_productos", (data) => {
    const productsHTML = data.map((el) => {
      return `<li class="product-list-item"><strong style="font-size:20px">${el.title}</strong>: USD${el.price} - STOCK: <span style="color:green">${el.stock}</span></li>`;
    });

    div.innerHTML = productsHTML.join("");
  });

  document.getElementById("title").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
});


socket.on("mensaje_error", data=>{
  Swal.fire({
    icon: 'error',
    title: '¡Ups, ha ocurrido un error!',
    text: data,
    showConfirmButton: false, 
    timer: 5000, 
    timerProgressBar: true,
    toast: true, 
    position: 'top-end',
    background: '#f2dede',
    customClass: {
      popup: 'error-popup-class',
    },
  });
})
