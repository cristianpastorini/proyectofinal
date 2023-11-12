document.addEventListener('DOMContentLoaded', function() {
    const sectionEntradas = document.querySelector('#entradas');
    const detalleCompraElement = document.getElementById("detalleCompra");
    function getData() {
        fetch('../js/entradas.json')
        .then(res => {
            if (!res.ok) {
            throw new Error('Hubo un problema al obtener los datos');
            }
            return res.json();
        })
        .then(data => {
    let entradasRecitalesFilter = data.entradas.filter(entradas => entradas.titulo === 'recitales');
    let entradasPartidosFilter = data.entradas.filter(entradas => entradas.titulo === 'partidos');
            crearBotones(entradasRecitalesFilter);
            crearBotones(entradasPartidosFilter);
        })
        .catch(error => console.log('Hubo un error:', error));
    }
    function crearBotones(data) {
        const sectionPartidos = document.createElement('div');
        const sectionRecitales = document.createElement('div');

        data.forEach(entrada => {
            if (entrada.titulo === 'partidos') {
            // Agregamos el botón al contenedor de partidos
            sectionPartidos.appendChild(crearBoton(entrada));
            } else {
            // Agregamos el botón al contenedor de recitales
            sectionRecitales.appendChild(crearBoton(entrada));
            }
        });

        sectionEntradas.appendChild(sectionPartidos);
        sectionEntradas.appendChild(sectionRecitales);
        }
    function crearBoton(entrada) {
        let button = document.createElement('button');
        button.setAttribute('class', 'container');
        button.innerHTML += `
        <div>
            <h3>${entrada.nombre}</h3>
        </div>`;
        // Agregamos el evento de clic al botón
        button.addEventListener('click', function() {
        mostrarFormulario(entrada.nombre, entrada.estadio, entrada.precio);
        });
        return button;
    }
    function mostrarFormulario(nombre, estadio, precio) {
        const formularioElement = document.createElement('div');
        formularioElement.innerHTML = `
            <label for="cantidadEntradas">Ingrese la cantidad de Entradas:</label>
            <input type="number" id="cantidadEntradas" pattern="[1-9]+" required>
            <button id="confirmarCompraButton">Confirmar Compra</button>`;
        detalleCompraElement.textContent = "";
        detalleCompraElement.appendChild(formularioElement);

        const confirmarCompraButton = document.getElementById("confirmarCompraButton");
        confirmarCompraButton.addEventListener("click", function() {
            const cantidadEntradas = document.getElementById("cantidadEntradas")?.value;
          // Validamos que la cantidad de entradas sea un número válido
            if (isNaN(cantidadEntradas) || cantidadEntradas < 1 || cantidadEntradas > 9) {
            // Mostramos el mensaje de error con Toastify
            Toastify({
                text: "La cantidad de entradas debe ser mayor que (0) y menor que (10).",
                duration: 4000,
                gravity: "bottom",
                position: "center",
                stopOnFocus: true,
                target: document.getElementById("toast-container"),
                style: {
                background: "black",
            }
            }).showToast();
            document.getElementById("cantidadEntradas").value = "";
            return;
            }

          // Guardamos la compra en el almacenamiento local
            const compra = {
            nombre,
            estadio,
            cantidadEntradas: cantidadEntradas || 0,
            precioTotal: cantidadEntradas * precio,
            };
            localStorage.setItem("compra", JSON.stringify(compra));
        
          // Mostramos el mensaje de compra exitosa con Toastify
            Toastify({
            text: "¡Compra realizada con éxito!",
            duration: 4000,
            gravity: "bottom",
            position: "center",
            stopOnFocus: true,
            target: document.getElementById("toast-container"),
            style: {
                background: "black",
        
            }
            }).showToast();

          // Recuperamos la información de la compra del almacenamiento local
            const storedCompra = JSON.parse(localStorage.getItem("compra"));
          // Si hay una compra guardada, la muestra
            if (storedCompra) {
            detalleCompraElement.innerHTML = `
                Evento: ${storedCompra.nombre},
                Estadio: ${storedCompra.estadio},
                Cantidad: ${storedCompra.cantidadEntradas},
                Total: $ ${storedCompra.precioTotal}
            `;
            } else {
            detalleCompraElement.innerHTML = `
                <label for="cantidadEntradas">Ingrese la cantidad de Entradas:</label>
                <input type="number" id="cantidadEntradas" pattern="[1-9]+" required>
                <button id="confirmarCompraButton">Confirmar Compra</button>
            `;
            }
        });
    }
    getData();
    });