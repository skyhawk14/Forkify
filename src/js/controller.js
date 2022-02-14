import * as model from './model';
import icons from '../img/icons.svg';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import BookMarksView from './views/BookMarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';
//polyfilling everything else
import 'core-js/stable';

if (module.hot) {
  module.hot.accept();
}

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    BookMarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    const {recipe} = model.state;
    console.log(recipe);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};

async function showSearchResult() {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) { 
    // debugger;
    recipeView.renderError(err.message)
  };
}
function controlPagination(page){ 
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) { 
  //update the recipe servings in state
  model.updateServings(newServings);
  //update the recipe view
  recipeView.update(model.state.recipe);
}

const init = function () { 
  BookMarksView.addBookMarkHandler(controlBookmarks);
  recipeView.addHandlerRenderer(showRecipe);
  searchView.addHandlerSearch(showSearchResult);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

const controlBookmarks = () => { 
  model.loadBookMark();
  BookMarksView.render(model.state.bookmarks);
  console.log(model.state.bookmarks);
}

const controlAddRecipe = async (newRecipe) => {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    BookMarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      //addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
}  

const controlAddBookmark = function () {
  //1 add/remove the booksmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else { model.deleteBookMark(model.state.recipe.id); }
  console.log(model.state.bookmarks);
  recipeView.update(model.state.recipe);
  //2 render the bookmark
  BookMarksView.render(model.state.bookmarks);
}

init();
