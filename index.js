const { Builder, Browser, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

(async function example() {
  const reportFileDir = initReportFile();
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    // LOGIN INCORRECTO
    await driver.get("http://localhost:5173/");
    await driver.findElement(By.id("nombre")).sendKeys("Pedro");
    await driver.findElement(By.id("contraseña")).sendKeys(4444444);
    await driver.findElement(By.id("button")).click();

    addToReport(
      "Validacion login incorrecto",
      true,
      reportFileDir,
      await savePicture(driver, "login-incorrecto")
    );
    // LOGIN INCORRECTO

    // LIAMPIANDO INPUTS
    await driver.sleep(2000);
    await driver.findElement(By.id("nombre")).clear();
    await driver.findElement(By.id("contraseña")).clear();
    await driver.sleep(2000);
    // LIAMPIANDO INPUTS

    // LOGIN CORRECTO
    await driver.findElement(By.id("nombre")).sendKeys("Caja");
    await driver.findElement(By.id("contraseña")).sendKeys(12345);
    await driver.sleep(1000);
    await driver.findElement(By.id("button")).click();

    addToReport(
      "Validacion login correcto",
      true,
      reportFileDir,
      await savePicture(driver, "login-correcto")
    );
    // LOGIN CORRECTO

    // MOTNO CAJA INCORRECTO
    await driver.wait(until.urlContains("fondo-caja"), 5000);
    await driver.findElement(By.id("btn")).click();
    await driver.sleep(1000);

    addToReport(
      "Validacion monto inicial incorrecto",
      true,
      reportFileDir,
      await savePicture(driver, "fondo-caja-incorrecto")
    );
    // MOTNO CAJA INCORRECTO

    await driver.sleep(2000);

    // MONTO CAJA CORRECTO
    await driver.findElement(By.id("fondo-caja")).sendKeys(1500);
    await driver.findElement(By.id("btn")).click();
    addToReport(
      "Validacion monto inicial correcto",
      true,
      reportFileDir,
      await savePicture(driver, "fondo-caja-correcto")
    );
    // MONTO CAJA CORRECTO

    await driver.sleep(2000);

    // PAGINA DE INICIO
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
    await driver.wait(
      until.elementLocated(By.css('[aria-label="Close"]')),
      5000
    );
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
    await driver.wait(
      until.elementLocated(By.css('[aria-label="Close"]')),
      5000
    );
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
    await driver.wait(
      until.elementLocated(By.css('[aria-label="Close"]')),
      5000
    );
    await driver.findElement(By.css('[aria-label="Close"]')).click();
    // ESPERAR POR EL MODAL Y CERRARLO

    await driver.sleep(3000);
    // PAGINA DE INICIO

    // PAGINA DE VENTAS AL CONTADO
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
    // PAGINA DE VENTAS AL CONTADO

    // PAGINA FACTURAS DE VENTAS AL CONTADO
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
    // PAGINA FACTURAS DE VENTAS AL CONTADO
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
