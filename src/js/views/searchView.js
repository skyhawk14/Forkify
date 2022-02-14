class SearchView {
    #parentElement = document.querySelector('.search');

    getQuery() { 
        const query = this.#parentElement.querySelector('.search__field').value;
        document.querySelector('.search__field').value = '';
        return query;   
    }

    addHandlerSearch(handler) { 
        this.#parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            // let searchText = document.querySelector('.search__field').value;
            // showSearchResult(searchText);
            handler();
        });
    }

    
 };
export default new SearchView();