import type { IInstrumentRepository } from "@domains/repositories";
import type {
  Instrument,
  InstrumentCreate,
  InstrumentInfo,
} from "@entities/instrument";

export interface IInstrumentDomain {
  save: (instrument: InstrumentCreate) => Promise<string>;
  list: () => Promise<InstrumentInfo[]>;
  // TODO
  // get: (instrumentId: string) => Promise<Instrument>;
  deleteMany: (instrumentIds: string[]) => Promise<void>;
}

class InstrumentDomain implements IInstrumentDomain {
  private readonly InstrumentRepository: IInstrumentRepository;

  constructor(instrumentRepository: IInstrumentRepository) {
    this.InstrumentRepository = instrumentRepository;
  }

  async save(instrument: InstrumentCreate) {
    if (instrument.id === undefined) {
      return this.InstrumentRepository.create(instrument);
    }

    await this.InstrumentRepository.update(instrument as Instrument);
    return instrument.id;
  }

  list(): Promise<InstrumentInfo[]> {
    return this.InstrumentRepository.list();
  }

  deleteMany(instrumentIds: string[]) {
    return this.InstrumentRepository.deleteMany(instrumentIds);
  }
}

export default InstrumentDomain;
