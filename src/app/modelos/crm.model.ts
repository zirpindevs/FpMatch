export interface Candidato {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;

  situacionLaboral:
    | 'Desempleado'
    | 'Trabajando'
    | 'Estudiando';

  nivelFormativo: string;
  experiencia: string;
  horasExperiencia?: number;
  competencias: string[];
  interesesProfesionales: string[];
  provincia: string;
  observaciones: string;
}

export interface Curso {
  id: number;
  codigo: string;
  nombre: string;
  familiaProfesional: string;
  duracionHoras: number;
  competencias: string[];
  ocupacionesRelacionadas: string[];
  requisitos: string[];
  demandaLaboral: number;
}

export interface Recomendacion {
  candidatoId: number;
  cursoId: number;
  puntuacion: number;
  motivo: string;
}