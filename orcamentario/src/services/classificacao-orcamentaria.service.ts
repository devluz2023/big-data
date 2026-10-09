import {repository} from '@loopback/repository';
import {ClassificacaoOrcamentaria} from '../models';
import {ClassificacaoOrcamentariaRepository} from '../repositories';

export class ClassificacaoOrcamentariaService {
  constructor(
    @repository(ClassificacaoOrcamentariaRepository)
    public classificacaoOrcamentariaRepository: ClassificacaoOrcamentariaRepository,
  ) { }

  async criarClassificacao(dados: Omit<ClassificacaoOrcamentaria, 'id'>): Promise<ClassificacaoOrcamentaria> {
    // Aqui você pode adicionar regras de negócio, validações, logs, etc.
    return this.classificacaoOrcamentariaRepository.create(dados);
  }

  async listarTodas(): Promise<ClassificacaoOrcamentaria[]> {
    return this.classificacaoOrcamentariaRepository.find();
  }
}
