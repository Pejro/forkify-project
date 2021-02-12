import icons from 'url:../../img/icons.svg'; // Parcel 2 way

export default class View {
  _data;

  /**
   * Render the recieved object to the dom
   * @param {Object | Object[]} data The data to be rendered (recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render= false
   * @this {Object} View instance
   * @author Patrik Repasky
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    //we are getting rid of html that is inside to remove "Start by searching.." message
    this._clear();
    //inserting our html to parent element (div recipe)
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    //converting string in to real dom node object which we can compare to our dom which lives on page and only change elements that are not same
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll(`*`));
    const curElements = Array.from(this._parentElement.querySelectorAll(`*`));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //updates change text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ``
      ) {
        //console.log(`😑`, newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //update changes attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = ``;
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    //clearing parentEl
    this._clear();
    //spinner works because of css keyframes `rotate`
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  //default message if no message specified
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="recipe">
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
}
