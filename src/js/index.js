import searchImg from "./searchImg";
import { Notify } from 'notiflix/build/notiflix-notify-aio.js';
// import galleryImgsTpl from '../templates/gallery.hbs';

Notify.init({
    width: '300px',
    position: 'left-top',
    fontSize: '16px',    
});

const container = {
    receivingForm: document.querySelector('.search-form'),
    receivingInput: document.querySelector('.search-input'),
    galleryImg: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more')
}

container.receivingForm.addEventListener('submit', onReceivingForm);
container.loadMore.addEventListener('click', onLoadMore);
container.loadMore.style.display = 'none';

let searchQuery;
let currentQuery;
let page;
let currentPage;
const perPage = 40;

async function onReceivingForm(e) {
    e.preventDefault();
    searchQuery = e.currentTarget.elements.searchQuery.value.trim();
    if (currentTarget === searchQuery) {
        Notify.warning("Error! You are already searching for this keyword");
        container.receivingInput.value = '';
        return;
    };
    if (searchQuery === '') {
        Notify.warning("Error! You are already searching for this keyword");
        container.receivingInput.value = '';
        return;
    };
    try {
        page = 1;
        console.log(`searchQuery: ${searchQuery}, page before fetch: ${page}`);
        let data = await searchImg(searchQuery, page);
        console.log('Hits: ', data.hits);
        if (data.hits && data.hits.length > 0) {
            Notify.success(`Hooray! We found ${data.totalHits} images.`)
            container.receivingInput.value = '';
            container.galleryImg.innerHTML = '';
            galleryImgMarcup(data.hits);
            page++;
            currentPage = page;
            container.loadMore.style.display = 'block';
            currentQuery = searchQuery;
            console.log(`searchQuery: ${searchQuery}, page after fetch: {page}`);
        } else {
            Notify.failure("Sorry, there are no images matching your search query. Please try again");
            container.receivingInput.value = '';
            searchQuery = currentQuery;
            page = currentPage;
        }
    } catch (error) {
        console.error(error.message);
    }
};

async function onLoadMore(e) {
    try {
        console.log(`searchQuery: ${searchQuery}, page before fetch: ${page}`);
        let data = await searchImg(searchQuery, page);
        console.log('Hits: ', data.hits);
        if (data.hits && data.hits.length > 0) {
            container.receivingInput.value = '';
            galleryImgMarcup(data.hits);

            if (perPage * page >= data.totalHits) {
                Notify.failure("We're sorry, but you've reached the end of search results.");
                container.loadMore.style.display = 'none';
                return;
            }
            page++;
            currentPage = page;
            container.loadMore.style.display = 'block';
            currentQuery = searchQuery;
            console.log(`searchQuery: ${searchQuery}, page after fetch: ${page}`);
        } else {
            Notify.failure("No more results.");
            container.loadMore.style.display = 'none';
        }
    } catch (error) {
        console.error(error.message)
    }
}

function galleryImgMarcup(hits) {
    container.galleryImg.insertAdjacentHTML('beforeend', galleryImgsTpl )
}