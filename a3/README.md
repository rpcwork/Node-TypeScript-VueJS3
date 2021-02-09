# ABOUT THE SOLUTION
This web app is built using the Vue3 composition API, Vue3 components to page hits counter, Vuex store for local state management, Custom Hooks for native fetch API calls, Vue3 Suspense component to manage hiding on loading and Vue3 router with create web history mode.
When the web app is loaded into the browser, it uses the native Fetch calls to communicate with the API where the data related to page hits is stored. These page hits are retrieved and stored into the Vuex4 store. Then, the page increments the page hit in the Vue4 storeand displays it on the screen. 
As, Next and previous are clicked, native fetch calls are made to the API to increment the page hits as well as local calls are made to increment the page hits in the Vuex4 store. 
I had to create 3 pages to test that the back button is respected by the router history mode.
Kindly note that the API returns a hardcoded JSON for page hits so the counts for page hits will start at non-zero numbers.

	
# QUICKSTART HELP
- Log into the server at : 69.87.218.194 

- ##Start the API server 
- Make sure api server you started for question 1 is stopped.
- cd /root/rchaube/a3/api;
- npm run dev
- Hit this in a browser to make sure API is running: http://69.87.218.194:3000/getpagehits

- ##Start the APP server in another terminal, tmux or screen session 
- cd /root/rchaube/a3/vu3-ts-router
- npm run serve
- then in a browser, hit: http://69.87.218.194:8080/