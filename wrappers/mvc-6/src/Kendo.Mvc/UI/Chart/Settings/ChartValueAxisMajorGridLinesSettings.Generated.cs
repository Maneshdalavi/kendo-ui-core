using Kendo.Mvc.Extensions;
using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Kendo.Mvc.UI
{
    /// <summary>
    /// Kendo UI ChartValueAxisMajorGridLinesSettings class
    /// </summary>
    public partial class ChartValueAxisMajorGridLinesSettings<T> where T : class 
    {
        public string Color { get; set; }

        public ChartDashType? DashType { get; set; }

        public string Type { get; set; }

        public bool? Visible { get; set; }

        public double? Width { get; set; }

        public double? Step { get; set; }

        public double? Skip { get; set; }


        public Chart<T> Chart { get; set; }

        protected Dictionary<string, object> SerializeSettings()
        {
            var settings = new Dictionary<string, object>();

            if (Color?.HasValue() == true)
            {
                settings["color"] = Color;
            }

            if (DashType.HasValue)
            {
                settings["dashType"] = DashType?.Serialize();
            }

            if (Type?.HasValue() == true)
            {
                settings["type"] = Type;
            }

            if (Visible.HasValue)
            {
                settings["visible"] = Visible;
            }

            if (Width.HasValue)
            {
                settings["width"] = Width;
            }

            if (Step.HasValue)
            {
                settings["step"] = Step;
            }

            if (Skip.HasValue)
            {
                settings["skip"] = Skip;
            }

            return settings;
        }
    }
}
