var GLOB = {
  canvasWidth: 1050,
  canvasHeight: 1485,
  cardWidth: 1050/4,
  cardHeight: 1485/3,
  netStyleDash: [5, 15],
  morse1: {
    A : [".-", "AKÁT"],
    B : ["-...", "BLÝSKAVICE"],
    C : ["-.-.", "CÍLOVNÍCI"],
    D : ["-..", "DÁLAVA"],
    E : [".", "ERB"],
    F : ["..-.", "FILIPÍNY"],
    G : ["--.", "GRÓNSKÁ ZEM"],
    H : ["....", "HRACHOVINA"],
    CH : ["----", "CHVÁTÁ K NÁM SÁM"],
    I : ["..", "IBIS"],
    J : [".---", "JASMÍN BÍLÝ"],
    K : ["-.-", "KRÁKORÁ"],
    L : [".-..", "LUPÍNEČEK"],
    M : ["--", "MÁVÁ"],
    N : ["-.", "NÁSTUP"],
    O : ["---", "Ó NÁŠ PÁN"],
    P : [".--.", "PAPÍRNÍCI"],
    Q : ["--.-", "KVÍLÍ ORKÁN"],
    R : [".-.", "RARÁŠEK"],
    S : ["...", "SOBOTA"],
    T : ["-", "TRÁM"],
    U : ["..-", "ULIČNÍK"],
    V : ["...-", "VYUČENÝ"],
    W : [".--", "WAGÓN KLÁD"],
    X : ["-..-", "XÉNOKRATÉS"],
    Y : ["-.--", "ÝGAR MÁVÁ"],
    Z : ["--..", "ZNÁMÁ ŽENA"]
  },
  morse: {
    A  : ["...","AMULET"],
    B  : ["---","BÍLÁ HŮL"],
    C  : ["..-","CELOFÁN"],
    D  : ["-","DRÁT"],
    E  : [".--","ELFÍ PLÁŠŤ"],
    F  : ["..--","FALEŠNÝ KNÍR"],
    G  : [".-.","GUMÁKY"],
    H  : ["...-","HRST OŘECHŮ"],
    CH : ["-..-","CHRÁPADELNÍK"],
    I  : ["..-.","INSTANTNÍ MED"],
    J  : ["---.","JÍZDNÍ ŘÁDY"],
    K  : [".-","KŘÍDA"],
    L  : ["-...","LÁHEV RUMU"],
    M  : ["-.-.","MÁTOVÝ ČAJ"],
    N  : ["-.-","NÁDOBÍ"],
    O  : [".-..","OSLÍ OCAS"],
    P  : [".--.","PAVÍ PÉRO"],
    Q  : ["-.","QVÉČKO"],
    R  : [".-","RUČNÍK"],
    S  : ["-..","SVÍTILNA"],
    T  : ["..","TURBAN"],
    U  : ["--..","ÚSTNÍ VODA"],
    V  : ["-.--","VÁLEČNÝ KŘÍŽ"],
    W  : [".","WRH"],
    X  : [".-.-","X KRÁT KVADRÁT"],
    Y  : ["....","YETIHO ZUB"],
    Z  : [".---","ZRAJÍCÍ SÝR"]
    //bedna.org, bednářské listy 2003: Ručník, ústní voda, hrst ořechů, instatní med, zrající sýr, mátový čaj, láhev rumu, nádobí, celofán, drát, křída, svítilna, jízdní řády, turban gumáky, bílá hůl, amulet, válečný kříž, falešný knír, oslí ocas, paví péro, elfí plášť a Yettiho zub.
  }
}

// draw given letter on the n-th order, so for n=0..3 it is at the first row, 4..7 second and 8..11 third row
function drawCard(letter, n, ctx) {
  let x = n % 4
  let y = Math.floor(n / 4) % 3

  var img = document.getElementById("img-background");
  ctx.drawImage(img, x * GLOB.cardWidth, y * GLOB.cardHeight, GLOB.cardWidth, GLOB.cardHeight);

  // write the Letter TOP
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.font = "140px Arial";
  let letterInfo = ctx.measureText(letter)
  ctx.fillText(letter, (x + 0.5) * GLOB.cardWidth - letterInfo.width / 2, (y + 0.333) * GLOB.cardHeight /*- 140 / 5*/ );

  // draw morse dots and dashes
  let morseDef = GLOB.morse[letter][0]
  let dotDiameter = GLOB.cardWidth / 13 // because dash is like two dots and ---- means 5x dot as the space and 4x 2x dot inside
  if (morseDef) {
    let morseAr = morseDef.split("")
    let dotsCount = morseAr.filter(ch => ch==".").length
    let spaces = Math.max(morseAr.length - 1, 0)
     let morseWidth = (spaces + dotsCount + 2 * (morseAr.length - dotsCount)) * dotDiameter
    let mx = dotDiameter / 2 + (GLOB.cardWidth - morseWidth) / 2
    let my = 0.6 * GLOB.cardHeight + dotDiameter // JUST have it over the indian background mouth
    for (let i = 0; i < morseAr.length; i++) {
      // console.log("would like to draw dot for letter " + letter + " at row: " + row +" and col:" + col)
      if (morseAr[i]===".") {
        ctx.beginPath();
        ctx.arc(x * GLOB.cardWidth + mx, y * GLOB.cardHeight + my, dotDiameter / 2, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        mx += 2 * dotDiameter
      } else {
        ctx.beginPath();
        ctx.rect(x * GLOB.cardWidth + mx - dotDiameter / 2, y * GLOB.cardHeight + my - dotDiameter / 2, 2 * dotDiameter, dotDiameter);
        ctx.fill();
        ctx.stroke();
        mx += 3 * dotDiameter
      }
    }
  }

  // draw the mnemo text
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.font = "bold 32px Arial";
  let mnemo = GLOB.morse[letter][1]
  let textWidth = GLOB.cardWidth
  let fontPx = 34
  while (textWidth > 0.95 * GLOB.cardWidth) {
    fontPx -= 2
    ctx.font = "bold " + fontPx + "px Arial";
    textWidth = ctx.measureText(mnemo).width
  }
  ctx.fillText(mnemo, (x + 0.5) * GLOB.cardWidth - textWidth / 2, (y + 1 - 0.333/2) * GLOB.cardHeight + 140 / 5 );
}

function drawCardFront(n, ctx) {
  let x = n % 4
  let y = Math.floor(n / 4) % 3
  var img = document.getElementById("img-foreground");
  ctx.drawImage(img, x * GLOB.cardWidth, y * GLOB.cardHeight, GLOB.cardWidth, GLOB.cardHeight);
}

function drawCards(letters, ctx) {
  for (let i = 0; i < letters.length; i++) {
    drawCard(letters[i], i, ctx)
  }
}

function drawNet(ctx) {
  function drawVerticals() {
    let x0 = 0
    let y0 = 0
    let y1 = GLOB.canvasHeight
    let xShift = GLOB.canvasWidth / 4
    for (let x = 0; x<=4; x++) {
      ctx.beginPath();
      ctx.moveTo(x0 + x * xShift, y0);
      ctx.lineTo(x0 + x * xShift, y1);
      ctx.stroke();
    }
  }
  function drawHorizontals() {
    let x0 = 0
    let y0 = 0
    let x1 = GLOB.canvasWidth
    let yShift = GLOB.canvasHeight / 3  // note, the same as in vertical, to make it squarish
    for (let y = 0; y<=3; y++) {
      ctx.beginPath();
      ctx.moveTo(x0, y0 + y * yShift);
      ctx.lineTo(x1, y0 + y * yShift);
      ctx.stroke();
    }
  }
  ctx.setLineDash([]);
  ctx.lineWidth = 1;
  drawVerticals()
  drawHorizontals()
}

function drawPage(letters, canvas) {
  let ctx = canvas.getContext("2d")
  drawCards(letters, ctx)
  drawNet(ctx)
}

function drawFrontPage(canvas) {
  let ctx = canvas.getContext("2d")
  for (let i = 0; i<12; i++) {
    drawCardFront(i, ctx)
  }
}
