const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


const count = 10; 
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = []; 
let favorites = {};

const createDOMNodes = (page) => {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites); 
    console.log('Current array', page, currentArray);
    currentArray.forEach((result) => {
        // card container 
        const card = document.createElement('div');
        card.classList.add('card');
        // image link 
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image'; 
        link.target = '_blank'; 
        // images 
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture Of The Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // body of card 
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // card titles 
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // save to favorites text 
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add To Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove Favorites';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // card text 
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation; 
        // footer container 
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // date 
        const date = document.createElement('strong');
        date.textContent = result.date;
        // copyright 
        const copyright = document.createElement('span');
        copyright.textContent = result.copyright ? result.copyright : '';
        // appending 
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image); 
        card.append(link, cardBody);
        console.log(card);
        imagesContainer.appendChild(card);
    });
}

const updateDOM = (page) => {
    // get favorites 
    if (localStorage.getItem('nasaFavorites')) { 
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = ''; 
    createDOMNodes(page); 
}

const getNasaPictures = async () => {
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        console.log(resultsArray);
        updateDOM('favorites');
    } catch (error) {
        // error cactch 
    }
}

// add result to favorites 
const saveFavorite = (itemUrl) => {
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            // save confirmation 
            saveConfirmed.hidden = false; 
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // favorites to local storage 
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    })
}

// delete favorites 
const removeFavorite = (itemUrl) => {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl]; 
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

getNasaPictures();
