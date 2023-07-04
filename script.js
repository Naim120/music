const music = document.querySelector('.music');
const audioSource = document.querySelector('audio');
const listOfAlbums = document.createElement('div');
const runningSongTitle = document.querySelector('.running-song-title');
const songListHeader = showHeaderUI('List of Songs', 'songs-close-btn');
const albumListHeader = showHeaderUI('List of Albums', 'album-close-btn');
let listOfSongs = null;

const sourceUrl =
  'https://cheap-spotify.pages.dev/';

const imgSrcUrl =
  'https://github.com/eloi700/JavaScript-100-Days/tree/6258973405ae4546eb0912a449c0d6ce9177b4b0/DATA-MUSIC/album-imgs/';

// Album Tracks UI Container
const albumTracks = document.createElement('div');
albumTracks.classList.add('album-tracks');
music.appendChild(albumTracks);

// Header UI
function showHeaderUI(headerText, buttonClass) {
  const albumTrackHeader = document.createElement('div');
  albumTrackHeader.classList.add('album-track-header');
  albumTrackHeader.innerHTML = `
      <h2 class="album-text-title">${headerText}</h2>
      <button class="${buttonClass}"><i class="fa-solid fa-x"></i></button>
    `;
  // Return to append in album & track accordingly
  return albumTrackHeader;
}

// Fetch Albums
const fetchAlbums = async () => {
  const response = await fetch(`https://cdn.jsdelivr.net/gh/eloi700/JavaScript-100-Days@6258973405ae4546eb0912a449c0d6ce9177b4b0/DATA-MUSIC/albums.json`);
  const { albums } = await response.json();
  albumsUI(albums);
};

fetchAlbums();

const fetchSongs = async (albumId) => {
  const response = await fetch(`${sourceUrl}${albumId}.json`);
  const { songs } = await response.json();
  songsUI(songs);
  addlBtns(songs);
};

// ========= ALBUMS UI =============
function albumsUI(albums) {
  // Header for list of albums
  listOfAlbums.classList.add('hide');
  listOfAlbums.appendChild(albumListHeader);

  // List of Albums
  listOfAlbums.classList.add('list-of-albums');
  albumTracks.appendChild(listOfAlbums);

  albums.forEach((album) => {
    const { id, name, artist, source, license } = album;
    const albumElement = document.createElement('div');
    albumElement.classList.add('album');
    albumElement.innerHTML = `
      <p class="name text">Album Name: ${name}</p>
      <p class="artist text">Artist: ${artist}</p>
      <p class="source text">Source: ${source}</p>
      <p class="license text">License: ${license}</p>
    `;

    albumElement.addEventListener('click', async () => {
      // Handle album click event
      listOfAlbums.classList.add('hide');
      await fetchSongs(id);

      // Fetch album image
      const albumImgUrl = `${imgSrcUrl}/${id}.jpg`;
      const albumImgElement = document.querySelector('.album_img');
      albumImgElement.src = albumImgUrl;
      albumImgElement.alt = name;
      document.querySelector('.album_title').textContent = name;
      document.querySelector('.artist').textContent = artist;
    });
    listOfAlbums.appendChild(albumElement);
  });
}

// ======= ALBUMS & TRACKS CONTAINER UI ==================
function songsUI(songs) {
  if (listOfSongs) {
    albumTracks.removeChild(listOfSongs);
  }
  listOfSongs = document.createElement('div');

  // HIDE List of Songs
  listOfSongs.classList.add('list-of-songs');
  albumTracks.appendChild(listOfSongs);

  // HEADER for List of Songs
  listOfSongs.appendChild(songListHeader);

  // =====CLOSE BUTTON FROM LIST OF SONGS=========
  const songsCloseBtn = songListHeader.querySelector('.songs-close-btn');
  songsCloseBtn.addEventListener('click', () => {
    listOfSongs.classList.add('hide');
  });

  // ======= SONGS UI=============
  const songsContainer = document.createElement('div');
  songsContainer.classList.add('songs-container');
  listOfSongs.appendChild(songsContainer);

  const songsUl = document.createElement('ul');
  songsUl.classList.add('songs-ul');
  songsContainer.appendChild(songsUl);

  // Iterate over the songs and create list items for each song
  for (const song of songs) {
    const songTitle = document.createElement('li');
    songTitle.classList.add('song-name');
    songTitle.textContent = song.songName;

    songTitle.addEventListener('click', () => {
      audioSource.src = `${sourceUrl}${song.audioLink}`;

      // Remove active class from all song titles
      const songTitles = document.querySelectorAll('.song-name');
      songTitles.forEach((title) => title.classList.remove('active'));

      // Add active class to the clicked song title
      songTitle.classList.add('active');

      // Update the running song title
      runningSongTitle.textContent = song.songName;
    });

    songsUl.appendChild(songTitle);
  }

  // Append the audio element to the songsContainer
  songsContainer.appendChild(songsUl);
}

// ==========PREVIOUS BUTTON ===============
function addlBtns(songs) {
  const prevBtn = document.querySelector('.prev');
  prevBtn.addEventListener('click', () => {
    const songTitles = document.querySelectorAll('.song-name');
    const activeSongIndex = Array.from(songTitles).findIndex((title) =>
      title.classList.contains('active')
    );
    const prevSongIndex =
      (activeSongIndex - 1 + songTitles.length) % songTitles.length;
    const prevSongTitle = songTitles[prevSongIndex];
    const prevSong = songs[prevSongIndex];

    audioSource.src = `${sourceUrl}${prevSong.audioLink}`;

    songTitles.forEach((title) => title.classList.remove('active'));
    prevSongTitle.classList.add('active');

    runningSongTitle.textContent = prevSong.songName;

    // Play the prev song automatically
    audioSource.play();
  });

  // ==========NEXT BUTTON ===============
  const nextBtn = document.querySelector('.next');
  nextBtn.addEventListener('click', () => {
    const songTitles = document.querySelectorAll('.song-name');
    const activeSongIndex = Array.from(songTitles).findIndex((title) =>
      title.classList.contains('active')
    );
    const nextSongIndex = (activeSongIndex + 1) % songTitles.length;
    const nextSongTitle = songTitles[nextSongIndex];
    const nextSong = songs[nextSongIndex];

    audioSource.src = `${sourceUrl}${nextSong.audioLink}`;

    songTitles.forEach((title) => title.classList.remove('active'));
    nextSongTitle.classList.add('active');

    runningSongTitle.textContent = nextSong.songName;

    // Play the next song automatically
    audioSource.play();
  });

  // ==========SHUFFLE BUTTON ===============
  const shuffleBtn = document.querySelector('.shuffle');
  shuffleBtn.addEventListener('click', () => {
    const songTitles = document.querySelectorAll('.song-name');
    const activeSongIndex = Array.from(songTitles).findIndex((title) =>
      title.classList.contains('active')
    );
    const shuffledSongIndex = Math.floor(Math.random() * songTitles.length);
    const shuffledSongTitle = songTitles[shuffledSongIndex];
    const shuffledSong = songs[shuffledSongIndex];

    audioSource.src = `${sourceUrl}${shuffledSong.audioLink}`;
    songTitles.forEach((title) => title.classList.remove('active'));
    shuffledSongTitle.classList.add('active');

    runningSongTitle.textContent = shuffledSong.songName;
  });
}

// ==========MENU BUTTON -> SHOW THE ALBUM===============
const menuBtn = document.querySelector('.menu-btn');
menuBtn.addEventListener('click', () => listOfAlbums.classList.remove('hide'));

// ==========CLOSE BUTTON FROM LIST OF ALBUMS===============
const albumCloseBtn = albumListHeader.querySelector('.album-close-btn');
albumCloseBtn.addEventListener('click', () => {
  listOfAlbums.classList.add('hide');
});

// Audio Ended Event
audioSource.addEventListener('ended', () => {
  document.querySelector('.next').click();
  audioSource.play();
});
