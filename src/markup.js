
function markupGallery(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
            
            <div class="thumb-img">
                <a class="gallery-link" href=${largeImageURL}>
                    <img class="gallery-image" src=${webformatURL} alt="${tags}" loading="lazy"/>
                </a>
            </div>
            
            <div class="info">
                <p class="info-item">
               <i class="fa-regular fa-heart"></i> ${likes}
                </p>
                <p class="info-item">
                 <i class="fa-solid fa-comment"></i> ${comments}
                </p>
                <p class="info-item">
                <i class="fa-solid fa-download"></i> ${downloads}
                </p>
                 <p class="info-item">
                <b>Views</b>${views}
                </p>
            </div>
        </div>`
    )
    .join('');
}
export { markupGallery };