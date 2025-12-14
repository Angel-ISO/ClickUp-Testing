import BaseApiService from "./baseApiService";

class ViewApiService extends BaseApiService {

    async getView(teamId){
        return this.makeRequest('GET', `/team/${teamId}/view`);
    }

}

export default new ViewApiService();

export { ViewApiService };