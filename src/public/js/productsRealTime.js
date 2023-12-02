const socket = io();
const div = document.getElementById("productosRealTime");

socket.on("connect", () => {
  console.log("Conectado al servidor");

  socket.on("productsRealTime", (data) => {
    const productsHTML = data.map((el) => {
      return `<li class="product-list-item"><strong style="font-size:20px">${el.title}</strong>: USD${el.price} - STOCK: <span style="color:green">${el.stock}</span></li>`;
    });

    div.innerHTML = productsHTML.join('');
  });
});
