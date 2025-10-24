// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Personal projects demonstrating end-to-end data science capabilities.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-bookshelf",
          title: "bookshelf",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/books/";
          },
        },{id: "post-building-an-llm-powered-insights-engine-that-doesn-39-t-hallucinate",
        
          title: "Building an LLM-Powered Insights Engine That Doesn&#39;t Hallucinate",
        
        description: "How I redesigned our audience insights system using LLMs while solving the hallucination problem for client-facing work",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/llm-insights-engine/";
          
        },
      },{id: "post-from-mongodb-to-postgresql-database-architecture-for-ml-projects",
        
          title: "From MongoDB to PostgreSQL: Database Architecture for ML Projects",
        
        description: "Why I used both NoSQL and SQL databases in my data pipeline, and when each makes sense",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/mongodb-postgresql-ml/";
          
        },
      },{id: "post-why-i-built-a-custom-synthetic-data-algorithm-instead-of-using-ctgan",
        
          title: "Why I Built a Custom Synthetic Data Algorithm Instead of Using CTGAN",
        
        description: "When off-the-shelf ML isn&#39;t enough—designing a KNN-based synthetic data generator that preserves feature correlations",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/synthetic-data-ctgan/";
          
        },
      },{id: "post-when-simpler-models-win-comparing-7-cnn-architectures",
        
          title: "When Simpler Models Win: Comparing 7 CNN Architectures",
        
        description: "Testing 7 different neural network architectures taught me that more layers doesn&#39;t mean better results—sometimes the baseline is the best choice",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/simple-cnn-wins/";
          
        },
      },{id: "post-activation-functions-killed-my-gan-a-debugging-story",
        
          title: "Activation Functions Killed My GAN: A Debugging Story",
        
        description: "How changing one line of code (tanh → sigmoid) took my GAN from complete failure to generating realistic digits",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/gan-activation-functions/";
          
        },
      },{id: "books-if-on-a-winter-39-s-night-a-traveler",
          title: 'If on a winter&amp;#39;s night a traveler',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/if_on_a_winters_night_a_traveler/";
            },},{id: "projects-teaching-computers-to-create-images",
          title: 'Teaching Computers to Create Images',
          description: "Exploring how neural networks learn to generate handwritten digits",
          section: "Projects",handler: () => {
              window.location.href = "/projects/image-generation/";
            },},{id: "projects-finding-profitable-real-estate-in-italy",
          title: 'Finding Profitable Real Estate in Italy',
          description: "AI-powered pipeline to help investors identify high-return properties",
          section: "Projects",handler: () => {
              window.location.href = "/projects/italian-real-estate/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
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
