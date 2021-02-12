import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    //read id and remove hash symbol using slice method
    const id = window.location.hash.slice(1);

    //simple guard clause that return when there is no ID also we prevent uneccesary nesting if we used if()
    if (!id) return;
    recipeView.renderSpinner();

    //0 update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //UPDATING BOOKMARKS VIEW
    bookmarksView.update(model.state.bookmarks);

    // 1. LOADING THE RECIPE
    //async function is calling another async function, its crucial to use await!
    await model.loadRecipe(id);

    // 2. RENDERING THE RECIPE
    //creating render method on recipeView object
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //1 get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    //2 load results that we searched for
    //does not return anything, all it does, it manipulates `state`
    await model.loadSearchResults(query);

    //3 render results
    resultsView.render(model.getSearchResultsPage());

    //4 render intial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1 render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //2 render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1 add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe.id);

  //2 update recipe view
  recipeView.update(model.state.recipe);

  //3 render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

//render bookmarks on page load event
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //RENDER BOOKMARK VIEW
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    //broswer history api parameters(state, title, url)
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`😑`, err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.AddHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
