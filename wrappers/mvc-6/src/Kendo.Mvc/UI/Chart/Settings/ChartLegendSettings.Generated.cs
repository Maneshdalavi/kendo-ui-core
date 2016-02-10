using Kendo.Mvc.Extensions;
using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Kendo.Mvc.UI
{
    /// <summary>
    /// Kendo UI ChartLegendSettings class
    /// </summary>
    public partial class ChartLegendSettings<T> where T : class 
    {
        public string Align { get; set; }

        public string Background { get; set; }

        public ChartLegendBorderSettings<T> Border { get; } = new ChartLegendBorderSettings<T>();

        public double? Height { get; set; }

        public ChartLegendInactiveItemsSettings<T> InactiveItems { get; } = new ChartLegendInactiveItemsSettings<T>();

        public ChartLegendItemSettings<T> Item { get; } = new ChartLegendItemSettings<T>();

        public ChartLegendLabelsSettings<T> Labels { get; } = new ChartLegendLabelsSettings<T>();

        public ChartLegendMarginSettings<T> Margin { get; } = new ChartLegendMarginSettings<T>();

        public double? OffsetX { get; set; }

        public double? OffsetY { get; set; }

        public string Orientation { get; set; }

        public ChartLegendPaddingSettings<T> Padding { get; } = new ChartLegendPaddingSettings<T>();

        public bool? Reverse { get; set; }

        public bool? Visible { get; set; }

        public double? Width { get; set; }

        public ChartLegendPosition? Position { get; set; }


        public Chart<T> Chart { get; set; }

        protected Dictionary<string, object> SerializeSettings()
        {
            var settings = new Dictionary<string, object>();

            if (Align?.HasValue() == true)
            {
                settings["align"] = Align;
            }

            if (Background?.HasValue() == true)
            {
                settings["background"] = Background;
            }

            var border = Border.Serialize();
            if (border.Any())
            {
                settings["border"] = border;
            }

            if (Height.HasValue)
            {
                settings["height"] = Height;
            }

            var inactiveItems = InactiveItems.Serialize();
            if (inactiveItems.Any())
            {
                settings["inactiveItems"] = inactiveItems;
            }

            var item = Item.Serialize();
            if (item.Any())
            {
                settings["item"] = item;
            }

            var labels = Labels.Serialize();
            if (labels.Any())
            {
                settings["labels"] = labels;
            }

            var margin = Margin.Serialize();
            if (margin.Any())
            {
                settings["margin"] = margin;
            }

            if (OffsetX.HasValue)
            {
                settings["offsetX"] = OffsetX;
            }

            if (OffsetY.HasValue)
            {
                settings["offsetY"] = OffsetY;
            }

            if (Orientation?.HasValue() == true)
            {
                settings["orientation"] = Orientation;
            }

            var padding = Padding.Serialize();
            if (padding.Any())
            {
                settings["padding"] = padding;
            }

            if (Reverse.HasValue)
            {
                settings["reverse"] = Reverse;
            }

            if (Visible.HasValue)
            {
                settings["visible"] = Visible;
            }

            if (Width.HasValue)
            {
                settings["width"] = Width;
            }

            if (Position.HasValue)
            {
                settings["position"] = Position?.Serialize();
            }

            return settings;
        }
    }
}
