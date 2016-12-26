var router = {
  sheets: {
    GET: function (parameters) {
      var sheetsFolder = DriveApp.getFolderById(parameters.sheetsFolderId);
      return getSheetsOfFolder(sheetsFolder);
    }
  },

  'sheets/:id': {
    PUT: function (id, parameters, newSheet) {
      DriveApp.getFileById(id).setDescription(JSON.stringify({tags: newSheet.tags}))
    }
  },

  setlists: {
    GET: function (parameters) {
      var setlistsFolder = DriveApp.getFolderById(parameters.setlistsFolderId);
      var zipsFolder = DriveApp.getFolderById(parameters.zipsFolderId);

      return getFilesArray(setlistsFolder).map(function (setlist) {
        return getSetlistInformation(setlist, zipsFolder);
      });
    },
    POST: function (parameters, setlistToCreate) {
      var spreadsheet = SpreadsheetApp.create(setlistToCreate.name);
      var spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
      var setlistsFolder = DriveApp.getFolderById(parameters.setlistsFolderId);
      var zipsFolder = DriveApp.getFolderById(parameters.zipsFolderId);

      setlistsFolder.addFile(spreadsheetFile);
      DriveApp.getRootFolder().removeFile(spreadsheetFile);

      var files = writeSheetsToSpreadsheet(spreadsheet.getActiveSheet(), setlistToCreate.sheets);
      var zipFile = saveZipToFolder(setlistToCreate.name, files, zipsFolder);
    }
  },

  'setlists/:id': {
    PUT: function (id, parameters, newSetlist) {
      var setlist = DriveApp.getFileById(id);
      var spreadsheet = SpreadsheetApp.open(setlist);

      var files = writeSheetsToSpreadsheet(spreadsheet.getActiveSheet(), newSetlist.sheets);

      // write changes to file and update ZIP
      var zipsFolder = DriveApp.getFolderById(parameters.zipsFolderId);
      var zipFile = getFileByName(zipsFolder, setlist.getName() + ".zip");
      updateZipFile(zipFile.getId(), createZipWithFiles(files));

      zipFile.setName(newSetlist.name + ".zip");
      setlist.setName(newSetlist.name);
    },
    DELETE: function (id, parameters) {
      var setlistToBeDeletedName = DriveApp.getFileById(id).getName();

      removeFileFromFolderByName(DriveApp.getFolderById(parameters.zipsFolderId), setlistToBeDeletedName + ".zip");
      removeFileFromFolderByName(DriveApp.getFolderById(parameters.setlistsFolderId), setlistToBeDeletedName);
    }
  }
};

function main(method, path, payload) {
  var pathParts = path.split("?");
  path = pathParts[0];

  var parameters = {};
  pathParts[1].split("&").forEach(function(parameter) {
    var parts = parameter.split("=");
    parameters[parts[0]] = parts[1];
  });

  path = path.substring(1);
  var pathParts = path.split("/");

  switch (pathParts.length) {
    case 1:
      return router[path][method](parameters, payload);
      break;

    case 2:
      return router[pathParts[0] + '/:id'][method](pathParts[1], parameters, payload);
      break;

    case 3:
      return router[pathParts[0] + '/:id'][pathParts[2]][method](pathParts[1], parameters, payload);
      break;

    default:
      throw "UNKNOWN ROUTE";
  }
}
