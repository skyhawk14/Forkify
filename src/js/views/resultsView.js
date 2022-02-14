import View from "./view";
import icons from 'url:../../img/icons.svg';
class ResultsView extends View { 
    _parentElement = document.querySelector('.results');
    _errorMessage = `No Recipes found for your query. Please try again!!!`;
    _message = ``;
    
    _generateMarkup() { 
        console.log(this._data);
        let html = '';
        const id = window.location.hash.slice(1);
      this._data.forEach(data => {
        debugger;
            html += `<li class="preview">
                <a class="preview__link ${data.id === id ? "preview__link--active":""}" href="#${data.id}">
                  <figure class="preview__fig">
                    <img src="${data.image}" alt="Test" />
                  </figure>
                  <div class="preview__data">
                    <h4 class="preview__title">${data.title}</h4>
                    <p class="preview__publisher">${data.publisher}</p>
                    <div class="preview__user-generated ${
                      data.key ? '' : 'hidden'
                    }">
                      <svg>
                      <use href="${icons}#icon-user"></use>
                      </svg>
                    </div>
                  </div>
                </a>
              </li>`;
        });
        return html;
    }
}

export default new ResultsView();