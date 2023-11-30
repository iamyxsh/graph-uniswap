import { Field, ObjectType } from '@nestjs/graphql';

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

  constructor(
    address: string,
    price: string,
    balance: string,
    decimals: number,
    symbol: string,
    name: string,
    usdcPrice: string,
  ) {
    this.pricePerToken = price;
    this.address = address;
    this.balance = balance;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    this.balancePrice = usdcPrice;
  }
}

export interface UniswapToken {
  id: string;
  derivedETH: string;
  symbol: string;
  name: string;
  decimals: number;
}
