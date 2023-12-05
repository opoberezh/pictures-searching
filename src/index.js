// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import {
//   getImages,
//   setSearchQuery,
//   resetPage,
//   nextPage,
//   updateFirstSearch,
// } from './get_api';
// import { createMarkup } from './markup';
// import { Notify } from 'notiflix';
// import { Report } from 'notiflix/build/notiflix-report-aio';

// let form = document.querySelector('#search-form');
// let gallery = document.querySelector('.gallery');
// let loadMoreBtn = document.querySelector('.load-more');
// let btnUp = document.getElementById('to-top-btn');
// let btnUpWrapper = document.querySelector('.btn-up');

// loadMoreBtn.style.display = 'none';

// form.addEventListener('submit', function (evt) {
//   evt.preventDefault();

//   let searchQuery = evt.target.searchQuery.value.trim();
//   if (searchQuery === '') {
//     Notify.warning('Input field is empty or contains only spaces');
//     return;
//   }

//   setSearchQuery(searchQuery);
//   resetPage();
//   updateFirstSearch(true);
//   loadMoreBtn.hidden = true;
//   gallery.innerHTML = '';

//   getImages().then(function (data) {
//     if (data.length === 0) {
//       Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//       loadMoreBtn.style.display = 'none';
//       return;
//     }

//     gallery.insertAdjacentHTML('beforeend', createMarkup(data));
//     new SimpleLightbox('.gallery a', {
//       captionDelay: 200,
//       captionsData: 'alt',
//     });
//     loadMoreBtn.hidden = false;
//     loadMoreBtn.style.display = 'block';
//   });

//   evt.target.searchQuery.value = '';
// });

// loadMoreBtn.addEventListener('click', function () {
//   nextPage().then(function (data) {
//     if (data.length === 0) {
//       Report.info(
//         "We're sorry",
//         "but you've reached the end of search results.",
//         'Okay'
//       );
//       loadMoreBtn.hidden = true;
//       return;
//     }

//     gallery.insertAdjacentHTML('beforeend', createMarkup(data));
//     new SimpleLightbox('.gallery a', {
//       captionDelay: 200,
//       captionsData: 'alt',
//     });
//   });
// });





//    /* smooth scrolling */
//    function scrollPage() {
//     const { height: cardHeight } = document.querySelector("gallery")
//       .firstElementChild.getBoundingClientRect();
  
//     window.scrollBy({
//       top: cardHeight * 2,
//       behavior: 'smooth',
//     });
//   }


//   scrollPage();

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './get_api';
import { markupGallery } from './markup';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('#search-form input');
const galleryItemsEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const btnUp = document.getElementById('to-top-btn');
const btnUpWrapper = document.querySelector('.btn-up');

let imgsName = '';
let currentPage = 1;
let totalPage = 0;

export {imgsName, currentPage };

formEl.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

const galleryLightBox = new SimpleLightbox('.gallery a');

async function onSubmit(evt) {
  evt.preventDefault();
  const {
    elements: { searchQuery },
  } = evt.currentTarget;

  imgsName = searchQuery.value.trim();
  currentPage = 1;
  loadMoreBtn.hidden = true;

  if (imgsName === '') {
    evt.currentTarget.reset();
    return;
  }

  try {
    const dataGallery = await getImages();
    galleryItemsEl.innerHTML = markupGallery(dataGallery.data.hits);
    galleryLightBox.refresh();
    if (dataGallery.data.hits.length) {
      Notify.success(`Hooray! We found ${dataGallery.data.totalHits} images.`);
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryItemsEl.innerHTML = '';
      loadMoreBtn.hidden = true;
    }

    totalPage = Math.ceil(
      dataGallery.data.totalHits / dataGallery.data.hits.length
    );

    if (totalPage > currentPage) {
      loadMoreBtn.hidden = false;
    }
  } catch (error) {
    console.log(error);
    galleryItemsEl.innerHTML = '';
    loadMoreBtn.hidden = true;
    currentPage = 1;
  }
}

inputEl.addEventListener('input', event => {
  if (event.currentTarget.value === '') {
    galleryItemsEl.innerHTML = '';
    loadMoreBtn.hidden = true;
    currentPage = 1;
  }
});

async function onClickLoadMoreBtn() {
  currentPage += 1;
  if (currentPage === totalPage) {
    loadMoreBtn.hidden = true;

    Notify.failure('Were sorry, but youve reached the end of search results.');
  }
  try {
    const dataGalleryPagination = await getImages();
    galleryItemsEl.insertAdjacentHTML(
      'beforeend',
      markupGallery(dataGalleryPagination.data.hits)
    );
    galleryLightBox.refresh();
  } catch (error) {
    console.log(error);
    galleryItemsEl.innerHTML = '';
    loadMoreBtn.hidden = true;
    currentPage = 1;
  }
}

//Button smooth scroll up

window.addEventListener('scroll', scrollFunction);

function scrollFunction() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    btnUpWrapper.style.display = 'flex';
  } else {
    btnUpWrapper.style.display = 'none';
  }
}
    btnUp.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
