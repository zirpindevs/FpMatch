import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';

export interface CentroAutorizado {
  nombre: string;
  codigoCentro: string;
  municipio: string;
  provincia: string;
  urlFuente: string;
}

export interface ConvocatoriaCurso {
  nombre: string;
  estado: string;
  horas: number | null;
  fechaFinSolicitud: string | null;
  inicioPrevisto: string | null;
  ubicacion: string | null;
  expediente: string;
  urlFuente: string;
}

export interface FuentesOficiales {
  fichaEspecialidad?: string;
  buscadorCentros?: string;
  buscadorCursos?: string;
}

export interface EspecialidadFormativa {
  id: string;
  codigo: string;
  nombre: string;
  familiaProfesional: string;
  familiaProfesionalNombre: string;
  duracionHoras: number | null;
  horasTeoricas?: number | null;
  horasPracticas?: number | null;
  certificado: string;
  centros: string;
  competencias: string[];
  ocupacionesRelacionadas: string[];
  requisitos: string[];
  centrosAutorizados?: CentroAutorizado[];
  cursosConvocados?: ConvocatoriaCurso[];
  fuentesOficiales?: FuentesOficiales;
  fechaConsulta?: string;
  estadoInvestigacion?: string;
  notaHoras?: string | null;
  demandaLaboral: number;
  fuenteDemanda: string;
}

interface EspecialidadJson extends Omit<EspecialidadFormativa, 'demandaLaboral' | 'fuenteDemanda' | 'familiaProfesionalNombre'> {
  demandaLaboral: number | null;
  fuenteDemanda: string;
}

interface TasaInsercionIECA {
  cursoAcademicoEgreso: string;
  familiaProfesionalIECA: string;
  medida: string;
  tiempoDesdeEgreso: string;
  trimestre: string;
  tasaInsercion: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImportacionCursosService {

  private readonly rutaCursos =
    'assets/datos/cursos-especialidades.json';
  private readonly rutaTasas =
    'assets/datos/tasas-insercion-ieca.json';

  private readonly categoriaIECAPorFamilia: Record<string, string> = {
    AD: 'NEGOCIOS, ADMINISTRACION Y DERECHO',
    AG: 'AGRICULTURA, GANADERIA, PESCA, SILVICULTURA Y VETERINARIA',
    AR: 'ARTES, HUMANIDADES Y LENGUAS',
    CO: 'NEGOCIOS, ADMINISTRACION Y DERECHO',
    HO: 'SERVICIOS',
    IF: 'TECNOLOGIAS DE LA INFORMACION Y LAS COMUNICACIONES (TIC)',
    SA: 'SALUD Y SERVICIOS SOCIALES',
    SE: 'SERVICIOS',
    SS: 'SALUD Y SERVICIOS SOCIALES'
  };

  private readonly nombrePorFamilia: Record<string, string> = {
    AD: 'Administración y gestión',
    AF: 'Actividades físicas y deportivas',
    AG: 'Agraria',
    AR: 'Artes gráficas',
    CO: 'Comercio y marketing',
    EL: 'Electricidad y electrónica',
    EN: 'Energía y agua',
    EO: 'Edificación y obra civil',
    FM: 'Fabricación mecánica',
    HO: 'Hostelería y turismo',
    IE: 'Industrias extractivas',
    IF: 'Informática y comunicaciones',
    IM: 'Instalación y mantenimiento',
    IN: 'Industrias alimentarias',
    MA: 'Madera, mueble y corcho',
    QU: 'Química',
    SA: 'Sanidad',
    SE: 'Seguridad y medio ambiente',
    SS: 'Servicios socioculturales y a la comunidad',
    TC: 'Textil, confección y piel',
    TM: 'Transporte y mantenimiento de vehículos',
    VI: 'Vidrio y cerámica'
  };

  constructor(private http: HttpClient) {}

  cargarEspecialidades():
    Observable<EspecialidadFormativa[]> {

    return forkJoin({
      especialidades: this.http.get<EspecialidadJson[]>(this.rutaCursos),
      tasas: this.http.get<TasaInsercionIECA[]>(this.rutaTasas)
    }).pipe(
      map(({ especialidades, tasas }) =>
        this.aplicarTasasInsercion(especialidades, tasas)
      )
    );
  }

  private aplicarTasasInsercion(
    especialidades: EspecialidadJson[],
    tasas: TasaInsercionIECA[]
  ): EspecialidadFormativa[] {
    const tasasRecientes = tasas.filter(tasa =>
      this.normalizar(tasa.cursoAcademicoEgreso) === 'CURSO 2023-2024' &&
      this.normalizar(tasa.tiempoDesdeEgreso) === 'ANO DE EGRESO + 3' &&
      this.normalizar(tasa.trimestre) === '3ER TRIMESTRE' &&
      this.normalizar(tasa.medida) === 'TASA DE INSERCION LABORAL TOTAL'
    );

    const tasasPorCategoria = new Map(
      tasasRecientes.map(tasa => [
        this.normalizar(tasa.familiaProfesionalIECA),
        tasa.tasaInsercion
      ])
    );
    const tasaTotal = tasasPorCategoria.get('TOTAL');

    if (tasaTotal === undefined) {
      throw new Error('No se encontró la tasa total de inserción IECA más reciente.');
    }

    return especialidades.map(especialidad => {
      const codigoFamilia = especialidad.familiaProfesional;
      const categoria =
        this.categoriaIECAPorFamilia[codigoFamilia] || 'TOTAL';
      const tasaCategoria = tasasPorCategoria.get(categoria);
      const tieneEquivalencia = tasaCategoria !== undefined;

      return {
        ...especialidad,
        familiaProfesionalNombre:
          this.nombrePorFamilia[codigoFamilia] || codigoFamilia,
        demandaLaboral: tieneEquivalencia ? tasaCategoria : tasaTotal,
        fuenteDemanda: tieneEquivalencia
          ? `IECA: ${categoria}`
          : 'IECA: total (familia sin equivalencia directa)'
      };
    });
  }

  private normalizar(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
  }
}