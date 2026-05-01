CS208 Full Stack Final Project - Donut Shop Application
Name: Austin Hart
GitHub: https://github.com/austinhart258
Term: Spring 2026

Project Description --

This is my full-stack application for CS208, built with node.js. I built a web application for a small donut shop that allows users to view and order donuts online. The application uses Express for the backend and MariaDB (MySQL) for the database. This application includes multiple pages, server-side validation, pagination, and timestamp generation. Please read the following instructions carefully because some of the setup only needs to be done once.


1.) Install the Database --
To set up the database, run the install_db.sh script in the setup_scripts directory. This script will install MariaDB and start the server running. You only need to run this script once per Codespace.

./setup_scripts/install_db.sh


2.) Create the Database Tables
Create the initial tables by running the following command --

sudo mysql -u root -p < ./setup_scripts/create_demo_table.sql


3.) Install Dependencies
Install the required dependencies using npm --

npm install


4.) Run the Application
Start the application using the following command --

npm start


5.) Access the Application --

On Codespaces, you can access the application by forwarding port 3000. Open the forwarded port in your browser to view the application.


Design Decisions --

1.) Since the database didnt provide a built in timestamp field I decided to store the comment and timestamp together as a JSON string. Allowing me to meet the server-side timestamps requirement without changing the database structure

2.) Since the prompt gave leniency in how the timestamps were posted I decided to go with the 'time ago' approach.

3.) I made the comment section the 10 comment limit per page as instructed and chose to go with a prev/next navigation between pages though I wanted to add numbered pages that you could click through but I have another coding project I need to work on as well so I am forced to leave it as is for now and I might come back later to include that.

4.) The design is meant to look minimal, cozy, and modern as provided in the guidelines and is minimal to reflect the modern cozy design


Edge cases --

1.) Empty comment submissions/only whitespace is rejected by the server and the page reloads with the error message 'Something went wrong'.

2.) Comments longer than 200 characters are rejected and the same error message stated previously is thrown with the page reloading.

3.) If the database query fails the application doesn't crash (not tested dont quote me on this(parenthesis inside parenthesis i know but I just wrote the code hoping it works)) and instead renders the page with an error message

4.) Older comments stored before I added timestamps are assigned fallback timestamps in case of errors.

5.) If someone tried to hit the submit button more than once the button is already disabled after being clicked to prevent duplicate submissions


Challenges --

1.) I struggled with handling the timestamps as I didnt want to modify the database or sql so instead I stored it as a JSON object(javascript object since it was done in javascript code but you know sounds fancy).

2.) I also struggled with implementing the pagination as it required more than I thought it would and in the end I didnt add page numbers and instead opted for the next/prev version that is implemented

3.) Figuring out how to handle the comments and older comments to be formatted correctly with timestamps was a big one I spent most of my time as you can see by the challenged implementing most of the comment structure


Note -- I wanted to add code to have the nav header follow the page but in the end I got a bit lazy and I might come back to see if I cant do that since I think it would look cool to have it follow the page, including the image in the top left.


Citations --

Google (I used google for general debugging and inquiry about how to use code and if I couldnt remember certain syntax)
ChatGPT (I used ChatGPT to help with debugging and questions like how to import the montserrat and italianno fonts)
MDN Web Docs (For general inquiry about properties, syntax, etc.) Link-https://developer.mozilla.org/en-US/
