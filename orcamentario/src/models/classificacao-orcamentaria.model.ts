import {Entity, model, property} from '@loopback/repository';

@model()
export class ClassificacaoOrcamentaria extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  codigo: string;

  @property({
    type: 'string',
    required: true,
  })
  nome: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo: string;

  constructor(data?: Partial<ClassificacaoOrcamentaria>) {
    super(data);
  }
}

export interface ClassificacaoOrcamentariaRelations {
  // describe navigational properties here
}

export type ClassificacaoOrcamentariaWithRelations = ClassificacaoOrcamentaria &
  ClassificacaoOrcamentariaRelations;