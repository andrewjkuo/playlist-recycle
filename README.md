# Spotify Playlist Recycling Plant

Don't send your old playlists to landfill! The **Spotify Playlist Recycling Plant** is a sustainable solution that combs through your music library and generates new intelligent playlists based on a few user inputs.

If you're anything like me, you've got thousands of songs floating around in a bunch of Spotify playlists with titles like "**GUD S0NGZ 2k18**". You know there are some forgotten gems in all that mess but it would take ages to find them...

At the heart of this tool is a custom algorithm that uses Spotify's **5000+** unique genres to identify similar artists. E.g. If you want to listen to some tracks that sound like The Stooges and The Ramones, just plug in those artists, adjust a few settings and your playlist will be ready before you can say "The KKK Took My Baby Away".

**Please Note**: This tool will only use tracks from your existing playlists and **DOES NOT** suggest new music. If this is functionality you are looking for, I would suggest using Spotify's recommendation algorithm. It's pretty good!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Future:
* Bugfix: handle edge case where all tracks are local
* Bugfix: handle edge case where only 1 track is imported
* Spotify rate limit handling
* Provide option to make output playlist private
* Remove songs from the output playlist directly in the app
