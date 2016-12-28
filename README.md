# MusicSheets app
This project helps members of a music band to…

* share their sheet music with other members via a common _Google Drive_ folder,
* create setlists (= Google Spreadsheets) _without_ copying the same sheet multiple times,
* download a setlist as a ZIP file, and share the link with others.



## User Interface
### List all setlists
![List all setlists](https://raw.github.com/Poitrin/musicsheets/master/doc/images/setlists.png)

### Create a new setlist
![Create a new setlist](https://raw.github.com/Poitrin/musicsheets/master/doc/images/create_setlist.png)

### List all sheets
![List all sheets](https://raw.github.com/Poitrin/musicsheets/master/doc/images/sheets.png)

## Installation
Clone the [`git` repo of this project](https://github.com/Poitrin/musicsheets).



### Frontend
#### Install dependencies
Install [Node.js](https://nodejs.org/en/download/current/).

Next, install [angular-cli](https://github.com/angular/angular-cli), which allows you to start the development server, create a build and run tests. Install it with the following command:
```
npm install -g angular-cli
```

Install the remaining dependencies:
```
cd /path/to/musicsheets/
npm install
```

#### Run the dev server
Start the dev server:
```
npm start
```
The client's dev server runs on `localhost:4200` (in `package.json`, you can configure the parameters of the `ng serve` command, e.g. `ng serve --host 127.0.0.1 --port 4200`). The app will automatically reload if you change any of the source files.

#### Create the project production build
You can also build the package (after having executed `npm install`).
```
npm run build
```
The build artifacts will be stored in the `dist/` directory.

### Backend / Google Apps Script (GAS)
The Frontend sends its requests to a _Google Apps Script_ (_GAS_).

Log in to your Google account and [create a new Google Apps Script (GAS)](https://script.google.com/macros/create).
In the GAS editor, create new _script files_ and paste the content from the corresponding files in `src/external/*.gs`. Don't forget to save.

Go to `src/environments/` and copy the `environment.ts-sample` twice. Rename one file `environment.ts`, and the other `environment.prod.ts`. Next, go to your Google Drive, create three new folders - _Setlists_, _Sheets_, and _Zips_ - and share them with everybody and a "Can Edit" access level. Open each folder and insert each folder's id from the browser's address bar (e.g. `https://drive.google.com/drive/u/1/folders/{HERE IS THE FOLDER ID}`) as the corresponding property (`sheets/setlists/zipsFolderId`) in the `environment...ts` files. This allows you to create different folders for different environments (development, production).

Back in the GAS editor, click `Publish > Deploy as API executable…`. Enter a name for the version (e.g. _V1_) and choose `Everybody` as the person who has access to the script. Note down the `Current API ID`, which we will call `scriptId`.
Next, hit `Deploy`. You can hit continue when a warning (_New scopes detected_) appears.

Update the `scriptId` and your `developerEmail` (that you used to log in to the GAS editor) in the environment files.

You'll need to create a `clientId`, in order to authenticate the user and execute the GAS.
[Open the Google Developers Console](https://console.developers.google.com/) and make sure you've selected the right project (create a new one, if needed).

Next, enable the `Google Apps Script Execution API` and the `Drive API` in the Google Developers Console: `Dashboard > Activate API > (Search for the two APIs) > Activate`. Otherwise, you’ll receive a "... API ... is disabled" error.

Click on `Credentials` (on the left), then the button `Create credentials > OAuth-Client-ID`. You'll need to enter a product name for the OAuth consent screen, if necessary.

Choose `Web application` as the application type and enter a name.
Add `http://localhost:4200` to the list of authorized JavaScript sources. In production, add your own domain. Otherwise, you'll receive a `redirect_uri_mismatch` error when you try to log in. It will take a while until the source is updated.
Copy the `clientId` and update the property in the environment files.

In order to avoid the "The caller does not have permission" error, make sure that your Console project is connected to the GAS. You can check this in the GAS editor, under `Resources > Developers Console Project...`

Every user who connects to the application the first time will have to confirm the needed permissions (show e-mail address, show basic profile information, etc.). In case you want to remove the permissions you gave, open the [Google Permissions Page](https://security.google.com/settings/security/permissions).

## Testing
### API testing with Postman
I decided to use [Postman](https://www.getpostman.com) to call and test the GAS API.

[Import the _Collection_](https://www.getpostman.com/docs/collections) and [the _Environment variables_](https://www.getpostman.com/docs/environments) from the corresponding files in `test/gas/`.

Next, update your environment variables by inserting the corresponding values (`scriptId`, `sheetsFolderId`, etc.). In order to get the `accessToken` value, you'll need to [authenticate via Postman](https://www.getpostman.com/docs/helpers) and insert the `access_token` as the corresponding environment variable.

For the authentication, you need to set Postman's Callback URL (`https://www.getpostman.com/oauth2/callback`) as an _Authorized redirect URI_ in the Google Developers Console (credentials of your OAuth Client ID). Insert the following values:

* __Auth URL:__ `https://accounts.google.com/o/oauth2/v2/auth`
* __Access Token URL:__ `https://www.googleapis.com/oauth2/v4/token`
* __Client ID and Client Secret:__ you can find them on the credentials page of your OAuth Client ID.
* __Scope:__ `https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email` (separated by spaces).
* __Grant Type__: Authorization Code

Unfortunately, Postman will need a new access token after 60 minutes. (I haven't found a way to use a refresh token and get a new access token via Postman.)

Please keep in mind that the tests depend on each other, so they have to be executed in the following order:

* Insert 8 sheet music files in your sheets folder.  
* `GET /sheets`  
  Test makes sure that 8 sheets are available.
* `PUT /sheets/:id {tags: [...]}`  
  Test makes sure that the first sheet's tags have been updated.
* `POST /setlists {...}`  
  Test makes sure that the created setlist has 3 sheets.
* `GET /setlists`  
  Test makes sure that 1 setlist is available.
* `PUT /setlists/:id {...}`  
  Test makes sure that the setlist has 5 sheets now.
* `DELETE /setlists/:id`

## Using _angular-cli_
### Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

### Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests
Before running the tests make sure you are serving the app via `ng serve`.
Then, run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 

## Further help
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Design decisions
### Saving setlists
1. Google Drive allows to save the same file in multiple folders, _without_ copying the files. You can do this with Google Apps Script, or [via the Drive web app, by choosing a file and hitting Shift+Z](https://productforums.google.com/forum/#!topic/drive/lf4fqed4n4k).

   Advantages:
   * The most "native" solution: we only have files and folders, no additional JSON/spreadsheet/… files.
   * `file.getParents()` could be used to list all setlists of a sheet.
   
   Disadvantages:
   * If the Drive user deletes a file in a folder, it is deleted in every other folder too.
   * The Drive Desktop client doesn’t support "linked files" and just creates a copy in every folder.
   * The order of the files (sheets) in a folder (setlist) can’t be specified.
1. 1 setlist = 1 JSON file.

   Disadvantages:
   * File structure could be damaged, and parsing errors could occur.
1. 1 setlist = Spreadsheet file.

   Advantages:
   * Database table-like structure.
   * No JSON parsing needed.
   
   Disadvantages:
   * Needs an additional OAuth permission.

### REST-inspired API calls
A method of a Google Apps Script can only be executed with a `POST` request. HTTP requests like `POST /setlists` are not possible. This is why the request body’s `parameters` contains an array with a HTTP method, a path, and the payload.
```JavaScript
var request = {
  "function": GapiService.MAIN_FUNCTION_NAME,
  parameters: [method, path, payload]
}
```
The following requests are possible at the moment:
* Sheets  
  `GET /sheets?sheetsFolderId=...&setlistsFolderId=...&zipsFolderId=...`  
  (parameters are hidden in the following examples)  
  `PUT /sheets/:id {tags: [...]}`
* Setlists  
  `GET /setlists`  
  `POST /setlists {...}`  
  `PUT /setlists/:id {...}`  
  `DELETE /setlists/:id`
  
#### Parameters
Initially, I planned the following URL schema:  
`GET /setlistsFolders/{setlistsFolderId}/setlists/{setlistId}`

However, this would have let to the following URL:  
`POST /setlistsFolders/{setlistsFolderId}/setlists/{setlistId}?zipsFolderId=...`.

In order to stay consistent, each parameter must be added at the end of the URL.

## To do / ideas
### Audio files
- [ ] Add audio file(s) to sheet
- [ ] A sheet can have multiple songs (different versions)
- [ ] An audio file can have multiple songs

### Lyrics
- [ ] Filter sheet lists by lyrics
- [ ] Use the lyrics of every sheet to create a Google Document which contains all the lyrics

### Author(s)
- [ ] Add an author to a sheet
- [ ] Filter sheet lists by author

### Filter and sorting
- [ ] "Hey Jude" and "Jude Hey" should display the same results
- [ ] Take into account abbreviations (e.g. Saint = St) for filter
- [ ] Ignore accents/Umlaute/etc. for filter
- [ ] Allow sorting of the setlists and sheets (name, last updated)

### Code / Invisible to the user
- [ ] Code: Add comments
- [ ] Code: Add tests (Front and Back)
- [ ] Backend (API) validation of list name

### Misc.
- [ ] Display a message that you need at least 1 sheet to create a list
- [ ] Find and handle multiple versions of the same sheet
- [ ] Add a language switch
- [ ] Get an overview over the list, instead of immediately editing it?
- [ ] Delete a setlist of someone else
- [ ] Add comments to the list
