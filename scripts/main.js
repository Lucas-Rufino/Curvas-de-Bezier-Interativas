const stroke_control = 2;
const stroke_circle = 2;
const radius_circle = 6;
const stroke_curve = 3;
const base_color = '#95a5a6';

var colors=[['#1abc9c', true],
            ['#2ecc71', true],
            ['#3498db', true],
            ['#9b59b6', true],
            ['#f1c40f', true],
            ['#e67e22', true],
            ['#e74c3c', true],
            ['#34495e', true],
            ['#16a085', true],
            ['#27ae60', true],
            ['#2980b9', true],
            ['#8e44ad', true],
            ['#f39c12', true],
            ['#d35400', true],
            ['#c0392b', true],
            ['#2c3e50', true],];
var curves = [];
var index = -1;
var cbAll = false;

insertGrid();
insertCurve([true, true, true, 200]);

function Curve(color, cbPoint, cbPolygon, cbCurve, nfEvaluation) {
    var controlPoints;
    var controlPath;
    var curvePath;
    var cbPoints;
    var cbPolygon;
    var cbCurve;
    var nfEvaluation;
    var color;

    this.color = color;
    this.controlPoints = [];
    this.controlPath = new Path().stroke(base_color, stroke_control).addTo(stage);
    this.curvePath = new Path().stroke(colors[this.color][0], stroke_curve).addTo(stage);
    this.cbPoints = cbPoint;
    this.cbPolygon = cbPolygon;
    this.cbCurve = cbCurve;
    this.nfEvaluation = nfEvaluation;

    this.getLengthPoints = function(){
        return this.controlPoints.length;
    };

    this.getColor = function(){
        return this.color;
    };

    this.getCBPoints = function(){
        return this.cbPoints;
    };

    this.getCBPolygon = function(){
        return this.cbPolygon;
    };

    this.getCBCurve = function(){
        return this.cbCurve;
    };

    this.getNFEvaluation = function(){
        return this.nfEvaluation;
    };

    this.setCBPoints = function(value){
        this.cbPoints = value;
    };

    this.setCBPolygon = function(value){
        this.cbPolygon = value;
    };

    this.setCBCurve = function(value){
        this.cbCurve = value;
    };

    this.setNFEvaluation = function(value){
        this.nfEvaluation = value;
    };

    this.insertPoint = function(x, y){
        this.controlPoints.push(new Circle(x, y, radius_circle).fill(base_color).stroke(colors[this.color][0], stroke_circle).addTo(stage));
        if(this.controlPath.segments().length === 0) this.controlPath.moveTo(x, y);
        else this.controlPath.lineTo(x, y);
    };

    this.removePoint = function(obj){
        for(var i=0 ; i<this.controlPoints.length ; i++){
            if(this.controlPoints[i] == obj){
                stage.removeChild(this.controlPoints[i]);
                this.controlPoints.splice(i, 1);
                this.controlPath.clear();
                for(var i=0 ; i<this.controlPoints.length ; i++){
                    if(this.controlPath.segments().length === 0) this.controlPath.moveTo(this.controlPoints[i].attr('x'), this.controlPoints[i].attr('y'));
                    else this.controlPath.lineTo(this.controlPoints[i].attr('x'), this.controlPoints[i].attr('y'));
                }
                break;
            }
        }
    };

    this.redraw = function(id = -1){
        if(this.cbPoints){
            for(var i=0 ; i<this.controlPoints.length ; i++){
                this.controlPoints[i].attr('radius', radius_circle);
                this.controlPoints[i].attr('strokeWidth', stroke_circle);
            }
        } else {
            for(var i=0 ; i<this.controlPoints.length ; i++){
                this.controlPoints[i].attr('radius', 0);
                this.controlPoints[i].attr('strokeWidth', 0);
            }
        }

        if(id != -1) this.redrawControl(id);
        if(this.cbPolygon) this.controlPath.attr('strokeWidth', stroke_control);
        else this.controlPath.attr('strokeWidth', 0);

        if(this.cbCurve){
            this.redrawCurve();
            this.curvePath.attr('strokeWidth', stroke_curve);
        } else this.curvePath.attr('strokeWidth', 0);
    };

    this.redrawControl = function(id){
        var circleIndex = this.searchCircle(id);
        var segments = this.controlPath.segments();
        segments[circleIndex][1] = this.controlPoints[circleIndex].attr('x');
        segments[circleIndex][2] = this.controlPoints[circleIndex].attr('y');
        this.controlPath.segments(segments);
    };

    this.redrawCurve = function(){
        if(this.controlPoints.length >= 2){
            this.curvePath.clear();
            this.curvePath.moveTo(this.controlPoints[0].attr('x'), this.controlPoints[0].attr('y'));
            var step = 1/this.nfEvaluation;
            for(var t=step, c=(1-t) ; t<1 ; t+=step, c-=step){
                var aux = this.controlPath.segments();
                for(var i=aux.length-1 ; i>=0 ; i--){
                    for(var j=0, nj=0 ; j<i ; j++){
                        nj = j+1;
                        aux[j][1] = c*aux[j][1] + t*aux[nj][1];
                        aux[j][2] = c*aux[j][2] + t*aux[nj][2];
                    }
                }
                this.curvePath.lineTo(aux[0][1], aux[0][2]);
            }
            var final = this.controlPoints.length-1;
            this.curvePath.lineTo(this.controlPoints[final].attr('x'), this.controlPoints[final].attr('y'));
        } else {
            this.curvePath.clear();
            this.curvePath.moveTo(0, 0);
            this.curvePath.lineTo(0, 0);
        }
    };

    this.removeCurve = function(){
        stage.removeChild(this.controlPath);
        stage.removeChild(this.curvePath);
        for(var i=0 ; i<this.controlPoints.length ; i++){
            stage.removeChild(this.controlPoints[i]);
        }
    };

    this.searchCircle = function(id){
        var begin = 0, end = this.controlPoints.length-1;
        var mean, value;
        while (begin <= end){
            mean = parseInt((begin + end)/2);
            value = this.controlPoints[mean].id;
            if(id == value) return mean;
            if(id < value) end = mean-1;
            else begin = mean+1;
        }
        return -1;
    }
}

function searchCurve(id){
    var curveIndex = -1;
    for(var i=0 ; i<curves.length && curveIndex==-1; i++){
        if(curves[i].searchCircle(id) != -1){
            curveIndex = i;
        }
    }
    return curveIndex;
}

function insertGrid(){
    for(var i=30 ; i<5000 ; i+=30){
        var path = new Path().stroke('#ecf0f1', 1).addTo(stage);
        path.moveTo(i, 0);
        path.lineTo(i, 5000);
        path = new Path().stroke('#ecf0f1', 1).addTo(stage);
        path.moveTo(0, i);
        path.lineTo(5000, i);
    }
    path = new Path().stroke('#bdc3c7', 1).addTo(stage);
    path.moveTo(0, 0);
    path.lineTo(0, 5000);
}

function findNextColor(){
    for(var i=0 ; i<colors.length ; i++){
        if(colors[i][1]){
            colors[i][1] = false;
            return i;
        }
    }
    return ((index+1)%colors.length);
}

function insertCurve(control){
    var color = findNextColor();
    var curve = new Curve(color, control[0], control[1], control[2], control[3]);
    curves.push(curve);
    stage.sendMessage('insertCurveHTML', {
        data: [curves.length, curve.getCBPoints(), curve.getCBPolygon(), curve.getCBCurve(), curve.getNFEvaluation()]
    });
}

stage.on('message:insertCurve', function(data) {
    insertCurve(data.data);
})

stage.on('message:removeCurve', function(data) {
    if(index >= 0){
        var curve = curves[data.data];
        colors[curve.getColor()][1] = true;
        curves[data.data].removeCurve();
        curves.splice(data.data, 1);
        stage.sendMessage('removeCurveHTML', {});
    }
})

stage.on('message:selectCBAll', function(data) {
    cbAll = data.data;
    if(cbAll){
        var curve = curves[index];
        for(var i=0 ; i<curves.length ; i++){
            curves[i].setCBPoints(curve.getCBPoints());
            curves[i].setCBPolygon(curve.getCBPolygon());
            curves[i].setCBCurve(curve.getCBCurve());
            curves[i].setNFEvaluation(curve.getNFEvaluation());
            curves[i].redraw();
        }
    }
})

stage.on('message:selectCBPoint', function(data) {
    if(cbAll){
        for(var i=0 ; i<curves.length ; i++){
            curves[i].setCBPoints(data.data);
            curves[i].redraw();
        }
    } else {
        var curve = curves[index];
        curve.setCBPoints(data.data);
        curve.redraw();
    }
})

stage.on('message:selectCBPolygon', function(data) {
    if(cbAll){
        for(var i=0 ; i<curves.length ; i++){
            curves[i].setCBPolygon(data.data);
            curves[i].redraw();
        }
    } else {
        var curve = curves[index];
	   curve.setCBPolygon(data.data);
        curve.redraw();
    }
})

stage.on('message:selectCBCurve', function(data) {
    if(cbAll){
        for(var i=0 ; i<curves.length ; i++){
            curves[i].setCBCurve(data.data);
            curves[i].redraw();
        }
    } else {
        var curve = curves[index];
	    curve.setCBCurve(data.data);
        curve.redraw();
    }
})

stage.on('message:modifyEvaluation', function(data) {
    if(cbAll){
        for(var i=0 ; i<curves.length ; i++){
            curves[i].setNFEvaluation(data.data);
            curves[i].redraw();
        }
    } else {
        var curve = curves[index];
	    curve.setNFEvaluation(data.data);
        curve.redrawCurve();
    }
})

stage.on('message:selectCurve', function(data) {
	if(data.data >= 0){
        index = data.data;
        var curve = curves[data.data];
        stage.sendMessage('selectCurveHTML', {
            data: [curve.getCBPoints(), curve.getCBPolygon(), curve.getCBCurve(), curve.getNFEvaluation(), colors[curve.getColor()][0]]
        });
    } else {
        index = -1;
        stage.sendMessage('selectCurveHTML', {
            data: [true, true, true, 200]
        });
    }
})

stage.on('pointerdown', function(event) {
    if(index >= 0){
        if(!(event.target instanceof Circle)) {
            var curve = curves[index];
            curve.insertPoint(event.x, event.y);
            curve.redraw();
        } else {
            var point = event.target;
            var curve = curves[searchCurve(point.id)];
            var delay = 0;
            var max = curve.getLengthPoints()*curve.getNFEvaluation()/1600;
            
            point.on('drag', function(dEvent) {
                this.attr({x: dEvent.x, y: dEvent.y});
                curve.redrawControl(this.id);
                if(delay++ > max){
                    curve.redrawCurve();
                    delay = 0;
                }
            });

            point.on('pointerup', function(rEvent){
                if(delay != 0){
                    curve.redraw(point.id);
                    delay = 0;
                }
            });

            point.on('doubleclick', function(rEvent) {
                curve.removePoint(this);
                curve.redrawCurve();
            });
        }
    }
});