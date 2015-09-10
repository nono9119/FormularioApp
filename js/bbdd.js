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
		tx.executeSql(tabla, [], showRecords, onError); 
		// Datos de prueba
		tx.executeSql('INSERT INTO contactos(nombre, correo) VALUES ("Antonio Martinez", "antonio@gmail.com")');
		tx.executeSql('INSERT INTO contactos(nombre, correo) VALUES ("Jessica Salguero", "jessica@outlook.es")');
	});
}

function insertarContacto() {
	var nombretemp = $('input:text[id=username]').val();
    var correotemp = $('input:text[id=useremail]').val();
	
   	db.transaction(function(tx) { 
		tx.executeSql(ins, [usernametemp, useremailtemp], loadAndReset, onError); 
	}); 
}

function borrarContacto(id) {
	//var id_contacto = id.toString();
    db.transaction(function(tx) { 
		tx.executeSql(del, [id], showRecords, onError); 
		alert('El contacto se borro correctamente'); 
	});
 
    resetForm();
}

function modificarContacto(id) {
	var usernameupdate = $('input:text[id=username]').val().toString();
    var useremailupdate = $('input:text[id=useremail]').val().toString();
    var useridupdate = $("#id").val();
	
 	db.transaction(function(tx) { 
		tx.executeSql(upd, [usernameupdate, useremailupdate, Number(useridupdate)], loadAndReset, onError); 
	});
}

function borrarTabla() {
	db.transaction(function(tx) { 
		tx.executeSql(drop, [], showRecords, onError); 
	});
 
    resetearFormulario();
    iniciarDB();
}

function obtenerContacto(id) {
	var item = dataset.item(i);
 
    $("#username").val((item['username']).toString());
    $("#useremail").val((item['useremail']).toString());
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
        tx.executeSql(selectAllStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var linkeditdelete = '<li>' + item['nombre'] + ' , ' + item['correo'] + 
				'    ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' +
 				'<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';
                $("#contactos").append(linkeditdelete);
            }
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