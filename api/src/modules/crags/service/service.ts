import {
  CreateCragBody,
  UpdateCragBody,
} from "../../../db/schemas/crags/CragsSchema";
import * as repo from "../repository/repository";

export class CragService {
  cragRepository = new repo.CragRepository();

  async listCrags() {
    return this.cragRepository.getAllCrags();
  }

  async addCrag(data: CreateCragBody) {
    return this.cragRepository.createCrag(data);
  }

  async getCragById(id: string) {
    return this.cragRepository.getCragById(id);
  }

  async updateCrag(id: string, data: UpdateCragBody) {
    return this.cragRepository.updateCrag(id, data);
  }

  async deleteCrag(id: string) {
    return this.cragRepository.deleteCrag(id);
  }
}
