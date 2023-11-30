import { Module } from '@nestjs/common';
import { AppResolver } from './graphql.resolver';

@Module({
  providers: [AppResolver],
})
export class GraphqlModule {}
