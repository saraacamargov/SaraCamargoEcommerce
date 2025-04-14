const productos = [
  {
    nombre: "Bandas de Resistencia",
    descripcion: "Ideales para entrenamientos funcionales y de fuerza.",
    precio: 35000,
    categoria: "fuerza"
  },
  {
    nombre: "Botella Deportiva",
    descripcion: "Conserva tus bebidas frías por más tiempo. Capacidad de 1L.",
    precio: 28000,
    categoria: "hidratacion"
  },
  {
    nombre: "Guantes para Pesas",
    descripcion: "Evita lesiones y mejora tu agarre durante el levantamiento.",
    precio: 42000,
    categoria: "proteccion"
  },
  {
    nombre: "Cuerda para Saltar",
    descripcion: "Ideal para cardio, ligera y ajustable para todos los niveles.",
    precio: 19000,
    categoria: "cardio"
  }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function renderizarProductos(categoria = "todos") {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";

  productos.filter(p => categoria === "todos" || p.categoria === categoria)
    .forEach((producto, index) => {
      const div = document.createElement("div");
      div.className = "producto";
      div.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">$${producto.precio.toLocaleString()}</p>
        <button onclick="agregarAlCarrito(${index})">Agregar al carrito</button>
      `;
      contenedor.appendChild(div);
    });
}

function agregarAlCarrito(index) {
  carrito.push(productos[index]);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${productos[index].nombre} fue agregado al carrito 🛒`);
}

function mostrarCarrito() {
  const modal = document.getElementById("modal-carrito");
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = "<li>Tu carrito está vacío</li>";
  } else {
    carrito.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.nombre} - $${item.precio.toLocaleString()}`;
      lista.appendChild(li);
    });
  }

  modal.style.display = "block";
}

document.getElementById("ver-carrito").addEventListener("click", mostrarCarrito);
document.getElementById("cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-carrito").style.display = "none";
});

document.getElementById("filtro-categoria").addEventListener("change", (e) => {
  renderizarProductos(e.target.value);
});

window.onclick = function(event) {
  const modal = document.getElementById("modal-carrito");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

paypal.Buttons({
  createOrder: function(data, actions) {
    const total = carrito.reduce((acc, item) => acc + item.precio, 0);
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: (total / 4000).toFixed(2) // Valor aproximado en USD
        }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Gracias por tu compra, ' + details.payer.name.given_name);
      carrito = [];
      localStorage.removeItem("carrito");
      document.getElementById("modal-carrito").style.display = "none";
    });
  }
}).render('#paypal-button-container');

renderizarProductos();
