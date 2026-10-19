import { Injectable } from '@angular/core';

import {
  Candidato,
  Curso
} from '../modelos/crm.model';

@Injectable({
  providedIn: 'root'
})
export class CrmService {

  private readonly claveCandidatos = 'orienta_candidatos';
  private readonly claveCursos = 'orienta_cursos';
  private readonly claveMigracionCandidatos =
    'orienta_candidatos_demo_v1';
  private readonly claveMigracionCursos =
    'orienta_cursos_demo_v1';

  private candidatosIniciales: Candidato[] = [
    {
      id: 1,
      nombre: 'Ana',
      apellidos: 'García López',
      email: 'ana.ejemplo@email.com',
      telefono: '600000001',
      situacionLaboral: 'Desempleado',
      nivelFormativo: 'ESO',
      experiencia: 'Dependienta de comercio',
      competencias: [
        'Atención al cliente',
        'Comunicación',
        'Ventas'
      ],
      interesesProfesionales: [
        'Comercio',
        'Logística'
      ],
      provincia: 'Málaga',
      observaciones: 'Interesada en mejorar su empleabilidad.'
    },
    {
      id: 2,
      nombre: 'Juan',
      apellidos: 'López Martín',
      email: 'juan.ejemplo@email.com',
      telefono: '600000002',
      situacionLaboral: 'Trabajando',
      nivelFormativo: 'Bachillerato',
      experiencia: 'Ayudante de cocina',
      competencias: [
        'Trabajo en equipo',
        'Organización'
      ],
      interesesProfesionales: [
        'Hostelería',
        'Administración'
      ],
      provincia: 'Sevilla',
      observaciones: ''
    },
    {
      id: 3,
      nombre: 'Sonia',
      apellidos: 'Pérez Navarro',
      email: 'sonia.perez@example.invalid',
      telefono: '600000003',
      situacionLaboral: 'Desempleado',
      nivelFormativo: 'Grado medio',
      experiencia: 'Auxiliar de enfermería en prácticas',
      competencias: ['Empatía', 'Cuidados básicos', 'Trabajo en equipo'],
      interesesProfesionales: ['Sanidad', 'Atención sociosanitaria'],
      provincia: 'Córdoba',
      observaciones: 'Busca incorporarse a un centro sanitario.'
    },
    {
      id: 4,
      nombre: 'Marcos',
      apellidos: 'Vega Díaz',
      email: 'marcos.vega@example.invalid',
      telefono: '600000004',
      situacionLaboral: 'Trabajando',
      nivelFormativo: 'ESO',
      experiencia: 'Repartidor y mozo de almacén',
      competencias: ['Organización', 'Preparación de pedidos', 'Conducción'],
      interesesProfesionales: ['Logística', 'Transporte'],
      provincia: 'Granada',
      observaciones: 'Interesado en mejorar sus opciones de promoción.'
    },
    {
      id: 5,
      nombre: 'Lucía',
      apellidos: 'Fernández Gil',
      email: 'lucia.fernandez@example.invalid',
      telefono: '600000005',
      situacionLaboral: 'Estudiando',
      nivelFormativo: 'Bachillerato',
      experiencia: 'Sin experiencia profesional',
      competencias: ['Creatividad', 'Comunicación', 'Competencia digital'],
      interesesProfesionales: ['Diseño', 'Marketing', 'Audiovisual'],
      provincia: 'Cádiz',
      observaciones: 'Quiere orientar su formación al diseño digital.'
    },
    {
      id: 6,
      nombre: 'Pablo',
      apellidos: 'Sánchez Ruiz',
      email: 'pablo.sanchez@example.invalid',
      telefono: '600000006',
      situacionLaboral: 'Desempleado',
      nivelFormativo: 'Grado medio',
      experiencia: 'Ayudante de mantenimiento',
      competencias: ['Electricidad básica', 'Resolución de problemas', 'Seguridad'],
      interesesProfesionales: ['Electricidad', 'Mantenimiento industrial'],
      provincia: 'Jaén',
      observaciones: 'Disponible para formación presencial.'
    },
    {
      id: 7,
      nombre: 'Carmen',
      apellidos: 'Ortega León',
      email: 'carmen.ortega@example.invalid',
      telefono: '600000007',
      situacionLaboral: 'Trabajando',
      nivelFormativo: 'Grado superior',
      experiencia: 'Administrativa de atención al público',
      competencias: ['Ofimática', 'Gestión documental', 'Atención al cliente'],
      interesesProfesionales: ['Administración', 'Recursos humanos'],
      provincia: 'Huelva',
      observaciones: 'Busca especializarse en gestión de personal.'
    },
    {
      id: 8,
      nombre: 'Javier',
      apellidos: 'Moreno Castro',
      email: 'javier.moreno@example.invalid',
      telefono: '600000008',
      situacionLaboral: 'Estudiando',
      nivelFormativo: 'ESO',
      experiencia: 'Ayudante de cocina en temporada',
      competencias: ['Manipulación de alimentos', 'Orden', 'Trabajo en equipo'],
      interesesProfesionales: ['Hostelería', 'Cocina'],
      provincia: 'Málaga',
      observaciones: 'Quiere obtener una cualificación profesional en cocina.'
    },
    {
      id: 9,
      nombre: 'Elena',
      apellidos: 'Torres Molina',
      email: 'elena.torres@example.invalid',
      telefono: '600000009',
      situacionLaboral: 'Desempleado',
      nivelFormativo: 'Grado medio',
      experiencia: 'Monitora de actividades infantiles',
      competencias: ['Dinamización', 'Escucha activa', 'Planificación'],
      interesesProfesionales: ['Educación infantil', 'Servicios sociales'],
      provincia: 'Almería',
      observaciones: 'Interesada en trabajar con infancia y familias.'
    },
    {
      id: 10,
      nombre: 'Sergio',
      apellidos: 'Navarro Cruz',
      email: 'sergio.navarro@example.invalid',
      telefono: '600000010',
      situacionLaboral: 'Trabajando',
      nivelFormativo: 'Grado superior',
      experiencia: 'Técnico de mantenimiento de maquinaria',
      competencias: ['Mecánica', 'Mantenimiento preventivo', 'Interpretación de planos'],
      interesesProfesionales: ['Fabricación mecánica', 'Industria'],
      provincia: 'Sevilla',
      observaciones: 'Valora formación avanzada compatible con su empleo.'
    },
    {
      id: 11,
      nombre: 'Alba',
      apellidos: 'Romero Martín',
      email: 'alba.romero@example.invalid',
      telefono: '600000011',
      situacionLaboral: 'Desempleado',
      nivelFormativo: 'Bachillerato',
      experiencia: 'Dependienta y cajera',
      competencias: ['Ventas', 'Caja', 'Resolución de incidencias'],
      interesesProfesionales: ['Comercio', 'Atención al cliente'],
      provincia: 'Cádiz',
      observaciones: 'Busca empleo en comercio y formación en ventas digitales.'
    },
    {
      id: 12,
      nombre: 'Daniel',
      apellidos: 'Flores Soto',
      email: 'daniel.flores@example.invalid',
      telefono: '600000012',
      situacionLaboral: 'Estudiando',
      nivelFormativo: 'Grado medio',
      experiencia: 'Prácticas de soporte informático',
      competencias: ['Soporte técnico', 'Sistemas operativos', 'Aprendizaje autónomo'],
      interesesProfesionales: ['Informática', 'Programación'],
      provincia: 'Granada',
      observaciones: 'Quiere continuar hacia desarrollo de aplicaciones.'
    },
    {
      id: 13,
      nombre: 'Rocío',
      apellidos: 'Medina Aguilar',
      email: 'rocio.medina@example.invalid',
      telefono: '600000013',
      situacionLaboral: 'Desempleado',
      nivelFormativo: 'ESO',
      experiencia: 'Peona agrícola en campañas temporales',
      competencias: ['Trabajo al aire libre', 'Clasificación de productos', 'Resistencia física'],
      interesesProfesionales: ['Agraria', 'Jardinería'],
      provincia: 'Jaén',
      observaciones: 'Busca ampliar sus opciones laborales durante todo el año.'
    },
    {
      id: 14,
      nombre: 'Iván',
      apellidos: 'Castillo Reyes',
      email: 'ivan.castillo@example.invalid',
      telefono: '600000014',
      situacionLaboral: 'Trabajando',
      nivelFormativo: 'Grado medio',
      experiencia: 'Recepcionista de hotel',
      competencias: ['Atención al huésped', 'Idiomas', 'Gestión de reservas'],
      interesesProfesionales: ['Turismo', 'Gestión hotelera'],
      provincia: 'Córdoba',
      observaciones: 'Interesado en progresar hacia coordinación de recepción.'
    },
    {
      id: 15,
      nombre: 'Nuria',
      apellidos: 'Campos Vidal',
      email: 'nuria.campos@example.invalid',
      telefono: '600000015',
      situacionLaboral: 'Estudiando',
      nivelFormativo: 'Bachillerato',
      experiencia: 'Voluntariado de acompañamiento a mayores',
      competencias: ['Empatía', 'Comunicación', 'Acompañamiento'],
      interesesProfesionales: ['Atención sociosanitaria', 'Cuidados'],
      provincia: 'Huelva',
      observaciones: 'Busca una formación acreditada en atención a la dependencia.'
    },
    {
      id: 16,
      nombre: 'Manuel',
      apellidos: 'Ortega Prieto',
      email: 'manuel.ortega@example.invalid',
      telefono: '600000016',
      situacionLaboral: 'Desempleado',
      nivelFormativo: 'Grado medio',
      experiencia: 'Operario de taller metalúrgico',
      competencias: ['Soldadura básica', 'Uso de herramientas', 'Prevención de riesgos'],
      interesesProfesionales: ['Fabricación mecánica', 'Mantenimiento'],
      provincia: 'Almería',
      observaciones: 'Disponible para mejorar su cualificación técnica.'
    },
    {
      id: 17,
      nombre: 'Sara',
      apellidos: 'León Ortiz',
      email: 'sara.leon@example.invalid',
      telefono: '600000017',
      situacionLaboral: 'Trabajando',
      nivelFormativo: 'Grado superior',
      experiencia: 'Agente de atención telefónica',
      competencias: ['Comunicación', 'Gestión de reclamaciones', 'Ofimática'],
      interesesProfesionales: ['Administración', 'Comercio'],
      provincia: 'Málaga',
      observaciones: 'Quiere orientar su experiencia hacia atención especializada.'
    }
  ];

  private cursosIniciales: Curso[] = [
    {
      id: 1,
      codigo: 'COML0110',
      nombre: 'Actividades auxiliares de almacén',
      familiaProfesional: 'Comercio y marketing',
      duracionHoras: 210,
      competencias: [
        'Preparación de pedidos',
        'Gestión básica de almacén',
        'Manipulación de mercancías'
      ],
      ocupacionesRelacionadas: [
        'Mozo de almacén',
        'Preparador de pedidos',
        'Auxiliar de almacén'
      ],
      requisitos: [],
      demandaLaboral: 80
    },
    {
      id: 2,
      codigo: 'SSCS0208',
      nombre:
        'Atención sociosanitaria a personas dependientes en instituciones sociales',
      familiaProfesional: 'Servicios socioculturales y a la comunidad',
      duracionHoras: 450,
      competencias: [
        'Atención a personas dependientes',
        'Apoyo en actividades cotidianas',
        'Comunicación asistencial'
      ],
      ocupacionesRelacionadas: [
        'Cuidador de personas dependientes',
        'Gerocultor'
      ],
      requisitos: [],
      demandaLaboral: 85
    },
    {
      id: 3,
      codigo: 'HOTR0108',
      nombre: 'Operaciones básicas de cocina',
      familiaProfesional: 'Hostelería y turismo',
      duracionHoras: 350,
      competencias: [
        'Preparación de alimentos',
        'Higiene alimentaria',
        'Organización de cocina'
      ],
      ocupacionesRelacionadas: [
        'Ayudante de cocina',
        'Auxiliar de cocina'
      ],
      requisitos: [],
      demandaLaboral: 75
    },
    {
      id: 4,
      codigo: 'ELEE0109',
      nombre:
        'Montaje y mantenimiento de instalaciones eléctricas de baja tensión',
      familiaProfesional: 'Electricidad y electrónica',
      duracionHoras: 920,
      competencias: [
        'Instalaciones eléctricas',
        'Mantenimiento',
        'Interpretación de esquemas'
      ],
      ocupacionesRelacionadas: [
        'Electricista',
        'Ayudante de instalaciones eléctricas'
      ],
      requisitos: [],
      demandaLaboral: 82
    },
    {
      id: 5,
      codigo: 'TEST-COM-01',
      nombre: 'Atención al cliente y ventas en comercio',
      familiaProfesional: 'Comercio y marketing',
      duracionHoras: 120,
      competencias: ['Atención al cliente', 'Comunicación', 'Ventas'],
      ocupacionesRelacionadas: ['Dependienta de comercio', 'Asesora de ventas'],
      requisitos: [],
      demandaLaboral: 94
    },
    {
      id: 6,
      codigo: 'TEST-SS-01',
      nombre: 'Cuidados y atención sociosanitaria',
      familiaProfesional: 'Servicios socioculturales y a la comunidad',
      duracionHoras: 180,
      competencias: ['Empatía', 'Cuidados básicos', 'Trabajo en equipo'],
      ocupacionesRelacionadas: [
        'Atención sociosanitaria',
        'Cuidador de personas dependientes'
      ],
      requisitos: [],
      demandaLaboral: 96
    },
    {
      id: 7,
      codigo: 'TEST-IF-01',
      nombre: 'Soporte informático y programación inicial',
      familiaProfesional: 'Informática y comunicaciones',
      duracionHoras: 200,
      competencias: [
        'Soporte técnico',
        'Sistemas operativos',
        'Aprendizaje autónomo'
      ],
      ocupacionesRelacionadas: [
        'Técnico de soporte informático',
        'Programación de software'
      ],
      requisitos: [],
      demandaLaboral: 91
    },
    {
      id: 8,
      codigo: 'TEST-LOG-01',
      nombre: 'Preparación de pedidos y operaciones logísticas',
      familiaProfesional: 'Comercio y marketing',
      duracionHoras: 150,
      competencias: [
        'Preparación de pedidos',
        'Organización',
        'Conducción'
      ],
      ocupacionesRelacionadas: ['Técnico de logística', 'Mozo de almacén'],
      requisitos: [],
      demandaLaboral: 93
    },
    {
      id: 9,
      codigo: 'TEST-HOT-01',
      nombre: 'Operaciones de cocina e higiene alimentaria',
      familiaProfesional: 'Hostelería y turismo',
      duracionHoras: 160,
      competencias: [
        'Manipulación de alimentos',
        'Orden',
        'Trabajo en equipo'
      ],
      ocupacionesRelacionadas: ['Ayudante de cocina', 'Auxiliar de cocina'],
      requisitos: [],
      demandaLaboral: 92
    },
    {
      id: 10,
      codigo: 'TEST-AD-01',
      nombre: 'Gestión documental y administración de personal',
      familiaProfesional: 'Administración y gestión',
      duracionHoras: 180,
      competencias: [
        'Ofimática',
        'Gestión documental',
        'Atención al cliente'
      ],
      ocupacionesRelacionadas: ['Técnica administrativa', 'Recursos humanos'],
      requisitos: [],
      demandaLaboral: 89
    },
    {
      id: 11,
      codigo: 'TEST-MAN-01',
      nombre: 'Mantenimiento eléctrico e industrial',
      familiaProfesional: 'Electricidad y electrónica',
      duracionHoras: 220,
      competencias: [
        'Electricidad básica',
        'Resolución de problemas',
        'Seguridad',
        'Mecánica',
        'Mantenimiento preventivo',
        'Interpretación de planos'
      ],
      ocupacionesRelacionadas: [
        'Mantenimiento industrial',
        'Ayudante de instalaciones eléctricas'
      ],
      requisitos: [],
      demandaLaboral: 93
    },
    {
      id: 12,
      codigo: 'TEST-AGR-01',
      nombre: 'Operaciones agrícolas y cuidado de cultivos',
      familiaProfesional: 'Agraria',
      duracionHoras: 140,
      competencias: [
        'Trabajo al aire libre',
        'Clasificación de productos',
        'Resistencia física'
      ],
      ocupacionesRelacionadas: ['Peona agrícola', 'Operaria de cultivos'],
      requisitos: [],
      demandaLaboral: 90
    }
  ];

  constructor() {
    this.inicializarDatos();
  }

  private inicializarDatos(): void {
    if (localStorage.getItem(this.claveCandidatos) === null) {
      this.guardarCandidatos(this.candidatosIniciales);
      localStorage.setItem(this.claveMigracionCandidatos, 'true');
    } else if (localStorage.getItem(this.claveMigracionCandidatos) === null) {
      const candidatos = this.obtenerCandidatos();
      const idsExistentes = new Set(candidatos.map(candidato => candidato.id));
      const candidatosDemoPendientes = this.candidatosIniciales.filter(
        candidato => candidato.id > 2 && !idsExistentes.has(candidato.id)
      );

      this.guardarCandidatos([
        ...candidatos,
        ...candidatosDemoPendientes
      ]);
      localStorage.setItem(this.claveMigracionCandidatos, 'true');
    }

    if (localStorage.getItem(this.claveCursos) === null) {
      this.guardarCursos(this.cursosIniciales);
      localStorage.setItem(this.claveMigracionCursos, 'true');
    } else if (localStorage.getItem(this.claveMigracionCursos) === null) {
      const cursos = this.obtenerCursos();
      const codigosExistentes = new Set(
        cursos.map(curso => curso.codigo)
      );
      const cursosDemoPendientes = this.cursosIniciales.filter(
        curso => curso.codigo.startsWith('TEST-') &&
          !codigosExistentes.has(curso.codigo)
      );
      let siguienteId = Math.max(0, ...cursos.map(curso => curso.id));

      cursosDemoPendientes.forEach(curso => {
        cursos.push({
          ...curso,
          id: ++siguienteId
        });
      });

      this.guardarCursos(cursos);
      localStorage.setItem(this.claveMigracionCursos, 'true');
    }
  }

  obtenerCandidatos(): Candidato[] {
    return JSON.parse(
      localStorage.getItem(this.claveCandidatos) || '[]'
    );
  }

  obtenerCursos(): Curso[] {
    return JSON.parse(
      localStorage.getItem(this.claveCursos) || '[]'
    );
  }

  guardarCandidatos(candidatos: Candidato[]): void {
    localStorage.setItem(
      this.claveCandidatos,
      JSON.stringify(candidatos)
    );
  }

  guardarCursos(cursos: Curso[]): void {
    localStorage.setItem(
      this.claveCursos,
      JSON.stringify(cursos)
    );
  }

  agregarCandidato(candidato: Candidato): void {
    const candidatos = this.obtenerCandidatos();

    candidato.id = Math.max(
      0,
      ...candidatos.map(c => c.id)
    ) + 1;

    candidatos.push(candidato);

    this.guardarCandidatos(candidatos);
  }

  agregarCurso(curso: Curso): void {
    const cursos = this.obtenerCursos();

    curso.id = Math.max(
      0,
      ...cursos.map(c => c.id)
    ) + 1;

    cursos.push(curso);

    this.guardarCursos(cursos);
  }

  importarEspecialidades(
    especialidades: any[]
  ): number {

    const cursosActuales = this.obtenerCursos();

    const codigosExistentes = new Set(
      cursosActuales.map(curso => curso.codigo)
    );

    let importados = 0;

    for (const especialidad of especialidades) {

      if (codigosExistentes.has(especialidad.codigo)) {
        const cursoExistente = cursosActuales.find(
          curso => curso.codigo === especialidad.codigo
        );

        if (cursoExistente) {
          cursoExistente.demandaLaboral = especialidad.demandaLaboral;
          cursoExistente.familiaProfesional =
            especialidad.familiaProfesionalNombre ||
            especialidad.familiaProfesional;
        }

        continue;
      }

      cursosActuales.push({
        id: Math.max(
          0,
          ...cursosActuales.map(curso => curso.id)
        ) + 1,

        codigo: especialidad.codigo,
        nombre: especialidad.nombre,
        familiaProfesional:
          especialidad.familiaProfesionalNombre ||
          especialidad.familiaProfesional,
        duracionHoras: especialidad.duracionHoras ?? 0,

        competencias: especialidad.competencias ?? [],
        ocupacionesRelacionadas:
          especialidad.ocupacionesRelacionadas ?? [],

        requisitos: especialidad.requisitos ?? [],

        demandaLaboral: especialidad.demandaLaboral
      });

      codigosExistentes.add(especialidad.codigo);
      importados++;
    }

    this.guardarCursos(cursosActuales);

    return importados;
  }

  eliminarCandidato(id: number): void {
    const candidatos = this.obtenerCandidatos()
      .filter(c => c.id !== id);

    this.guardarCandidatos(candidatos);
  }

  eliminarCurso(id: number): void {
    const cursos = this.obtenerCursos()
      .filter(c => c.id !== id);

    this.guardarCursos(cursos);
  }
}