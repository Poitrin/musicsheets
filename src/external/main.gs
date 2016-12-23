var scriptProperties = PropertiesService.getScriptProperties();
var sheetsFolder = DriveApp.getFolderById(scriptProperties.getProperty('SHEETS_FOLDER_ID'));
var zipsFolder = DriveApp.getFolderById(scriptProperties.getProperty('ZIPS_FOLDER_ID'));
var setlistsFolder = DriveApp.getFolderById(scriptProperties.getProperty('SETLISTS_FOLDER_ID'));

var router = {
  sheets: {
    GET: function () {
      return getSheetsOfFolder(DriveApp.getFolderById(SHEETS_FOLDER_ID));
    }
  },

  'sheets/:id': {
    PUT: function (id, newSheet) {
      DriveApp.getFileById(id).setDescription(JSON.stringify({tags: newSheet.tags}))
    }
  },

  setlists: {
    GET: function () {
      return getFilesArray(setlistsFolder).map(function (setlist) {
        return getSetlistInformation(setlist);
      });
    },
    POST: function (setlistToCreate) {
      var spreadsheet = SpreadsheetApp.create(setlistToCreate.name);
      var spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
      setlistsFolder.addFile(spreadsheetFile);
      DriveApp.getRootFolder().removeFile(spreadsheetFile);

      var files = writeSheetsToSpreadsheet(spreadsheet.getActiveSheet(), setlistToCreate.sheets);
      var zipFile = saveZipToFolder(setlistToCreate.name, files, zipsFolder);
    }
  },

  'setlists/:id': {
    PUT: function (id, newSetlist) {
      var setlist = DriveApp.getFileById(id);
      var spreadsheet = SpreadsheetApp.open(setlist);

      var files = writeSheetsToSpreadsheet(spreadsheet.getActiveSheet(), newSetlist.sheets);

      // write changes to file and update ZIP
      var zipFile = getFileByName(zipsFolder, setlist.getName() + ".zip");
      updateZipFile(zipFile.getId(), createZipWithFiles(files));

      zipFile.setName(newSetlist.name + ".zip");
      setlist.setName(newSetlist.name);
    },
    DELETE: function (id) {
      var setlistToBeDeletedName = DriveApp.getFileById(id).getName();

      removeFileFromFolderByName(zipsFolder, setlistToBeDeletedName + ".zip");
      removeFileFromFolderByName(setlistsFolder, setlistToBeDeletedName);
    },

    download: {
      GET: function (id) {
        var zipFile = zipsFolder.getFilesByName(id).next();

        return zipFile.getUrl();
      }
    }
  }
};

function main(method, path, payload) {
  path = path.substring(1);
  var pathParts = path.split("/");

  switch (pathParts.length) {
    case 1:
      return router[path][method](payload);
      break;

    case 2:
      return router[pathParts[0] + '/:id'][method](pathParts[1], payload);
      break;

    case 3:
      return router[pathParts[0] + '/:id'][pathParts[2]][method](pathParts[1], payload);
      break;

    default:
      throw "UNKNOWN ROUTE";
  }
}


