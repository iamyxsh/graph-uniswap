import { Field, ObjectType } from '@nestjs/graphql';
import { EXCHANGE_TYPE } from '../constants';

@ObjectType()
export class Token {
  @Field()
  address: string;
  @Field()
  pricePerToken: string;
  @Field()
  balance: string;
  @Field()
  decimals: number;
  @Field()
  symbol: string;
  @Field()
  name: string;
  @Field()
  balancePrice: string;
  @Field()
  exchange: EXCHANGE_TYPE;

  constructor(
    address: string,
    price: string,
    balance: string,
    decimals: number,
    symbol: string,
    name: string,
    usdcPrice: string,
    exchange: EXCHANGE_TYPE,
  ) {
    this.pricePerToken = price;
    this.address = address;
    this.balance = balance;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    this.balancePrice = usdcPrice;
    this.exchange = exchange;
  }
}

export interface UniswapToken {
  id: string;
  derivedETH: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface CurveToken {
  id: string;
  lastPriceUSD: string;
  symbol: string;
  name: string;
  decimals: number;
}
