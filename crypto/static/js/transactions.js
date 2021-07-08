function recibeRespuesta() {
  if (this.readyState === 4 && (this.status === 200 || this.status === 201)) {
    const respuesta = JSON.parse(this.responseText);

    if (respuesta.status !== "success") {
      alert(
        "Se ha producido un error en acceso a servidor: " + respuesta.mensaje
      );
      return;
    }

    alert(respuesta.mensaje);

    llamaApiCoin();
  }
}

const xhr = new XMLHttpRequest();
const xhr2 = new XMLHttpRequest();

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
      <td>${movimientos.moneda_to}</td>
      <td>${movimientos.cantidad_to.toFixed(2)}</td>
      `;
      fila.innerHTML = dentro;
      const tbody = document.querySelector(".tabla-movimientos tbody");
      tbody.appendChild(fila);
    }
  }
}

function llamaApiCoin() {
  xhr2.open("GET", "http://localhost:5000/api/v1/movimientos", true);
  xhr2.onload = muestraMovimientos;
  xhr2.send();
}

function capturaConversion(ev) {
  ev.preventDefault();
  let movimiento = {};
  movimiento.conv_from = document.querySelector("#conv_from").value;
  movimiento.cantidad_from = document.querySelector("#cantidad_from").value;
  movimiento.conv_to = document.querySelector("#conv_to").value;

  xhr.open(
    "GET",
    `http://localhost:5000/api/v1/par/${movimiento.conv_from}/${movimiento.conv_to}/${movimiento.cantidad_from}`,
    true
  );

  //xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onload = recibeRespuesta;
  xhr.send();
};


/*

    $.ajax({
    url:'/api/v1/par',
    type:'POST',
    data: movimiento,
    success: function(response) {
      console.log(response);
    }
})

*/

window.onload = function () {
  llamaApiCoin();

  document
    .querySelector("#calcular")
    .addEventListener("click", capturaConversion);
};
