//select element
const searchInput = document.querySelector(".search-bar");
const searchForm = document.querySelector(".search-form");

//add event listener
searchForm.addEventListener("submit", handleSubmit);

//FUNCTIONS
async function handleSubmit(event) {
  //prevent page from refresh when submit form
  event.preventDefault();

  //get search value and remove whitespace
  const inputValue = searchInput.value;
  const searchQuery = inputValue.trim();

  try {
    const results = await searchWiki(searchQuery);
    displaySearch(results);
  } catch (err) {
    console.log(err);
  }
}

async function searchWiki(searchQuery) {
  //set up api url
  //  an example of what the url api will look like
  // let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;

  let url = "https://en.wikipedia.org/w/api.php";
  const params = {
    action: "query",
    list: "search",
    srsearch: searchQuery,
    format: "json",
    prop: "info",
    inprop: "url",
    srlimit: "20",
  };

  url += "?origin=*";
  Object.keys(params).forEach(function (key) {
    url += "&" + key + "=" + params[key];
  });

  //fetch response json using url and return it
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const json = await response.json();
  return json;
}

function displaySearch(results) {
  const searchResults = document.querySelector(".search-results");
  //clear all children element form search result/ refresh search results
  while (searchResults.firstChild) {
    searchResults.removeChild(searchResults.firstChild);
  }

  if (results.query.searchinfo.totalhits === 0) {
    searchResults.insertAdjacentHTML(
      "beforeend",
      `<h3 class="result-error">No results found. Try again :(</h3>`
    );
    // return;
  } else {
    results.query.search.forEach((result) => {
      const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

      //append result to DOM
      searchResults.insertAdjacentHTML(
        "beforeend",
        `<div class="result-item">
        <h3 class="result-title">
          <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
        <span class="result-snippet">${result.snippet}</span><br>
      </div>`
      );
    });
  }
}
