const { Builder, Browser, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const by = require("selenium-webdriver/lib/by");

(async function example() {
  const reportFileDir = initReportFile();
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    // LOGIN INCORRECTO
    await testLoginIncorrecto(driver, addToReport, reportFileDir);
    // LOGIN INCORRECTO

    // LIAMPIANDO INPUTS
    await driver.sleep(2000);
    await driver.findElement(By.id("nombre")).clear();
    await driver.findElement(By.id("contraseña")).clear();
    await driver.sleep(2000);
    // LIAMPIANDO INPUTS

    // LOGIN CORRECTO
    await testLoginCorrecto(driver, addToReport, reportFileDir);
    // LOGIN CORRECTO

    // MOTNO CAJA INCORRECTO
    await testMontoCajarIncorrecto(driver, addToReport, reportFileDir);
    // MOTNO CAJA INCORRECTO

    await driver.sleep(2000);

    // MONTO CAJA CORRECTO
    await testMontoCajaCorrecto(driver, addToReport, reportFileDir);
    // MONTO CAJA CORRECTO

    await driver.sleep(2000);

    // PAGINA DE INICIO
    await testPaginaInicio(driver, addToReport, reportFileDir);
    // PAGINA DE INICIO

    // PAGINA DE VENTAS AL CONTADO
    await testPaginaVentasAlContado(driver, addToReport, reportFileDir);
    // PAGINA DE VENTAS AL CONTADO

    // PAGINA FACTURAS DE VENTAS AL CONTADO
    await testPaginaFacturasContado(driver, addToReport, reportFileDir);
    // PAGINA FACTURAS DE VENTAS AL CONTADO

    // PAGINA VENTAS A CREDITO
    await testPaginaVentaCredito(driver, addToReport, reportFileDir);
    // PAGINA VENTAS A CREDITO

    // PAGINA FACTURAS VENTAS A CREDITO
    await testPaginaFacturasCredito(driver, addToReport, reportFileDir);
    // PAGINA FACTURAS VENTAS A CREDITO

    // PAGINA FACTURAS DEVOLUCIONES AL CONTADO
    await testPaginaFacturasDevolucionesContado(
      driver,
      addToReport,
      reportFileDir
    );
    // PAGINA FACTURAS DEVOLUCIONES AL CONTADO

    // PAGINA PARA AGREGAR O ACTUALIZAR PRODUCTOS
    await testPaginaParaAgregarProducto(driver, addToReport, reportFileDir);
    // PAGINA PARA AGREGAR O ACTUALIZAR PRODUCTOS

    // PAGINA PARA COBRAR DEUDAS
    await testPaginaCobrarDeudas(driver, addToReport, reportFileDir);
    // PAGINA PARA COBRAR DEUDAS

    // PAGINA PARA DEVOLUCIONES
    await testPaginaDevoluciones(driver, addToReport, reportFileDir);
    // PAGINA PARA DEVOLUCIONES

    // PAGINA PARA REGISTRAR INGRESOS
    await testPaginaRegistrarIngreso(driver, addToReport, reportFileDir);
    // PAGINA PARA REGISTRAR INGRESOS

    // PAGINA PARA REGISTRAR RETIRO
    await testPaginaRegistrarRetiro(driver, addToReport, reportFileDir);
    // PAGINA PARA REGISTRAR RETIRO

    // PAGINA PARA CREAR FACTURAS CUSTOMS
    await testGeneracionDeFactura(driver, addToReport, reportFileDir);
    // PAGINA PARA CREAR FACTURAS CUSTOMS
  } catch (error) {
    console.log("Error durante la prueba:", error);
    await savePicture(driver, "error");
  } finally {
    console.log("Reporte finalizado");
    finalizarReporte(reportFileDir);
    await driver.quit();
  }
})();

const savePicture = async (driver, filename) => {
  const picture = await driver.takeScreenshot();
  const filePath = path.join(__dirname, `${filename}.png`);
  fs.writeFileSync(filePath, picture, "base64");
  console.log(`Imagen guardada en: ${filePath}`);
  return `${filename}.png`;
};

// Add row to report
const addToReport = (testName, result, reportDir, pictureDir) => {
  const status = result ? "success" : "failed";
  fs.appendFileSync(
    reportDir,
    `
    
     <tr>
            <td>${testName}</td>
            <td>${status}</td>
             <td>
               <img src="./${pictureDir}" alt="" class="img" />
            </td>
          </tr>
    
    `
  );
};

// Init reprot file
function initReportFile() {
  const filePath = path.join(__dirname, "report.html");

  fs.writeFileSync(
    filePath,
    `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reprotes Enyel</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: sans-serif;
      }
      .header {
        width: 100%;
        padding: 1em;
        border-bottom: 1px solid slategray;
      }

      .header-content {
        /* background: blue; */
        width: 100%;
        max-width: 1024px;
        margin: 0 auto;
      }

      .header-titulo {
        font-size: 20px;
        font-weight: bold;
      }

      .main {
        width: 100%;
        max-width: 1024px;
        padding: 1em;
        margin: 0 auto;
      }

      table {
        border-collapse: collapse;
      }
      th,
      td {
        border: 1px solid slategray;
        padding: 1em;
        text-align: left;
      }

      th {
        background: #f4f4f4;
      }

    .img {
        width: 350px;
        height: 200px;
      }
    </style>
  </head>
  <body>
    <header class="header">
      <div class="header-content">
        <h1 class="header-titulo">Reportes Test - Sistema de Ventas</h1>
      </div>
    </header>

    <div class="main">
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>Estado</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody>`
  );

  return filePath;
}

function finalizarReporte(reportDir) {
  fs.appendFileSync(
    reportDir,
    `
        
        </tbody>
      </table>
    </div>
  </body>
</html>
        `
  );
}

// FUNCIONES TEST

async function testLoginIncorrecto(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/");
  await driver.findElement(By.id("nombre")).sendKeys("Pedro");
  await driver.findElement(By.id("contraseña")).sendKeys(4444444);
  await driver.findElement(By.id("btn2")).click();

  addToReport(
    "Validacion login incorrecto",
    true,
    reportFileDir,
    await savePicture(driver, "login-incorrecto")
  );
}

async function testLoginCorrecto(driver, addToReport, reportFileDir) {
  await driver.findElement(By.id("nombre")).sendKeys("Caja");
  await driver.findElement(By.id("contraseña")).sendKeys(12345);
  await driver.sleep(1000);
  await driver.findElement(By.id("btn2")).click();

  addToReport(
    "Validacion login correcto",
    true,
    reportFileDir,
    await savePicture(driver, "login-correcto")
  );
}

async function testMontoCajarIncorrecto(driver, addToReport, reportFileDir) {
  await driver.wait(until.urlContains("fondo-caja"), 5000);
  await driver.findElement(By.id("btn")).click();
  await driver.sleep(1000);

  addToReport(
    "Validacion monto inicial incorrecto",
    true,
    reportFileDir,
    await savePicture(driver, "fondo-caja-incorrecto")
  );
}

async function testMontoCajaCorrecto(driver, addToReport, reportFileDir) {
  await driver.findElement(By.id("fondo-caja")).sendKeys(1500);
  await driver.findElement(By.id("btn")).click();
  addToReport(
    "Validacion monto inicial correcto",
    true,
    reportFileDir,
    await savePicture(driver, "fondo-caja-correcto")
  );
}

async function testPaginaInicio(driver, addToReport, reportFileDir) {
  await driver.wait(until.urlContains("caja"), 5000);
  await driver.findElement(By.id("btn-1")).click();

  await driver.sleep(2000);

  addToReport(
    "Validacion modales de pagina de inicio",
    true,
    reportFileDir,
    await savePicture(driver, "modal-todos-los-productos")
  );

  // ESPERAR POR EL MODAL Y CERRARLO
  await driver.wait(until.elementLocated(By.css('[aria-label="Close"]')), 5000);
  await driver.findElement(By.css('[aria-label="Close"]')).click();
  // ESPERAR POR EL MODAL Y CERRARLO

  await driver.sleep(1000);
  await driver.findElement(By.id("btn-2")).click();
  await driver.sleep(2000);

  addToReport(
    "Validacion modales de pagina de inicio",
    true,
    reportFileDir,
    await savePicture(driver, "modal-productos-en-baja")
  );

  // ESPERAR POR EL MODAL Y CERRARLO
  await driver.wait(until.elementLocated(By.css('[aria-label="Close"]')), 5000);
  await driver.findElement(By.css('[aria-label="Close"]')).click();
  // ESPERAR POR EL MODAL Y CERRARLO

  await driver.sleep(1000);
  await driver.findElement(By.id("btn-3")).click();
  await driver.sleep(2000);

  addToReport(
    "Validacion modales de pagina de inicio",
    true,
    reportFileDir,
    await savePicture(driver, "modal-productos-agotados")
  );

  // ESPERAR POR EL MODAL Y CERRARLO
  await driver.wait(until.elementLocated(By.css('[aria-label="Close"]')), 5000);
  await driver.findElement(By.css('[aria-label="Close"]')).click();
  // ESPERAR POR EL MODAL Y CERRARLO

  await driver.sleep(3000);
}

async function testPaginaVentasAlContado(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/caja/vender");
  await driver.findElement(By.id("btn")).click();
  await driver.sleep(1000);

  addToReport(
    "Validacion pagina ventas al contado",
    true,
    reportFileDir,
    await savePicture(driver, "ventas-al-contado")
  );
  await driver.sleep(1000);
}

async function testPaginaFacturasContado(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/caja/reimprimir-factura-contado");
  await driver.findElement(By.id("btn")).click();
  await driver.sleep(1000);

  addToReport(
    "Validacion pagina facturas al contado",
    true,
    reportFileDir,
    await savePicture(driver, "facturas al contado")
  );
  await driver.sleep(1000);
}

async function testPaginaVentaCredito(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/caja/venderCredito");
  await driver.wait(until.urlContains("caja/venderCredito"), 5000);
  await driver.sleep(1000);
  await driver.findElement(By.id("btn1")).click();
  await driver.sleep(1000);
  addToReport(
    "Pagina venta a credito",
    true,
    reportFileDir,
    await savePicture(driver, "venta-credito-incorrecto")
  );
  await driver.sleep(1000);
}

async function testPaginaFacturasCredito(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/caja/reimprimir-factura-credito");
  await driver.findElement(By.id("btn")).click();
  await driver.sleep(1000);

  addToReport(
    "Validacion pagina facturas credito",
    true,
    reportFileDir,
    await savePicture(driver, "facturas-a-credito")
  );
  await driver.sleep(1000);
}

async function testPaginaFacturasDevolucionesContado(
  driver,
  addToReport,
  reportFileDir
) {
  await driver.get(
    "http://localhost:5173/caja/reimprimir-factura-devolucion-contado"
  );
  await driver.findElement(By.id("btn")).click();
  await driver.sleep(1000);

  addToReport(
    "Validacion pagina facturas devoluciones contado",
    true,
    reportFileDir,
    await savePicture(driver, "facturas-devoluciones-contado")
  );
  await driver.sleep(1000);
}

async function testPaginaParaAgregarProducto(
  driver,
  addToReport,
  reportFileDir
) {
  await driver.get("http://localhost:5173/caja/comprar");
  await driver.findElement(By.id("btn1")).click();
  await driver.sleep(2000);
  await driver.findElement(By.id("btn2")).click();

  await driver.findElement(By.id("codigoAlmacen")).sendKeys("897217091241");
  await driver.findElement(By.id("nombre")).sendKeys("Filtro de aire");
  await driver.findElement(By.id("tramo")).sendKeys("A1");
  await driver.findElement(By.id("cantidad")).sendKeys(4);
  await driver.findElement(By.id("precioCompra")).sendKeys(350);
  await driver.findElement(By.id("precioVenta")).sendKeys(1250);
  await driver.findElement(By.id("minimo")).sendKeys(1);

  addToReport(
    "Validacion pagina agregar nuevo producto",
    true,
    reportFileDir,
    await savePicture(driver, "nuevo-producto-campos")
  );

  await driver.sleep(1000);
  await driver.findElement(By.id("btn2")).click();
  await driver.sleep(3000);

  addToReport(
    "Validacion pagina agregar nuevo producto",
    true,
    reportFileDir,
    await savePicture(driver, "nuevo-producto-agregado")
  );
}

async function testPaginaCobrarDeudas(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/caja/cobrar-deudas");
  await driver.findElement(By.id("btn")).click;
  await driver.sleep(1000);
  addToReport(
    "Validacion pagina cobrar deudas",
    true,
    reportFileDir,
    await savePicture(driver, "cobrar-deudas")
  );
  await driver.sleep(1000);
}

async function testPaginaDevoluciones(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/caja/devoluciones-contado");
  await driver.findElement(By.id("codigo")).sendKeys("7192");
  await driver.findElement(By.id("btn")).click();
  await driver.sleep(1000);
  addToReport(
    "Validacion buscar producto para devolucion",
    true,
    reportFileDir,
    await savePicture(driver, "devolucion-producto")
  );
}

async function testPaginaRegistrarIngreso(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/caja/registrar-ingreso");
  await driver.findElement(By.id("input1")).sendKeys(1200);
  await driver.findElement(By.id("select")).click();
  await driver.findElement(By.id("option")).click();
  await driver.findElement(By.id("input2")).sendKeys("Ingreso de test");
  await driver.findElement(By.id("btn")).click();
  await driver.sleep(2000);

  addToReport(
    "Validacion registrar ingreso",
    true,
    reportFileDir,
    await savePicture(driver, "ingreso-extra")
  );

  await driver.sleep(1000);
}

async function testPaginaRegistrarRetiro(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/caja/registrar-retiro");
  await driver.findElement(By.id("input1")).sendKeys(1200);
  await driver.findElement(By.id("input2")).sendKeys("Retiro de prueba");
  await driver.findElement(By.id("btn")).click();
  await driver.sleep(2000);

  addToReport(
    "Validacion retiro ",
    true,
    reportFileDir,
    await savePicture(driver, "registrar-retiro")
  );

  await driver.sleep(1000);
}

async function testGeneracionDeFactura(driver, addToReport, reportFileDir) {
  await driver.get("http://localhost:5173/caja/facturar-venta");
  await driver.findElement(By.id("btn")).click();
  await driver.sleep(2000);

  addToReport(
    "Validacion Generar factura incorrecto",
    true,
    reportFileDir,
    await savePicture(driver, "factura-custom-incorrecto")
  );
}
