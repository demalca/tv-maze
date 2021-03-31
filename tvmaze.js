/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const titles = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${query}`
  );
  const shows = [];

  for (let title of titles.data) {
    const id = title.show.id;
    const name = title.show.name;
    const summary = title.show.summary;
    const url = title.show.url;

    const image = title.show.image
      ? title.show.image.original
      : "https://tinyurl.com/tv-missing";

    const show = { id, name, summary, url, image };
    shows.push(show);
  }
  return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src=${show.image}>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const epi = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = [];
  for (let episodeInfo of epi.data) {
    const id = episodeInfo.id;
    const name = episodeInfo.name;
    const season = episodeInfo.season;
    const number = episodeInfo.number;

    const episode = { id, name, season, number };
    episodes.push(episode);
  }
  // console.log(episodes);

  return episodes;
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    console.log(episode.name, episode.season, episode.number);
    let $item = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>
      `
    );
    $episodesList.append($item);
  }
  $("#episodes-area").show();
}

$("#shows-list").on(
  "click",
  ".get-episodes",
  async function handleEpisodeClick(evt) {
    let showId = $(evt.target).closest(".Show").data("show-id");
    let episodes = await getEpisodes(showId);
    populateEpisodes(episodes);
  }
);
