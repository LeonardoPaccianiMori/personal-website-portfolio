/* Create vega lite chart as another node and hide the code block, appending the vega lite node after it */
document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    document.querySelectorAll("pre>code.language-vega_lite").forEach((elem) => {
      const jsonData = elem.textContent;
      const backup = elem.parentElement;
      backup.classList.add("unloaded");
      /* create vega lite node */
      let chartElement = document.createElement("div");
      chartElement.classList.add("vega-lite");
      backup.after(chartElement);

      /* Embed the visualization in the container */
      vegaEmbed(chartElement, JSON.parse(jsonData));
    });
  }
});
