/* ===== DATOS INICIALES ===== */
let alumnos = [
    { nombre: "Juan Pérez", nota: 7.5 },
    { nombre: "Ana García", nota: 9.2 },
    { nombre: "Carlos López", nota: 6.8 },
    { nombre: "María Rodríguez", nota: 8.5 },
    { nombre: "Pedro Martínez", nota: 5.2 }
];

/* ===== FUNCIONES DE CÁLCULO CON REDUCE ===== */

// Calcular promedio usando reduce()
function calcularPromedio(lista) {
    if (lista.length === 0) return 0;
    const suma = lista.reduce((total, alumno) => total + alumno.nota, 0);
    return (suma / lista.length).toFixed(2);
}

// Encontrar mejor alumno usando reduce()
function encontrarMejorAlumno(lista) {
    if (lista.length === 0) return null;
    return lista.reduce((mejor, alumno) => alumno.nota > mejor.nota ? alumno : mejor);
}

// Encontrar peor alumno usando reduce()
function encontrarPeorAlumno(lista) {
    if (lista.length === 0) return null;
    return lista.reduce((peor, alumno) => alumno.nota < peor.nota ? alumno : peor);
}

// Calcular nota máxima usando reduce()
function calcularNotaMaxima(lista) {
    if (lista.length === 0) return 0;
    return lista.reduce((max, alumno) => alumno.nota > max ? alumno.nota : max, 0);
}

// Calcular nota mínima usando reduce()
function calcularNotaMinima(lista) {
    if (lista.length === 0) return 0;
    return lista.reduce((min, alumno) => alumno.nota < min ? alumno.nota : min, 10);
}

// Contar aprobados usando reduce()
function contarAprobados(lista) {
    return lista.reduce((count, alumno) => alumno.nota >= 6 ? count + 1 : count, 0);
}

// Contar suspensos usando reduce()
function contarSuspensos(lista) {
    return lista.reduce((count, alumno) => alumno.nota < 6 ? count + 1 : count, 0);
}

/* ===== FUNCIONES DE ACTUALIZACIÓN DE UI ===== */

// Actualizar estadísticas principales
function actualizarEstadisticas() {
    const promedio = calcularPromedio(alumnos);
    const mejor = encontrarMejorAlumno(alumnos);
    const peor = encontrarPeorAlumno(alumnos);
    const notaMax = calcularNotaMaxima(alumnos);
    const notaMin = calcularNotaMinima(alumnos);
    const aprobados = contarAprobados(alumnos);
    const suspensos = contarSuspensos(alumnos);

    // Actualizar tarjetas de estadísticas
    document.getElementById('promedio').textContent = promedio;
    document.getElementById('mejor-name').textContent = mejor ? mejor.nombre : '--';
    document.getElementById('mejor-nota').textContent = mejor ? `Nota: ${mejor.nota}` : 'Nota: --';
    document.getElementById('peor-name').textContent = peor ? peor.nombre : '--';
    document.getElementById('peor-nota').textContent = peor ? `Nota: ${peor.nota}` : 'Nota: --';
    document.getElementById('total-alumnos').textContent = alumnos.length;

    // Actualizar resumen estadístico
    document.getElementById('aprobados').textContent = aprobados;
    document.getElementById('suspensos').textContent = suspensos;
    document.getElementById('nota-maxima').textContent = notaMax.toFixed(2);
    document.getElementById('nota-minima').textContent = notaMin.toFixed(2);

    // Actualizar gráfico y tabla
    actualizarGrafico();
    mostrarListaAlumnos();
}

// Actualizar tabla dinámicamente
function mostrarListaAlumnos(filtro = '') {
    const tbody = document.getElementById('tabla-body');
    tbody.innerHTML = '';

    const alumnosFiltrados = alumnos.filter(alumno =>
        alumno.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    if (alumnosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No se encontraron alumnos</td></tr>';
        return;
    }

    alumnosFiltrados.forEach((alumno, index) => {
        const calificacion = obtenerCalificacion(alumno.nota);
        const porcentaje = (alumno.nota / 10) * 100;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${alumno.nombre}</strong></td>
            <td><strong>${alumno.nota}</strong></td>
            <td>
                <span class="calificacion ${calificacion}">
                    ${obtenerTextoCalificacion(alumno.nota)}
                </span>
            </td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${porcentaje}%"></div>
                </div>
            </td>
            <td>
                <button class="btn-delete" onclick="eliminarAlumno('${alumno.nombre}')">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función auxiliar para obtener clase de calificación
function obtenerCalificacion(nota) {
    if (nota >= 9) return 'excelente';
    if (nota >= 8) return 'bueno';
    if (nota >= 6) return 'regular';
    return 'bajo';
}

// Función auxiliar para obtener texto de calificación
function obtenerTextoCalificacion(nota) {
    if (nota >= 9) return 'Excelente';
    if (nota >= 8) return 'Bueno';
    if (nota >= 6) return 'Regular';
    return 'Bajo';
}

// Crear gráfico de barras sin librerías externas
function actualizarGrafico() {
    const contenedor = document.getElementById('grafico-barras');
    contenedor.innerHTML = '';

    if (alumnos.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; color: #95a5a6; padding: 40px;">No hay alumnos para mostrar</p>';
        return;
    }

    const notaMaxima = 10;

    alumnos.forEach(alumno => {
        const porcentaje = (alumno.nota / notaMaxima) * 100;

        const barraContainer = document.createElement('div');
        barraContainer.className = 'barra-container';
        barraContainer.innerHTML = `
            <div class="barra" style="height: ${porcentaje}%" title="${alumno.nombre}: ${alumno.nota}">
                <div class="barra-valor">${alumno.nota}</div>
            </div>
            <div class="barra-label">${alumno.nombre.split(' ')[0]}</div>
        `;

        contenedor.appendChild(barraContainer);
    });
}

/* ===== FUNCIONES DE GESTIÓN DE ALUMNOS ===== */

// Agregar nuevo alumno
function agregarAlumno(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const nota = parseFloat(document.getElementById('nota').value);

    // Validar entrada
    if (!nombre || nombre.length < 2) {
        alert('Por favor, ingrese un nombre válido (mínimo 2 caracteres).');
        return;
    }

    if (isNaN(nota) || nota < 0 || nota > 10) {
        alert('La nota debe ser un número entre 0 y 10.');
        return;
    }

    // Verificar si el alumno ya existe
    if (alumnos.some(a => a.nombre.toLowerCase() === nombre.toLowerCase())) {
        alert('Este alumno ya existe en la lista.');
        return;
    }

    // Agregar alumno
    alumnos.push({ nombre, nota });
    
    // Limpiar y actualizar
    document.getElementById('form-alumno').reset();
    actualizarEstadisticas();
    
    // Mostrar feedbak visual
    mostrarNotificacion(`✓ ${nombre} agregado correctamente`);
}

// Eliminar alumno
function eliminarAlumno(nombre) {
    if (confirm(`¿Está seguro de que desea eliminar a ${nombre}?`)) {
        alumnos = alumnos.filter(a => a.nombre !== nombre);
        actualizarEstadisticas();
        mostrarNotificacion(`✓ ${nombre} eliminado correctamente`);
    }
}

// Mostrar notificación temporal
function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = mensaje;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

/* ===== BÚSQUEDA EN TIEMPO REAL ===== */

function buscarAlumnos() {
    const termino = document.getElementById('buscar').value;
    mostrarListaAlumnos(termino);
}

/* ===== EXPORTAR A PDF ===== */

function exportarPDF() {
    const elemento = document.getElementById('dashboard');
    const contenido = elemento.innerHTML;
    
    // Crear ventana de impresión
    const ventana = window.open('', 'PRINT', 'height=600,width=800');
    
    ventana.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Panel de Análisis de Alumnos</title>
            <link rel="stylesheet" href="css/styles.css">
            <style>
                @media print {
                    body { background: white; }
                    .header-actions, .tabla-actions, .form-section, .btn-delete { display: none; }
                    #dashboard { box-shadow: none; padding: 0; margin: 0; }
                    section { page-break-inside: avoid; }
                }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            <header class="header">
                <div class="container">
                    <div class="header-content">
                        <h1>📊 Panel de Análisis de Alumnos</h1>
                        <p class="subtitle">Reporte Generado - ${new Date().toLocaleDateString('es-ES')}</p>
                    </div>
                </div>
            </header>
            ${contenido}
        </body>
        </html>
    `);
    
    ventana.document.close();
}

/* ===== INICIALIZACIÓN ===== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar con los datos
    actualizarEstadisticas();
    
    // Event listeners
    document.getElementById('form-alumno').addEventListener('submit', agregarAlumno);
    document.getElementById('buscar').addEventListener('input', buscarAlumnos);
});

/* ===== ESTILOS DE ANIMACIÓN ===== */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);