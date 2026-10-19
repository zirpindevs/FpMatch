import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  EspecialidadFormativa,
  ImportacionCursosService
} from './servicios/importacion-cursos.service';
import { CrmService } from './servicios/crm.service';

import {
  Candidato,
  Curso,
  Recomendacion
} from './modelos/crm.model';

interface CursoCatalogo {
  id?: number | string;
  codigo: string;
  nombre: string;
  familiaProfesional: string;
  familiaProfesionalNombre?: string;
  duracionHoras: number | null;
  competencias: string[];
  ocupacionesRelacionadas: string[];
  requisitos: string[];
  demandaLaboral: number | null;
  fuenteDemanda?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  seccionActual = 'inicio';

  candidatos: Candidato[] = [];
  cursos: Curso[] = [];

  busquedaCandidato = '';
  busquedaCurso = '';

  candidatoSeleccionado: Candidato | null = null;

  nuevoCandidato: Candidato = this.crearCandidatoVacio();

  nuevoCurso: Curso = this.crearCursoVacio();

  mostrarFormularioCandidato = false;
  mostrarFormularioCurso = false;

  cursosImportados: EspecialidadFormativa[] = [];
  cargandoCursos = false;
  errorCursos = '';
  paginaActual = 1;
  readonly cursosPorPagina = 25;

  private readonly claveEspecialidadesEliminadas =
    'orienta_especialidades_eliminadas';

  constructor(
    private crmService: CrmService,
    private importacionCursos: ImportacionCursosService
  ) {
    this.cargarDatos();
  }

  ngOnInit(): void {
    this.cargarCursosDesdeJSON();
  }

  cargarDatos(): void {
    this.candidatos =
      this.crmService.obtenerCandidatos();

    this.cursos =
      this.crmService.obtenerCursos();
  }

  cargarCursosDesdeJSON(): void {
    this.cargandoCursos = true;
    this.errorCursos = '';

    this.importacionCursos
      .cargarEspecialidades()
      .subscribe({
        next: (datos) => {
          const codigosEliminados =
            this.obtenerCodigosEspecialidadEliminados();

          this.cursosImportados = datos.filter(
            curso => !codigosEliminados.has(curso.codigo)
          );
          this.cargandoCursos = false;
          this.cambiarPagina(1);
        },
        error: (error) => {
          console.error('Error al cargar los cursos y las tasas IECA:', error);

          this.errorCursos =
            'No se han podido cargar los cursos y las tasas de inserción.';

          this.cargandoCursos = false;
        }
      });
  }

  private obtenerCodigosEspecialidadEliminados(): Set<string> {
    return new Set(
      JSON.parse(
        localStorage.getItem(this.claveEspecialidadesEliminadas) || '[]'
      )
    );
  }

  get catalogoCursos(): CursoCatalogo[] {
    const catalogo = new Map<string, CursoCatalogo>();
    const especialidadesPorCodigo = new Map(
      this.cursosImportados.map(especialidad => [
        especialidad.codigo,
        especialidad
      ])
    );

    this.cursosImportados.forEach(curso => {
      catalogo.set(curso.codigo, curso);
    });

    this.cursos.forEach(curso => {
      const especialidad = especialidadesPorCodigo.get(curso.codigo);

      catalogo.set(
        curso.codigo,
        especialidad
          ? {
              ...curso,
              familiaProfesional:
                especialidad.familiaProfesionalNombre ||
                curso.familiaProfesional,
              familiaProfesionalNombre:
                especialidad.familiaProfesionalNombre,
              demandaLaboral: especialidad.demandaLaboral,
              fuenteDemanda: especialidad.fuenteDemanda
            }
          : curso
      );
    });

    return Array.from(catalogo.values());
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActual = seccion;
    this.candidatoSeleccionado = null;
  }

  crearCandidatoVacio(): Candidato {
    return {
      id: 0,
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      situacionLaboral: 'Desempleado',
      nivelFormativo: '',
      experiencia: '',
      competencias: [],
      interesesProfesionales: [],
      provincia: '',
      observaciones: ''
    };
  }

  crearCursoVacio(): Curso {
    return {
      id: 0,
      codigo: '',
      nombre: '',
      familiaProfesional: '',
      duracionHoras: 0,
      competencias: [],
      ocupacionesRelacionadas: [],
      requisitos: [],
      demandaLaboral: 50
    };
  }

  get candidatosFiltrados(): Candidato[] {
    const busqueda =
      this.busquedaCandidato.toLowerCase().trim();

    return this.candidatos.filter(candidato => {
      const texto = [
        candidato.nombre,
        candidato.apellidos,
        candidato.provincia,
        candidato.experiencia,
        candidato.situacionLaboral
      ].join(' ').toLowerCase();

      return texto.includes(busqueda);
    });
  }

  get cursosFiltrados(): CursoCatalogo[] {
    const busqueda =
      this.busquedaCurso.toLowerCase().trim();

    return this.catalogoCursos.filter(curso => {
      const texto = [
        curso.codigo,
        curso.nombre,
        curso.familiaProfesional,
        ...curso.ocupacionesRelacionadas
      ].join(' ').toLowerCase();

      return texto.includes(busqueda);
    });
  }

  get cursosPaginados(): CursoCatalogo[] {
    const inicio = (this.paginaActual - 1) * this.cursosPorPagina;

    return this.cursosFiltrados.slice(
      inicio,
      inicio + this.cursosPorPagina
    );
  }

  get totalPaginas(): number {
    return Math.max(
      1,
      Math.ceil(this.cursosFiltrados.length / this.cursosPorPagina)
    );
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = Math.min(
      Math.max(1, pagina),
      this.totalPaginas
    );
  }

  get candidatosDesempleados(): number {
    return this.candidatos.filter(
      c => c.situacionLaboral === 'Desempleado'
    ).length;
  }

  get cursosConDemandaAlta(): number {
    return this.cursos.filter(
      c => c.demandaLaboral >= 75
    ).length;
  }

  guardarCandidato(): void {
    if (
      !this.nuevoCandidato.nombre.trim() ||
      !this.nuevoCandidato.apellidos.trim()
    ) {
      alert('Introduce el nombre y los apellidos.');
      return;
    }

    this.crmService.agregarCandidato({
      ...this.nuevoCandidato,
      competencias: [...this.nuevoCandidato.competencias],
      interesesProfesionales: [
        ...this.nuevoCandidato.interesesProfesionales
      ]
    });

    this.cargarDatos();

    this.nuevoCandidato = this.crearCandidatoVacio();

    this.mostrarFormularioCandidato = false;
  }

  guardarCurso(): void {
    if (
      !this.nuevoCurso.nombre.trim() ||
      !this.nuevoCurso.codigo.trim()
    ) {
      alert('Introduce el nombre y el código del curso.');
      return;
    }

    this.crmService.agregarCurso({
      ...this.nuevoCurso,
      competencias: [...this.nuevoCurso.competencias],
      ocupacionesRelacionadas: [
        ...this.nuevoCurso.ocupacionesRelacionadas
      ],
      requisitos: [...this.nuevoCurso.requisitos]
    });

    this.cargarDatos();

    this.nuevoCurso = this.crearCursoVacio();

    this.mostrarFormularioCurso = false;
  }

  eliminarCandidato(candidato: Candidato): void {
    const confirmar = confirm(
      `¿Quieres eliminar a ${candidato.nombre} ${candidato.apellidos}?`
    );

    if (!confirmar) {
      return;
    }

    this.crmService.eliminarCandidato(candidato.id);

    this.cargarDatos();

    this.candidatoSeleccionado = null;
  }

  eliminarCurso(curso: CursoCatalogo): void {
    const confirmar = confirm(
      `¿Quieres eliminar el curso "${curso.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    const cursoGuardado = this.cursos.find(
      existente => existente.codigo === curso.codigo
    );

    if (cursoGuardado) {
      this.crmService.eliminarCurso(cursoGuardado.id);
    }

    if (this.cursosImportados.some(
      especialidad => especialidad.codigo === curso.codigo
    )) {
      const codigosEliminados =
        this.obtenerCodigosEspecialidadEliminados();

      codigosEliminados.add(curso.codigo);

      localStorage.setItem(
        this.claveEspecialidadesEliminadas,
        JSON.stringify(Array.from(codigosEliminados))
      );

      this.cursosImportados = this.cursosImportados.filter(
        especialidad => especialidad.codigo !== curso.codigo
      );
    }

    this.cargarDatos();
    this.cambiarPagina(this.paginaActual);
  }

  abrirFicha(candidato: Candidato): void {
    this.candidatoSeleccionado = candidato;
    this.seccionActual = 'ficha';
  }

  seleccionarCandidato(id: string): void {
    this.candidatoSeleccionado = this.candidatos.find(
      candidato => candidato.id === Number(id)
    ) || null;
  }

  obtenerRecomendaciones(
    candidato: Candidato
  ): Recomendacion[] {

    return this.cursos
      .map(curso => {

        const competenciasCandidato =
          candidato.competencias.map(c =>
            c.toLowerCase()
          );

        const interesesCandidato =
          candidato.interesesProfesionales.map(i =>
            i.toLowerCase()
          );

        const competenciasCoincidentes =
          curso.competencias.filter(competencia =>
            competenciasCandidato.some(c =>
              c.includes(competencia.toLowerCase()) ||
              competencia.toLowerCase().includes(c)
            )
          ).length;

        const interesesCoincidentes =
          interesesCandidato.some(interes =>
            curso.familiaProfesional
              .toLowerCase()
              .includes(interes)
          ) ||
          curso.ocupacionesRelacionadas.some(ocupacion =>
            interesesCandidato.some(interes =>
              ocupacion.toLowerCase().includes(interes)
            )
          );

        const puntuacionCompetencias =
          curso.competencias.length > 0
            ? Math.min(
                100,
                competenciasCoincidentes /
                curso.competencias.length * 100
              )
            : 0;

        const puntuacionIntereses =
          interesesCoincidentes ? 100 : 0;

        const puntuacion =
          curso.demandaLaboral * 0.30 +
          puntuacionCompetencias * 0.35 +
          puntuacionIntereses * 0.35;

        const motivo = interesesCoincidentes
          ? 'Coincide con sus intereses profesionales.'
          : competenciasCoincidentes > 0
            ? 'Aprovecha algunas de sus competencias actuales.'
            : 'Puede ampliar sus opciones profesionales; conviene revisar su encaje.';

        return {
          candidatoId: candidato.id,
          cursoId: curso.id,
          puntuacion: Math.round(puntuacion),
          motivo
        };
      })
      .sort((a, b) => b.puntuacion - a.puntuacion);
  }

  obtenerCursoPorId(id: number): Curso | undefined {
    return this.cursos.find(curso => curso.id === id);
  }

  obtenerNivelRecomendacion(puntuacion: number): string {
    if (puntuacion >= 75) {
      return 'Alta';
    }

    if (puntuacion >= 50) {
      return 'Media';
    }

    return 'Baja';
  }

  importarCatalogo(): void {

  this.importacionCursos
    .cargarEspecialidades()
    .subscribe({
      next: (especialidades) => {

        const codigosEliminados =
          this.obtenerCodigosEspecialidadEliminados();

        const cantidad =
          this.crmService.importarEspecialidades(
            especialidades.filter(
              especialidad => !codigosEliminados.has(especialidad.codigo)
            )
          );

        this.cargarDatos();
        this.cambiarPagina(this.paginaActual);

        alert(
          `Importación completada. ` +
          `Se han añadido ${cantidad} especialidades nuevas.`
        );
      },

      error: (error) => {
        console.error(
          'Error al importar las especialidades',
          error
        );

        alert(
          'No se ha podido cargar el catálogo formativo.'
        );
      }
    });
}

}
