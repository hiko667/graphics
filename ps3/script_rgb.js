const elements = {

    rgbR: document.getElementById('rgb-r'),
    rgbG: document.getElementById('rgb-g'),
    rgbB: document.getElementById('rgb-b'),

    txtRgbR: document.getElementById('txt-rgb-r'),
    txtRgbG: document.getElementById('txt-rgb-g'),
    txtRgbB: document.getElementById('txt-rgb-b'),

    cmykC: document.getElementById('cmyk-c'),
    cmykM: document.getElementById('cmyk-m'),
    cmykY: document.getElementById('cmyk-y'),
    cmykK: document.getElementById('cmyk-k'),

    txtCmykC: document.getElementById('txt-cmyk-c'),
    txtCmykM: document.getElementById('txt-cmyk-m'),
    txtCmykY: document.getElementById('txt-cmyk-y'),
    txtCmykK: document.getElementById('txt-cmyk-k'),

    colorPreview: document.getElementById('color-preview'),
};

function rgbToCmyk(r, g, b) {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    
    if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    const c = (1 - rNorm - k) / (1 - k);
    const m = (1 - gNorm - k) / (1 - k);
    const y = (1 - bNorm - k) / (1 - k);

    return {
        c: parseFloat((c * 100).toFixed(1)),
        m: parseFloat((m * 100).toFixed(1)),
        y: parseFloat((y * 100).toFixed(1)),
        k: parseFloat((k * 100).toFixed(1))
    };
}

function cmykToRgb(c, m, y, k) {
    const cNorm = c / 100;
    const mNorm = m / 100;
    const yNorm = y / 100;
    const kNorm = k / 100;

    const r = 255 * (1 - cNorm) * (1 - kNorm);
    const g = 255 * (1 - mNorm) * (1 - kNorm);
    const b = 255 * (1 - yNorm) * (1 - kNorm);

    return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
    };
}


function updateFromRGB() {
    const r = parseInt(elements.rgbR.value, 10);
    const g = parseInt(elements.rgbG.value, 10);
    const b = parseInt(elements.rgbB.value, 10);

    elements.txtRgbR.value = r;
    elements.txtRgbG.value = g;
    elements.txtRgbB.value = b;

    const cmyk = rgbToCmyk(r, g, b);

    elements.cmykC.value = cmyk.c;
    elements.cmykM.value = cmyk.m;
    elements.cmykY.value = cmyk.y;
    elements.cmykK.value = cmyk.k;
    elements.txtCmykC.value = cmyk.c;
    elements.txtCmykM.value = cmyk.m;
    elements.txtCmykY.value = cmyk.y;
    elements.txtCmykK.value = cmyk.k;

    elements.colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function updateFromCMYK() {
    const c = parseFloat(elements.cmykC.value);
    const m = parseFloat(elements.cmykM.value);
    const y = parseFloat(elements.cmykY.value);
    const k = parseFloat(elements.cmykK.value);

    elements.txtCmykC.value = c.toFixed(1);
    elements.txtCmykM.value = m.toFixed(1);
    elements.txtCmykY.value = y.toFixed(1);
    elements.txtCmykK.value = k.toFixed(1);

    const rgb = cmykToRgb(c, m, y, k);

    elements.rgbR.value = rgb.r;
    elements.rgbG.value = rgb.g;
    elements.rgbB.value = rgb.b;
    elements.txtRgbR.value = rgb.r;
    elements.txtRgbG.value = rgb.g;
    elements.txtRgbB.value = rgb.b;

    elements.colorPreview.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}


['rgb-r', 'rgb-g', 'rgb-b', 'txt-rgb-r', 'txt-rgb-g', 'txt-rgb-b'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
        if (id.startsWith('txt-')) {
            document.getElementById(id.substring(4)).value = el.value;
        } else {
            document.getElementById('txt-' + id).value = el.value;
        }
        updateFromRGB();
    });
});

['cmyk-c', 'cmyk-m', 'cmyk-y', 'cmyk-k', 'txt-cmyk-c', 'txt-cmyk-m', 'txt-cmyk-y', 'txt-cmyk-k'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
        if (id.startsWith('txt-')) {
            document.getElementById(id.substring(4)).value = el.value;
        } else {
            document.getElementById('txt-' + id).value = el.value;
        }
        updateFromCMYK();
    });
});

updateFromRGB();