import type { IInstrumentRepository } from "@domains/repositories";
import type { Instrument, InstrumentInfo } from "@entities/instrument";

export interface IInstrumentDomain {
  save: (instrument: Instrument) => Promise<string>;
  list: () => Promise<InstrumentInfo[]>;
  // TODO
  // get: (instrumentId: string) => Promise<Instrument>;
  // deleteMany: (instrumentIds: string[]) => Promise<void>;
}

class InstrumentDomain implements IInstrumentDomain {
  private readonly InstrumentRepository: IInstrumentRepository;

  constructor(instrumentRepository: IInstrumentRepository) {
    this.InstrumentRepository = instrumentRepository;
  }

  async save(instrument: Instrument) {
    if (instrument.id === undefined) {
      return this.InstrumentRepository.create(instrument);
    }

    // TODO
    // await this.InstrumentRepository.update(instrument);
    return instrument.id;
  }

  list(): Promise<InstrumentInfo[]> {
    return this.InstrumentRepository.list();
  }
}

export default InstrumentDomain;
