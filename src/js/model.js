import { API_URL,TIMEOUT_SECONDS,RESULTS_PER_PAGE,KEY } from './config';
//polyfilling async await
import 'regenerator-runtime/runtime';
import { AJAX } from './views/helper';
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page:1
    },
    bookmarks: [],
};


const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) { 
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
        // let { recipe } = data;
        // recipe = {
        //     id: recipe.id,
        //     title: recipe.title,
        //     publisher: recipe.publisher,
        //     sourceUrl: recipe.source_url,
        //     image: recipe.image_url,
        //     servings: recipe.servings,
        //     cookingTime: recipe.cooking_time,
        //     ingredients: recipe.ingredients,
        // };
        state.recipe = createRecipeObject(data);
        // console.log(recipe);
        if (state.bookmarks.some(b => b.id === id)) {
            state.recipe.bookmarked = true;
        } else { 
            state.recipe.bookmarked = false;
        }
    } catch (err) { 
        console.log(`${err} `);
        throw err;
    }
}

export const loadSearchResults = async function(query) { 
    try {
        let srchUrl = `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}&key=${KEY}`;
        let data = await AJAX(srchUrl);
        console.log(data);
        state.search.query = query;
        state.search.results=data.data.recipes.map((recipe) => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key }),
            }
        });
        //displaySearchResult(data);
    } catch (error) {
        throw (error);
    }
}


export const getSearchResultsPage = function (page=1) {
    state.search.page = page;
    const start = (page - 1) * RESULTS_PER_PAGE;
    const end = page * RESULTS_PER_PAGE;
    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}


const persistBookmark = () => { 
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookMark = function (recipe) {
    state.bookmarks.push(recipe);
    //mark current recipe as bookmarked
    if (recipe.id == state.recipe.id) { 
        state.recipe.bookmarked = true;
    }
    persistBookmark();
}


export const deleteBookMark = function (id) {
    const idx = state.bookmarks.findIndex(b => b.id === id);
    state.bookmarks.splice(idx,1);
    //mark current recipe as bookmarked
    if (id == state.recipe.id) { 
        state.recipe.bookmarked = false;
    }
    persistBookmark();
}

export const loadBookMark=()=>{ 
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}


export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
