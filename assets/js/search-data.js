// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "home",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-projects",
          title: "projects",
          description: "Selected professional, personal, and experimental projects showing how I approach applied data-science problems.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "dropdown-technical-notes",
              title: "technical notes",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/notes/";
              },
            },{id: "dropdown-thoughts",
              title: "thoughts",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/thoughts/";
              },
            },{id: "nav-bookshelf",
          title: "bookshelf",
          description: "This page follows curiosity rather than a single theme. These are the books that captured my attention, challenged me, or simply stayed with me.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/books/";
          },
        },{id: "dropdown-wanderer",
              title: "wanderer",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/wanderer/";
              },
            },{id: "post-what-academic-research-taught-me-about-applied-data-science-and-what-i-had-to-unlearn",

          title: "What Academic Research Taught Me About Applied Data Science—and What I Had to...",

        description: "Some research habits transferred directly into applied data science; others had to be reshaped around decisions, users, and constraints.",
        section: "Posts",
        handler: () => {

            window.location.href = "/blog/2026/what-research-taught-me-about-applied-data-science/";

        },
      },{id: "post-when-more-analysis-makes-the-answer-worse",

          title: "When More Analysis Makes the Answer Worse",

        description: "Rigor is not the same as exhaustiveness: analysis should reduce the uncertainty that matters to a decision.",
        section: "Posts",
        handler: () => {

            window.location.href = "/blog/2026/when-more-analysis-makes-the-answer-worse/";

        },
      },{id: "post-technical-appendix-recipe-graphs-and-regional-cuisine-modeling",

          title: "Technical Appendix: Recipe Graphs and Regional Cuisine Modeling",

        description: "The technical appendix to my Italian cuisine project, including extraction prompts, graph modeling choices, and the main analytical outputs.",
        section: "Posts",
        handler: () => {

            window.location.href = "/blog/2026/italian-cuisine-deep-dive/";

        },
      },{id: "post-visualizing-regional-structure-in-italian-cuisine",

          title: "Visualizing Regional Structure in Italian Cuisine",

        description: "Three visualization choices that made the geographic story in my Italian cuisine dataset much easier to see",
        section: "Posts",
        handler: () => {

            window.location.href = "/blog/2025/visualizing-italian-cuisine/";

        },
      },{id: "post-modeling-recipes-as-graphs-instead-of-ingredient-lists",

          title: "Modeling Recipes as Graphs Instead of Ingredient Lists",

        description: "The modeling decision that changed my Italian cuisine project from a feature-engineering exercise into a structural one",
        section: "Posts",
        handler: () => {

            window.location.href = "/blog/2025/why-graphs-for-recipes/";

        },
      },{id: "post-technical-appendix-real-estate-data-pipeline-and-roi-modeling",

          title: "Technical Appendix: Real Estate Data Pipeline and ROI Modeling",

        description: "Technical appendix to my Italian real-estate project, covering scraping, ETL, synthetic data, modeling, and dashboard design.",
        section: "Posts",
        handler: () => {

            window.location.href = "/blog/2025/italian-real-estate-deep-dive/";

        },
      },{id: "post-moving-the-real-estate-pipeline-from-mongodb-to-postgresql",

          title: "Moving the Real Estate Pipeline from MongoDB to PostgreSQL",

        description: "How the storage layer changed as the project moved from messy scraping to analytics-ready modeling.",
        section: "Posts",
        handler: () => {

            window.location.href = "/blog/2025/mongodb-postgresql-ml/";

        },
      },{id: "post-when-ctgan-failed-to-preserve-the-correlations-that-mattered",

          title: "When CTGAN Failed to Preserve the Correlations That Mattered",

        description: "A practical synthetic-data decision from an Italian real-estate project: preserving geographic and price correlations mattered more than matching marginal distributions.",
        section: "Posts",
        handler: () => {

            window.location.href = "/blog/2025/synthetic-data-ctgan/";

        },
      },{id: "post-technical-appendix-mnist-classifiers-vaes-and-gans",

          title: "Technical Appendix: MNIST Classifiers, VAEs, and GANs",

        description: "The technical appendix to my MNIST image-generation project, covering the experiment setup, architecture choices, and per-model results.",
        section: "Posts",
        handler: () => {

            window.location.href = "/blog/2025/image-generation-deep-dive/";

        },
      },{id: "books-fahrenheit-451",
          title: 'Fahrenheit 451',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/fahrenheit_451/";
            },},{id: "books-if-on-a-winter-39-s-night-a-traveler",
          title: 'If on a winter&amp;#39;s night a traveler',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/if_on_a_winters_night_a_traveler/";
            },},{id: "books-1984",
          title: '1984',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/nineteen_eighty_four/";
            },},{id: "books-il-piccolo-principe",
          title: 'Il Piccolo Principe',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_little_prince/";
            },},{id: "books-the-songlines",
          title: 'The Songlines',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_songlines/";
            },},{id: "books-la-trilogia-della-rabbia",
          title: 'La trilogia della rabbia',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/trilogy_of_anger/";
            },},{id: "books-the-written-world-and-the-unwritten-world",
          title: 'The Written World and the Unwritten World',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/written_and_unwritten_world/";
            },},{id: "projects-accelerating-qualitative-interview-analysis",
          title: 'Accelerating Qualitative Interview Analysis',
          description: "An internal AI agent that turns extensive Italian interview materials into thematic syntheses, traceable answers, and translated client deliverables",
          section: "Projects",handler: () => {
              window.location.href = "/projects/accelerating-qualitative-interview-analysis/";
            },},{id: "projects-cleaning-open-ended-survey-responses-at-scale",
          title: 'Cleaning Open-Ended Survey Responses at Scale',
          description: "An internal workflow that standardizes respondent-written survey answers so analysts can move from raw files to usable metrics in minutes",
          section: "Projects",handler: () => {
              window.location.href = "/projects/cleaning-open-ended-brand-responses-at-scale/";
            },},{id: "projects-teaching-computers-to-create-images",
          title: 'Teaching Computers to Create Images',
          description: "Exploring how neural networks learn to generate handwritten digits",
          section: "Projects",handler: () => {
              window.location.href = "/projects/image-generation/";
            },},{id: "projects-a-look-into-italian-cuisine",
          title: 'A Look Into Italian Cuisine',
          description: "Understanding the historical evolution and geographical diversity of Italian cuisine",
          section: "Projects",handler: () => {
              window.location.href = "/projects/italian-cuisine/";
            },},{id: "projects-finding-profitable-real-estate-in-italy",
          title: 'Finding Profitable Real Estate in Italy',
          description: "AI-powered pipeline to help investors identify areas with high-return properties",
          section: "Projects",handler: () => {
              window.location.href = "/projects/italian-real-estate/";
            },},{id: "projects-matching-client-briefs-to-analytics-capabilities",
          title: 'Matching Client Briefs to Analytics Capabilities',
          description: "A working internal chatbot that turns client briefs into explainable analytics recommendations grounded in a capabilities catalogue",
          section: "Projects",handler: () => {
              window.location.href = "/projects/matching-client-problems-to-analytics-solutions/";
            },},{id: "projects-building-an-agentic-creative-research-assistant",
          title: 'Building an Agentic Creative Research Assistant',
          description: "A working agentic prototype that turns scattered web and video sources into structured research reports for creative strategy",
          section: "Projects",handler: () => {
              window.location.href = "/projects/synthesizing-creative-research-across-sources/";
            },},{id: "projects-interpreting-consumer-segments-at-scale",
          title: 'Interpreting Consumer Segments at Scale',
          description: "An internal LLM workflow for making large segment-profile outputs easier to explore, summarize, and use in strategy work",
          section: "Projects",handler: () => {
              window.location.href = "/projects/turning-audience-data-into-strategy/";
            },},{id: "projects-wanderer",
          title: 'Wanderer',
          description: "Three.js gravity sandbox with tidal interactions",
          section: "Projects",handler: () => {
              window.location.href = "/projects/wanderer/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6C%65%6F%6E%61%72%64%6F%70%61%63%63%69%61%6E%69%6D%6F%72%69@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/LeonardoPaccianiMori", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/leonardo-pacciani-mori", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
