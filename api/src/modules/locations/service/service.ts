import * as repo from "../repository/repository";

export class LocationService {
  locationRepository = new repo.LocationRepository();
  async listLocations() {
    return this.locationRepository.getAllLocations();
  }

  async addLocation(name: string) {
    return this.locationRepository.createLocation(name);
  }

  async getLocationById(id: string) {
    return this.locationRepository.getLocationById(id);
  }

  async updateLocation(id: string, name: string) {
    return this.locationRepository.updateLocation(id, name);
  }

  async deleteLocation(id: string) {
    return this.locationRepository.deleteLocation(id);
  }
}
