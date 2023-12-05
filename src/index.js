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

export { imgsName, currentPage };

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
