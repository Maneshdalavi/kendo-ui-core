/*
 Defines some methods which are generic to a Shape implementing its own inner layout on resize.
 * */
var SelfLayoutShape = window.kendo.Class.extend({
        init: function (options) {
        },

        DFT: function (el, func) {
            func(el);
            if (el.childNodes) {
                for (var i = 0; i < el.childNodes.length; i++) {
                    var item = el.childNodes[i];
                    this.DFT(item, func);
                }
            }
        },

        /*
         Returns the angle in degrees for the given matrix
         */
        getMatrixAngle: function (m) {
            if (m === null || m.d === 0) return 0;
            return Math.atan2(m.b, m.d) * 180 / Math.PI;
        },

        /*
         Returns the scaling factors for the given matrix.
         */
        getMatrixScaling: function (m) {
            var sX = Math.sqrt(m.a * m.a + m.c * m.c);
            var sY = Math.sqrt(m.b * m.b + m.d * m.d);
            return [sX, sY];
        }

    })
    ;

var mediaPlayerShape = SelfLayoutShape.extend({
    init: function (options) {
        SelfLayoutShape.fn.init.call(this, options);
    },
    options: {
        name: "Special",
        data: function (data) {

            // define the elements of the shape and in the layout method define how they are positioned upon resize

            var g = new kendo.diagram.Group({
                autoSize: true,
                id: "shapeRoot"
            });
            var background = new kendo.diagram.Rectangle({
                width: 100,
                height: 100,
                background: "dimgray",
                id: "background"
            });
            g.append(background);

            var view = new kendo.diagram.Rectangle({
                width: 90,
                height: 60,
                background: "silver",
                id: "view"
            });
            view.native.setAttribute("transform", "translate(5,5)");
            g.append(view);

            var playBar = new kendo.diagram.Rectangle({
                width: 90,
                height: 10,
                background: "steelblue",
                cornerRadius: 6,
                id: "playBar"
            });
            playBar.native.setAttribute("transform", "translate(5,78)");
            g.append(playBar);

            var playGroup = new kendo.diagram.Group({
                id: "playGroup"
            });
            playGroup.native.setAttribute("transform", "translate(35,70)");
            g.append(playGroup);

            var playCircle = new kendo.diagram.Circle({
                radius: 15,
                background: "silver",
                id: "playCircle"
            });
            playGroup.append(playCircle);

            var playIcon = new kendo.diagram.Path({
                data: "m7.5,5.5l0,18l18.25,-9.69231l-18.25,-8.30769z",
                background: "orange"
            });
            playGroup.append(playIcon);
            return g;
        },
        connectors: [],


        layout: function (shape, oldBounds, newBounds) {
            var that = shape.options.parent();
            if (!kendo.diagram.Utils.isDefined(newBounds)) {
                newBounds = shape.bounds();
            }
            if (!kendo.diagram.Utils.isDefined(oldBounds)) {
                oldBounds = shape.bounds();
            }
            var c = newBounds.center();
            //var sx = newBounds.width / oldBounds.width;
            var sy = newBounds.height / oldBounds.height;
            var svg = shape.visual.native.ownerSVGElement;
            var consolidatedMatrix = svg.createSVGTransform().matrix;
            var p = new kendo.diagram.Point(c.x - newBounds.x - 25, c.y - newBounds.y - 25);

            // do not use this since it will access the item in the toolbox...!
            // var special = document.getElementById("special");

            var shapeRoot;
            that.DFT(shape.visual.native, function (n) {
                if (n.id === "shapeRoot") {
                    shapeRoot = n;
                    n.removeAttribute("transform");
                }
                if (n.id === "background") {
                    n.removeAttribute("transform");
                    n.setAttribute("width", newBounds.width);
                    n.setAttribute("height", newBounds.height);
                }
                if (n.id === "playBar") {
                    n.removeAttribute("transform");
                    n.setAttribute("width", newBounds.width - 20);
                    n.setAttribute("x", 10);
                    n.setAttribute("y", newBounds.height - 30);
                }
                if (n.id === "playGroup") {
                    /*n.setAttribute("cx", newBounds.width/2);
                     n.setAttribute("cy", newBounds.height-25);*/
                    n.setAttribute("transform", "translate(" + (newBounds.width / 2 - 15) + "," + (newBounds.height - 40) + ")");
                }
                if (n.id === "view") {
                    n.removeAttribute("transform");
                    n.setAttribute("width", newBounds.width - 10);
                    n.setAttribute("height", newBounds.height - 50);
                    n.setAttribute("x", 5);
                    n.setAttribute("y", 5);

                    /*
                     // the following undoes the scaling of the parent if it's not reset earlier
                     var resetScaling = svg.createSVGTransform();
                     var s = that.getMatrixScaling(shapeRoot.getCTM());
                     resetScaling.setScale(1 / s[0], 1 / s[1]);
                     consolidatedMatrix = consolidatedMatrix.multiply(resetScaling.matrix);*/

                    /* var shift = svg.createSVGTransform();
                     shift.setTranslate(p.x, p.y);
                     consolidatedMatrix = consolidatedMatrix.multiply(shift.matrix);

                     var m = consolidatedMatrix;
                     n.setAttribute("transform", "matrix(" + m.a + " " + m.b + " " + m.c + " " + m.d + " " + m.e + " " + m.f + ")");*/
                }
            });


        }

    }
});
var tabControl = SelfLayoutShape.extend({
    init: function (options) {
        SelfLayoutShape.fn.init.call(this, options);
    },
    options: {
        name: "Special",
        data: function (data) {
            function makeTab (index, title) {
                var g = new kendo.diagram.Group({
                    autoSize: true,
                    id: "tabGroup" + index
                });
                var tabRectangle = new kendo.diagram.Rectangle({
                    width: 100,
                    height: 30,
                    background: "silver",
                    id: "tabRectangle" + index
                });
                //tabRectangle.native.setAttribute("transform", "translate(0,0)");
                g.append(tabRectangle);

                var text = new kendo.diagram.TextBlock();
                text.content(title);
                text.native.setAttribute("transform", "translate(10,10)");
                g.append(text);

                return g;
            }
            var g = new kendo.diagram.Group({
                autoSize: true,
                id: "shapeRoot"
            });
            var background = new kendo.diagram.Rectangle({
                width: 100,
                height: 100,
                background: "dimgray",
                id: "background"
            });
            g.append(background);

            var tab1 = makeTab(1, "Tab1");
            tab1.native.setAttribute("transform", "translate(5,0)");
            g.append(tab1);

            var tab2 = makeTab(2, "Tab2");
            tab2.native.setAttribute("transform", "translate(105,0)");
            g.append(tab2);


            return g;
        },
        connectors: [],


        layout: function (shape, oldBounds, newBounds) {
            var that = shape.options.parent();
            if (!kendo.diagram.Utils.isDefined(newBounds)) {
                newBounds = shape.bounds();
            }
            if (!kendo.diagram.Utils.isDefined(oldBounds)) {
                oldBounds = shape.bounds();
            }
            var c = newBounds.center();
            var svg = shape.visual.native.ownerSVGElement;

            var p = new kendo.diagram.Point(c.x - newBounds.x - 25, c.y - newBounds.y - 25);

            var shapeRoot;
            that.DFT(shape.visual.native, function (n) {
                if (n.id === "shapeRoot") {
                    shapeRoot = n;
                    n.removeAttribute("transform");
                }
                if (n.id === "background") {
                    n.removeAttribute("transform");
                    n.setAttribute("width", newBounds.width);
                    n.setAttribute("height", newBounds.height - 35);
                    n.setAttribute("x", 0);
                    n.setAttribute("y", 30);
                }

                if (n.id === "tab1") {
                    n.removeAttribute("transform");
                    n.setAttribute("width", 100);
                    n.setAttribute("height", 30);
                    n.setAttribute("transform", "translate(" + 5 + "," + 0 + ")");
                }
                if (n.id === "tab2") {
                    n.removeAttribute("transform");
                    n.setAttribute("width", 100);
                    n.setAttribute("height", 30);
                    n.setAttribute("transform", "translate(" + 205 + "," + 0 + ")");
                }
            });


        }

    }
});
var shapesSource = [
    new mediaPlayerShape(),
    new tabControl()     ,
    {
        options: {
            name: "Circle",
            data: "Circle",
            rx: 50,
            ry: 50
        }
    },
    {
        options: {
            name: "Triangle",
            data: "m0,100 L100,100 L50,0z",
            connectors: [
                {
                    name: "Top",
                    position: function (shape) {
                        return shape._transformPoint(shape.bounds().top());
                    }
                },
                {
                    name: "Right",
                    position: function (shape) {
                        return shape._transformPoint(shape.bounds().bottomRight());
                    }
                },
                {
                    name: "Left",
                    position: function (shape) {
                        return shape._transformPoint(shape.bounds().bottomLeft());
                    }
                },
                {
                    name: "Auto"
                }
            ]
        }
    },
    {
        options: {
            name: "Sequential Data",
            data: "m50.21875,97.4375l0,0c-26.35457,0 -47.71875,-21.25185 -47.71875,-47.46875l0,0c0,-26.21678 21.36418,-47.46875 47.71875,-47.46875l0,0c12.65584,0 24.79359,5.00155 33.74218,13.90339c8.94862,8.90154 13.97657,20.97617 13.97657,33.56536l0,0c0,12.58895 -5.02795,24.66367 -13.97657,33.56542l13.97657,0l0,13.90333l-47.71875,0z",
            connectors: [
                {
                    name: "Top",
                    description: "Top Connector"
                },
                {
                    name: "Right",
                    description: "Right Connector"
                },
                {
                    name: "Bottom",
                    description: "Bottom Connector"
                },
                {
                    name: "BottomRight",
                    description: "Bottom Connector"
                },
                {
                    name: "Left",
                    Description: "Left Connector"
                },
                {
                    name: "Auto",
                    Description: "Auto Connector",
                    position: function (shape) {
                        return shape.getPosition("center");
                    }
                }
            ],
            content: "Custom connectors",
            width: 150,
            height: 150
        }
    },
    {
        options: {
            name: "Data",
            data: "m2.5,97.70305l19.07013,-95.20305l76.27361,0l-19.0702,95.20305l-76.27354,0z"
        }
    },
    {
        options: {
            name: "Wave",
            data: "m2.5,15.5967c31.68356,-45.3672 63.37309,45.3642 95.05661,0l0,81.65914c-31.68353,45.36404 -63.37305,-45.36732 -95.05661,0l0,-81.65914z"
        }
    },
    {
        options: {
            name: 'Arrow 1',
            data: 'M25,0.5 L25,10.5 L111.5,10.5 L111.5,30.5 L25,30.5 L25,39.5 L0.5,20.5 z',
            content: 'arrow 1'
        }
    },
    {
        options: {
            name: 'Arrow 2',
            data: 'M15,0 L15,10 L111.5,10 L111.5,30 L15,30 L15,39.5 L0.5,20 z'
        }
    },
    {
        options: {
            name: 'Arrow 3',
            data: 'M24,0.5 L30,5.8299999 L25,10 L111.5,10 L111.5,30 L25,30 L30,34.23 L24,39.5 L0.5,20 z'
        }
    },
    {
        options: {
            name: 'Arrow 4',
            data: 'M15,0.5 L25,0.5 L18,10 L111.5,10 L111.5,30 L18,30 L25,39.5 L15,39.5 L0.5,20 z'
        }
    },
    {
        options: {
            name: 'Arrow 5',
            data: 'M40,0.5 L35,10 L111.49947,10 L111.49947,30 L35,30 L40,39.5 L0.5,20 z'
        }
    },
    {
        options: {
            name: 'Arrow 6',
            data: 'M25,0.5 L25,10 L89,10 L93,0.5 L111.5,0.5 L103,20 L111.5,39.5 L93,39.5 L89,30 L25,30 L25,39.5 L0.5,20 z'
        }
    },
    {
        options: {
            name: 'Arrow 7',
            data: 'M15,0.5 L15,10.5 L89,10.5 L93,1.5 L111.5,1.5 L103,20.5 L111.5,39.5 L93,39.5 L89,31 L15,31 L15,39.5 L0.5,21 z'
        }
    },
    {
        options: {
            name: 'Arrow 8',
            data: 'M111.5,0.5 L103.69976,20 L111.5,39.5 L90,35 L85,30 L34.5,30 L40,39.5 L0.5,20 L40,0.5 L35,10 L85,10 L90,5 z'
        }
    },
    {
        options: {
            name: 'Double Arrow 1',
            data: 'M97,0.5 L111.5,20 L97,39.5 L97,30 L15.5,30 L15.5,39.5 L0.5,20 L15.5,0.5 L15.5,10 L97,10 z'
        }
    },
    {
        options: {
            name: 'Double Arrow 2',
            data: 'M87,1 L112.5,20 L87,40 L87,30 L25.5,30 L25.5,40 L0.5,20 L25.5,0.5 L25.5,10 L87,10 z'
        }
    },
    {
        options: {
            name: 'Double Arrow 3',
            data: 'M88,0.5 L111.5,20 L88,39.5 L82,34.2 L87,30 L25,30 L30,34 L24,39.5 L0.5,20 L24,0.5 L30,6 L25,10 L87,10 L82,5.83 z'
        }
    },
    {
        options: {
            name: 'Double Arrow 4',
            data: 'M15,0.5 L25,0.5 L18,10 L94,10 L87,0.5 L97,0.5 L111.5,20 L97,39.5 L87,39.5 L94,30 L18,30 L25,39.5 L15,39.5 L0.5,20 z'
        }
    },
    {
        options: {
            name: 'Double Arrow 5',
            data: 'M40,0.5 L35,10 L77,10 L72,0.5 L111.5,20 L72,39.5 L77,30 L35,30 L40,39.5 L0.5,20 z'
        }
    },

    {
        options: {
            name: 'Cloud Shape',
            data: 'M14.248657,39.417725 C14.248657,39.417725 14,29.667244 21.3302,24.000578 C28.663574,18.333912 39.328003,20.250563 39.328003,20.250563 C39.328003,20.250563 43.494385,0.5 63.741943,0.5 C82.739746,0.5 87.655762,19.750601 87.655762,19.750601 C87.655762,19.750601 100.32007,16.000544 108.31909,24.750582 C114.66797,31.695599 112.90283,40.4174 112.90283,40.4174 C112.90283,40.4174 123.16272,45.471794 120.81873,58.500729 C117.81824,75.179268 98.904663,74.25106 98.904663,74.25106 L18.581177,74.25106 C18.581177,74.25106 0.5,73.084129 0.5,57.750725 C0.5,42.417324 14.248657,39.417725 14.248657,39.417725 z'
        }
    },
    {
        options: {
            name: 'Cross Shape 2',
            data: 'M25.33,0.50 L49.67,0.50 L49.67,25.33 L74.50,25.33 L74.50,49.67 L49.67,49.67 L49.67,74.50 L25.33,74.50 L25.33,49.67 L0.50,49.67 L0.50,25.33 L25.33,25.33 z'
        }
    },
    {
        options: {
            name: 'Cross Shape',
            data: 'M32.78,0.50 L42.22,0.50 L42.22,32.78 L74.50,32.78 L74.50,42.22 L42.22,42.22 L42.22,74.50 L32.78,74.50 L32.78,42.22 L0.50,42.22 L0.50,32.78 L32.78,32.78 z'
        }
    },
    {
        options: {
            name: 'Ellipse Shape',
            data: 'M111.50,37.50 C111.50,57.91 86.67,74.50 56.00,74.50 C25.33,74.50 0.50,57.91 0.50,37.50 C0.50,17.09 25.33,0.50 56.00,0.50 C86.67,0.50 111.50,17.09 111.50,37.50 z'
        }
    },
    {
        options: {
            name: 'Hexagon Shape',
            data: 'M21.56,0.50 L63.56,0.50 L84.50,37.50 L63.56,74.50 L21.56,74.50 L0.50,37.50 z'
        }
    },
    {
        options: {
            name: 'Heptagon Shape',
            data: 'M0.50,48.01 L7.78,15.18 L37.38,0.50 L67.10,15.18 L74.50,47.88 L54.00,74.50 L21.12,74.50 z'
        }
    },
    {
        options: {
            name: 'Octagon Shape',
            data: 'M22.79,0.50 L53.04,0.50 L74.46,21.88 L74.50,52.62 L52.30,74.50 L22.91,74.50 L0.50,52.88 L0.50,21.75 z'
        }
    },
    {
        options: {
            name: 'Pentagon Shape',
            data: 'M37.50,0.50 L74.50,28.76 L60.35,74.50 L14.65,74.50 L0.50,28.76 z'
        }
    },
    {
        options: {
            name: 'Right Triangle Shape',
            data: 'M0.50,0.50 L111.50,74.50 L0.50,74.50 z'
        }
    },
    {
        options: {
            name: 'Rounded Rectangle Shape',
            data: 'M0,9 C0,4.0294371 4.0294371,0 9,0 L103,0 C107.97057,0 112,4.0294371 112,9 L112,66 C112,70.970566 107.97057,75 103,75 L9,75 C4.0294371,75 0,70.970566 0,66 z'
        }
    },
    {
        options: {
            name: 'Star Shape',
            data: 'M40.00,0.50 L49.34,28.76 L79.50,28.76 L55.10,46.24 L64.35,74.50 L40.00,57.02 L15.60,74.50 L24.90,46.24 L0.50,28.76 L30.66,28.76 z'
        }
    },
    {
        options: {
            name: 'Star Shape',
            data: 'M32.50,0.50 L43.22,19.09 L64.50,19.09 L53.83,37.52 L64.50,55.91 L43.22,55.91 L32.50,74.50 L21.78,55.91 L0.50,55.91 L11.17,37.52 L0.50,19.09 L21.78,19.09 z'
        }
    },
    {
        options: {
            name: 'Star Shape',
            data: 'M40.00,0.50 L51.13,17.24 L71.70,15.15 L64.99,33.92 L79.50,48.08 L60.02,54.78 L57.59,74.50 L40.00,64.07 L22.41,74.50 L19.98,54.78 L0.50,48.08 L15.01,33.92 L8.30,15.15 L28.87,17.24 z'
        }
    },
    {
        options: {
            name: 'Triangle Shape',
            data: 'M43.51,0.50 L86.50,74.50 L0.50,74.50 z'
        }
    },

    {
        options: {
            name: 'Begin Loop Shape',
            data: 'M22.74,0.50 L90.10,0.50 L111.45,21.91 L111.50,74.50 L0.50,74.50 L0.50,21.79 z'
        }
    },
    {
        options: {
            name: 'Card Shape',
            data: 'M 0.50 19.00 L 19.00,0.50 H 111.50 V 74.50 H 0.50 Z'
        }
    },
    {
        options: {
            name: 'Collate Shape',
            data: 'M37.50,37.75 L74.50,74.50 L0.50,74.50 z M0.50,0.50 L74.50,0.50 L37.50,37.25 z'
        }
    },
    {
        options: {
            name: 'Create Request Shape',
            data: 'M0.50000262,0.5 L111.5,0.5 L111.5,74.5 L0.50000262,74.5 z M0.5,15.500003 L111.5,15.500003 M0.5,59.500004 L111.5,59.500004'
        }
    },
    {
        options: {
            name: 'Database Shape 1',
            data: 'M74.5,13 C74.5,19.903559 57.934536,25.5 37.5,25.5 C17.065464,25.5 0.5,19.903559 0.5,13 C0.5,6.0964408 17.065464,0.5 37.5,0.5 C57.934536,0.5 74.5,6.0964408 74.5,13 z M74.5,13.5 L74.498734,62.643272 C73.507751,69.247826 57.295956,74.499954 37.5,74.499954 C17.704042,74.499954 1.4922448,69.247826 0.50126934,62.643272 L0.5,13.5'
        }
    },
    {
        options: {
            name: 'Database Shape 2',
            data: 'M74.5,13 C74.5,19.903559 57.934536,25.5 37.5,25.5 C17.065464,25.5 0.5,19.903559 0.5,13 C0.5,6.0964408 17.065464,0.5 37.5,0.5 C57.934536,0.5 74.5,6.0964408 74.5,13 z M74.5,13.5 L74.498734,62.643272 C73.507751,69.247826 57.295956,74.499954 37.5,74.499954 C17.704042,74.499954 1.4922448,69.247826 0.50126934,62.643272 L0.5,13.5 M74.5,18.25 C74.5,25.153559 57.934536,30.75 37.5,30.75 C17.065464,30.75 0.5,25.153559 0.5,18.25'
        }
    },
    {
        options: {
            name: 'Database Shape 3',
            data: 'M74.5,13 C74.5,19.903559 57.934536,25.5 37.5,25.5 C17.065464,25.5 0.5,19.903559 0.5,13 C0.5,6.0964408 17.065464,0.5 37.5,0.5 C57.934536,0.5 74.5,6.0964408 74.5,13 z M74.5,13.5 L74.498734,62.643272 C73.507751,69.247826 57.295956,74.499954 37.5,74.499954 C17.704042,74.499954 1.4922448,69.247826 0.50126934,62.643272 L0.5,13.5 M74.5,18.25 C74.5,25.153559 57.934536,30.75 37.5,30.75 C17.065464,30.75 0.5,25.153559 0.5,18.25 M74.5,23.25 C74.5,30.153559 57.934536,35.75 37.5,35.75 C17.065464,35.75 0.5,30.153559 0.5,23.25'
        }
    },
    {
        options: {
            name: 'Data Shape',
            data: 'M 19.00,0.50 L 111.50 0.50 L 93.00,74.50 L 0.50,74.50 Z'
        }
    },
    {
        options: {
            name: 'Data Store Shape',
            data: 'M0.5,0.5 L14.5,0.5 L14.5,74.5 L0.5,74.5 z M14.500003,0.5000003 L111.5,0.5000003 L111.5,74.5 L14.500003,74.5'
        }
    },
    {
        options: {
            name: 'Decision Shape',
            data: 'M56.00,0.50 L111.50,37.50 L56.00,74.50 L0.50,37.50 z'
        }
    },
    {
        options: {
            name: 'Delay Shape',
            data: 'M 0,0 H 37.5 A 10,10 0 0 1 37.5,74.50 H 1 Z'
        }
    },
    {
        options: {
            name: 'Devided Process Shape',
            data: 'M0.50000006,0.5 L111.5,0.5 L111.5,14.5 L0.50000006,14.5 z M111.5,14.500001 L111.5,74.501999 L0.5,74.501999 L0.5,14.500001'
        }
    },
    {
        options: {
            name: 'Direct Data Shape',
            data: 'M12.86,0.50 L99.39,0.50 C106.21,0.50 111.50,17.08 111.50,37.50 C111.50,57.92 106.21,74.50 99.39,74.25 L12.86,74.25 C6.04,74.25 0.50,57.92 0.50,37.50 C0.50,17.08 6.04,0.50 12.86,0.50 z'
        }
    },
    {
        options: {
            name: 'Display Shape',
            data: 'M25.22,0.50 L99.39,0.50 C106.21,0.50 111.50,17.08 111.50,37.50 C111.50,57.92 106.21,74.50 99.39,74.25 L25.22,74.25 L0.50,37.50 z'
        }
    },
    {
        options: {
            name: 'Document Shape',
            data: 'M0.50,0.50 L111.50,0.75 L111.50,86.51 C111.50,86.51 87.26,64.60 53.49,80.39 C16.92,97.50 0.80,74.48 0.80,74.48 z'
        }
    },
    {
        options: {
            name: 'Duplicating Shape',
            data: 'M37.42,0.50 C44.11,0.50 50.35,2.29 55.80,5.42 L56.00,5.52 L56.20,5.42 C61.65,2.29 67.89,0.50 74.58,0.50 C94.95,0.50 111.50,17.09 111.50,37.50 C111.50,57.91 94.95,74.50 74.58,74.50 C67.89,74.50 61.65,72.71 56.20,69.58 L56.00,69.46 L55.80,69.58 C50.37,72.71 44.11,74.50 37.42,74.50 C17.10,74.50 0.50,57.91 0.50,37.50 C0.50,17.14 17.10,0.50 37.42,0.50 z'
        }
    },
    {
        options: {
            name: 'External Data Shape',
            data: 'M12.83,0.50 L111.50,0.50 L111.50,0.60 L111.40,0.70 C106.07,4.94 102.13,19.79 102.13,37.50 C102.13,55.21 106.07,70.06 111.40,74.30 L111.50,74.40 L111.50,74.50 L12.83,74.50 C6.03,74.50 0.50,57.92 0.50,37.50 C0.50,17.08 6.03,3.81 12.83,0.50 z'
        }
    },
    {
        options: {
            name: 'Feedback Shape',
            data: 'M0.50,0.50 L24.89,0.50 L74.50,18.50 L24.88,36.50 L0.50,36.50 z'
        }
    },
    {
        options: {
            name: 'Framed Rectangle Shape',
            data: 'M0.50,0.50 L111.50,0.50 L111.50,74.50 L0.50,74.50 z M14.87,13.43 L97.13,13.43 L97.13,61.57 L14.87,61.57 z'
        }
    },
    {
        options: {
            name: 'Internal Storage Shape',
            data: 'M 0.50,19.00 H 111.50 M 19.00,0.50 V 74.50 M 0.50,0.50 H 111.50 V 74.50 H 0.50 Z'
        }
    },
    {
        options: {
            name: 'Lined Document Shape',
            data: 'M0.5,0.5 L14.5,0.5 L14.5,84.277 L14.251022,84.183327 C5.0858073,80.599884 0.79999673,74.479614 0.79999644,74.479614 L0.5,0.50087458 z M14.500002,0.50000077 L111.5,0.50000077 L111.5,86.510292 C111.5,86.510292 87.260002,64.600212 53.489998,80.390266 C36.347809,88.410606 23.699032,87.613289 15.097685,84.502586 L14.500002,84.277725'
        }
    },
    {
        options: {
            name: 'Loop Limit Shape',
            data: 'M0.5,19 L15.3,0 L95,0.5 L111.5,19 L111.5,74.5 L0.5,74.5 z'
        }
    },
    {
        options: {
            name: 'Manual Input Shape',
            data: 'M 0 19 L 111.5,0 V 74.5 H 0 Z'
        }
    },
    {
        options: {
            name: 'Manual Operation Shape',
            data: 'M0.5,0.5 L111.5,0.5 L91.75,74.5 L19,74.5 z'
        }
    },
    {
        options: {
            name: 'Message From User Shape',
            data: 'M21.79,0.50 L74.50,0.50 L74.50,74.50 L21.79,74.50 L0.50,37.50 z'
        }
    },
    {
        options: {
            name: 'Message To User Shape',
            data: 'M0.50,0.50 L74.50,0.50 L74.50,0.60 L52.90,37.50 L74.50,74.40 L74.50,74.50 L0.50,74.50 z'
        }
    },
    {
        options: {
            name: 'Microform Processing Shape',
            data: 'M0.50,0.50 L56.00,21.86 L111.50,0.50 L111.50,74.50 L56.00,53.13 L0.50,74.50 z'
        }
    },
    {
        options: {
            name: 'Microform Recording Shape',
            data: 'M0.50,0.50 L84.74,21.86 L111.50,8.12 L111.50,67.15 L84.74,53.13 L0.50,74.50 z'
        }
    },
    {
        options: {
            name: 'Multiple Document Shape',
            data: 'M107.55,9.90L111.50,9.90 L111.50,86.38 C111.50,86.38 89.40,66.83 58.56,80.92 C28.82,94.50 13.90,79.70 10.99,76.30 L10.86,76.15 L10.86,9.90 L107.55,9.90 z M5.43,4.95 L101.58,4.95 L101.59,4.95 L106.57,4.95 L106.57,8.43 L10.86,8.43 L9.38,8.43 L9.38,9.90 L9.38,74.56 L9.38,74.56 C7.73,73.23 6.63,72.05 6.04,71.36 L5.94,71.25 L5.93,71.23 L5.43,70.88 z M0.50,0.50 L101.63,0.50 L101.58,3.47 L5.43,3.47 L3.95,3.47 L3.95,69.72 L3.55,69.37 C1.52,67.61 0.55,66.24 0.55,66.24 z'
        }
    },
    {
        options: {
            name: 'Off Page Connection Shape',
            data: 'M0.50,0.50 L53.27,0.50 L74.50,37.50 L53.27,74.50 L0.50,74.50 z'
        }
    },
    {
        options: {
            name: 'Off Page Link Shape',
            data: 'M74.50,0.50 L74.50,53.36 L37.50,74.50 L0.50,53.36 L0.50,0.50 z'
        }
    },
    {
        options: {
            name: 'Off Page Reflection Shape',
            data: 'M37.50,0.50 L74.50,25.17 L74.50,74.50 L0.50,74.50 L0.50,25.17 z'
        }
    },
    {
        options: {
            name: 'Or Shape',
            data: 'M74.5,37.5 C74.5,57.934536 57.934536,74.5 37.5,74.5 C17.065464,74.5 0.5,57.934536 0.5,37.5 C0.5,17.065464 17.065464,0.5 37.5,0.5 C57.934536,0.5 74.5,17.065464 74.5,37.5 z M0.5,37.5 L37,37.5 M38,37.5 L74.5,37.5 M37.5,0.5 L37.5,74.5'
        }
    },
    {
        options: {
            name: 'Paper Tape Shape',
            data: 'M0.50,0.60 C0.50,0.60 19.53,21.86 53.32,6.05 C60.21,2.83 66.70,1.19 72.65,0.60 L73.59,0.50 L82.36,0.50 L83.06,0.55 C98.91,2.09 109.67,10.41 111.50,11.94 L111.50,86.50 C111.50,86.50 87.22,64.51 53.32,80.36 C16.65,97.50 0.50,74.41 0.50,74.41 z'
        }
    },
    {
        options: {
            name: 'Predefined Shape',
            data: 'M 1,0.50 V 74.50 M 19.00,0.50 V 74.50 M 0.50 0.50 H 111.50 V 74.50 H 0.50 Z'
        }
    },
    {
        options: {
            name: 'Preparation Shape',
            data: 'M 0.50,37.50 L 19.10,0.50  H 93.50 L 111.50,37.70 L 93.00,74.5 H19.00 Z'
        }
    },
    {
        options: {
            name: 'Primitive From-Call Shape',
            data: 'M0.5,0.5 L14.5,0.5 L14.5,74.5 L0.5,74.5 z M14.5,0.5 L74.5,0.5 L59,37.5 L74.5,74.5 L14.5,74.5'
        }
    },
    {
        options: {
            name: 'Primitive To-Call Shape',
            data: 'M60.5,0.5 L74.5,0.5 L74.5,74.5 L60.5,74.5 z M60.5,74.5 L17.166668,74.5 L0.5,37.5 L17.166668,0.5 L60.5,0.5'
        }
    },
    {
        options: {
            name: 'Sequential Data Shape',
            data: 'M37.50,0.50 C57.91,0.50 74.50,17.09 74.50,37.50 C74.50,48.33 69.83,58.11 62.38,64.88 L62.18,65.06 L74.50,65.06 L74.50,74.50 L37.50,74.50 L36.76,74.50 L36.76,74.50 L36.56,74.50 C16.59,73.98 0.50,57.59 0.50,37.50 C0.50,17.09 17.09,0.50 37.50,0.50 z'
        }
    },
    {
        options: {
            name: 'Sort Shape',
            data: 'M0.5,37.5 L37.5,0.5 L74.5,37.5 M0.5,37.5 L74.5,37.5 L37.5,74.5 z'
        }
    },
    {
        options: {
            name: 'Start Shape',
            data: 'M74.5,37.5 C74.5,57.91 57.91,74.5 37.5,74.5 C17,74.5 0.5,57.91 0.5,37.5 C0.5,17 17,0.5 37.5,0.5 C57.91,0.5 74.5,17 74.5,37.5 z'
        }
    },
    {
        options: {
            name: 'Stored Data Shape',
            data: 'M12,0.5 C16.099238,0.5 12.198184,0.5 12.29682,0.5 L12.5,0.5 L12.5,0.5 L111.5,0.5 L111.5,0.5 L111.40821,0.5 C105.33196,1.5 100.5,17.704042 100.5,37.5 C100.5,57.295956 105.33196,73.5 111.5,74.5 L111.5,74.5 L111.5,74.5 L12.5,74.5 L12.5,74.5 L12.29682,74.5 C12.198184,74.5 12.099238,74.5 12,74.5 C5.6487255,74.5 0.5,57.934536 0.5,37.5 C0.5,17.065464 5.6487255,0.5 12,0.5 z'
        }
    },
    {
        options: {
            name: 'Summing Junction Shape',
            data: 'M74.5,37.5 C74.5,57.934536 57.934536,74.5 37.5,74.5 C17.065464,74.5 0.5,57.934536 0.5,37.5 C0.5,17.065464 17.065464,0.5 37.5,0.5 C57.934536,0.5 74.5,17.065464 74.5,37.5 z M12.75,10.75 L38.25,36.25 M39,36.75 L64.5,62.25 M63.5,11.5 L11.5,63.5'
        }
    },
    {
        options: {
            name: 'Terminator Shape',
            data: 'M20.5,0.5 L54.5,0.5 L54.5,0.5 L55,0.5 C65.5,0.5 74.5,9 74.5,20 C74.5,30 65,39.5 55,39.5 L54.5,39.5 L54.5,39.5 L20.5,39.5 L20.5,39.5 L20,39.5 C9,39.5 0.5,30 0.5,20 C0.5,9 9,0.5 20,0.5 L20.5,0.5 z'
        }
    },
    {
        options: {
            name: 'Transmittal Tape Shape',
            data: 'M0.50,0.50 L77.85,0.50 L111.50,0.50 L111.50,86.50 C111.50,86.50 98.42,74.31 78.05,74.31 L0.50,74.31 z'
        }
    },
    {
        options: {
            name: "Rectangle Shape",
            data: "m0,0 L0,100 L100,100 L100,0z"
        }
    }
];
