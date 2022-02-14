import icons from '../../img/icons.svg';
export default class View { 
    _data;
    render(data,render=true) { 
        if(!data || (Array.isArray(data) && data.length==0)){
            this.renderError();
            return;
        }
      this._data = data;
      const markup = this._generateMarkup();
      if (!render) { 
        return markup;
      }
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderSpinner = function () {
        const markup = `
        <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
        </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    _clear() { 
        this._parentElement.innerHTML = '';
    }

    renderError(message=this._errorMessage) { 
        const markup = `<div class="error">
            <div>
              <svg>
                <use href="src/img/icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message=this._message) { 
        const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  
    update(data) { 
      if(!data || (Array.isArray(data) && data.length==0)){
         this.renderError();
          return;
      }
      this._data = data;
      // this._clear();
      const newMarkUp = this._generateMarkup();
      const newDom = document.createRange().createContextualFragment(newMarkUp);
      const newElements = Array.from(newDom.querySelectorAll('*'));
      const currentElements = Array.from(this._parentElement.querySelectorAll('*'));
      newElements.forEach((newEl, i) => { 
        const curEl = currentElements[i];
        if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
          curEl.textContent = newEl.textContent;
        }
        //update attribtues
        if (!newEl.isEqualNode(curEl)) { 
          Array.from(newEl.attributes).forEach((attr) => { 
            curEl.setAttribute(attr.name, attr.value);
          })
        }
      })
      
    }
}
