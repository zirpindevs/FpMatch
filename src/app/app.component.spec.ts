import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { ImportacionCursosService } from './servicios/importacion-cursos.service';

describe('AppComponent', () => {
  const cursos = [
    {
      id: 'ADGD0108',
      codigo: 'ADGD0108',
      nombre: 'Gestión administrativa y contable',
      familiaProfesional: 'AD',
      familiaProfesionalNombre: 'Administración y gestión',
      duracionHoras: 630,
      certificado: 'Si',
      centros: 'Si',
      competencias: ['Ofimática'],
      ocupacionesRelacionadas: ['Auxiliar administrativo'],
      requisitos: ['Bachillerato'],
      horasTeoricas: 450,
      horasPracticas: 180,
      centrosAutorizados: [{
        nombre: 'Centro Público de FPE Cartuja',
        codigoCentro: '1800055974',
        municipio: 'Granada',
        provincia: 'Granada',
        urlFuente: 'https://example.org/centro/1800055974'
      }],
      cursosConvocados: [
        {
          nombre: 'Contabilidad y fiscalidad',
          estado: 'En plazo de solicitud',
          horas: 240,
          fechaFinSolicitud: '2020-10-08',
          inicioPrevisto: '2020-11-11',
          ubicacion: null,
          expediente: 'EXP-ANTERIOR',
          urlFuente: 'https://example.org/convocatoria/anterior'
        },
        {
          nombre: 'Gestión administrativa',
          estado: 'En plazo de solicitud',
          horas: 320,
          fechaFinSolicitud: '2099-10-21',
          inicioPrevisto: '2099-11-23',
          ubicacion: 'Granada, Granada',
          expediente: 'EXP-ACTUAL',
          urlFuente: 'https://example.org/convocatoria/actual'
        }
      ],
      fuentesOficiales: {
        fichaEspecialidad: 'https://example.org/especialidad/ADGD0108',
        buscadorCentros: 'https://example.org/centros?codigo=ADGD0108',
        buscadorCursos: 'https://example.org/cursos'
      },
      fechaConsulta: '2026-10-20',
      estadoInvestigacion: 'consulta_parcial_datos_oficiales',
      notaHoras: 'El reparto de horas proviene de la ficha consultada.',
      demandaLaboral: 78,
      fuenteDemanda: 'IECA'
    },
    {
      id: 'HOT001',
      codigo: 'HOT001',
      nombre: 'Operaciones básicas de cocina',
      familiaProfesional: 'HO',
      familiaProfesionalNombre: 'Hostelería y turismo',
      duracionHoras: 250,
      certificado: 'Si',
      centros: 'Si',
      competencias: ['Manipulación de alimentos'],
      ocupacionesRelacionadas: ['Ayudante de cocina'],
      requisitos: ['ESO'],
      demandaLaboral: 68,
      fuenteDemanda: 'IECA'
    },
    {
      id: 'COMT0110',
      codigo: 'COMT0110',
      nombre: 'Atención al cliente, consumidor o usuario',
      familiaProfesional: 'CO',
      familiaProfesionalNombre: 'Comercio y marketing',
      duracionHoras: 460,
      certificado: 'Si',
      centros: 'Si',
      competencias: [],
      ocupacionesRelacionadas: [],
      requisitos: [],
      demandaLaboral: 88,
      fuenteDemanda: 'IECA'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{
        provide: ImportacionCursosService,
        useValue: {
          cargarEspecialidades: () => of(cursos.map(curso => ({
            ...curso,
            requisitos: [...curso.requisitos]
          })))
        }
      }]
    }).compileComponents();
  });

  it('muestra el simulador sin pedir una cuenta', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('cambiar el rumbo');
    expect(compiled.querySelector('input[name="email"]')).toBeNull();
    expect(compiled.querySelector('input[name="nombre"]')).toBeNull();
  });

  it('marca en rojo los datos obligatorios que faltan', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.perfil.nivelFormativo = '';
    app.perfil.familiaProfesional = '';
    app.generarItinerario();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.field-invalid select').length).toBe(2);
    expect(compiled.querySelectorAll('.field-error').length).toBe(2);
    expect(app.recomendaciones).toEqual([]);
  });

  it('permite añadir experiencias y exige completar las añadidas', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.perfil.nivelFormativo = 'Bachillerato';
    app.perfil.familiaProfesional = 'AD';
    app.agregarExperiencia();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.experience-entry').length).toBe(2);
    app.generarItinerario();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.experience-entry .field-invalid').length).toBe(2);
    expect(app.recomendaciones).toEqual([]);
  });

  it('muestra convocatorias, centros, horas y fuentes en la ficha completa', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    app.perfil = {
      nivelFormativo: 'Bachillerato',
      familiaProfesional: 'AD',
      cualificaciones: 'Excel',
      experiencias: []
    };
    app.generarItinerario();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.description-toggle') as HTMLButtonElement;
    expect(button.textContent).toContain('Ver ficha completa');
    button.click();
    fixture.detectChanges();

    const detail = fixture.nativeElement.querySelector('.course-detail') as HTMLElement;
    expect(detail.textContent).toContain('450');
    expect(detail.textContent).toContain('180');
    expect(detail.textContent).toContain('Centros asociados');
    expect(detail.textContent).toContain('Centro Público de FPE Cartuja');
    expect(detail.textContent).toContain('Plazo finalizado');
    expect(detail.textContent).toContain('En plazo de solicitud');
    expect(detail.textContent).toContain('EXP-ACTUAL');
    expect(detail.textContent).toContain('Consulta parcial de datos oficiales');
    expect(detail.querySelectorAll('.course-map iframe').length).toBe(2);
    expect(detail.textContent).toContain('Centro autorizado · Granada');
    expect(detail.textContent).toContain('Convocatoria · Granada, Granada');

    const sourceLinks = Array.from(
      detail.querySelectorAll('a'),
      link => link.getAttribute('href')
    );
    expect(sourceLinks).toContain('https://example.org/especialidad/ADGD0108');
    expect(sourceLinks).toContain('https://example.org/centros?codigo=ADGD0108');
  });

  it('oculta secciones de la ficha cuando el curso no trae esos datos', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    app.perfil = {
      nivelFormativo: 'Bachillerato',
      familiaProfesional: 'CO',
      cualificaciones: '',
      experiencias: []
    };
    app.generarItinerario();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.description-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();

    const detail = fixture.nativeElement.querySelector('.course-detail') as HTMLElement;
    expect(detail.textContent).not.toContain('Competencias profesionales');
    expect(detail.textContent).not.toContain('Ocupaciones relacionadas');
    expect(detail.textContent).not.toContain('Requisitos de acceso');
    expect(detail.textContent).not.toContain('Convocatorias publicadas');
    expect(detail.textContent).not.toContain('Centros autorizados');
    expect(detail.textContent).not.toContain('0 registros');
    expect(detail.textContent).not.toContain('0 centros');
    expect(detail.textContent).not.toContain('No constan');
    expect(detail.querySelector('.course-maps')).toBeNull();
  });

  it('prioriza cursos con afinidad y sector elegido', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.perfil = {
      nivelFormativo: 'Bachillerato',
      familiaProfesional: 'AD',
      cualificaciones: 'Excel',
      experiencias: [
        { descripcion: 'Auxiliar administrativo', horas: 300 },
        { descripcion: 'contable', horas: 200 }
      ]
    };
    app.generarItinerario();

    expect(app.recomendaciones[0].curso.codigo).toBe('ADGD0108');
    expect(app.recomendaciones.every(
      recomendacion => recomendacion.curso.familiaProfesional === 'AD'
    )).toBeTrue();
    expect(app.recomendaciones[0].coincidencias).toContain('excel');
    expect(app.recomendaciones[0].coincidencias).toContain('contable');
  });

  it('suma prioridad solo por convocatorias publicadas que siguen en plazo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    app.cursos = [
      ...app.cursos,
      {
        ...app.cursos[0],
        id: 'ADGD0108-SIN-CONVOCATORIA',
        codigo: 'ADGD0108-SIN-CONVOCATORIA',
        cursosConvocados: []
      }
    ];
    app.perfil.nivelFormativo = 'Bachillerato';
    app.perfil.familiaProfesional = 'AD';
    app.generarItinerario();

    const conConvocatoria = app.recomendaciones.find(
      recomendacion => recomendacion.curso.codigo === 'ADGD0108'
    );
    const sinConvocatoria = app.recomendaciones.find(
      recomendacion => recomendacion.curso.codigo === 'ADGD0108-SIN-CONVOCATORIA'
    );

    expect(conConvocatoria?.convocatoriasAbiertas).toBe(1);
    expect(conConvocatoria?.bonificacionConvocatorias).toBe(3);
    expect(conConvocatoria?.puntuacion).toBe(sinConvocatoria!.puntuacion + 3);
  });

  it('no considera "atención al cliente" una cualificación específica', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    app.perfil = {
      nivelFormativo: 'Bachillerato',
      familiaProfesional: '*',
      cualificaciones: 'atención al cliente',
      experiencias: []
    };
    app.generarItinerario();

    const cursoAtencion = app.recomendaciones.find(
      recomendacion => recomendacion.curso.codigo === 'COMT0110'
    );
    expect(cursoAtencion?.coincidencias).toEqual([]);
    expect(new Set(app.recomendaciones.map(
      recomendacion => recomendacion.curso.familiaProfesional
    )).size).toBe(app.recomendaciones.length);
  });

  it('usa el nivel formativo para priorizar cursos con requisitos compatibles', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    app.perfil = {
      nivelFormativo: 'Bachillerato',
      familiaProfesional: '*',
      cualificaciones: '',
      experiencias: []
    };
    app.generarItinerario();
    expect(app.recomendaciones[0].curso.codigo).toBe('ADGD0108');

    app.perfil.nivelFormativo = 'ESO';
    app.generarItinerario();

    expect(app.recomendaciones[0].curso.codigo).toBe('HOT001');
  });

  it('aumenta la afinidad con más horas de experiencia relacionada', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    app.perfil = {
      nivelFormativo: 'Bachillerato',
      familiaProfesional: 'AD',
      cualificaciones: '',
      experiencias: [{ descripcion: 'Auxiliar administrativo', horas: 0 }]
    };
    app.generarItinerario();
    const puntuacionInicial = app.recomendaciones[0].puntuacion;

    app.perfil.experiencias[0].horas = 1000;
    app.generarItinerario();

    expect(app.recomendaciones[0].puntuacion).toBeGreaterThan(puntuacionInicial);
  });
});