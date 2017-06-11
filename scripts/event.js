function insertCurve(){
    if(document.getElementById('cbAll').checked){
        var cbPoint = document.getElementById('cbPoint').checked
        var cbPolygon = document.getElementById('cbPolygon').checked
        var cbCurve = document.getElementById('cbCurve').checked
        var nfEvaluation = document.getElementById('nfEvaluation').value
        m.sendMessage('insertCurve', {
            data: [cbPoint, cbPolygon, cbCurve, nfEvaluation]
        });
    } else {
        m.sendMessage('insertCurve', {
            data: [true, true, true, 200]
        });
    }
}

function removeCurve(){
	var sCurve = document.getElementById('sCurve').selectedIndex
    m.sendMessage('removeCurve', {
        data: sCurve
    });
}

function selectCurve(){
    var sCurve = document.getElementById('sCurve').selectedIndex
    m.sendMessage('selectCurve', {
        data: sCurve
    });
}

function selectCBAll(){
    var cbAll = document.getElementById('cbAll').checked
    m.sendMessage('selectCBAll', {
        data: cbAll
    });
}

function selectCBPoint(){
	var cbPoint = document.getElementById('cbPoint').checked
	m.sendMessage('selectCBPoint', {
        data: cbPoint
    });
}

function selectCBPolygon(){
	var cbPolygon = document.getElementById('cbPolygon').checked
	m.sendMessage('selectCBPolygon', {
        data: cbPolygon
    });
}

function selectCBCurve(){
	var cbCurve = document.getElementById('cbCurve').checked
	m.sendMessage('selectCBCurve', {
        data: cbCurve
    });
}

function modifyEvaluation(){
	var nfEvaluation = document.getElementById('nfEvaluation');
    if(nfEvaluation.value >= 0){
        m.sendMessage('modifyEvaluation', {
            data: nfEvaluation.value
        });
    } else {
        m.sendMessage('modifyEvaluation', {
            data: 0
        });
        nfEvaluation.value = 0;
    }
}