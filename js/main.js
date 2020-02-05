(function(){
    'use strict';
    document.addEventListener('DOMContentLoaded', function(){
			

    	//getPaiments();
    	//getRegistries();
    	getClients();
    	getConcepts();

    	function getPaiments(){

				var xhr = new XMLHttpRequest();
				
    		xhr.open('GET', 'http://deltagym.azurewebsites.net/Gimnasio/servicios/ObtenerPagos', true);
    		xhr.onload = function(){
    			if(this.status === 200){
						const result = JSON.parse(this.responseText);
						//result.sort();
						//console.log('Result: '+result);
						let arrayPaiments = [];
						for(let i = 0; i < result.length; i++){
							arrayPaiments[i] = [];
							for(let j = 0; j < result.length; j++){
								var date = moment(result[i].Fecha).format('YYYY-MM-DD');     
									arrayPaiments[i].push(result[i].Id);
									arrayPaiments[i].push(result[i].Id_Clientes);
									arrayPaiments[i].push(result[i].Id_Conceptos);
									arrayPaiments[i].push(result[i].CantidadPagada);
									arrayPaiments[i].push(date);
							}
						}
							arrayPaiments.sort(sortFunction);
							function sortFunction(a, b) {
							if (a[4] === b[4]) {
									return 0;
							}
							else {
									return (a[4] < b[4]) ? -1 : 1;
							}
					}
    				for(let i = 0; i < result.length; i++){                               //var date = moment(result[i].Fecha).format('YYYY-MM-DD HH::mm::ss');

						$('#get_paiments tbody').append('<tr><td>'+arrayPaiments[i][0]+'</td>'
														+'<td>'+arrayPaiments[i][1]+'</td>'
														+'<td>'+arrayPaiments[i][2]+'</td>'
														+'<td>'+arrayPaiments[i][3]+'</td>'
														
														+'<td>'+arrayPaiments[i][4]+'</td></tr>');
    				}
    				//$('#get_paiments').html(this.responseText);
						//console.log('Hola 2: '+result);
						
    			}
    		
    		}
    		xhr.send();
    		
        }

        function getRegistries(clientMethod){

					//var clientInfo = JSON.parse(clientMethod);

        var xhr = new XMLHttpRequest();
    		xhr.open('GET', 'http://deltagym.azurewebsites.net/Gimnasio/servicios/ObtenerRegistros', true);
    		xhr.onload = function(){
    			if(this.status === 200){
						const result = JSON.parse(this.responseText);
						let array = [];
						let arrayInfoClientsNDates = [];
						//let arrayCounter = 0;
						let arrayClientPerDay = []; 
						for(let i = 0; i < clientMethod.length; i++){
							array[i] = [];
							arrayInfoClientsNDates[i] = [];
							var dataClientCounter = 0; 
							for(let j = 0; j < result.length; j++){
								var dateIngreso = moment(result[j].Ingreso).format('YYYY-MM-DD');
								
								//var dateSalida = moment(result[j].Salida).format('YYYY-MM-DD HH::mm::ss');
								if(clientMethod[i].Id == result[j].Id_Clientes && dataClientCounter == 0){
									array[i].push(clientMethod[i].Id);
									array[i].push(clientMethod[i].Nombre);
									array[i].push(clientMethod[i].ApPaterno);
									array[i].push(clientMethod[i].ApMaterno);
									array[i].push(dateIngreso);
									arrayClientPerDay.push(dateIngreso);
									var dataClientCounter = 1; 
								}else if(clientMethod[i].Id == result[j].Id_Clientes && dataClientCounter == 1){
									array[i].push(dateIngreso);
									arrayClientPerDay.push(dateIngreso);
								}
							}
						}
						let arrayClientDatesCounter = [];
						for(let i = 0; i < array.length; i++){
							  arrayClientDatesCounter[i] = [];
								var clientID = array[i][0];
								var clientName = array[i][1] + ' ' + array[i][2] + ' ' + array[i][3];
								var datesCounter = 0;
									var showTable = '<tr><td>'+array[i][0]+'</td>'
								+'<td>'+array[i][1]+'</td>'
								+'<td>'+array[i][2]+'</td>'
								+'<td>'+array[i][3]+'</td><td>';

								var arrayDates = array[i].slice(4);
								arrayDates.sort();
								for(var j = 0; j < arrayDates.length; j++){
								showTable += arrayDates[j] + ' <br>';	
								
								datesCounter++;
									//console.log(array[i][j]);
								}
								arrayClientDatesCounter[i].push(clientID);
								arrayClientDatesCounter[i].push(clientName);
								arrayClientDatesCounter[i].push(datesCounter);
								showTable += '</td></tr>';
								$('#show_all_clients_hours').append(showTable);
								//console.log(showTable);
						}
						arrayClientDatesCounter.sort(sortFunction);
						function sortFunction(a, b) {
							if (a[2] === b[2]) {
									return 0;
							}
							else {
									return (a[2] < b[2]) ? 1 : -1;
							}
					}
						for(var i = 0; i <10; i++){

								let showTableCounterDates = '';
								showTableCounterDates += '<tr><td>'+ arrayClientDatesCounter[i][0] + '</td><td>' + arrayClientDatesCounter[i][1] + '</td><td>' + arrayClientDatesCounter[i][2] + '</td></tr>';
								$('#show_all_number_clients_visits').append(showTableCounterDates);
							
						}
						//#3 Acomodar fechas por numero de clientes
						getClientsPerDate(arrayClientPerDay);
						getSuscriptionsPerDate(array, arrayClientPerDay);
    			}
    		
    		}
    		xhr.send();
				}

				
				
				function getClientsPerDate(arrayClientPerDay){

					arrayClientPerDay.sort();
					let arrayFilteredClientsPerDay = [...new Set(arrayClientPerDay)];
					let showTablePeoplePerDay = '';
					//console.log('3er Elemento' + arrayFilteredClientsPerDay[0] +' '+ arrayFilteredClientsPerDay[1] +' '+ arrayFilteredClientsPerDay[2] +' '+ arrayFilteredClientsPerDay[3] +' ');
					for(var i = 0; i < arrayFilteredClientsPerDay.length; i++){
						let daysCounter = 0;
						for(var j = 0; j < arrayClientPerDay.length; j++){
							//console.log('Entro: ' + arrayClientPerDay[j]);
							if(arrayFilteredClientsPerDay[i] == arrayClientPerDay[j]){
								daysCounter++;
								//console.log('Entro: ' + arrayClientPerDay[j]);
							}
						}
						showTablePeoplePerDay += '<tr><td>'+arrayFilteredClientsPerDay[i]+'</td><td>'+daysCounter+'</td></tr>';
					}
					//console.log(showTablePeoplePerDay);
					$('#show_number_clients_per_date').append(showTablePeoplePerDay);
				}


				function getSuscriptionsPerDate(arrayClientDatesCounter ,arrayClientsDates){
					arrayClientsDates.sort();
					let arrayFilteredDatesPerDay = [...new Set(arrayClientsDates)];
					let showTablePeoplePerDay = '';
					for(var h = 0; h < arrayFilteredDatesPerDay.length; h++){
					var peopleOnDate = '';
					for(var i = 0; i < arrayClientDatesCounter.length; i++){
						var arrayDates = arrayClientDatesCounter[i].slice(4)
						arrayDates.sort();
						for(var j = 0; j < arrayDates.length; j++){
							if(arrayDates[j] == arrayFilteredDatesPerDay[h]){
								peopleOnDate += arrayClientDatesCounter[i][0] + ' - ' + arrayClientDatesCounter[i][1] + ' ' + arrayClientDatesCounter[i][2] + ' ' + arrayClientDatesCounter[i][3] + '<br>';
							}
						}
					}
					showTablePeoplePerDay += '<tr><td>'+arrayFilteredDatesPerDay[h]+'</td><td>'+peopleOnDate+'</td></tr>';
				}
				$('#show_kind_suscription_per_date').append(showTablePeoplePerDay);
				getSuscriptionsRegistries();
				}

				function getSuscriptionsRegistries(){

				let arrayPaiments = [];

				var xhr = new XMLHttpRequest();
				
    		xhr.open('GET', 'http://deltagym.azurewebsites.net/Gimnasio/servicios/ObtenerPagos', true);
    		xhr.onload = function(){
    			 if(this.status === 200){
						
						const result = JSON.parse(this.responseText);
						//result.sort();
						//console.log('Result: '+result);
						
						for(let i = 0; i < result.length; i++){
							arrayPaiments[i] = [];
							for(let j = 0; j < result.length; j++){
								var date = moment(result[i].Fecha).format('YYYY-MM-DD');     
									arrayPaiments[i].push(result[i].Id);
									arrayPaiments[i].push(result[i].Id_Clientes);
									arrayPaiments[i].push(result[i].Id_Conceptos);
									arrayPaiments[i].push(result[i].CantidadPagada);
									arrayPaiments[i].push(date);
							}
						}
							arrayPaiments.sort(sortFunction);
							function sortFunction(a, b) {
							if (a[4] === b[4]) {
									return 0;
							}
							else {
									return (a[4] < b[4]) ? -1 : 1;
							}
					}
    				for(let i = 0; i < arrayPaiments.length; i++){                               //var date = moment(result[i].Fecha).format('YYYY-MM-DD HH::mm::ss');

						$('#get_paiments tbody').append('<tr><td>'+arrayPaiments[i][0]+'</td>'
														+'<td>'+arrayPaiments[i][1]+'</td>'
														+'<td>'+arrayPaiments[i][2]+'</td>'
														+'<td>'+arrayPaiments[i][3]+'</td>'
														
														+'<td>'+arrayPaiments[i][4]+'</td></tr>');
    				}
    				//$('#get_paiments').html(this.responseText);
						//console.log('Hola 2: '+result);
					//	$('#get_paiments tbody').append('<tr><td>'+this.responseText+'</td>');
					}
					
    		
    		}
    		xhr.send();

				}

        function getClients(){

    		var xhr = new XMLHttpRequest();
    		xhr.open('GET', 'http://deltagym.azurewebsites.net/Gimnasio/servicios/ObtenerClientes', true);
    		xhr.onload = function(){
    			if(this.status === 200){
						var result = JSON.parse(this.responseText);
    				//$('#get_clients tbody').html(result);
    				//console.log('Hola 2: '+result);
    			/*	for(let i = 0; i < result.length; i++){
							var date = moment(result[i].FechaCorte).format('DD-MM-YYYY HH::mm::ss');
						$('#get_clients tbody').append('<tr><td>'+result[i].Id+'</td>'
														+'<td>'+result[i].Nombre+'</td>'
														+'<td>'+result[i].ApPaterno+'</td>'
														+'<td>'+result[i].ApMaterno+'</td>'
														+'<td>'+result[i].Telefono+'</td>'
														+'<td>'+result[i].Celular+'</td>'
														+'<td>'+result[i].Localidad+'</td>'
														+'<td>'+result[i].Domicilio+'</td>'
														+'<td>'+result[i].FechaImgreso+'</td>'
														+'<td>'+date+'</td>'
														+'<td>'+result[i].Membresia+'</td>'
														+'<td>'+result[i].Estatus+'</td>'
														+'<td>'+result[i].Notas+'</td></tr>');
						}*/
						getRegistries(JSON.parse(this.responseText));
    			}
    		
    		}
    		xhr.send();

				}
				
				

        function getConcepts(){


	    	var xhr = new XMLHttpRequest();
    		xhr.open('GET', 'http://deltagym.azurewebsites.net/Gimnasio/servicios/ObtenerConceptos', true);
    		xhr.onload = function(){
    			if(this.status === 200){
    				const result = JSON.parse(this.responseText);
    				//$('#get_concepts').html(result);

    				for(let i = 0; i < result.length; i++){
						$('#get_concepts tbody').append('<tr><td>'+result[i].Id+'</td>'
														+'<td>'+result[i].Concepto+'</td>'
														+'<td>'+result[i].Costo+'</td>'
														+'<td>'+result[i].Descripcion+'</td>'
														+'<td>'+result[i].Estatus+'</td>'
														+'<td>'+result[i].Periodo+'</td></tr>');
    				}
    				//console.log('Hola 2: '+result);
    			}
    		
    		}
    		xhr.send();
	    	}

});
})();