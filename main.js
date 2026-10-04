/****  Gallery ****/

const gallery = document.querySelector('.gallery');
const errorMessage = document.querySelector('.gallery__error');
const galleryContainer = document.querySelector('.gallery__container');

const tabletOrder = [
      1,8,2,9,3,10,4,11,5,12,13,6,14,7,15 ];

const desktopOrder = [
      1,5,9,12,2,6,10,13,3,7,14,4,8,11,15 ];

/**** Application State ****/

let artworks = [];
let currentIndex = 0;

/**** Slideshow Elements ****/

const slideshow    = document.querySelector('.slideshow');
const headerButton = document.querySelector('.header__btn');

const slideshowImage = document.querySelector('.slideshow__hero-img img');
const slideshowImageLarge = document.querySelector('.hero__large');

const slideshowName = document.querySelector('.slideshow__text-name');
const slideshowArtist = document.querySelector('.slideshow__text-artist');
const slideshowYear = document.querySelector('.slideshow__text-year');
const slideshowContent = document.querySelector('.slideshow__text-content');

const slideshowArtistImage = document.querySelector('.slideshow__hero-artist img');

const sourceLink = document.querySelector('.artist__link');

const footerName = document.querySelector('.footer_header');
const footerArtist = document.querySelector('.footer_artist');

const lightboxImage = document.querySelector('.lightbox__image');
const slideshowIndex = document.querySelector('.slideshow__index');
const slideAnnouncement = document.querySelector('.sr-only');

const previousButton = document.querySelector(
  '.slideshow__footer-buttons .next-prev-btn:first-child'
);

const nextButton = document.querySelector(
  '.slideshow__footer-buttons .next-prev-btn:last-child'
);


/**** Lightbox Elements ****/

const lightbox = document.querySelector('.lightbox');

const viewImageButton = document.querySelector('.slideshow__view-image');

const closeButton = document.querySelector('.lightbox__close');

/**** View Switching ****/

function showSlideshow() {
  gallery.classList.add('hidden');
  slideshow.classList.remove('hidden');
  headerButton.textContent = 'Close slideshow';
  headerButton.setAttribute('aria-expanded', 'true');
}

function showGallery() {
  slideshow.classList.add('hidden');
  gallery.classList.remove('hidden');

  headerButton.textContent = 'Start slideshow';
  headerButton.setAttribute('aria-expanded', 'false');
}

function toggleSlideshow() {
const isSlideshowVisible = !slideshow.classList.contains('hidden');

  if (isSlideshowVisible) {
    showGallery();
  } else {
    showSlideshow();
  }
}

/**** Load Gallery ****/
  
async function loadGallery() {
  try {
    const response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    artworks = await response.json();

    artworks.forEach((artwork, index) => {
      createGalleryCard(artwork, index);
    });

    updateSlideshow();

  } catch (error) {
    console.error('Failed to load gallery:', error);
      errorMessage.textContent = 'Sorry, we could not load the gallery. Please try again.';
      errorMessage.classList.remove('hidden');
  }
} 

function createGalleryCard(artwork, index) {
  const card = document.createElement('article');
  
  card.classList.add('gallery__card');

  card.style.setProperty(
    '--order-tablet',
    tabletOrder[index]
  );

  card.style.setProperty(
    '--order-desktop',
    desktopOrder[index]
  );   

   card.style.setProperty(
    '--card-height',
    `${artwork.images.gallery.height}px`
  );

  const button = document.createElement('button');

  button.classList.add('gallery__card-button');
  button.type = 'button';

  button.innerHTML = `
    <img
      class="gallery__card-img"
      src="${artwork.images.gallery.src}"
      alt="${artwork.name}"
     
    >

    <div class="gallery__card-desc">
      <p class="gallery__card-title galleria-text-lg">
        ${artwork.name}
      </p>

      <p class="gallery__card-artist galleria-text-sm">
        ${artwork.artist.name}
      </p>
    </div>
  `;

  card.appendChild(button);
  const image = card.querySelector('.gallery__card-img');

  image.addEventListener('error', () => {
    console.error(`Image failed to load: ${image.src}`);
  });

  button.addEventListener('click', () => {
    currentIndex = index;
    updateSlideshow();
    showSlideshow();
   });
  
   galleryContainer.appendChild(card);
}

/**** Slideshow ****/

/*** Update Progress ***/
function updateProgress() {
  const progress = ((currentIndex + 1) / artworks.length) * 100;

  slideshowIndex.style.setProperty(
    '--progress',
    `${progress}%`
  );
  const artwork = artworks[currentIndex];
  slideAnnouncement.textContent =
  `Artwork ${currentIndex + 1} of ${artworks.length}: ${artwork.name}`;
}

//*** Update Slideshow ***/
function updateSlideshow() {
  const artwork = artworks[currentIndex];

  if (!artwork) {
    return;
  }

  // Hero image
  slideshowImage.src = artwork.images.hero.small;
  slideshowImage.alt = artwork.name;

  slideshowImageLarge.srcset = artwork.images.hero.large;

  // Artwork information
  slideshowName.textContent = artwork.name;
  slideshowArtist.textContent = artwork.artist.name;

  slideshowYear.textContent = artwork.year;

  slideshowContent.textContent = artwork.description;

  // Artist image
  slideshowArtistImage.src = artwork.artist.image;
  slideshowArtistImage.alt = artwork.artist.name;

  // Source
  sourceLink.href = artwork.source;


   // Footer
  footerName.textContent = artwork.name;
  footerArtist.textContent = artwork.artist.name;

  // Lightbox
  lightboxImage.src = artwork.images.gallery.src;
  lightboxImage.alt = artwork.name;

  updateProgress();
  updateNavigationButtons();
}

/**** Navigation ****/

function updateNavigationButtons() {
  previousButton.disabled =
    currentIndex === 0;

  nextButton.disabled =
    currentIndex === artworks.length - 1;
}


function showNextArtwork() {
 
   if (currentIndex < artworks.length - 1) {
    currentIndex++;
    updateSlideshow();
  }
}

function showPreviousArtwork() {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlideshow();
  }
}

/**** Lightbox Functions ****/
function openLightbox() {
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  viewImageButton.setAttribute('aria-expanded','true');

  document.body.classList.add('no-scroll');
  closeButton.focus();
}


function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  viewImageButton.setAttribute('aria-expanded','false');
  viewImageButton.focus();

  document.body.classList.remove('no-scroll');
}

/*** keyboard Navigation ****/

function handleKeyboardNavigation(event) {

  // Escape closes lightbox
  if (event.key === 'Escape') {
    if (lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
    return;
  }

  // Don't navigate slideshow while lightbox is open
  if (lightbox.classList.contains('is-open')) {
    return;
  }

  // Only navigate when slideshow is visible
  if (!slideshow.classList.contains('hidden')) {

    if (event.key === 'ArrowLeft') {
      showPreviousArtwork();
    }

    if (event.key === 'ArrowRight') {
      showNextArtwork();
    }
  }
}

/*** Event Listeners ****/

  headerButton.addEventListener('click',toggleSlideshow);

  nextButton.addEventListener('click',showNextArtwork);

  previousButton.addEventListener('click',showPreviousArtwork);

  viewImageButton.addEventListener('click', openLightbox);

  closeButton.addEventListener('click', closeLightbox);

  document.addEventListener('keydown',handleKeyboardNavigation);

/*** Initialize ****/
loadGallery();

