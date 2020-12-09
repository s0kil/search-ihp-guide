import debounce from "https://cdn.skypack.dev/pin/underscore@v1.12.0-SbbRwvcnn3j8cyGALdrC/mode=raw,min/modules/debounce";
import { render } from "https://cdn.skypack.dev/pin/solid-js@v0.23.2-Hdhcf56TcwCjJ93WOLwJ/min/solid-js/web.js";
import html from "https://cdn.skypack.dev/pin/solid-js@v0.23.2-Hdhcf56TcwCjJ93WOLwJ/min/solid-js/html.js";
import {
  For,
  createState,
  createEffect
} from "https://cdn.skypack.dev/pin/solid-js@v0.23.2-Hdhcf56TcwCjJ93WOLwJ/min/solid-js.js";

async function queryAPI(query) {
  const searchAttributes = [
    "in:file",
    "language:Markdown",
    "extension:markdown",
    "repo:digitallyinduced/ihp",
    "path:Guide/"
  ].join("+");

  const searchURL = `https://api.github.com/search/code?q=${query}+${searchAttributes}`;

  return fetch(searchURL).then((r) => r.json());
}

const App = () => {
  const [state, setState] = createState({
    searchQuery: "",
    searchResults: []
  });

  // Debounce Update Of `searchQuery` State After 0.5 Seconds
  const setSearchQuery = debounce(
    (query) => setState("searchQuery", query),
    500
  );

  // Query GitHub API Once `searchQuery` State Has Changed
  createEffect(async () => {
    const queryResult = await queryAPI(state.searchQuery);
    setState("searchResults", queryResult.items);
  });

  // Full Path To Guide From Relative Path
  const IHP_BASE_URL = "https://ihp.digitallyinduced.com/";
  function guidePath(path) {
    const htmlPath = path.replace(".markdown", ".html");
    return IHP_BASE_URL + htmlPath;
  }

  return html`
    <div>
      <input
        type="text"
        id="github-search"
        name="github-search"
        placeholder="Search"
        autocomplete="off"
        oninput=${(event) => setSearchQuery(event.target.value)}
      />

      <nav id="search-results">
        <ul>
          <${For} each=${() => state.searchResults}>
            ${(searchResult) =>
              html`
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href=${guidePath(searchResult.path)}
                  >
                    ${searchResult.name.split(".")[0]}
                  </a>
                </li>
              `}
          <//>
        </ul>
      </nav>
    </div>
  `;
};

render(App, document.querySelector("main"));
