import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import { getImage } from "./getImages";

let pagecount = 1;
let hits = 0;
let totalHits = 0;
let search = "";
const imagesOnPage = 40;

const form = document.querySelector('form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const btn = document.querySelector(".load-more");
form.addEventListener('submit', onSubmitBtnClick);
btn.addEventListener('click', onLoadMoreBtnClick);
btn.classList.add("visually-hidden");

 const simpleLightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250, })

async function onSubmitBtnClick(e) {
  hits = 0;
  btn.classList.add("visually-hidden")
  e.preventDefault();
  search = input.value.trim();
  gallery.innerHTML = "";
  console.log(search);
  pagecount = 1;


  
  try {if (search !== "") {
   const images = await getImage(search, pagecount);
      renderImageCard(images.hits);
      simpleLightbox.refresh();
      if (images.totalHits === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query.Please try again.');
        return
      } else if (images.totalHits >= 1 && images.totalHits <= imagesOnPage) {
       totalHits = images.totalHits;
        console.log(totalHits);
        Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results."); } 
      else if(images.totalHits > imagesOnPage){
        totalHits = images.totalHits;
        console.log(totalHits);
        Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`)
        pagecount += 1;
        btn.classList.remove("visually-hidden")
      }
    }}
  catch(error){
      console.log(error)
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
      gallery.innerHTML = "";
      search = "";
    };
  }

    
async function onLoadMoreBtnClick() {
  console.log(search)
  console.log(hits);
  try {
  const images = await getImage(search, pagecount)
  renderImageCard(images.hits);
  simpleLightbox.refresh();

  pagecount += 1;
  if (totalHits <= (pagecount-1)* 40) {
    console.log(pagecount)
    btn.classList.add("visually-hidden");
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
 catch(error){console.log(error)}
}

function renderImageCard(images) {
   let imagesMarkup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    hits += 1;
    return `<div class="photo-card">
   <a class="gallery__link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
  }).join(' ');
    gallery.insertAdjacentHTML('beforeend', imagesMarkup);
}

