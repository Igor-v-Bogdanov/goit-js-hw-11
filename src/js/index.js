import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35735341-83298046caef66a584c9c60a1';
const VISIB_BTN = `<button type="button" class="load-more" style="display: block">Load more</button>`;
const HIDD_BTN = `<button type="button" class="load-more" style="display: none">Load more</button>`;
const sorry =
  'Sorry, there are no images matching your search query. Please try again.';
const theEnd = "We're sorry, but you've reached the end of search results.";

const perPage = 40;
let pageNumber = 1;

const axios = require('axios').default;

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const newArea = document.querySelector('.new-area');
// const loadMore = document.querySelector('.load-more');

form.addEventListener('submit', searchPhoto);


// ----------------------------------------------------------------------------
function searchPhoto(evt) {
  
  evt.preventDefault();
  const searchQuery = form.elements.searchQuery.value
    .trim()
    .replaceAll(' ', '+');
  // console.log(searchQuery);

  if (searchQuery !== '') {
    fetchData(searchQuery).then(renderPhoto);
  } else {
    Notiflix.Notify.failure(sorry);
    gallery.innerHTML = ``;
    newArea.innerHTML = HIDD_BTN;
  }
}

// ----------------------------------------------------------------------------
async function fetchData(valueQ) {
  pageNumber = 1;
  try {
    const resp = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${valueQ}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${pageNumber}`
    );
    // console.log(resp);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

async function newFetchData(valueQ) {
  try {
    const resp = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${valueQ}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${pageNumber}`
    );
    // console.log(resp);
    return resp;
  } catch (error) {
    console.error(error);
  }
}


// ----------------------------------------------------------------------------
function renderPhoto(arrayOfPhotos) {
  const photos = arrayOfPhotos.data.hits;
  const totalHits = arrayOfPhotos.data.totalHits;

  if (totalHits === 0) {
    gallery.innerHTML = ``;
    newArea.innerHTML = HIDD_BTN;
    Notiflix.Notify.failure(sorry);
  }

  if (totalHits > 0 && totalHits <= perPage) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    gallery.innerHTML = ``;
    newArea.innerHTML = HIDD_BTN;
    // console.log(photos);

    for (const photo of photos) {
      gallery.insertAdjacentHTML(
        'beforeend',
        `<div class="photo-card">
          <img src="${photo.webformatURL}" alt="${photo.tags}" class="photo" loading="lazy" />
              <div class="info">
               <p class="info-item">
                 <b>Likes: ${photo.likes}</b>
               </p>
               <p class="info-item">
                 <b>Views: ${photo.views}</b>
               </p>
               <p class="info-item">
                 <b>Comments: ${photo.comments}</b>
               </p>
               <p class="info-item">
                 <b>Downloads: ${photo.downloads}</b>
               </p>
              </div>
        </div>`
      );
    }
  }
  if (totalHits > perPage) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    gallery.innerHTML = ``;
    newArea.innerHTML = VISIB_BTN;
    // console.log(photos);

    for (const photo of photos) {
      gallery.insertAdjacentHTML(
        'beforeend',
        `<div class="photo-card">
          <img src="${photo.webformatURL}" alt="${photo.tags}" class="photo" loading="lazy" />
              <div class="info">
               <p class="info-item">
                 <b>Likes: ${photo.likes}</b>
               </p>
               <p class="info-item">
                 <b>Views: ${photo.views}</b>
               </p>
               <p class="info-item">
                 <b>Comments: ${photo.comments}</b>
               </p>
               <p class="info-item">
                 <b>Downloads: ${photo.downloads}</b>
               </p>
              </div>
        </div>`
      );
    }

    const loadMore = document.querySelector('.load-more');
    // console.log(loadMore);
    loadMore.addEventListener('click', addPage);
  }
}

// -----------------------------------------------------------------------
function addPage(evt) {
  evt.preventDefault();

  pageNumber = pageNumber + 1;

  const searchQuery = form.elements.searchQuery.value
    .trim()
    .replaceAll(' ', '+');
  // console.log(searchQuery);

  if (searchQuery !== '') {
    newFetchData(searchQuery).then(addNewPage);
  } else {
    Notiflix.Notify.failure(sorry);
    gallery.innerHTML = ``;
    newArea.innerHTML = HIDD_BTN;
  }
}

// -----------------------------------------------------------------------
function addNewPage(arrayOfNewPagePhotos) {
  const photos = arrayOfNewPagePhotos.data.hits;
  const totalHits = arrayOfNewPagePhotos.totalHits;
  console.log(photos);

  if (photos.length === 0) {
    // gallery.innerHTML = ``;
    newArea.innerHTML = HIDD_BTN;
    Notiflix.Notify.failure(theEnd);
    pageNumber = 1;
  } else {
    newArea.innerHTML = VISIB_BTN;

    for (const photo of photos) {
      gallery.insertAdjacentHTML(
        'beforeend',
        `<div class="photo-card">
          <img src="${photo.webformatURL}" alt="${photo.tags}" class="photo" loading="lazy" />
              <div class="info">
               <p class="info-item">
                 <b>Likes: ${photo.likes}</b>
               </p>
               <p class="info-item">
                 <b>Views: ${photo.views}</b>
               </p>
               <p class="info-item">
                 <b>Comments: ${photo.comments}</b>
               </p>
               <p class="info-item">
                 <b>Downloads: ${photo.downloads}</b>
               </p>
              </div>
        </div>`
      );
    }
    const loadMore = document.querySelector('.load-more');
    // console.log(loadMore);
    loadMore.addEventListener('click', addPage);
  }
}
