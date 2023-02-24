// FETCH

let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

// VARIABLES

const containerProductos = document.querySelector('#container-productos');
const containerCarrito = document.querySelector('#container-carrito');
let botonesAgregar = document.querySelectorAll('.agregar-carrito');
let botonesEliminar = document.querySelectorAll('.eliminar-carrito');
const cantidadCarrito = document.querySelector('#cantidad-carrito');
const botonVaciar = document.querySelector('#vaciar-carrito');
const subTotal = document.querySelector('#subTotal');
const botonComprar = document.querySelector('#comprar-carrito');
const inputSearch = document.querySelector('#inputSearch')

// FUNCIONES

function cargarProductos() {

    containerProductos.innerHTML = "";

    productos.forEach(producto => {

        const div = document.createElement('div');
        div.classList.add('producto', 'col-6', 'col-md-3')

        div.innerHTML = `
                    <i class="fa-solid fa-circle-plus agregar-carrito" id=${producto.id}></i>
                    <img src="${producto.imagen}" class="producto-img" alt="${producto.nombre}">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <h4 class="producto-precio">$${producto.precio}</h4>
        `;

        containerProductos.append(div);
    })

    actualizarBotonesAgregar()

}


function actualizarBotonesAgregar() {

    botonesAgregar = document.querySelectorAll('.agregar-carrito');

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    })

}

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem('carrito');

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarCantidadCarrito()
} else {
    productosEnCarrito = [];
    cargarProductosCarrito();

}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto Agregado",
        duration: 1000,
        gravity: "bottom", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #F9C521, #f99b21)",
            borderRadius: "2rem",
            color: "#121212",
            fontWeight: "600"
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarCantidadCarrito();
    cargarProductosCarrito();

    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));

}

function actualizarCantidadCarrito() {

    nuevaCantidadCarrito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    cantidadCarrito.innerText = nuevaCantidadCarrito;

}

function cargarProductosCarrito() {

    if (productosEnCarrito && productosEnCarrito.length > 0) {

        containerCarrito.innerHTML = "";

        productosEnCarrito.forEach(producto => {

            const div = document.createElement('div');
            div.classList.add('col-12', 'producto-carrito')

            div.innerHTML = `
                    <span class="producto-carrito-cantidad">${producto.cantidad}</span>
                    <img src="${producto.imagen}" class="producto-carrito-img" alt='${producto.nombre}'>
                    <h3 class="producto-carrito-nombre">${producto.nombre}</h3>
                    <h4 class="producto-precio">${producto.precio}</h4>
                    <i class="fa-solid fa-circle-xmark fa-xl eliminar-carrito" id=${producto.id}></i>
        `;

            containerCarrito.append(div);
        })

        actualizarBotonesEliminar()
        actualizarTotal()

    } else {

        containerCarrito.innerHTML = "";
        actualizarTotal()

    }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {

    botonesAgregar = document.querySelectorAll('.eliminar-carrito');

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', eliminarDelCarrito);
    })

}

function eliminarDelCarrito(e) {

    Toastify({
        text: "Producto Eliminado",
        duration: 1000,
        gravity: "bottom", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #F9C521, #f99b21)",
            borderRadius: "2rem",
            color: "#121212",
            fontWeight: "600"
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);


    productosEnCarrito.splice(index, 1);

    cargarProductosCarrito();
    actualizarCantidadCarrito();

    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener('click', vaciarCarrito);

function vaciarCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Se van a borrar ${productosEnCarrito.length} productos`,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#F9C521',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Vaciar',
            iconColor: '#F9C521',
            color: '#121212'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Eliminado!',
                    'Tu carrito fue eliminado.',
                    'success'
                )
                productosEnCarrito.length = 0;
                localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));
                cargarProductosCarrito()
                actualizarCantidadCarrito();

            }
        })



    } else {

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Tu carrito esta vacío!',
        })
    }
}

function actualizarTotal() {
    totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    subTotal.innerText = `Subtotal : $${totalCalculado}`;
}

botonComprar.addEventListener('click', comprarCarrito);

function comprarCarrito() {

    if (productosEnCarrito && productosEnCarrito.length > 0) {

        let timerInterval
        Swal.fire({
            title: '¡Muchas gracias por tu compra!',
            html: 'Tu pedido ha sido realizado y está siendo procesado. Recibirás un correo electrónico con los detalles del pedido.',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
            }
        })

        productosEnCarrito.length = 0;
        localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));
        cargarProductosCarrito()
        actualizarCantidadCarrito();

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Tu carrito esta vacío!',
        })
    }
}

// Buscador

inputSearch.addEventListener('keyup', (e) => {

    const filtroBusqueda = productos.filter((producto) => {
        return producto.nombre.toUpperCase().includes(e.target.value.toUpperCase())
    })

    if (filtroBusqueda.length !== 0) {

        containerProductos.innerHTML = ''
        filtroBusqueda.forEach((producto) => {

            containerProductos.innerHTML +=
                `
                <div class="producto col-6 col-md-3">
                    <i class="fa-solid fa-circle-plus agregar-carrito" id=${producto.id}></i>
                    <img src="${producto.imagen}" class="producto-img" alt="${producto.nombre}">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <h4 class="producto-precio">$${producto.precio}</h4>
                </div>
                `
        })
        actualizarBotonesAgregar()

    } else {

        containerProductos.innerHTML = ''
        containerProductos.innerHTML +=
            `
            <div class="col-12 error">

            <i class="fa-regular fa-face-sad-cry"></i>

            <p>Oops...<br>No se encontro ningun producto con ese nombre</p>
        </div>
                `

    }
})
