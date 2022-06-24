const buttonBuscar = document.getElementById('buscar');
const inputContenido = document.getElementById('personaje');
const resultadoContenedor = document.getElementById('main');
const divPersPrincipales = document.getElementById('principales');
const divFavs= document.getElementById('sectionfavoritos');

API_MORTY= "https://rickandmortyapi.com/graphql";

const queryBusquedaPorIds = (listaAbuscar) => `query {
    charactersByIds(ids:"${listaAbuscar}"){
    id
      name
      species
      gender
      origin {
        name
      }
      image
      episode{
          episode
          name
      }
  }
}
`

const queryPersonaje = (personaje) => `query {
    characters( filter: { name: "${personaje}" }) {
      results {
        id
        name
        species
        gender
        origin{
          name
        }
        image
        episode{
            episode
            name
        }
      } 
    } 
  }`

  function configOptions(queryName, valorABuscar){
    const options = {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: queryName(valorABuscar)
        })
    }
    return options;
  }

    function pararSpinner() {
        const spinner = document.getElementById('spinner');
        spinner.setAttribute('style', 'display : none ;');
    }

    function empezarSpinner(){
        const spinner = document.getElementById('spinner');
        spinner.setAttribute('style', 'display : block ;');
    }

  function searchPersPrincipales (){

    let listaPersFavoritos=[1,2,3,4,5]

    optionsRecibido=configOptions(queryBusquedaPorIds, listaPersFavoritos);

    empezarSpinner();
    fetch(API_MORTY, optionsRecibido)
     .then(function (response){
         console.log('response cruda', response);
         return response.json();
     }).then(function(json){
        let data =json.data.charactersByIds;
        localStorage.principales = JSON.stringify(data);
         mostrarPersPrincipales();
         console.log(json);
     }).finally(function(){
        pararSpinner();
     })
     .catch(function (err){
         console.log('Algo fallo', err);
     })

  }


  buttonBuscar.addEventListener('click', (e)=>{

    e.preventDefault();
    
     const inputValue = inputContenido.value;
     optionsRecibido=configOptions(queryPersonaje, inputValue);

     empezarSpinner();
     fetch(API_MORTY, optionsRecibido)
     .then(function (response){
         console.log('response cruda', response);
         return response.json();
     }).then(function(json){
         mostrarResultadoPers(json);
         
     }).finally(function(){
        pararSpinner();
     })
     .catch(function (err){
         console.log('Algo fallo', err);
     })
});

function mostrarResultadoPers(dataPersonajes){

    if(dataPersonajes.data.characters.results.length==0){
        resultadoContenedor.innerHTML='<p>No encontramos a tu personaje, vuelve a intentar con otro nombre.</p>';
        return;
    }

    resultado=dataPersonajes.data.characters.results[0];
    let temporadas= organizarEpisodios(resultado);
      
        resultadoContenedor.innerHTML =`
        <div class="card my-5" style="max-width: 450px; margin: auto;">
                <div class="row g-0">
                    <div class="col-md-4 foto">
                        <img src="${resultado.image}" class="img-fluid rounded-start d-block" alt="${resultado.name}" style="margin: auto;"/>
                        <h2 class="text-center mt-1">${resultado.name}</h2>
                    </div>
                    <div class="col-md-8">
                    <div class="card-body">
                        <p>Especie: ${resultado.species}</p>
                        <p>Sexo: ${resultado.gender}</p>
                        <p>Origen del personaje: ${resultado.origin.name}</p>
                        <p>Episodios en el que aparece:</p>
                        <div id="BusquedaTemporadasId${resultado.id}" class="d-flex flex-wrap"></div>
                        <div id="BusquedaCapitulosId${resultado.id}"></div>
                        <button onclick="agregarFav('${resultado.id}')" type="button" class="buttonAction">Agregar a Favoritos</button>
                        <button onclick="eliminarFav('${resultado.id}')" type="button" class="buttonAction">Eliminar de Favoritos</button>
                    </div>
                    </div>
                </div>
            </div>

        `;
        
    const divBusquedaTemporadas = document.getElementById(`BusquedaTemporadasId${resultado.id}`);
    const divBusquedaCapitulos = document.getElementById(`BusquedaCapitulosId${resultado.id}`);

    for (let i=0; i<temporadas.length; i++){

        divBusquedaTemporadas.innerHTML+=`
              <p>
                  <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#tempbusq${resultado.id}${temporadas[i].nombre}" aria-expanded="false" aria-controls="collapseExample">
                  ${temporadas[i].nombre}
                  </button>
              </p>`;
        divBusquedaCapitulos.innerHTML+=`
            <div class="collapse" id="tempbusq${resultado.id}${temporadas[i].nombre}">
                <div class="card card-body">
                    <ul id="episodiosbusqId${resultado.id}${temporadas[i].nombre}"></ul>
                </div>
            </div>
         `;
        
       
        const ulBusquedaEpisodios = document.getElementById(`episodiosbusqId${resultado.id}${temporadas[i].nombre}`);

        for(let y=0; y<temporadas[i].episodios.length; y++){
            ulBusquedaEpisodios.innerHTML+=`
            <li>${temporadas[i].episodios[y].codEpisodio}: ${temporadas[i].episodios[y].nombre}</li>
            `;
        }
    }  
    
}

function organizarEpisodios(arrayEpisodio){

    let season=null;
    let temporadas=[];
    let episodios=[];

    for (let y=0; y <arrayEpisodio.episode.length; y++){
        
        if (season==null){
            season=arrayEpisodio.episode[y].episode.slice(0,3);
            let episodio={"nombre":arrayEpisodio.episode[y].name, "codEpisodio": arrayEpisodio.episode[y].episode.slice(3,6)};
            episodios.push(episodio);
        }else if (arrayEpisodio.episode[y].episode.startsWith(season)){
        let episodio={"nombre":arrayEpisodio.episode[y].name, "codEpisodio": arrayEpisodio.episode[y].episode.slice(3,6)};
            episodios.push(episodio);
            if(arrayEpisodio.episode.length-1 == y){
            temporadas.push({ 
                'nombre': season,
                'episodios': episodios});                      
            episodios=[];
            }
        }else{
        temporadas.push({ 
            'nombre': season,
            'episodios': episodios});
        episodios=[];
        season=arrayEpisodio.episode[y].episode.slice(0,3);
        let episodio={"nombre":arrayEpisodio.episode[y].name, "codEpisodio": arrayEpisodio.episode[y].episode.slice(3,6)};
        episodios.push(episodio);
        }

    }

    return temporadas;

}


function mostrarPersPrincipales(){

    let arrayPersPrincipales = JSON.parse(localStorage.principales);
     let temporadas;
     
     for(let i=0; i<arrayPersPrincipales.length; i++){
        
        temporadas= organizarEpisodios(arrayPersPrincipales[i]);
        

          divPersPrincipales.innerHTML+=`
            <div class="card mb-3" style="max-width: 450px;">
                <div class="row g-0">
                    <div class="col-md-4 foto">
                        <img src="${arrayPersPrincipales[i].image}" class="img-fluid rounded-start d-block margin-auto" alt="${arrayPersPrincipales[i].name}" style="margin: auto;"/>
                        <h2 class="text-center mt-1">${arrayPersPrincipales[i].name}</h2>
                    </div>
                    <div class="col-md-8">
                    <div class="card-body">
                        <p>Especie: ${arrayPersPrincipales[i].species}</p>
                        <p>Sexo: ${arrayPersPrincipales[i].gender}</p>
                        <p>Origen del personaje: ${arrayPersPrincipales[i].origin.name}</p>
                        <p>Episodios en el que aparece:</p>
                        <div id="temporadasId${arrayPersPrincipales[i].id}" class="d-flex flex-column flex-md-row flex-wrap"></div>
                        <div id="capitulosId${arrayPersPrincipales[i].id}"></div>
                        <button onclick="agregarFav('${arrayPersPrincipales[i].id}')" type="button" class="buttonAction">Agregar a Favoritos</button>
                        <button onclick="eliminarFav('${arrayPersPrincipales[i].id}')" type="button" class="buttonAction">Eliminar de Favoritos</button>
                    </div>
                    </div>
                </div>
            </div>
          `;

          const divTemporadas = document.getElementById(`temporadasId${arrayPersPrincipales[i].id}`);
          const divCapitulos = document.getElementById(`capitulosId${arrayPersPrincipales[i].id}`);
          for (let a=0; a<temporadas.length; a++){
              //debugger;
                divTemporadas.innerHTML+=`
                    <p>
                        <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#temp${arrayPersPrincipales[i].id}${temporadas[a].nombre}" aria-expanded="false" aria-controls="collapseExample">
                            ${temporadas[a].nombre}
                        </button>
                    </p>`;
                divCapitulos.innerHTML+=`
                    <div class="collapse" id="temp${arrayPersPrincipales[i].id}${temporadas[a].nombre}">
                        <div class="card card-body">
                            <ul id="episodiosId${arrayPersPrincipales[i].id}${temporadas[a].nombre}"></ul>
                        </div>
                    </div>
                `;

                const ulEpisodios = document.getElementById(`episodiosId${arrayPersPrincipales[i].id}${temporadas[a].nombre}`);
                for (let b=0; b<temporadas[a].episodios.length; b++){
                    ulEpisodios.innerHTML+=`
                        <li>${temporadas[a].episodios[b].codEpisodio}: ${temporadas[a].episodios[b].nombre}</li>
                    `;
                }

          }

          
     }
}

searchPersPrincipales();

let favs=[];

if(localStorage.favoritos){
    favs = JSON.parse(localStorage.favoritos);
}else{
    localStorage.favoritos = JSON.stringify(favs);
}

function agregarFav(personajeid){

    let indexPersonaje = favs.indexOf(personajeid);

    if(indexPersonaje!==-1){
        alert('Este personaje ya se encuentra en tu lista de favoritos.', 'warning');
        return;
    }
    
    favs.push(personajeid);
    alert('Se ha agregado a tu lista de favoritos con éxito.', 'success');

    localStorage.favoritos = JSON.stringify(favs);
    console.log(favs);
}

function eliminarFav(elemento){
    let indexPersonaje = favs.indexOf(elemento);

    if(indexPersonaje==-1){
        alert('Este personaje no se encuentra en tu lista de favoritos.', 'warning');
        return;
    }

    let removidos = favs.filter(valor => valor !== elemento ? true : false);
    favs=removidos;
    localStorage.favoritos = JSON.stringify(favs);
    alert('Se ha eliminado de tus favoritos con éxito.', 'danger')
}

var alertPlaceholder = document.getElementById('liveAlertPlaceholder')
function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

    alertPlaceholder.append(wrapper)
}

window.addEventListener('offline', event => {
    console.log('Se ha perdido la conexión con Internet.');
    alert('No hay conexión con Internet. El sitio está trabajando de forma Offline.', 'danger')
})

window.addEventListener('online', event => {
    console.log('Se ha recuperado la conexión con Internet');
    alert('Se ha recuperado la conexión con Internet. El sitio está trabajando de forma Online.', 'success')
})

if (!navigator.onLine){
    console.log('Se ha perdido la conexión con Internet.');
}