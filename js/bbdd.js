// Querys y variables globales
var tabla = "CREATE TABLE IF NOT EXISTS contactos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, correo TEXT)"; 
var todos = "SELECT * FROM contactos";
var ins = "INSERT INTO contactos (nombre, correo) VALUES (?, ?)";
var upd = "UPDATE contactos SET nombre = ?, correo = ? WHERE id = ?";
var del = "DELETE FROM contactos WHERE id = ?";
var drop = "DROP TABLE contactos";
var db = openDatabase("ContactosDB", "1.0", "ContactosDB", 200000);  // Open SQLite
var dataset;
var DataType; 
// Funciones
function iniciarDB() {
	try {
		if (!window.openDatabase) {
			alert('Este navegador no soporta bases de datos.');
		} else {
			crearTabla();
		}
	} catch(e) {
		if (e === 2) {
			 console.log('Error con la versión de la base de datos.');
		} else {
			console.log("Error: " + e + ".");
		}
		return;
	}
	
}

function crearTabla() {
	db.transaction(function(tx) { 
		tx.executeSql(tabla, [], cargarContactos, onError); 
		// Datos de prueba
		tx.executeSql('INSERT INTO contactos(nombre, correo) VALUES ("Antonio Martinez", "antonio@gmail.com")');
		tx.executeSql('INSERT INTO contactos(nombre, correo) VALUES ("Jessica Salguero", "jessica@outlook.es")');
	});
}

function insertarContacto() {
	var nombretemp = $('input:text[id=username]').val();
    var correotemp = $('input:text[id=useremail]').val();
	
   	db.transaction(function(tx) { 
		tx.executeSql(ins, [nombretemp, correotemp], recargar, onError); 
	}); 
	window.location.href = '#inicio';
}

function borrarContacto(id) {
	//var id_contacto = id.toString();
    db.transaction(function(tx) { 
		tx.executeSql(del, [id], cargarContactos, onError); 
		alert('El contacto se borro correctamente'); 
	});
 
    resetForm();
}

function modificarContacto(id) {
	var nombreupd = $('input:text[id=username]').val().toString();
    var correoupd = $('input:text[id=useremail]').val().toString();
    var idupd = $("#id").val();
	
 	db.transaction(function(tx) { 
		tx.executeSql(upd, [nombreupd, correoupd, Number(idupd)], recargar, onError); 
	});
}

function borrarTabla() {
	db.transaction(function(tx) { 
		tx.executeSql(drop, [], cargarContactos, onError); 
	});
 
    resetearFormulario();
    iniciarDB();
}

function obtenerContacto(id) {
	var item = dataset.item(i);
 
    $("#username").val((item['nombre']).toString());
    $("#useremail").val((item['correo']).toString());
    $("#id").val((item['id']).toString());
}

function resetearFormulario() {
	$("#username").val("");
    $("#useremail").val("");
    $("#id").val("");
}

function recargar() {
	resetearFormulario();
    cargarContactos();
}

function cargarContactos() {
    $("#contactos").html('');
    db.transaction(function(tx) {
        tx.executeSql(todos, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
				var linkeditdelete = '<li>' + item['nombre'] + ' , ' + item['correo'] + '</li>';
				/*
                var linkeditdelete = '<li>' + item['nombre'] + ' , ' + item['correo'] + 
				'    ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' +
 				'<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>'; 
				*/
            }
			$("#contactos").append('<ul data-role="listview">' + linkeditdelete + 
				'</ul><a href="#ingreso">Añadir nuevo</a>');
        });
    });
}

function onError(tx, error) { alert(error.message); }

$(document).ready(function() {
	//$("body").fadeIn(2000); // Fede In Effect when Page Load..
    iniciarDB();
 	$("#btnGuardar").click(insertarContacto);  // Register Event Listener when button click.
 	$("#btnActualizar").click(modificarContacto);
 	$("#btnRecargar").click(resetearFormulario);
 	$("#btnBorrar").click(borrarTabla);
});