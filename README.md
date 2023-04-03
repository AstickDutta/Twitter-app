Twitter web app
This is a simple Twitter web app built with Node.js, Express, and MongoDB. It allows users to create accounts, post tweets, follow/unfollow other users, like and retweet tweets, and search for tweets by keyword or hashtag.

Getting Started
To get started, follow these steps:

Clone the repository:  https://github.com/AstickDutta/Twitter-app.git master
Install dependencies: npm install
Create a .env file in the root directory and add the following environment variables:
MONGODB_URI: the URI for your MongoDB database
SESSION_SECRET: a secret string used to sign the session cookie
EMAIL_USERNAME: your Gmail username (for sending password reset emails)
EMAIL_PASSWORD: your Gmail password (for sending password reset emails)
Start the server: npm start
Navigate to http://localhost:3000 in your web browser
Usage
Authentication
To create an account, click the "Sign up" button on the home page and fill out the registration form.
To log in, click the "Log in" button on the home page and enter your email and password.
To log out, click the "Log out" button in the top navigation bar.
Profile
To view your profile, click the "Profile" button in the top navigation bar.
To edit your profile, click the "Edit profile" button on your profile page.
Tweets

To view a tweet, click on its title in the tweet list.
To like or unlike a tweet, click the heart icon next to the tweet.
To retweet or unretweet a tweet, click the retweet icon next to the tweet.
To reply to a tweet, click the reply icon next to the tweet and fill out the reply form.
Search
To search for tweets by keyword or hashtag, enter a search query in the search bar in the top navigation bar and press Enter.
Follow
To follow a user, click the "Follow" button on their profile page.
To unfollow a user, click the "Unfollow" button on their profile page.
Password reset
To reset your password, click the "Forgot password?" link on the login page and enter your email address. An email with instructions for resetting your password will be sent to you.
To reset your password, follow the instructions in the email you received and enter your new password in the password reset form.
Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
