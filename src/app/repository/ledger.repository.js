import { ledgerModel } from "#models";

class LedgerRepository {
  static async createLedger(data, session) {
    const [ledger] = await ledgerModel.create([data], { session });
    return ledger;
  }
}

export default LedgerRepository;
