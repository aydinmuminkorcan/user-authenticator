<p align="center"><img src="./public/img/lock.png" height="60"/></p>
<h1 align="center">User Authenticator</h1>
<p align="center">Make yourself trusted!</p>

This simple project illustrates the scenarios of Sign In / Sign Up process for a web application with a fully responsive UI. It can be used as a subsystem or template for the projects which need user authentication.
<br>

## Prerequisites

* ___NodeJS and related command line tools___: You need to install the latest version  of NodeJS runtime before you do anything. It can be installed in various ways, but we recommend to install it via nvm (Node Version Manager) a bash script used to manage multiple released Node.js versions. To install nvm, apply the instructions on https://github.com/nvm-sh/nvm#install--update-script. Then, type to check
  
    ```
    nvm --version
    ```
    You may list the versions available for installation
    ```
    nvm ls-remote
    ```
    and install one or more of them by 

    ```
    nvm install <version-of-nodejs>
    ```
    Then check if it worked 

    ```
    node --version
    npm  --version
    ```
    Finally, you can pick one of the installed versions by
    ```
    nvm use <version-of-nodejs>
    ```    
* ___Mongodb___: Install mongodb by the help of [this guide](https://docs.mongodb.com/manual/installation/) or simply 
  download and add its bin directory to your system's $PATH environment variable. Run the following to start mongodb server:
  ```
  mongod --dbpath <directory-path-to-store-actual-data>
  ```
  Note: For the production environment, you need to create [a mongodb cloud account](https://www.mongodb.com/cloud/atlas) if you do not have and initialize a database there by following these steps:

  - Click the green **Get started free** button
  - Fill in your information then hit **Get started free**
  - You will be redirected to Create New Cluster page.
  - Select a **Cloud Provider and Region** (such as AWS and a free tier region)
  - Select cluster Tier to Free forever **Shared** Cluster
  - Give Cluster a name (default: Cluster0)
  - Click on green **Create Cluster button**
  - Now, to access your database you need to create a DB user. To create a new MongoDB user, from the **Clusters view**, select the **Security tab**
  - Under the **MongoDB Users** tab, click on **+Add New User**
  - Fill in a username and password and give it either **Atlas Admin** User Privilege
  - Next, you will need to create an IP address whitelist and obtain the connection URI. In the Clusters view, under the cluster details (i.e. SANDBOX - Cluster0), click on the **CONNECT** button.
  - Under section **(1) Check the IP Whitelist**, click on **ALLOW ACCESS FROM ANYWHERE**. The form will add a field with `0.0.0.0/0`.  Click **SAVE** to save the `0.0.0.0/0` whitelist.
  - Under section **(2) Choose a connection method**, click on **Connect Your Application**
  - In the new screen, select **Node.js** as Driver and version **3.6 or later**.
  - Save the URI connection string to be used later for MONGODB_URI environment variable of production. 


* ___Google Credentials___: Get your google __client ID__ and __client secret__ from [google console page](https://console.developers.google.com/) by the following steps, later you will use them while sign in with google
  
  1. From the project drop-down, select an existing project, or create a new one by selecting __Create a new project__
  
      ![alt text](./public/img/1.png)

  2. In the sidebar under "APIs & Services", select __Credentials__
   
      ![alt text](./public/img/2.png)


  3. In Credentials tab, select the Create credentials drop-down list, and choose __OAuth client ID__.
   
     ![alt text](./public/img/3.png)

  4. Under Application type, select __Web application__, give a name whatever you want, and add your domain to __Authorized Javascript Origin__. (For the development environment, localhost is ok). In __Authorized redirect URI__ use http://localhost:3000/users/auth/google/callback
  . Then click __Create__ button. 

     ![alt text](./public/img/4.png)

  5. Copy or download the credentials JSON file by clicking on the download button.
   
      _Note_: When you run this app in the development environment, you will come across the following screen because of not using https, but this will not be the case in the production environment as Heroku itself publishes apps via https. Thus, for now, simply click on show advance and then click on Go to 'your app name'(unsafe) and allow it.

      ![alt text](./public/img/5.png)
 
 * ___Github Credentials___: Get your github __client ID__ and __client secret__  by creating a new oauth app on [developer settings page](https://github.com/settings/developers)
    
    1. Click on New Oauth App button
    
        ![alt text](./public/img/6.png)
    
    2. Fill the form and register application.
   
        ![alt text](./public/img/7.png)

        Then, save client id and secret to be used later for environment variables

        _Note_: You will need to update authorization callback url for different environments since the url will be changed

 * ___Heroku___: Create a [heroku](https://www.heroku.com/) account if you do not have.
   
## Installing
Clone the repository : 

```
git clone https://github.com/aydinmuminkorcan/user.git
``` 
or using ssh 

```
git clone git@github.com:aydinmuminkorcan/user.git
``` 
After cloning the repository, install dependencies by :

```
npm install
```

Then open an empty file named .env and set environment variables like that

```
NODE_ENV = development
PORT = 3000
MONGODB_URI = <your mongodb uri>
GOOGLE_CLIENT_ID = <your GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET = <your GOOGLE_CLIENT_ID>
GOOGLE_REDIRECT_URI = 'http://localhost:3000/users/auth/google/callback'
GITHUB_CLIENT_ID = <your GITHUB_CLIENT_ID>
GITHUB_CLIENT_SECRET = <your GITHUB_CLIENT_ID>
GITHUB_REDIRECT_URI = 'http://localhost:3000/users/auth/github/callback'
```

Finally, for the development environment run:

```
npm run dev
```

Here we go! Open a web browser and go to http://localhost:3000 and authenticate yourself.

## Running the tests
Run the tests by:

```
npm run test
```

### Coding style tests
Make sure you formatted the code and checked for coding style rules before commit and fix errors if any

```
npm run format
npm run lint
```

## Deployment
Deploy the app on heroku by using the following button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/aydinmuminkorcan/user-authenticator)

Alternatively, you can deploy manually from your terminal by installing [heroku toolbelt](https://toolbelt.heroku.com/)
    
  1. Enter your heroku credentials by 
   
        ```
        heroku login
        ```
  2. Create a heroku app by running the following command from the app directory:
   
        ```
        heroku create
        ```
  3. Then, set the different environment variables by:
        ```
        heroku config:set <key>=<value> 
        ```
  4. Finally, 
        ```
        git push heroku master
        ```
## Built With
* [Express](https://expressjs.com/) - The web framework used
* [npm](https://docs.npmjs.com/) - Dependency Management
* [Mongodb](https://www.mongodb.com/) - Database to store user information
* [Bootstrap](https://getbootstrap.com/) - UI framework 
  

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/aydinmuminkorcan/user-authenticator/tags). 

## Authors

* **Mumin Korcan Aydin** - *Initial work* - [aydinmuminkorcan](https://github.com/aydinmuminkorcan)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

[![Stargazers repo roster for @aydinmuminkorcan/user-authenticator](https://reporoster.com/stars/aydinmuminkorcan/user-authenticator)](https://github.com/aydinmuminkorcan/user-authenticator/stargazers)


[![Forkers repo roster for @aydinmuminkorcan/user-authenticator](https://reporoster.com/forks/aydinmuminkorcan/user-authenticator)](https://github.com/aydinmuminkorcan/user-authenticator/network/members)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
