const xhr = new XMLHttpRequest()
const xhr2 = new XMLHttpRequest()

function muestraMovimientos() {
  if (this.readyState === 4 && this.status === 200) {
    const respuesta = JSON.parse(this.responseText);

    if (respuesta.status !== "success") {
      alert("Se ha producido un error en la consulta")
      return
    }

    for (let i = 0; i < respuesta.data.length; i++) {
      const data = respuesta.data[i]
      const fila = document.createElement("tr")
      const dentro = `
      <td>${data.name}</td>
      <td>${data.symbol}</td>
      <td>${data.price.toFixed(2)} € </td>
      <td>${data.percent_change_24h.toFixed(2)} % </td>
      `
      fila.innerHTML = dentro
      const tbody = document.querySelector(".tabla-precios tbody")
      tbody.appendChild(fila)
    }
  }
}

function muestraStatus() {
  if (this.readyState === 4 && this.status === 200) {
    const respuesta = JSON.parse(this.responseText);

    if (respuesta.status !== "success") {
      alert("Se ha producido un error en la consulta");
      return;
    }
    
    for (let i = 0; i < respuesta.cartera.length; i++) {
      const data = respuesta.cartera[i]
      const fila = document.createElement("tr")
      const dentro = `
      <td>${data.name}</td>
      <td>${data.net.toFixed(8)}</td>
      <td>${data.EUR.toFixed(2)} €</td>
      `
      fila.innerHTML = dentro
      const tbody = document.querySelector(".tabla-wallet tbody")
      tbody.appendChild(fila)
    }
  }
}

function llamaApiCoin() {
xhr.open("GET", "http://localhost:5000/api/v1/precios", true)
xhr.onload = muestraMovimientos
xhr.send()
}

function llamaApiStatus() {
  xhr2.open("GET", "http://localhost:5000/api/v1/status", true);
  xhr2.onload = muestraStatus;
  xhr2.send();
}


window.onload = function () {
  llamaApiCoin()

  llamaApiStatus()
}


