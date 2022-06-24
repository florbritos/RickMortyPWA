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

let favs=[];

if(localStorage.favoritos){
    favs = JSON.parse(localStorage.favoritos);
}else{
    localStorage.favoritos = JSON.stringify(favs);
}

function buscarFavs(){

    if(favs.length==0){
        
        divFavs.innerHTML='<p class="text-center fw-bold my-3">No tienes ningún favorito.</p>';
        pararSpinner();
        return;
    }

    optionsRecibido=configOptions(queryBusquedaPorIds, favs);
    empezarSpinner();
    fetch(API_MORTY, optionsRecibido)
        .then(function (response){
            console.log('response cruda', response);
            return response.json();
        }).then(function(json){
        mostrarfavs(json);
            console.log(json);
        }).finally(function(){
            pararSpinner();
        })
        .catch(function (err){
            console.log('Algo fallo', err);
        })

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

function mostrarfavs(jsonFavs){

    let arrayFavs = jsonFavs.data.charactersByIds;
    let temporadas;
    
    for(let i=0; i<arrayFavs.length; i++){
       
       temporadas= organizarEpisodios(arrayFavs[i]);
       console.log(arrayFavs[i]);

       divFavs.innerHTML+=`
           <div class="card mb-3" style="max-width: 450px;" id="favorito${arrayFavs[i].id}">
               <div class="row g-0">
                   <div class="col-md-4 foto">
                       <img src="${arrayFavs[i].image}" class="img-fluid rounded-start d-block" alt="${arrayFavs[i].name}" style="margin:auto;"/>
                       <h2 class="text-center mt-1">${arrayFavs[i].name}</h2>
                   </div>
                   <div class="col-md-8">
                   <div class="card-body">
                       <p>Especie: ${arrayFavs[i].species}</p>
                       <p>Sexo: ${arrayFavs[i].gender}</p>
                       <p>Origen del personaje: ${arrayFavs[i].origin.name}</p>
                       <p>Episodios en el que aparece:</p>
                       <div id="temporadasId${arrayFavs[i].id}" class="d-flex flex-column flex-md-row flex-wrap"></div>
                       <div id="capitulosId${arrayFavs[i].id}"></div>
                       <button onclick="eliminarFav('${arrayFavs[i].id}')" type="button" class="buttonAction">Eliminar de Favoritos</button>
                   </div>
                   </div>
               </div>
           </div>
         `;

         const divTemporadas = document.getElementById(`temporadasId${arrayFavs[i].id}`);
         const divCapitulos = document.getElementById(`capitulosId${arrayFavs[i].id}`);
         for (let a=0; a<temporadas.length; a++){
             //debugger;
               divTemporadas.innerHTML+=`
                   <p>
                       <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#temp${arrayFavs[i].id}${temporadas[a].nombre}" aria-expanded="false" aria-controls="collapseExample">
                           ${temporadas[a].nombre}
                       </button>
                   </p>`;
               divCapitulos.innerHTML+=`
                   <div class="collapse" id="temp${arrayFavs[i].id}${temporadas[a].nombre}">
                       <div class="card card-body">
                           <ul id="episodiosId${arrayFavs[i].id}${temporadas[a].nombre}"></ul>
                       </div>
                   </div>
               `;

               const ulEpisodios = document.getElementById(`episodiosId${arrayFavs[i].id}${temporadas[a].nombre}`);
               for (let b=0; b<temporadas[a].episodios.length; b++){
                   ulEpisodios.innerHTML+=`
                       <li>${temporadas[a].episodios[b].codEpisodio}: ${temporadas[a].episodios[b].nombre}</li>
                   `
               }

         }
    
    }
}

function eliminarFav(elemento){

    let removidos = favs.filter(valor => valor !== elemento ? true : false);
    localStorage.favoritos = JSON.stringify(removidos);
    document.getElementById(`favorito${elemento}`).remove();
    alert('Se ha eliminado de tus favoritos con éxito', 'danger')

    if(removidos.length==0){
        divFavs.innerHTML='<p class="text-center fw-bold my-3">No tienes ningún favorito.</p>';
    }

}

var alertPlaceholder = document.getElementById('liveAlertPlaceholder')
function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
  
    alertPlaceholder.append(wrapper)
}
   
buscarFavs();

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

function pararSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.setAttribute('style', 'display : none ;');
}

function empezarSpinner(){
    const spinner = document.getElementById('spinner');
    spinner.setAttribute('style', 'display : block ;');
}
