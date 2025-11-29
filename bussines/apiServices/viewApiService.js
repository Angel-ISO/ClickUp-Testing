import BaseApiService from "./baseApiService";

class ViewApiService extends BaseApiService {

    async get_view(team_id){
        return this.make_request('GET', `/team/${team_id}/view`);
    }

}

export default new ViewApiService();

export { ViewApiService };