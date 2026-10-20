import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  EspecialidadFormativa,
  ImportacionCursosService
} from './servicios/importacion-cursos.service';

interface PerfilSimulacion {
  nivelFormativo: string;
  familiaProfesional: string;
  cualificaciones: string;
  experiencia: string;
  horasExperiencia: number;
}

interface RecomendacionCurso {
  curso: EspecialidadFormativa;
  puntuacion: number;
  coincidencias: string[];
  motivo: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private readonly palabrasGenericas = new Set([
    'atencion', 'cliente', 'clientes', 'usuario', 'usuarios',
    'servicio', 'servicios', 'profesional', 'profesionales',
    'experiencia', 'trabajo', 'equipo', 'auxiliar', 'basico', 'basica',
    'curso', 'cursos', 'formacion', 'nivel', 'grado', 'certificado',
    'certificados', 'conocimientos', 'competencias'
  ]);

  private readonly equivalenciasCualificacion: Record<string, string[]> = {
    excel: ['administracion', 'contabilidad'],
    ofimatica: ['administracion', 'contabilidad'],
    word: ['administracion', 'ofimatica'],
    facturacion: ['contabilidad', 'administracion'],
    nominas: ['administracion', 'recursos humanos'],
    contable: ['contabilidad', 'administracion'],
    informatica: ['sistemas', 'microinformaticos', 'comunicaciones'],
    programacion: ['desarrollo', 'software', 'informatica'],
    redes: ['sistemas', 'comunicaciones', 'informatica'],
    ciberseguridad: ['seguridad', 'sistemas', 'informatica'],
    enfermeria: ['sanidad', 'sanitario', 'cuidados'],
    sanitario: ['sanidad', 'salud', 'cuidados'],
    cuidados: ['sanidad', 'sociosanitaria', 'dependencia'],
    farmacia: ['sanidad', 'farmaceutica'],
    cocina: ['hosteleria', 'alimentos', 'restauracion'],
    camarero: ['hosteleria', 'restauracion'],
    ventas: ['comercio', 'marketing', 'comercial'],
    comercial: ['comercio', 'marketing', 'ventas'],
    almacen: ['logistica', 'transporte', 'almacenamiento'],
    reparto: ['transporte', 'conduccion', 'logistica'],
    conduccion: ['transporte', 'vehiculos', 'conduccion'],
    electricidad: ['electrica', 'electrico', 'mantenimiento'],
    mecanica: ['mecanizado', 'fabricacion', 'mantenimiento'],
    soldadura: ['fabricacion', 'mecanica', 'metal'],
    agricultura: ['agraria', 'agricola', 'cultivos'],
    jardineria: ['agraria', 'jardineria', 'medioambiental'],
    limpieza: ['limpieza', 'ambiental', 'residuos'],
    docencia: ['educacion', 'docencia', 'sociocultural'],
    monitor: ['deportivas', 'sociocultural', 'educacion'],
    diseno: ['artes', 'grafico', 'diseno'],
    carpinteria: ['madera', 'mueble', 'carpinteria'],
    costura: ['textil', 'confeccion', 'piel'],
    quimica: ['quimica', 'laboratorio'],
    laboratorio: ['quimica', 'sanidad', 'laboratorio'],
    construccion: ['edificacion', 'obra', 'construccion'],
    fontaneria: ['energia', 'agua', 'instalacion'],
    peluqueria: ['imagen', 'personal', 'peluqueria'],
    turismo: ['hosteleria', 'turismo', 'alojamiento']
  };

  readonly nivelesFormativos = [
    'Sin estudios',
    'Educación primaria',
    'ESO',
    'Educación Secundaria para Personas Adultas (ESA/ESPA)',
    'Formación Profesional Básica',
    'Certificado profesional nivel 1',
    'Grado medio',
    'Bachillerato',
    'Certificado profesional nivel 2',
    'Grado superior',
    'Certificado profesional nivel 3',
    'Enseñanzas artísticas profesionales',
    'Enseñanzas deportivas',
    'Grado universitario',
    'Máster universitario',
    'Doctorado',
    'Otros'
  ];

  perfil: PerfilSimulacion = {
    nivelFormativo: '',
    familiaProfesional: '*',
    cualificaciones: '',
    experiencia: '',
    horasExperiencia: 0
  };

  cursos: EspecialidadFormativa[] = [];
  recomendaciones: RecomendacionCurso[] = [];
  fichaAbiertaCodigo: string | null = null;
  cargandoCursos = false;
  errorCursos = '';
  simulacionEnviada = false;

  constructor(private importacionCursos: ImportacionCursosService) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  get familiasProfesionales(): { codigo: string; nombre: string }[] {
    const familias = new Map<string, string>();

    this.cursos.forEach(curso => {
      familias.set(curso.familiaProfesional, curso.familiaProfesionalNombre);
    });

    return Array.from(familias, ([codigo, nombre]) => ({ codigo, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }

  get empleabilidadMedia(): number {
    const tasasPorFamilia = new Map<string, number>();

    this.cursos.forEach(curso => {
      tasasPorFamilia.set(curso.familiaProfesional, curso.demandaLaboral);
    });

    const tasas = Array.from(tasasPorFamilia.values());
    return tasas.length
      ? tasas.reduce((total, tasa) => total + tasa, 0) / tasas.length
      : 0;
  }

  get nombreFamiliaSeleccionada(): string {
    if (this.perfil.familiaProfesional === '*') {
      return 'Todas las áreas';
    }

    return this.familiasProfesionales.find(
      familia => familia.codigo === this.perfil.familiaProfesional
    )?.nombre || 'Área seleccionada';
  }

  private cargarCursos(): void {
    this.cargandoCursos = true;
    this.importacionCursos.cargarEspecialidades().subscribe({
      next: cursos => {
        this.cursos = cursos;
        this.cargandoCursos = false;
      },
      error: error => {
        console.error('No se pudo cargar el catálogo formativo:', error);
        this.errorCursos = 'No se ha podido cargar el catálogo. Actualiza la página para intentarlo de nuevo.';
        this.cargandoCursos = false;
      }
    });
  }

  generarItinerario(): void {
    if (!this.perfil.nivelFormativo || !this.perfil.familiaProfesional) {
      return;
    }

    const cursosDisponibles = this.perfil.familiaProfesional === '*'
      ? this.cursos
      : this.cursos.filter(
          curso => curso.familiaProfesional === this.perfil.familiaProfesional
        );

    const ranking = cursosDisponibles
      .map(curso => this.puntuarCurso(curso))
      .sort((a, b) => b.puntuacion - a.puntuacion);
    const tieneCualificacionEspecifica =
      this.obtenerTokens(this.perfil.cualificaciones).length > 0 ||
      this.obtenerTokens(this.perfil.experiencia).length > 0;
    const nivel = this.normalizar(this.perfil.nivelFormativo);
    const tieneRequisitoCompatible = cursosDisponibles.some(curso =>
      this.normalizar(curso.requisitos.join(' ')).includes(nivel)
    );

    if (
      this.perfil.familiaProfesional === '*' &&
      !tieneCualificacionEspecifica &&
      !tieneRequisitoCompatible
    ) {
      const familiasIncluidas = new Set<string>();
      this.recomendaciones = ranking.filter(recomendacion => {
        const familia = recomendacion.curso.familiaProfesional;
        if (familiasIncluidas.has(familia)) {
          return false;
        }

        familiasIncluidas.add(familia);
        return true;
      }).slice(0, 3);
    } else {
      this.recomendaciones = ranking.slice(0, 3);
    }
    this.simulacionEnviada = true;

    setTimeout(() => {
      document.getElementById('itinerario')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  obtenerUrlDescripcion(curso: EspecialidadFormativa): string {
    if (curso.fuentesOficiales?.fichaEspecialidad) {
      return curso.fuentesOficiales.fichaEspecialidad;
    }

    return 'https://www.juntadeandalucia.es/empleoformacionytrabajoautonomo/' +
      'formacion/web/fichero-de-especialidades-formativas/' +
      encodeURIComponent(curso.codigo);
  }

  alternarFicha(codigo: string): void {
    this.fichaAbiertaCodigo = this.fichaAbiertaCodigo === codigo ? null : codigo;
  }

  obtenerEstadoConvocatoria(convocatoria: {
    estado: string;
    fechaFinSolicitud: string | null;
  }): string {
    const fechaFin = convocatoria.fechaFinSolicitud;
    if (fechaFin) {
      const fechaLimite = new Date(`${fechaFin}T00:00:00`);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (!Number.isNaN(fechaLimite.getTime()) && fechaLimite < hoy) {
        return 'Plazo finalizado';
      }
    }

    return convocatoria.estado || 'Estado no indicado';
  }

  convocatoriaEnPlazo(convocatoria: {
    estado: string;
    fechaFinSolicitud: string | null;
  }): boolean {
    return this.obtenerEstadoConvocatoria(convocatoria)
      .toLowerCase()
      .includes('en plazo');
  }

  obtenerEstadoInvestigacion(estado?: string): string {
    if (!estado) {
      return 'Estado de consulta no indicado';
    }

    const etiquetas: Record<string, string> = {
      consulta_parcial_datos_oficiales: 'Consulta parcial de datos oficiales',
      consulta_completa_datos_oficiales: 'Consulta completa de datos oficiales'
    };

    return etiquetas[estado] || estado.replaceAll('_', ' ');
  }

  private puntuarCurso(curso: EspecialidadFormativa): RecomendacionCurso {
    const tokensCurso = new Set(this.obtenerTokens([
      curso.nombre,
      curso.familiaProfesionalNombre,
      ...curso.ocupacionesRelacionadas,
      ...curso.competencias
    ].join(' ')));
    const tokensCualificacion = this.obtenerTokens(this.perfil.cualificaciones);
    const tokensExperiencia = this.obtenerTokens(this.perfil.experiencia);
    const coincidenciasCualificacion = tokensCualificacion.filter(token =>
      this.coincideCualificacion(token, tokensCurso)
    );
    const coincidenciasExperiencia = tokensExperiencia.filter(token =>
      this.coincideToken(token, tokensCurso)
    );
    const coincidencias = Array.from(new Set([
      ...coincidenciasCualificacion,
      ...coincidenciasExperiencia
    ])).slice(0, 3);

    const puntosCualificacion = Math.min(100, coincidenciasCualificacion.length * 40);
    const puntosExperiencia = coincidenciasExperiencia.length
      ? Math.min(100, coincidenciasExperiencia.length * 35 +
        Math.min(Number(this.perfil.horasExperiencia) || 0, 1000) / 1000 * 30)
      : 0;
    const requisitos = this.normalizar(curso.requisitos.join(' '));
    const nivel = this.normalizar(this.perfil.nivelFormativo);
    const tieneRequisitosFormativos = requisitos.length > 0;
    const puntosFormacion = tieneRequisitosFormativos
      ? requisitos.includes(nivel) ? 100 : 0
      : 0;
    const pesosActivos =
      (tokensCualificacion.length ? 0.55 : 0) +
      (tokensExperiencia.length ? 0.25 : 0) +
      (tieneRequisitosFormativos ? 0.20 : 0);
    const afinidad = pesosActivos
      ? (
          puntosCualificacion * (tokensCualificacion.length ? 0.55 : 0) +
          puntosExperiencia * (tokensExperiencia.length ? 0.25 : 0) +
          puntosFormacion * (tieneRequisitosFormativos ? 0.20 : 0)
        ) / pesosActivos
      : 0;
    const tasa = curso.demandaLaboral ?? this.empleabilidadMedia;
    const puntuacion = Math.round(
      pesosActivos ? tasa * 0.35 + afinidad * 0.65 : tasa
    );

    let motivo = 'Sector con oportunidades de inserción laboral según los datos disponibles.';
    if (coincidencias.length && puntosExperiencia > 0) {
      motivo = `Relaciona tu formación y experiencia con: ${coincidencias.join(', ')}.`;
    } else if (coincidencias.length) {
      motivo = `Coincide con cualificaciones de tu perfil: ${coincidencias.join(', ')}.`;
    } else if (puntosExperiencia > 0) {
      motivo = `Aprovecha experiencia profesional relacionada: ${coincidenciasExperiencia.join(', ')}.`;
    } else if (tieneRequisitosFormativos && puntosFormacion > 0) {
      motivo = `Tu formación actual cumple los requisitos indicados: ${curso.requisitos.join(', ')}.`;
    }

    return { curso, puntuacion, coincidencias, motivo };
  }

  private obtenerTokens(texto: string): string[] {
    return Array.from(new Set(
      this.normalizar(texto)
        .split(/[^a-z0-9]+/)
        .filter(token => token.length > 3 && !this.palabrasGenericas.has(token))
    ));
  }

  private coincideCualificacion(token: string, tokensCurso: Set<string>): boolean {
    if (this.coincideToken(token, tokensCurso)) {
      return true;
    }

    return (this.equivalenciasCualificacion[token] || []).some(equivalencia =>
      this.obtenerTokens(equivalencia).some(termino =>
        this.coincideToken(termino, tokensCurso)
      )
    );
  }

  private coincideToken(token: string, tokensCurso: Set<string>): boolean {
    return Array.from(tokensCurso).some(tokenCurso =>
      token === tokenCurso ||
      (token.length >= 6 && tokenCurso.length >= 6 &&
        (token.includes(tokenCurso) || tokenCurso.includes(token)))
    );
  }

  private normalizar(texto: string): string {
    return texto.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}