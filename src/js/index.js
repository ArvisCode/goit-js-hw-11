import '../sass/main.scss';
import fetch from './fetch';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const { searchForm, gallery, loadMoreBtn, endCollectionText } = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endCollectionText: document.querySelector('.end-collection-text'),
};

function renderImageCard(arr) {
  const markup = arr
    .map(
      img => `<div class="photo-card">
        <a href="${img.largeImageURL}">
          <img class="photo-img" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${img.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${img.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${img.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${img.downloads}
          </p>
        </div>
      </div>`,
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  scrollFun(-1000);
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', submitSearchForm);

async function submitSearchForm(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value;
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetch(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreBtn.classList.remove('is-hidden');
  } else {
    loadMoreBtn.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      renderImageCard(response.hits);
      lightbox.refresh();
      endCollectionText.classList.add('is-hidden');
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.classList.add('is-hidden');
      endCollectionText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

loadMoreBtn.addEventListener('click', clickLoadMoreBtn);

async function clickLoadMoreBtn() {
  currentPage += 1;
  const response = await fetch(searchQuery, currentPage);
  renderImageCard(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  scrollFun(2);

  if (currentHits === response.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endCollectionText.classList.remove('is-hidden');
  }
}

function scrollFun(step) {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * step,
    behavior: 'smooth',
  });
}
