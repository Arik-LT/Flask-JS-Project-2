function muestraMovimientos() {
  if (this.readyState === 4 && this.status === 200) {
    const respuesta = JSON.parse(this.responseText);

    if (respuesta.status !== "success") {
      alert("Se ha producido un error en la consulta");
      return;
    }

    for (let i = 0; i < respuesta.movimientos.length; i++) {
      const movimientos = respuesta.movimientos[i];
      const fila = document.createElement("tr");
      const dentro = `
      <td>${movimientos.date}</td>
      <td>${movimientos.time}</td>
      <td>${movimientos.moneda_from}</td>
      <td>${movimientos.cantidad_from.toFixed(2)}</td>
      <td>${movimientos.moneda_to} € </td>
      <td>${movimientos.cantidad_to.toFixed(2)} % </td>
      `;
      fila.innerHTML = dentro;
      const tbody = document.querySelector(".tabla-movimientos tbody");
      tbody.appendChild(fila);
    }
  }
}

const xhr = new XMLHttpRequest();

xhr.open("GET", "http://localhost:5000/api/v1/movimientos", true);

xhr.onload = muestraMovimientos;

xhr.send();
