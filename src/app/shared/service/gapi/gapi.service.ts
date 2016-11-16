import {environment} from "../../../../environments/environment";

declare var gapi: { // FIXME: copied from authentication.service
  auth2: {init: any, getAuthInstance(): any},
  currentUser: any,
  load: any,
  client: any,
  signIn(): Promise<any>,
  signOut(): Promise<any>
};

export class GapiService {
  static MAIN_FUNCTION_NAME = 'main';
  static SCRIPT_ID = environment.scriptId;
  static DEVELOPER_EMAIL = environment.developerEmail;
  static HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  };

  constructor(protected _path) {
  };

  findAll(): Promise<any> {
    return this.makeApiCall(GapiService.HTTP_METHODS.GET, this._path, null);
  }

  create(item) {
    return this.makeApiCall(GapiService.HTTP_METHODS.POST, this._path, item);
  }

  read(id) {
    return this.makeApiCall(GapiService.HTTP_METHODS.GET, `${this._path}/${id}`, null);
  }

  update(id, item) {
    return this.makeApiCall(GapiService.HTTP_METHODS.PUT, `${this._path}/${id}`, item)
  }

  destroy(id) {
    return this.makeApiCall(GapiService.HTTP_METHODS.DELETE, `${this._path}/${id}`, null);
  }

  protected makeApiCall(method, path, payload) {
    return new Promise(function(resolve, reject) {
      let currentUserEmail = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();

      // Create execution request.
      var request = {
        "function": GapiService.MAIN_FUNCTION_NAME,
        parameters: [method, path, payload],
        // Use devMode if the current user is the developer
        devMode: currentUserEmail === GapiService.DEVELOPER_EMAIL
      };

      // Make the request.
      var op = gapi.client.request({
        'root': 'https://script.googleapis.com',
        'path': 'v1/scripts/' + GapiService.SCRIPT_ID + ':run',
        'method': 'POST',
        'body': request
      });

      // Log the results of the request.
      op.execute(function (resp) {
        if (resp.error && resp.error.status) {
          // The API encountered a problem before the script started executing.
          console.log('Error calling API: ' + JSON.stringify(resp, null, 2));
          reject(resp.error);
        }
        else if (resp.error) {
          // The API executed, but the script returned an error.
          let error = resp.error.details[0];
          console.log('Script error! Message: ' + error['errorMessage']);
          reject(error);
        }
        else {
          // Here, the function returns an array of strings.
          return resolve(resp.response.result);
        }
      });
    });
  }
}
