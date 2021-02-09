# ABOUT THE SOLUTION
The solution presents a test to image API available at: http://69.87.218.194:3000/texttoimage (please see instructions on how to start server before testing it). The program first makes a POST request to projectnametor.p.rapidapi.com and gets a requested number of words. E.g.: frank fumbling fabulous famous flowery fine furtive fast frightened finger
Then, it makes a POST to img4me.p.rapidapi.com with body containing the above words and gets back a URL of the image containing the above words.
	
# QUICKSTART HELP
- Log into the server at : 69.87.218.194
- cd /root/rchaube/a1;
- npm run dev
- Then in a browser hit: http://69.87.218.194:3000/texttoimage