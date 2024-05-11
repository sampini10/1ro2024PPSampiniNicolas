//Clases

class Persona {
    constructor(id, nombre, apellido, fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }
    toString() {
        return "ID: " + this.id + ", Nombre: " + this.nombre + ", Apellido: " + this.apellido + ", Fecha de Nacimiento: " + this.fechaNacimiento;
    }
}

class Ciudadano extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, dni) {
        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni;
    }
    toString() {
        return super.toString() + ", DNI: " + this.dni;
    }
}

class Extranjero extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
        super(id, nombre, apellido, fechaNacimiento);
        this.paisOrigen = paisOrigen;
    }
    toString() {
        return super.toString() + ", Pais Origen: " + this.paisOrigen;
    }
}

//Carga del array
let dataJSON = '[{"id":1,"apellido":"Serrano","nombre":"Horacio","fechaNacimiento":19840103,"dni":45876942},{"id":2,"apellido":"Casas","nombre":"Julian","fechaNacimiento":19990723,"dni":98536214},{"id":3,"apellido":"Galeano","nombre":"Julieta","fechaNacimiento":20081103,"dni":74859612},{"id":4,"apellido":"Molina","nombre":"Juana","fechaNacimiento":19681201,"paisOrigen":"Paraguay"},{"id":5,"apellido":"Barrichello","nombre":"Rubens","fechaNacimiento":19720523,"paisOrigen":"Brazil"},{"id":666,"apellido":"Hkkinen","nombre":"Mika","fechaNacimiento":19680928,"paisOrigen":"Finlandia"}]'
dataJSON = JSON.parse(dataJSON);

//lista para guardar el array
let listaPersonasObj = [];
let listaPersonasObjFiltrada = [];

//function para cargar data de JSON
function cargarDatos() {
    dataJSON.forEach((persona) => {
        if (persona.dni) {
            let ciudadanoNew = new Ciudadano(
                persona.id,
                persona.nombre,
                persona.apellido,
                persona.fechaNacimiento,
                persona.dni
            );
            listaPersonasObj.push(ciudadanoNew);
        } else if (persona.paisOrigen) {
            let extranjeroNew = new Extranjero(
                persona.id,
                persona.nombre,
                persona.apellido,
                persona.fechaNacimiento,
                persona.paisOrigen
            );
            listaPersonasObj.push(extranjeroNew);
        }
    });
    console.log(listaPersonasObj);
    cargarTabla(listaPersonasObj);
}

//Function para cargar la tabla
function cargarTabla(listaPersonasObj) {
    let tbody = document.getElementById("dataTable");
    tbody.innerHTML = "";

    listaPersonasObj.forEach((persona) => {
        let trData = document.createElement("tr");
        trData.setAttribute("id", "fila-" + persona.id);

        let tdID = document.createElement("td");
        tdID.textContent = persona.id;
        trData.appendChild(tdID);

        let tdNombre = document.createElement("td");
        tdNombre.textContent = persona.nombre;
        trData.appendChild(tdNombre);

        let tdApellido = document.createElement("td");
        tdApellido.textContent = persona.apellido;
        trData.appendChild(tdApellido);

        let tdFechaNacimiento = document.createElement("td");
        tdFechaNacimiento.textContent = persona.fechaNacimiento;
        trData.appendChild(tdFechaNacimiento);

        let tdDni = document.createElement("td");
        tdDni.textContent = persona.dni;
        trData.appendChild(tdDni);

        let tdPaisOrigen = document.createElement("td");
        tdPaisOrigen.textContent = persona.paisOrigen;
        trData.appendChild(tdPaisOrigen);

        trData.addEventListener("click", () => {
            editarPersona(persona.id);
        });

        tbody.appendChild(trData);
    });
}

//Function para filtrar
function filtrarTipo() {
    let getFiltroTipo = document.getElementById("FiltroTipo");
    let valorFiltro = getFiltroTipo.value;
    listaPersonasObjFiltrada = listaPersonasObj.filter((persona) => {
        if (valorFiltro === "todos") {
            return true;
        } else if (valorFiltro === "ciudadano") {
            return persona instanceof Ciudadano;
        } else if (valorFiltro === "extranjero") {
            return persona instanceof Extranjero;
        }
    });

    cargarTabla(listaPersonasObjFiltrada);
}

function calcularPromedioEdad() {
    let edadPromedio = 0;
    let sumaEdades = 0;
    if (listaPersonasObjFiltrada.length == 0) {
        filtrarTipo();
    }
    let fechasNacimiento = listaPersonasObj.map(persona => persona.fechaNacimiento.toString());
    fechasNacimiento.forEach((fecha) => {
        let fechaAño = fecha.substring(0, 4);
        let añoActual = new Date().getFullYear();
        let edadPersona = añoActual - fechaAño;

        sumaEdades += edadPersona;
        edadPromedio = sumaEdades / fechasNacimiento.length;
    });

    document.getElementById("EdadPromedio").value = edadPromedio;
}

function agregarPersona() {
    if (validarDatosIngresados()) {
        let persona;
        let id = ObtenerId();
        let nombre = document.getElementById("nombreNew").value;
        let apellido = document.getElementById("apellidoNew").value;
        let fechaNacimiento = document.getElementById("fechaNacimientoNew").value;
        let tipoNew = document.getElementById("tipoNew").value;
        let dni = document.getElementById("dniNew").value;
        let paisOrigen = document.getElementById("paisNew").value;

        if (tipoNew === "ciudadano") {
            persona = new Ciudadano(id, nombre, apellido, fechaNacimiento, dni);
        }
        else if (tipoNew === "extranjero") {
            persona = new Extranjero(id, nombre, apellido, fechaNacimiento, paisOrigen);
        }

        listaPersonasObj.push(persona);
        cargarTabla(listaPersonasObj);
        limpiarFormABM();
        retornarFormDatos();
        alert("Se agrego correctamente");
    }
    else {
        alert("No ingreso los campos correspondientes");
    }
}

function validarDatosIngresados() {
    let datosValidos = false;
    let nombre = document.getElementById("nombreNew").value;
    let apellido = document.getElementById("apellidoNew").value;
    let fechaNacimiento = document.getElementById("fechaNacimientoNew").value;
    let tipoNew = document.getElementById("tipoNew").value;
    let dni = document.getElementById("dniNew").value;
    let paisOrigen = document.getElementById("paisNew").value;

    if (esValido(nombre) && esValido(apellido) && esValido(fechaNacimiento) && esValido(tipoNew)) {
        if (tipoNew === "ciudadano") {
            datosValidos = esValido(dni);
        }
        else if (tipoNew === "extranjero") {
            datosValidos = esValido(paisOrigen);
        }
    }
    return datosValidos;
}

function esValido(valor) {
    return valor !== null && valor.trim() !== "";
}

function ObtenerId() {
    let id = 1;
    while (listaPersonasObj.some(persona => persona.id === id)) {
        id++;
    }
    return id;
}

function limpiarFormABM() {
    document.getElementById("idPersona").value = "";
    document.getElementById("nombreNew").value = "";
    document.getElementById("apellidoNew").value = "";
    document.getElementById("fechaNacimientoNew").value = "";
    document.getElementById("tipoNew").value = "";
    document.getElementById("dniNew").value = "";
    document.getElementById("paisNew").value = "";
}

function retornarFormDatos() {
    limpiarFormABM();
    document.getElementById("FormABM").style.display = "none";
    document.getElementById("FormDatos").style.display = "block";
}
function mostrarFormularioABM(edicion) {
    document.getElementById("FormABM").style.display = "block";
    document.getElementById("FormDatos").style.display = "none";
    if (edicion) {
        document.getElementById("botonModificar").style.display = "inline";
        document.getElementById("botonEliminar").style.display = "inline";
        document.getElementById("botonCrear").style.display = "none";
    }
    else {
        document.getElementById("botonModificar").style.display = "none";
        document.getElementById("botonEliminar").style.display = "none";
        document.getElementById("botonCrear").style.display = "inline";
        document.getElementById("tipoNew").disabled = false;
        document.getElementById("paisNew").disabled = false;
        document.getElementById("dniNew").disabled = false;
    }

}

function editarPersona(id) {
    mostrarFormularioABM(true);
    let persona;
    if (id > 0) {
        persona = listaPersonasObj.find(persona => persona.id === id);
        cargarFormABM(persona);
    }
}
function cargarFormABM(persona) {
    document.getElementById("idPersona").value = persona.id;
    document.getElementById("nombreNew").value = persona.nombre;
    document.getElementById("apellidoNew").value = persona.apellido;
    document.getElementById("fechaNacimientoNew").value = persona.fechaNacimiento;
    if (persona instanceof Ciudadano) {
        document.getElementById("tipoNew").value = "ciudadano";
        document.getElementById("dniNew").value = persona.dni;
        document.getElementById("tipoNew").disabled = true;
        document.getElementById("paisNew").disabled = true;
        document.getElementById("dniNew").disabled = false;
    }
    else {
        document.getElementById("tipoNew").value = "extranjero";
        document.getElementById("paisNew").value = persona.paisOrigen;
        document.getElementById("tipoNew").disabled = true;
        document.getElementById("dniNew").disabled = true;
        document.getElementById("paisNew").disabled = false;
    }
}
function modificarPersona() {
    let idPersona = document.getElementById("idPersona").value;
    let personaMoficar;
    if (validarDatosIngresados()) {
        let nombre = document.getElementById("nombreNew").value;
        let apellido = document.getElementById("apellidoNew").value;
        let fechaNacimiento = document.getElementById("fechaNacimientoNew").value;
        let dni = document.getElementById("dniNew").value;
        let paisOrigen = document.getElementById("paisNew").value;

        personaModificar = listaPersonasObj.find((persona) => persona.id == idPersona);

        if (personaModificar != null) {
            personaModificar.nombre = nombre;
            personaModificar.apellido = apellido;
            personaModificar.fechaNacimiento = fechaNacimiento;
            personaModificar.dni = dni;
            personaModificar.paisOrigen = paisOrigen;
            alert("Se modifico el ID:" + idPersona);
            cargarTabla(listaPersonasObj);
            retornarFormDatos();
        }
        else {
            alert("No se encontro el ID")
        }
    }
    else {
        alert("No ingreso los campos correspondientes");
    }
}
function eliminarPersona() {
    let idPersona = document.getElementById("idPersona").value;
    respuesta = confirm("Desea eliminar?");
    if (idPersona > 0 && respuesta) {
        listaPersonasObj = listaPersonasObj.filter(persona => persona.id != idPersona);
        alert("Se elimino el ID:" + idPersona);
        cargarTabla(listaPersonasObj);
        retornarFormDatos();
    }
    else
    {
        retornarFormDatos();
    }
}