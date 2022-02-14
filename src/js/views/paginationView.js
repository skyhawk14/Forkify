import View from "./view";
import { RESULTS_PER_PAGE } from "../config";
import icons from '../../img/icons.svg';

class PaginationView extends View { 
    _parentElement = document.querySelector('.pagination');
    
    addHandlerClick(handler) { 
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!e) return;
            const pageGoTo = new Number(btn.dataset.goto);
            console.log(pageGoTo);
            handler(pageGoTo.valueOf());
        });
    }

    _generateMarkup() { 
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / RESULTS_PER_PAGE);
        console.log(curPage);
        console.log(numPages);
        this._clear();
        //Page1 and other pages are present
        if (curPage === 1 && numPages > 1) {
            return `<button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage+1}</span>
            <svg class="search__icon">
              <use href="${icons}.svg#icon-arrow-right"></use>
            </svg>
          </button>`;
        }
        if (curPage == numPages && numPages>1) {
            //Last page
            return `<button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage-1}</span>
          </button>`;
        }
        if (curPage < numPages) { 
            //other page
            return `<button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage-1}</span>
          </button>
          <button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage+1}</span>
            <svg class="search__icon">
              <use href="${icons}.svg#icon-arrow-right"></use>
            </svg>
          </button>`;
        }
        
        //Page 1 and no other pages are present
        return '';
    }
}
export default new PaginationView();