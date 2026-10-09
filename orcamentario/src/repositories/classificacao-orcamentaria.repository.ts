import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {OrcamentarioDataSource} from '../datasources';
import {ClassificacaoOrcamentaria, ClassificacaoOrcamentariaRelations} from '../models';

export class ClassificacaoOrcamentariaRepository extends DefaultCrudRepository<
  ClassificacaoOrcamentaria,
  typeof ClassificacaoOrcamentaria.prototype.id,
  ClassificacaoOrcamentariaRelations
> {
  constructor(
    @inject('datasources.orcamentario') dataSource: OrcamentarioDataSource,
  ) {
    super(ClassificacaoOrcamentaria, dataSource);
  }
}