$(document).ready(function () {
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    if (typeof Toc !== "undefined") {
      var $scope = $("#markdown-content");
      if (!$scope.length) {
        $scope = $("article").first();
      }

      $myNav.empty();
      $myNav.attr("data-toggle", "toc");

      var $headings = $scope.find("h2, h3").filter(":not([data-toc-skip])");
      if ($headings.length) {
        var $navList = Toc.helpers.createChildNavList($myNav);
        Toc.helpers.populateNav($navList, 2, $headings);
      }

      $("body").scrollspy({
        target: navSelector,
        offset: 100,
      });
    }
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});
