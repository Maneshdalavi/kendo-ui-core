
package com.kendoui.taglib.chart;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class SeriesDonutTag extends  BaseTag  /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        SeriesTag parent = (SeriesTag)findParentWithClass(SeriesTag.class);

        parent.addDonut(this);

//<< doEndTag

        return super.doEndTag();
    }

    @Override
    public void initialize() {
//>> initialize
//<< initialize

        super.initialize();
    }

    @Override
    public void destroy() {
//>> destroy
//<< destroy

        super.destroy();
    }

//>> Attributes

    public static String tagName() {
        return "chart-series-donut";
    }

    public void setBorder(DonutBorderTag value) {
        setProperty("border", value);
    }

    public void setConnectors(DonutConnectorsTag value) {
        setProperty("connectors", value);
    }

    public void setLabels(DonutLabelsTag value) {
        setProperty("labels", value);
    }

    public void setOverlay(DonutOverlayTag value) {
        setProperty("overlay", value);
    }

    public void setTooltip(DonutTooltipTag value) {
        setProperty("tooltip", value);
    }

    public String getCategoryField() {
        return (String)getProperty("categoryField");
    }

    public void setCategoryField(String value) {
        setProperty("categoryField", value);
    }

    public String getColorField() {
        return (String)getProperty("colorField");
    }

    public void setColorField(String value) {
        setProperty("colorField", value);
    }

    public Object getData() {
        return (Object)getProperty("data");
    }

    public void setData(Object value) {
        setProperty("data", value);
    }

    public String getExplodeField() {
        return (String)getProperty("explodeField");
    }

    public void setExplodeField(String value) {
        setProperty("explodeField", value);
    }

    public float getHoleSize() {
        return (float)getProperty("holeSize");
    }

    public void setHoleSize(float value) {
        setProperty("holeSize", value);
    }

    public float getMargin() {
        return (float)getProperty("margin");
    }

    public void setMargin(float value) {
        setProperty("margin", value);
    }

    public float getOpacity() {
        return (float)getProperty("opacity");
    }

    public void setOpacity(float value) {
        setProperty("opacity", value);
    }

    public float getPadding() {
        return (float)getProperty("padding");
    }

    public void setPadding(float value) {
        setProperty("padding", value);
    }

    public float getSize() {
        return (float)getProperty("size");
    }

    public void setSize(float value) {
        setProperty("size", value);
    }

    public float getStartAngle() {
        return (float)getProperty("startAngle");
    }

    public void setStartAngle(float value) {
        setProperty("startAngle", value);
    }

//<< Attributes

}
