let pokemonRepository = (function () {

    let pokemonList = []
  
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
    let modalContainer = document.querySelector('#modal-container');
  
  
    // This adds pokemon to the PokemonList if they are valid
    function add(pokemon) {
      if (
        typeof pokemon === "object" &&
        "name" in pokemon
      ) {
        pokemonList.push(pokemon);
      } else {
        console.log("pokemon is not correct");
      }
    }
  
    // Gets value of array
    function getAll() {
      return pokemonList;
    }
  
    function showModal(title, text, pokemonImage) {
      //clear existing modal content
      modalContainer.innerHTML = '';
  
      //create modal
      let modal = document.createElement('div');
      modal.classList.add('modal');
  
      //add new content to modal
      let closeButtonElement = document.createElement('button');
      closeButtonElement.classList.add('modal-close');
      closeButtonElement.innerText = 'Close';
      closeButtonElement.addEventListener('click', hideModal);
  
      //Modal content
      let titleElement = document.createElement('h1');
      titleElement.innerText = title;
  
      let contentElement = document.createElement('p');
      contentElement.innerText = text;
  
      let imageElement = document.createElement('img');
      imageElement.src = pokemonImage;
  
      modal.appendChild(closeButtonElement);
      modal.appendChild(titleElement);
      modal.appendChild(imageElement);
      modal.appendChild(contentElement);
  
      modalContainer.appendChild(modal);
  
      modalContainer.classList.add('is-visible');
    }
  
    function hideModal() {
      modalContainer.classList.remove('is-visible');
    }
  
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' &&
        modalContainer.classList.contains('is-visible')) {
        hideModal();
      }
    });
  
    modalContainer.addEventListener('click', (e) => {
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });
  
    
  
    function loadList() {
      return fetch(apiUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Network response not OK');
          }
          return response.json();
        })
        .then(function (json) {
          console.log('API Response', json);
          return Promise.all(json.results.map(function (item) {
            return loadDetails(item.url);
            
            
           
          }));
        })
        .then(function () {
          console.log('All details loaded successfully');
          pokemonRepository.getAll().forEach(function (pokemon) {
            if (pokemon) {
            addListItem(pokemon);
            }
          });
        })
        .catch(function (error) {
          console.error('Error fetching data:', error);
        })
    }
  
    function addListItem(pokemon) {
      let pokemonListContainer = document.querySelector('.pokemon-list');
      let listItem = document.createElement("li");
      let button = document.createElement("button");
      button.innerText = pokemon.name;
      button.classList.add("button-class");
      listItem.appendChild(button);
      pokemonListContainer.appendChild(listItem);
      button.addEventListener('click', function () {
        if (pokemon.detailsUrl) {
        showDetails(pokemon);
        } else {
          console.error('Details URL not found for', pokemon.name);
        }
      })
    }
  
    function loadDetails(url) {
      return fetch(url)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Network response not OK');
          }
          return response.json();
        })
        .then(function (details) {
          console.log('Pokemon Details', details);
          if(!details.sprites || !details.sprites.front_default) {
            console.error('Sprites not found', details.name);
            return null;
          }
          // Now we add the details to the item
          
          let pokemon = {
            name: details.name,
            detailsUrl: url,
            imageUrl: details.sprites.front_default,
            height: details.height,
            types: details.types
          };
          add(pokemon);
        })
        .catch(function (error) {
          console.error('Error fetching details', error);
        });
    }
  
    function showDetails(pokemon) {
      if (isValidImageUrl(pokemon.imageUrl)) {
        console.log('Valid image URL', pokemon.imageUrl);
      }
        showModal(pokemon.name, `Height: ${pokemon.height}`, pokemon.imageUrl);
      } 
      
    
    function isValidImageUrl(url) {
      const imageExtensions = /\.(jpg|jpeg|png|gif|mbp|svg)$/i;
      return imageExtensions.test(url);
    }
  
    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showDetails: showDetails
    }
  
  }
  )();
  
  
  pokemonRepository.loadList().then(function () {
    // Now the data is loaded!
    pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });