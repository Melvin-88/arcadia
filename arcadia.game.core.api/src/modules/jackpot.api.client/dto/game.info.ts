import { CurrencyData } from './currency.data';
import { FundingDetails } from './funding.details';

export class GameInfo {
  gameDetails: any;
  recurrenceDetails: any;
  fundingDetails: FundingDetails;
  currenciesDetails: { currencies: CurrencyData[] };
  controlGroupDetails: any;
  strategiesDetails: any;
}