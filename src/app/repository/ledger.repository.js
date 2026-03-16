import { ledgerModel } from "#models";

class LedgerRepository {
  static async createLedger(data, session) {
    return await ledgerModel.create(data, { session });
  }
}

export default LedgerRepository;
