(function(f, define) {
    define(["../main",  "../../kendo.draganddrop", "./resizing-utils"], f);
})(function() {

(function(kendo, undefined) {
    var $ = kendo.jQuery;
    var extend = $.extend;
    var noop = $.noop;
    var proxy = $.proxy;

    var Editor = kendo.ui.editor;
    var Class = kendo.Class;
    var Draggable = kendo.ui.Draggable;
    var Observable = kendo.Observable;

    var AND = "and";
    var DRAG_START = "dragStart";
    var DRAG = "drag";
    var DRAG_END = "dragEnd";
    var NS = ".kendoEditorTableResizeHandle";
    var HALF_INSIDE = "halfInside";
    var MOUSE_OVER = "mouseover";
    var MOUSE_OUT = "mouseout";
    var HORIZONTAL = "horizontal";
    var VERTICAL = "vertical";
    var HORIZONTAL_AND_VERTICAL = HORIZONTAL + AND + VERTICAL;

    var BODY = "body";
    var TABLE = "table";

    var EAST = "east";
    var NORTH = "north";
    var NORTHEAST = "northeast";
    var NORTHWEST = "northwest";
    var SOUTH = "south";
    var SOUTHEAST = "southeast";
    var SOUTHWEST = "southwest";
    var WEST = "west";

    var TableResizeHandle = Observable.extend({
        init: function(options) {
            var that = this;

            Observable.fn.init.call(that);

            that.options = extend({}, that.options, options);
            that.element = $(that.options.template).appendTo(that.options.appendTo)[0];

            that._attachEventHandlers();
            that._addStyles();
            that._initDraggable();
            that._initPositioningStrategy();
            that._initDraggingStrategy();

            $(that.element).data(TABLE, that.options.resizableElement);
        },

        destroy: function() {
            var that = this;

            $(that.element).off(NS).remove();
            that.element = null;
            
            that._destroyDraggable();

            that.unbind();
        },

        options: {
            appendTo: null,
            direction: SOUTHEAST,
            resizableElement: null,
            template: "<div class='k-table-resize-handle' unselectable='on' contenteditable='false'></div>"
        },

        events: [
            DRAG_START,
            DRAG,
            DRAG_END,
            MOUSE_OVER,
            MOUSE_OUT
        ],

        show: function() {
            var that = this;

            that._setPosition();
        },

        _setPosition: function() {
            var that = this;
            var position = that._positioningStrategy.getPosition();

            $(that.element).css({
                left: position.left,
                top: position.top
            });
        },

        _attachEventHandlers: function() {
            var that = this;

            $(that.element)
                .on(MOUSE_OVER + NS, proxy(that._onMouseOver, that))
                .on(MOUSE_OUT + NS, proxy(that._onMouseOut, that));
        },

        _onMouseOver: function() {
            this.trigger(MOUSE_OVER);
        },

        _onMouseOut: function() {
            this.trigger(MOUSE_OUT);
        },

        _addStyles: function() {
            var that = this;

            function getDirectionClass(direction) {
                return {
                    "east": "k-resize-e",
                    "north": "k-resize-n",
                    "northeast": "k-resize-ne",
                    "northwest": "k-resize-nw",
                    "south": "k-resize-s",
                    "southeast": "k-resize-se",
                    "southwest": "k-resize-sw",
                    "west": "k-resize-w"
                }[direction];
            }

            $(that.element).addClass(getDirectionClass(that.options.direction));
        },

        _initPositioningStrategy: function() {
            var that = this;
            var options = that.options;

            that._positioningStrategy = HandlePositioningStrategy.create({
                name: options.direction,
                handle: that.element,
                resizableElement: options.resizableElement,
                rootElement: options.rootElement
            });
        },

        _initDraggable: function() {
            var that = this;
            var element = that.element;

            if (that._draggable || !element) {
                return;
            }

            that._draggable = new Draggable(element, {
                dragstart: proxy(that._onDragStart, that),
                drag: proxy(that._onDrag, that),
                dragend: proxy(that._onDragEnd, that)
            });
        },

        _onDragStart: function() {
            this.trigger(DRAG_START);
        },

        _onDrag: function(e) {
            var that = this;

            that.trigger(DRAG, that._draggingStrategy.adjustDragDelta({
                deltaX: e.x.delta,
                deltaY: e.y.delta
            }));
        },

        _onDragEnd: function() {
            this.trigger(DRAG_END);
        },

        _destroyDraggable : function() {
            var that = this;

            if (that._draggable) {
                that._draggable.destroy();
                that._draggable = null;
            }
        },

        _initDraggingStrategy: function() {
            var that = this;

            function getStrategyName(direction) {
                return {
                    "east": HORIZONTAL,
                    "north": VERTICAL,
                    "northeast": HORIZONTAL_AND_VERTICAL,
                    "northwest": HORIZONTAL_AND_VERTICAL,
                    "south": VERTICAL,
                    "southeast": HORIZONTAL_AND_VERTICAL,
                    "southwest": HORIZONTAL_AND_VERTICAL,
                    "west": HORIZONTAL
                }[direction];
            }

            that._draggingStrategy = HandleDraggingStrategy.create({
                name: getStrategyName(that.options.direction)
            });
        }
    });

    var StrategyFactory = Class.extend({
        init: function() {
            this._items = [];
        },

        register: function(name, type) {
            this._items.push({
                name: name,
                type: type
            });
        },

        create: function(options) {
            var items = this._items;
            var itemsLength = items.length;
            var name = options.name ? options.name.toLowerCase() : "";
            var match;
            var item;
            var i;

            for (i = 0; i < itemsLength; i++) {
                item = items[i];

                if (item.name.toLowerCase() === name) {
                    match = item;
                    break;
                }
            }

            if (match) {
                return new match.type(options);
            }
        }
    });

    var PositioningStrategyFactory = StrategyFactory.extend({});
    PositioningStrategyFactory.current = new PositioningStrategyFactory();

    var HandlePositioningStrategy = Class.extend({
        init: function(options) {
            var that = this;
            that.options = extend({}, that.options, options);
        },

        options: {
            handle: null,
            offset: HALF_INSIDE,
            resizableElement: null,
            rootElement: null
        },

        getPosition: function() {
            var that = this;
            var position = that.calculatePosition();
            var handleOffsetPosition = that.applyHandleOffset(position);
            var scrollOffsetPosition = that.applyScrollOffset(handleOffsetPosition);
            return scrollOffsetPosition;
        },

        calculatePosition: noop,

        applyHandleOffset: function(position) {
            var options = this.options;
            var handle = $(options.handle);

            if (options.offset === HALF_INSIDE) {
                return {
                    top: position.top - (handle.outerHeight() / 2),
                    left: position.left - (handle.outerWidth() / 2)
                };
            }

            return position;
        },

        applyScrollOffset: function(position) {
            var rootElement = $(this.options.rootElement);

            if (!rootElement.is(BODY)) {
                return {
                    top: position.top + rootElement.scrollTop(),
                    left: position.left + rootElement.scrollLeft()
                };
            }

            return position;
        }
    });

    HandlePositioningStrategy.create = function(options) {
        return PositioningStrategyFactory.current.create(options);
    };

    var EastPositioningStrategy = HandlePositioningStrategy.extend({
        calculatePosition: function() {
            var resizableElement = $(this.options.resizableElement);
            var offset = resizableElement.position();

            return {
                top: offset.top + (resizableElement.outerHeight() / 2),
                left: offset.left + resizableElement.outerWidth()
            };
        }
    });
    PositioningStrategyFactory.current.register(EAST, EastPositioningStrategy);

    var NorthPositioningStrategy = HandlePositioningStrategy.extend({
        calculatePosition: function() {
            var resizableElement = $(this.options.resizableElement);
            var offset = resizableElement.position();

            return {
                top: offset.top,
                left: offset.left + (resizableElement.outerWidth() / 2)
            };
        }
    });
    PositioningStrategyFactory.current.register(NORTH, NorthPositioningStrategy);

    var NortheastPositioningStrategy = HandlePositioningStrategy.extend({
        calculatePosition: function() {
            var resizableElement = $(this.options.resizableElement);
            var offset = resizableElement.position();

            return {
                top: offset.top,
                left: offset.left + resizableElement.outerWidth()
            };
        }
    });
    PositioningStrategyFactory.current.register(NORTHEAST, NortheastPositioningStrategy);

    var NorthwestPositioningStrategy = HandlePositioningStrategy.extend({
        calculatePosition: function() {
            var resizableElement = $(this.options.resizableElement);
            var offset = resizableElement.position();

            return {
                top: offset.top,
                left: offset.left
            };
        }
    });
    PositioningStrategyFactory.current.register(NORTHWEST, NorthwestPositioningStrategy);

    var SouthPositioningStrategy = HandlePositioningStrategy.extend({
        calculatePosition: function() {
            var resizableElement = $(this.options.resizableElement);
            var offset = resizableElement.position();

            return {
                top: offset.top + resizableElement.outerHeight(),
                left: offset.left + (resizableElement.outerWidth() / 2)
            };
        }
    });
    PositioningStrategyFactory.current.register(SOUTH, SouthPositioningStrategy);

    var SoutheastPositioningStrategy = HandlePositioningStrategy.extend({
        calculatePosition: function() {
            var resizableElement = $(this.options.resizableElement);
            var offset = resizableElement.position();

            return {
                top: offset.top + resizableElement.outerHeight(),
                left: offset.left + resizableElement.outerWidth()
            };
        }
    });
    PositioningStrategyFactory.current.register(SOUTHEAST, SoutheastPositioningStrategy);

    var SouthwestPositioningStrategy = HandlePositioningStrategy.extend({
        calculatePosition: function() {
            var resizableElement = $(this.options.resizableElement);
            var offset = resizableElement.position();

            return {
                top: offset.top + resizableElement.outerHeight(),
                left: offset.left
            };
        }
    });
    PositioningStrategyFactory.current.register(SOUTHWEST, SouthwestPositioningStrategy);

    var WestPositioningStrategy = HandlePositioningStrategy.extend({
        calculatePosition: function() {
            var resizableElement = $(this.options.resizableElement);
            var offset = resizableElement.position();

            return {                
                top: offset.top + (resizableElement.outerHeight() / 2),
                left: offset.left
            };
        }
    });
    PositioningStrategyFactory.current.register(WEST, WestPositioningStrategy);

    var DraggingStrategyFactory = StrategyFactory.extend({});
    DraggingStrategyFactory.current = new DraggingStrategyFactory();

    var HandleDraggingStrategy = Class.extend({
        init: function(options) {
            var that = this;
            that.options = extend({}, that.options, options);
        },

        options: {
            direction: "",
            deltaAdjustment: {}
        },

        adjustDragDelta: function(deltas) {
            return extend(deltas, this.options.deltaAdjustment);
        }
    });

    HandleDraggingStrategy.create = function(options) {
        return DraggingStrategyFactory.current.create(options);
    };

    var HorizontalDraggingStrategy = HandleDraggingStrategy.extend({
        options: {
            direction: HORIZONTAL,
            deltaAdjustment: {
                deltaY: 0
            }
        }
    });
    DraggingStrategyFactory.current.register(HORIZONTAL, HorizontalDraggingStrategy);

    var VerticalDraggingStrategy = HandleDraggingStrategy.extend({
        options: {
            direction: VERTICAL,
            deltaAdjustment: {
                deltaX: 0
            }
        }
    });
    DraggingStrategyFactory.current.register(VERTICAL, VerticalDraggingStrategy);

    var HorizontalAndVerticalDraggingStrategy = HandleDraggingStrategy.extend({
        options: {
            direction: HORIZONTAL_AND_VERTICAL
        }
    });
    DraggingStrategyFactory.current.register(HORIZONTAL_AND_VERTICAL, HorizontalAndVerticalDraggingStrategy);

    extend(Editor, {
        TableResizeHandle: TableResizeHandle
    });
})(window.kendo);

}, typeof define == 'function' && define.amd ? define : function(a1, a2, a3){ (a3 || a2)(); });