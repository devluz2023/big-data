import {inject} from '@loopback/core';
import {get, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {ClassificacaoOrcamentaria} from '../models';
import {ClassificacaoOrcamentariaService} from '../services';

export class ClassificacaoOrcamentariaController {
  constructor(
    @inject('services.ClassificacaoOrcamentariaService')
    public classificacaoService: ClassificacaoOrcamentariaService,
  ) { }

  @post('/classificacoes-orcamentarias')
  @response(200, {
    description: 'ClassificacaoOrcamentaria model instance',
    content: {'application/json': {schema: getModelSchemaRef(ClassificacaoOrcamentaria)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ClassificacaoOrcamentaria, {
            title: 'NewClassificacaoOrcamentaria',
            exclude: ['id'],
          }),
        },
      },
    })
    classificacaoOrcamentaria: Omit<ClassificacaoOrcamentaria, 'id'>,
  ): Promise<ClassificacaoOrcamentaria> {
    return this.classificacaoService.criarClassificacao(classificacaoOrcamentaria);
  }

  @get('/classificacoes-orcamentarias')
  @response(200, {
    description: 'Array of ClassificacaoOrcamentaria model instances',
  })
  async find(): Promise<ClassificacaoOrcamentaria[]> {
    return this.classificacaoService.listarTodas();
  }
}
