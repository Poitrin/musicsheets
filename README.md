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
In the GAS editor, create new _script files_ and paste the content from the corresponding files in `/musicsheets/src/external/*.gs`.

Next, create three new folders (for _Setlists_, _Sheets_, and _Zips_). Open each folder and copy the `FOLDER_ID` from the browser's address bar (e.g. `https://drive.google.com/drive/u/1/folders/{HERE IS THE FOLDER_ID}`).
Insert the three `FOLDER_ID`s in the GAS project’s `main.gs` (the lines are at the beginning of the script).

Don't forget to save the GAS and move it to your favorite destination.

Go to `src/environments/` and copy the `environment.ts-sample` twice. Rename one `environment.ts`, and the other `environment.prod.ts`.

Next, copy the `FOLDER_ID` of the sheets folder and add the property `sheetsDriveFolderId: '{FOLDER_ID}'` to the `environment...ts` files in the `/src/environments/` folder.

Back in the GAS editor, click `Publish > Deploy as API executable…`. Enter a name for the version (e.g. _V1_) and choose `Everybody` as the person who has access to the script. Note down the `Current API ID`, which we will call `scriptId`.
Next, hit `Deploy`. You can hit continue when a warning (_New scopes detected_) appears.

Insert the `scriptId` and your `developerEmail` (that you used to log in) in the environment files.

You'll need to create a `clientId`, in order to authenticate the user and execute the GAS.
[Open the Google Developers Console](https://console.developers.google.com/) and make sure you've selected the right project (create a new one, if needed).

Don't forget to enable the `Google Apps Script Execution API` and the `Drive API` in the Google Developers Console: `Dashboard > Activate API > … Search for (Google Apps Script Execution|Drive) API … > Activate`. Otherwise, you’ll receive a "Google Apps Script Execution API ... is disabled" error.

Click on `Credentials` (on the left), then the button `Create credentials > OAuth-Client-ID`. You'll need to enter a product name for the OAuth consent screen, if necessary.

Choose `Web application` as the application type and enter a name.
Add `http://localhost:4200` to the list of authorized JavaScript sources. In production, this will be your own domain. Otherwise, you'll receive a `redirect_uri_mismatch` error. It will take a while until the source is updated.
Copy the `clientId` and insert the property into the environment files.

Your environment files should now look like this:
```JavaScript
export const environment = {
  production: false, // or true
  sheetsDriveFolderId: '...',
  clientId: '...',
  scriptId: '...',
  developerEmail: '...'
};
```

In order to avoid the "The caller does not have permission" error, make sure that your Console project is connected to the GAS. You can check this in the GAS editor, under `Resources > Developers Console Project...`

Every user who connects to the application the first time will have to confirm the needed permissions (show e-mail address, show basic profile information, etc.). In case you want to remove the permissions you gave, open the [Google Permissions Page](https://security.google.com/settings/security/permissions).

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
  `GET /sheets`  
  `PUT /sheets/:id {tags: [...]}`
* Setlists  
  `GET /setlists`  
  `POST /setlists {...}`  
  `PUT /setlists/:id {...}`  
  `DELETE /setlists/:id`
  

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
