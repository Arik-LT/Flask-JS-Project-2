let price_converted;
let cartera

const xhr = new XMLHttpRequest();
const xhr2 = new XMLHttpRequest();
const xhr3 = new XMLHttpRequest();

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

function muestraMovimientos() {
  if (this.readyState === 4 && this.status === 200) {
    const respuesta = JSON.parse(this.responseText);

    if (respuesta.status !== "success") {
      alert("Se ha producido un error en la consulta");
      return;
    }

    const tbody = document.querySelector(".tabla-movimientos tbody");
    tbody.innerHTML = "";

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
      
      tbody.appendChild(fila);
    }
  }
}

function muestraStatus() {
  if (this.readyState === 4 && this.status === 200) {
    respuesta = JSON.parse(this.responseText);

    if (respuesta.status !== "success") {
      alert("Se ha producido un error en la consulta");
      return;
    }

    cartera = respuesta.cartera
    document.querySelector(".Invertido").textContent = respuesta.net_valor.invertido.toFixed(2) + " €"
    if (respuesta.net_valor.invertido > 0) {
    document.querySelector(".Invertido").style.color="Red"
    } else {
    document.querySelector(".Invertido").style.color="Green"
    }

    document.querySelector(".Valor").textContent = respuesta.net_valor.valor_criptos.toFixed(2) + " €"
    if (respuesta.net_valor.invertido > 0) {
      document.querySelector(".Valor").style.color="Green"
      } else {
      document.querySelector(".Valor").style.color="Red"
      }

    document.querySelector(".Beneficio").textContent = respuesta.net_valor.net_profit.toFixed(2) + " €"
    if (respuesta.net_valor.invertido > 0) {
      document.querySelector(".Beneficio").style.color="Green"
      } else {
      document.querySelector(".Beneficio").style.color="Red"
      }
  }
  return cartera
}

function llamaApiCoin() {
  xhr2.open("GET", "http://localhost:5000/api/v1/movimientos", true);
  xhr2.onload = muestraMovimientos;
  xhr2.send();
}

function llamaApiStatus() {
  xhr3.open("GET", "http://localhost:5000/api/v1/status", true);
  xhr3.onload = muestraStatus;
  xhr3.send();
}

function capturaConversion(ev) {
  ev.preventDefault();
  muestraStatus()

  let movimiento = {};
  movimiento.conv_from = document.querySelector("#conv_from").value;
  movimiento.cantidad_from = document.querySelector("#cantidad_from").value;
  movimiento.conv_to = document.querySelector("#conv_to").value;

  if (movimiento.conv_from === movimiento.conv_to){
    alert("Las monedas From y To deben ser distintas")
  }
  if(!movimiento.cantidad_from){
    alert("Debe seleccionar una cantidad")
  }
  if (movimiento.cantidad_from < 0){
    alert("La cantidad debe ser positiva")
  }

  if (movimiento.conv_from !== "EUR") {
    for (let i = 0; i < cartera.length; i++) {
      if (cartera[i].name = movimiento.conv_from) {
        if (movimiento.cantidad_from > cartera[i].net) {
          alert(`No tienes sufcientes ${movimiento.conv_from} para realizar esta transacción`)
          break
        }
      }
    }
  }

  xhr.open(
    "GET",
    `http://localhost:5000/api/v1/par/${movimiento.conv_from}/${movimiento.conv_to}/${movimiento.cantidad_from}`,
    true
  );

  xhr.onload = () => {
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
    const respuesta = JSON.parse(xhr.responseText);
    console.log(respuesta.status.error_message)

    if (respuesta.status.error_message !== null) {
      alert("Se ha producido un error en la consulta");
      return;
    }

    price_converted = respuesta.data.quote[movimiento.conv_to].price;

    document.querySelector(".conversionValue").textContent =
      price_converted.toFixed(6) + `  ${movimiento.conv_to}`;
    document.querySelector(".priceValue").textContent =
      (movimiento.cantidad_from / price_converted).toFixed(6) + "  €";
  };
}
  xhr.send();
}

function creaMovimiento(ev) {
  ev.preventDefault();
  
  muestraStatus()
  console.log(cartera);

  let movimiento = {};
  movimiento.conv_from = document.querySelector("#conv_from").value;
  movimiento.cantidad_from = Number(
    document.querySelector("#cantidad_from").value
  );
  movimiento.conv_to = document.querySelector("#conv_to").value;
  movimiento.cantidad_to = price_converted;

  xhr.open("POST", `http://localhost:5000/api/v1/nuevomov`, true);

  xhr.onload = recibeRespuesta;

  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.send(JSON.stringify(movimiento));
}

window.onload = function () {
  llamaApiCoin();

  llamaApiStatus();

  document
    .querySelector("#calcular")
    .addEventListener("click", capturaConversion);

  document.querySelector("#cancelar").addEventListener("click", () => {
    document.querySelector("#cantidad_from").value = ''
    document.querySelector(".conversionValue").textContent = ''
    document.querySelector(".priceValue").textContent = ''
  });

  document.querySelector("#submit").addEventListener("click", creaMovimiento);
};

