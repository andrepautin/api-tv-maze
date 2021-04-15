"use strict";
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const showsAPI = "http://api.tvmaze.com/search/shows";
const episodesAPI = 'http://api.tvmaze.com/';
const noImage = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function getShowsByTerm( /* term */) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let userInput = $("#searchForm-term").val(); // gets the term that user wants to search
  let searchesByTerm = await axios.get(showsAPI, {params: {q:userInput}}); // get all of the shows that match user's search // use axios params object
  
  let shows = searchesByTerm.data.map((eachShow) => { // create object for each show containing id, name, summary and image // refactor with ma
    let show = {
      id: eachShow.show.id, 
      name: eachShow.show.name, 
      summary: eachShow.show.summary, 
      };
      show.image = (eachShow.show.image !== null) ? eachShow.show.image.original : noImage;// could be a ternary operator
      return show;
      // console.log(obj);
     // add object to array to return
  });
  // console.log(searchesByTerm);
  // let firstShow = searchesByTerm[0].show;
  // console.log(firstShow.id);
  // console.log(firstShow.id, firstShow.name, firstShow.summary, firstShow.image.original);
  return shows;
    // {
    //   id: 1767,
    //   name: "The Bletchley Circle",
    //   summary:
    //     `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
    //        women with extraordinary skills that helped to end World War II.</p>
    //      <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
    //        normal lives, modestly setting aside the part they played in 
    //        producing crucial intelligence, which helped the Allies to victory 
    //        and shortened the war. When Susan discovers a hidden code behind an
    //        unsolved murder she is met by skepticism from the police. She 
    //        quickly realises she can only begin to crack the murders and bring
    //        the culprit to justice with her former friends.</p>`,
    //   image:
    //       "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
    // }
}
/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);
    $showsList.append($show);  }
}
/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});
/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  let episodesResponse = await axios.get(`${episodesAPI}shows/${id}/episodes`); // get all of the shows that match user's search
  // return episodesData.data.map((episodeData) => { // create object for each show containing id, name, summary and image
  //   // console.log(episode);
  //   let episode = {
  //     id: episodeData.id, 
  //     name: episodeData.name, 
  //     season: episodeData.season,
  //     number: episodeData.number,
  //   }
  //   return episode;
  // });
  return episodesResponse.data.map(({id, name, season, number}) => ( // create object for each show containing id, name, summary and image
    // console.log(episode);
    {
      id, 
      name,
      season,
      number
    }
    ));
}

/** Given list of episodes, create markup for each and add to DOM */
function populateEpisodes(episodes) {
  $('#episodesList').empty();
  for (let episode of episodes) {
    let $episode = $(`<li> ${episode.name} (season ${episode.season}, number ${episode.number})</li>`);
    $('#episodesList').append($episode);
  }
  $episodesArea.show(); 
}

/** gets list of episodes for the selected show and updates the DOM */
async function getAndShowEpisodes (e) {
  let id = $(e.target).closest('.Show').data('show-id');
  let listOfEpisodes= await getEpisodesOfShow(id);
  populateEpisodes(listOfEpisodes);
}

$showsList.on('click', '.Show-getEpisodes', getAndShowEpisodes)
