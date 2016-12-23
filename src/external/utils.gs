/**
 * Returns ID, name, and download url for each sheet in a folder.
 */
function getSheetsOfFolder(folder) {
  return getFilesArray(folder).map(function (sheet) {
    return getFileInformation(sheet);
  });
}

/**
 * Returns ID, name, and download url for each file.
 */
function getFileInformation(file) {
  var metadata = JSON.parse(file.getDescription() || '{"tags": []}')

  return {
    id: file.getId(),
    name: file.getName(),
    url: file.getUrl(),
    tags: metadata.tags
  }
}

function getSheetsOfSetlist(setlistFile) {
  var sheet = SpreadsheetApp.open(setlistFile).getActiveSheet();
  var values = sheet.getDataRange().getValues();
  return values.map(function(value) {
    var id = value[0];
    return getFileInformation(DriveApp.getFileById(id));
  });
}

/**
 * Returns ID, name, isRemovable, ZIP file download url, owner (email, name), and sheets of the setlist
 */
function getSetlistInformation(setlistFile) {
  return {
    id: setlistFile.getId(),
    name: setlistFile.getName(),
    dateCreated: setlistFile.getDateCreated().toISOString(),
    lastUpdated: setlistFile.getLastUpdated().toISOString(),
    isRemovable: userIsCurrentlyLoggedIn(setlistFile.getOwner().getEmail()),
    zipFileLink: getFileByName(zipsFolder, setlistFile.getName() + ".zip").getUrl(),
    owner: {
      email: setlistFile.getOwner().getEmail(),
      name: setlistFile.getOwner().getName()
    },
    sheets: getSheetsOfSetlist(setlistFile)
  };
}

/**
 * Writes the IDs of the sheets array to the spreadsheet.
 * Returns an array with all the files.
 */
function writeSheetsToSpreadsheet(spreadsheet, sheets) {
  spreadsheet.clearContents();

  return sheets.map(function(sheet) {
    var id = sheet.id;
    spreadsheet.appendRow([id]);
    return DriveApp.getFileById(id);
  });
}

/**
 * Iterates through the iterator and returns an array with all the items.
 */
function iteratorToArray(iterator) {
  var items = [];

  while (iterator.hasNext()) {
    var item = iterator.next();
    items.push(item);
  }

  return items;
}

/**
 * Returns all the files of a folder as an array.
 */
function getFilesArray(folder) {
  return iteratorToArray(folder.getFiles());
}

/**
 * Returns all the folders of a folder as an array.
 */
function getFoldersArray(folder) {
  return iteratorToArray(folder.getFolders());
}

/**
 * Adds every file (in folder and subfolders) to the sheetsArray.
 */
function getFilesRecursively(folder, sheetsArray) {
  getFoldersArray(folder).map(function(folderChild) {
    getFilesRecursively(folderChild, sheetsArray);
  });

  sheetsArray.push.apply(sheetsArray, getFilesArray(folder));
}

function folderHasFile(folder, fileName) {
  return folder.getFilesByName(fileName).hasNext();
}

function getContent(file) {
  return parseJSON(file.getBlob().getDataAsString())
}

function getFileByName(folder, fileName) {
  return folder.getFilesByName(fileName).next();
}

function removeFileById(id) {
  Drive.Files.remove(id);
}

function removeFileFromFolderByName(folder, fileName) {
  var file = getFileByName(folder, fileName);
  folder.removeFile(file);
  removeFileById(file.getId());
}

function createZipWithFiles(filesArray) {
  var blobs = filesArray.map(function(sheet, index) {
    var blob = sheet.getBlob();
    blob.setName(addTrailingZerosToNumber(index + 1) + " " + blob.getName());
    return blob;
  });
  var blobsZipped = Utilities.zip(blobs);

  return blobsZipped;
}

function saveZipToFolder(name, filesArray, folder) {
  var blobsZipped = createZipWithFiles(filesArray);
  var zipFile = folder.createFile(blobsZipped);
  zipFile.setName(name + ".zip");

  return zipFile;
}

function userIsCurrentlyLoggedIn(userEmail) {
  return (userEmail === Session.getEffectiveUser().getEmail());
}

function updateZipFile(id, blobsZipped) {
  return Drive.Files.update({mimeType: "application/zip"}, id, blobsZipped);
}

function addTrailingZerosToNumber(number) {
  var trailingZeros = "0000";
  return (trailingZeros + number).slice(-trailingZeros.length);
}
